import { env } from "../../src/server/env";
import {
  clientIp,
  enforceRateLimit,
  readJsonBody,
  requireMethod,
  sendError,
  sendJson,
  HttpError,
  type ApiRequest,
  type ApiResponse,
} from "../../src/server/http";
import { submitLead } from "../../src/server/submitLead";
import { verifyTurnstile } from "../../src/server/turnstile";
import { leadSubmissionSchema, toFieldErrors } from "../../src/server/validation";
import type { WebsiteContext } from "../../src/server/website/fetchContext";

/**
 * POST /api/audit/lead
 *
 * Receives the completed assessment plus the email capture, persists the lead,
 * generates the report and returns it for immediate display.
 */
export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireMethod(req, res, "POST")) return;

  try {
    await enforceRateLimit("submit", req, env.rateLimitSubmitPerHour);

    const parsed = leadSubmissionSchema.safeParse(await readJsonBody(req));
    if (!parsed.success) {
      throw new HttpError(422, "invalid_submission", "Some answers need another look.", toFieldErrors(parsed.error));
    }

    const submission = parsed.data;

    const turnstile = await verifyTurnstile(submission.turnstile_token, clientIp(req));
    if (!turnstile.ok) {
      throw new HttpError(403, "bot_check_failed", "That didn't pass the automated check. Please reload and try again.");
    }

    // The website context was fetched and validated by /api/audit/website; it is
    // re-checked here for shape so a crafted client cannot inject free text.
    const websiteContext = normaliseWebsiteContext(submission.website_context);

    const outcome = await submitLead(submission, websiteContext);

    sendJson(res, 200, {
      lead_id: outcome.leadId,
      access_token: outcome.accessToken,
      report_url: outcome.reportUrl,
      report: outcome.report,
      report_status: outcome.reportStatus,
      next_action: outcome.nextAction,
      delivery: outcome.delivery,
    });
  } catch (error) {
    sendError(res, error);
  }
}

/** Accepts only the fields the report generator reads, with hard length caps. */
const normaliseWebsiteContext = (value: unknown): WebsiteContext | null => {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const str = (key: string, max: number) => String(raw[key] ?? "").slice(0, max);

  const summaryText = str("summaryText", 1_800);
  const title = str("title", 200);
  if (!summaryText && !title) return null;

  return {
    requestedUrl: str("requestedUrl", 300),
    finalUrl: str("finalUrl", 300),
    title,
    description: str("description", 300),
    siteName: str("siteName", 200),
    headings: Array.isArray(raw.headings)
      ? raw.headings.slice(0, 8).map((heading) => String(heading).slice(0, 140))
      : [],
    summaryText,
    fetchedAt: str("fetchedAt", 40) || new Date().toISOString(),
  };
};
