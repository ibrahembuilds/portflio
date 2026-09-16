import {
  requireMethod,
  sendError,
  sendJson,
  HttpError,
  type ApiRequest,
  type ApiResponse,
} from "../../src/server/http";
import { getLeadStore } from "../../src/server/store";
import { buildNextAction } from "../../src/server/submitLead";

/**
 * GET /api/audit/report?id=<lead id>&t=<access token>
 *
 * Re-opens a previously generated report. The token is required: a lead id on
 * its own is not enough to read someone's answers.
 */
export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireMethod(req, res, "GET")) return;

  try {
    const url = new URL(req.url ?? "/", "http://localhost");
    const id = url.searchParams.get("id") ?? "";
    const token = url.searchParams.get("t") ?? "";
    if (!id || !token) throw new HttpError(400, "missing_parameters", "That link is incomplete.");

    const lead = await getLeadStore().getLeadByToken(id, token);
    if (!lead || !lead.report_json) {
      // Same response for "wrong token" and "no such lead", so the endpoint
      // cannot be used to test whether an id exists.
      throw new HttpError(404, "not_found", "That report link is no longer valid.");
    }

    sendJson(res, 200, {
      lead_id: lead.id,
      report: lead.report_json,
      report_status: lead.report_status,
      company_name: lead.company,
      first_name: lead.name,
      next_action: buildNextAction(lead.fit_status),
      created_at: lead.created_at,
    });
  } catch (error) {
    sendError(res, error);
  }
}
