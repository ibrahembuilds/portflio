import { env } from "../../src/server/env";
import {
  enforceRateLimit,
  readJsonBody,
  requireMethod,
  type ApiRequest,
  type ApiResponse,
} from "../../src/server/http";
import { getLeadStore } from "../../src/server/store";
import { analyticsEventSchema, stripEventProperties } from "../../src/server/validation";

/**
 * POST /api/audit/event
 *
 * First-party funnel counts. Answer text and email addresses are stripped
 * server-side by the property allow-list, so they can never reach analytics
 * even if a future client change tries to send them.
 *
 * Always returns 204: a dropped analytics event must never surface to a user.
 */
export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireMethod(req, res, "POST")) return;

  try {
    await enforceRateLimit("event", req, env.rateLimitEventPerHour);

    const parsed = analyticsEventSchema.safeParse(await readJsonBody(req));
    if (parsed.success) {
      await getLeadStore().recordEvent({
        session_id: parsed.data.session_id,
        event: parsed.data.event,
        properties: stripEventProperties(parsed.data.properties),
        attribution: parsed.data.attribution ?? {},
      });
    }
  } catch (error) {
    console.warn("[event] dropped", error);
  }

  res.statusCode = 204;
  res.end();
}
