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
import { buildPreview } from "../../src/server/report/heuristics";
import { assessmentAnswersSchema, toFieldErrors } from "../../src/server/validation";

/**
 * POST /api/audit/preview
 *
 * The limited preview shown before the email gate. Deliberately deterministic —
 * no model is called and nothing is stored, so an anonymous visitor cannot run
 * up model cost or create a record simply by filling the form in.
 */
export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireMethod(req, res, "POST")) return;

  try {
    await enforceRateLimit("preview", req, env.rateLimitWebsitePerHour);

    const parsed = assessmentAnswersSchema.safeParse(await readJsonBody(req));
    if (!parsed.success) {
      throw new HttpError(422, "invalid_answers", "Some answers need another look.", toFieldErrors(parsed.error));
    }

    const findings = buildPreview(parsed.data);
    sendJson(res, 200, { count: findings.length, findings });
  } catch (error) {
    sendError(res, error);
  }
}
