import http from "node:http";
import https from "node:https";
import dns from "node:dns";
import type { LookupFunction } from "node:net";
import { assertSafeUrl, BlockedUrlError, isBlockedAddress, normaliseWebsiteInput } from "./ssrf";

export type WebsiteContext = {
  requestedUrl: string;
  finalUrl: string;
  title: string;
  description: string;
  siteName: string;
  headings: string[];
  summaryText: string;
  fetchedAt: string;
};

export type WebsiteFetchResult = { ok: true; context: WebsiteContext } | { ok: false; reason: string };

const MAX_BYTES = 512 * 1024;
const TIMEOUT_MS = 6_000;
const MAX_REDIRECTS = 3;
const ALLOWED_CONTENT_TYPES = ["text/html", "application/xhtml+xml", "text/plain"];
const USER_AGENT = "SystemsTeardownBot/1.0 (+https://ibrahemahmed.com)";

/**
 * DNS lookup hook installed on the socket. Every address the socket is offered
 * is checked before the connection is made, which closes the rebinding window
 * that a "resolve, check, then fetch by hostname" flow leaves open.
 */
const guardedLookup: LookupFunction = (hostname, options, callback) => {
  dns.lookup(hostname, { ...options, all: true, verbatim: true }, (error, addresses) => {
    if (error) {
      callback(error, "", 0);
      return;
    }
    const permitted = addresses.filter((entry) => !isBlockedAddress(entry.address));
    if (permitted.length === 0) {
      callback(new BlockedUrlError("blocked-address", "Resolved to a non-public address"), "", 0);
      return;
    }
    if (options.all) {
      callback(null, permitted);
      return;
    }
    callback(null, permitted[0].address, permitted[0].family);
  });
};

type RawResponse = { status: number; headers: http.IncomingHttpHeaders; body: string; url: URL };

const requestOnce = (url: URL): Promise<RawResponse> =>
  new Promise((resolve, reject) => {
    const transport = url.protocol === "https:" ? https : http;
    const request = transport.request(
      url,
      {
        method: "GET",
        lookup: guardedLookup,
        headers: {
          "user-agent": USER_AGENT,
          accept: "text/html,application/xhtml+xml;q=0.9,text/plain;q=0.8",
          "accept-language": "en",
        },
      },
      (response) => {
        const status = response.statusCode ?? 0;

        if (status >= 300 && status < 400) {
          response.resume();
          resolve({ status, headers: response.headers, body: "", url });
          return;
        }

        const contentType = String(response.headers["content-type"] ?? "").toLowerCase();
        if (contentType && !ALLOWED_CONTENT_TYPES.some((type) => contentType.includes(type))) {
          response.destroy();
          reject(new Error(`unsupported-content-type:${contentType.split(";")[0]}`));
          return;
        }

        const declaredLength = Number(response.headers["content-length"] ?? 0);
        if (declaredLength > MAX_BYTES) {
          response.destroy();
          reject(new Error("response-too-large"));
          return;
        }

        const chunks: Buffer[] = [];
        let total = 0;
        response.on("data", (chunk: Buffer) => {
          total += chunk.length;
          if (total > MAX_BYTES) {
            response.destroy();
            reject(new Error("response-too-large"));
            return;
          }
          chunks.push(chunk);
        });
        response.on("end", () => {
          resolve({ status, headers: response.headers, body: Buffer.concat(chunks).toString("utf8"), url });
        });
        response.on("error", reject);
      },
    );

    request.setTimeout(TIMEOUT_MS, () => {
      request.destroy(new Error("timeout"));
    });
    request.on("error", reject);
    request.end();
  });

/** Follows redirects manually so every hop is re-validated, not just the first. */
const fetchWithRedirects = async (start: URL): Promise<RawResponse> => {
  let current = start;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    const response = await requestOnce(current);
    if (response.status < 300 || response.status >= 400) return response;

    const location = response.headers.location;
    if (!location) return response;
    current = assertSafeUrl(new URL(location, current).toString());
  }
  throw new BlockedUrlError("too-many-redirects");
};

const decodeEntities = (value: string): string =>
  value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => {
      const point = Number(code);
      return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : " ";
    });

/** Control characters are stripped: they are a cheap way to smuggle formatting
 *  into a model prompt, and they carry no meaning for us. */
// Matching control characters is the whole point here: this pattern removes them.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = new RegExp("[\\u0000-\\u0008\\u000b\\u000c\\u000e-\\u001f\\u007f-\\u009f\\u200b-\\u200f\\u2028\\u2029\\u202a-\\u202e\\ufeff]", "g");

const clean = (value: string, max: number): string =>
  decodeEntities(value).replace(CONTROL_CHARS, " ").replace(/\s+/g, " ").trim().slice(0, max);

const matchMeta = (html: string, patterns: RegExp[]): string => {
  for (const pattern of patterns) {
    const match = pattern.exec(html);
    if (match?.[1]) return clean(match[1], 300);
  }
  return "";
};

export const extractWebsiteContext = (html: string, requestedUrl: string, finalUrl: string): WebsiteContext => {
  // Comments and non-content elements are removed first: they are the usual
  // hiding place for text aimed at whatever reads the page next.
  const stripped = html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ");

  const title = clean((/<title[^>]*>([\s\S]*?)<\/title>/i.exec(stripped)?.[1] ?? "").replace(/<[^>]+>/g, " "), 200);

  const description = matchMeta(stripped, [
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i,
    /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i,
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i,
  ]);

  const siteName = matchMeta(stripped, [/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']*)["']/i]);

  const headings: string[] = [];
  const headingPattern = /<h[12][^>]*>([\s\S]*?)<\/h[12]>/gi;
  let heading = headingPattern.exec(stripped);
  while (heading && headings.length < 8) {
    const text = clean(heading[1].replace(/<[^>]+>/g, " "), 140);
    if (text.length > 2) headings.push(text);
    heading = headingPattern.exec(stripped);
  }

  const bodyMatch = /<body[^>]*>([\s\S]*)<\/body>/i.exec(stripped);
  const summaryText = clean((bodyMatch?.[1] ?? stripped).replace(/<[^>]+>/g, " "), 1_800);

  return {
    requestedUrl,
    finalUrl,
    title,
    description,
    siteName,
    headings,
    summaryText,
    fetchedAt: new Date().toISOString(),
  };
};

/**
 * Best-effort public-page fetch. Never throws: the assessment must continue
 * normally when a prospect's site is slow, blocked, or simply does not exist.
 *
 * Everything returned here is untrusted external content. It is only ever used
 * to describe what the business appears to do — never to infer headcount,
 * internal process frequency, tooling or losses.
 */
export const fetchWebsiteContext = async (rawInput: string): Promise<WebsiteFetchResult> => {
  const normalised = normaliseWebsiteInput(rawInput);
  if (!normalised) return { ok: false, reason: "empty" };

  try {
    const url = assertSafeUrl(normalised);
    const response = await fetchWithRedirects(url);

    if (response.status < 200 || response.status >= 300) {
      return { ok: false, reason: `status-${response.status}` };
    }
    if (!response.body.trim()) return { ok: false, reason: "empty-body" };

    return { ok: true, context: extractWebsiteContext(response.body, normalised, response.url.toString()) };
  } catch (error) {
    if (error instanceof BlockedUrlError) return { ok: false, reason: error.reason };
    return { ok: false, reason: error instanceof Error ? error.message.slice(0, 80) : "unknown" };
  }
};
