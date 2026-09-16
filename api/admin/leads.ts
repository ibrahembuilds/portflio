import { env } from "../../src/server/env";
import {
  bearerMatches,
  requireMethod,
  sendError,
  sendJson,
  HttpError,
  type ApiRequest,
  type ApiResponse,
} from "../../src/server/http";
import { getLeadStore } from "../../src/server/store";
import type { LeadRecord } from "../../src/server/store/types";

/**
 * GET /api/admin/leads?format=json|csv&limit=&offset=
 *
 * Protected by a bearer token from TEARDOWN_ADMIN_TOKEN. Deliberately small:
 * the purpose is to make qualified Teardown leads usable, not to build a CRM.
 */

const CSV_COLUMNS: Array<[keyof LeadRecord | "tools", string]> = [
  ["created_at", "Created"],
  ["company", "Company"],
  ["name", "Contact"],
  ["email", "Email"],
  ["role", "Role"],
  ["country", "Country"],
  ["employee_range", "Team size"],
  ["fit_status", "Fit"],
  ["process_problem", "Problem"],
  ["weekly_frequency", "Frequency"],
  ["tools", "Tools"],
  ["previous_attempts", "Already tried"],
  ["estimated_value", "Stated value"],
  ["marketing_consent", "Marketing consent"],
  ["report_status", "Report"],
  ["email_status", "Email"],
  ["source", "Source"],
  ["utm_source", "UTM source"],
  ["utm_campaign", "UTM campaign"],
  ["report_pdf_url", "Report link"],
];

/** Prefixes cells that a spreadsheet would otherwise evaluate as a formula. */
const csvCell = (value: unknown): string => {
  const text = Array.isArray(value) ? value.join(" | ") : String(value ?? "");
  const guarded = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${guarded.replace(/"/g, '""')}"`;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireMethod(req, res, "GET")) return;

  try {
    if (!env.adminToken) throw new HttpError(503, "admin_disabled", "Admin access is not configured.");
    if (!bearerMatches(req, env.adminToken)) throw new HttpError(401, "unauthorised", "Not authorised.");

    const url = new URL(req.url ?? "/", "http://localhost");
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 100), 1), 500);
    const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);

    const leads = await getLeadStore().listLeads(limit, offset);

    if (url.searchParams.get("format") === "csv") {
      const header = CSV_COLUMNS.map(([, title]) => csvCell(title)).join(",");
      const rows = leads.map((lead) =>
        CSV_COLUMNS.map(([key]) => csvCell(key === "tools" ? lead.current_tools : lead[key])).join(","),
      );
      const body = [header, ...rows].join("\r\n");

      res.statusCode = 200;
      res.setHeader("content-type", "text/csv; charset=utf-8");
      res.setHeader("content-disposition", `attachment; filename="teardown-leads.csv"`);
      res.setHeader("cache-control", "no-store");
      res.end(body);
      return;
    }

    sendJson(res, 200, { count: leads.length, limit, offset, leads });
  } catch (error) {
    sendError(res, error);
  }
}
