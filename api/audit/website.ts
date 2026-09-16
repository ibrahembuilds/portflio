import { env } from "../../src/server/env";
import {
  enforceRateLimit,
  readJsonBody,
  requireMethod,
  sendError,
  sendJson,
  HttpError,
  type ApiRequest,
  type ApiResponse,
} from "../../src/server/http";
import { fetchWebsiteContext } from "../../src/server/website/fetchContext";
import { websiteLookupSchema } from "../../src/server/validation";

/**
 * POST /api/audit/website
 *
 * Fetches the public page at a prospect-supplied URL for context only. Always
 * returns 200: a failure here must never interrupt the assessment, so the
 * client treats { ok: false } as "carry on".
 */
export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireMethod(req, res, "POST")) return;

  try {
    await enforceRateLimit("website", req, env.rateLimitWebsitePerHour);

    const parsed = websiteLookupSchema.safeParse(await readJsonBody(req));
    if (!parsed.success) throw new HttpError(422, "invalid_request", "That URL could not be read.");

    const result = await fetchWebsiteContext(parsed.data.url);

    if (!result.ok) {
      // The reason is logged, not returned: it describes our network policy and
      // is of no use to the prospect.
      console.warn(`[website] lookup failed: ${result.reason}`);
      sendJson(res, 200, { ok: false });
      return;
    }

    sendJson(res, 200, { ok: true, context: result.context });
  } catch (error) {
    sendError(res, error);
  }
}
