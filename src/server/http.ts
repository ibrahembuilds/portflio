import type { IncomingMessage, ServerResponse } from "node:http";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { env } from "./env";
import { getLeadStore } from "./store";

/**
 * Request and response helpers written against Node's own IncomingMessage and
 * ServerResponse, which is exactly what Vercel's Node runtime passes to a
 * function. The same handlers therefore run unchanged under `vercel dev`, in
 * production, and under scripts/dev-server.mjs used by the E2E suite.
 */

export type ApiRequest = IncomingMessage & { body?: unknown };
export type ApiResponse = ServerResponse;

export const MAX_BODY_BYTES = 64 * 1024;

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message?: string,
    readonly details?: Record<string, string>,
  ) {
    super(message ?? code);
  }
}

export const sendJson = (res: ApiResponse, status: number, payload: unknown) => {
  const body = JSON.stringify(payload);
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.setHeader("x-content-type-options", "nosniff");
  res.end(body);
};

export const sendError = (res: ApiResponse, error: unknown) => {
  if (error instanceof HttpError) {
    sendJson(res, error.status, { error: error.code, message: error.message, details: error.details });
    return;
  }
  console.error("[api] unhandled error", error);
  sendJson(res, 500, { error: "internal_error", message: "Something went wrong on my side." });
};

/**
 * Reads and parses a JSON body. Vercel may have parsed it already, in which
 * case the stream is consumed and `req.body` is used instead.
 */
export const readJsonBody = async (req: ApiRequest): Promise<unknown> => {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === "string") {
      try {
        return JSON.parse(req.body);
      } catch {
        throw new HttpError(400, "invalid_json", "Request body was not valid JSON.");
      }
    }
    return req.body;
  }

  const declared = Number(req.headers["content-length"] ?? 0);
  if (declared > MAX_BODY_BYTES) throw new HttpError(413, "payload_too_large", "That request was too large.");

  const chunks: Buffer[] = [];
  let total = 0;

  await new Promise<void>((resolve, reject) => {
    req.on("data", (chunk: Buffer) => {
      total += chunk.length;
      if (total > MAX_BODY_BYTES) {
        reject(new HttpError(413, "payload_too_large", "That request was too large."));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", resolve);
    req.on("error", reject);
  });

  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    throw new HttpError(400, "invalid_json", "Request body was not valid JSON.");
  }
};

export const requireMethod = (req: ApiRequest, res: ApiResponse, method: string): boolean => {
  if (req.method === method) return true;
  res.setHeader("allow", method);
  sendJson(res, 405, { error: "method_not_allowed" });
  return false;
};

/**
 * Client address. Vercel sets x-forwarded-for; the left-most entry is the
 * client. Falls back to the socket address locally.
 */
export const clientIp = (req: ApiRequest): string => {
  const forwarded = req.headers["x-forwarded-for"];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const first = raw?.split(",")[0]?.trim();
  return first || req.socket?.remoteAddress || "unknown";
};

/** IP addresses are hashed before they are used as a rate-limit key, so the
 *  limiter never stores a raw address. */
export const rateLimitKey = (scope: string, ip: string): string =>
  `${scope}:${createHash("sha256").update(`${ip}:teardown`).digest("hex").slice(0, 32)}`;

export const enforceRateLimit = async (scope: string, req: ApiRequest, limit: number, windowSeconds = 3_600) => {
  const key = rateLimitKey(scope, clientIp(req));
  let hits: number;
  try {
    hits = await getLeadStore().hitRateLimit(key, windowSeconds);
  } catch (error) {
    // A limiter that cannot count must not take the endpoint down with it.
    console.error("[ratelimit] check failed, allowing request", error);
    return;
  }
  if (hits > limit) {
    throw new HttpError(429, "rate_limited", "That's a few too many requests. Please try again in a little while.");
  }
};

export const newAccessToken = (): string => randomBytes(24).toString("base64url");

/** Constant-time bearer-token comparison for the admin endpoint. */
export const bearerMatches = (req: ApiRequest, expected: string): boolean => {
  if (!expected) return false;
  const header = req.headers.authorization ?? "";
  const provided = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!provided) return false;

  const a = Buffer.from(createHash("sha256").update(provided).digest());
  const b = Buffer.from(createHash("sha256").update(expected).digest());
  return timingSafeEqual(a, b);
};

/** Absolute URL of a lead's report page, used in emails and stored on the row. */
export const reportUrlFor = (id: string, token: string): string =>
  `${env.auditSiteUrl.replace(/\/$/, "")}/?report=${encodeURIComponent(id)}&t=${encodeURIComponent(token)}`;
