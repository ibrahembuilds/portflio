import { env } from "../../src/server/env";
import {
  requireMethod,
  sendError,
  HttpError,
  type ApiRequest,
  type ApiResponse,
} from "../../src/server/http";
import { pdfFilename, renderReportPdf } from "../../src/server/pdf/render";
import { getLeadStore } from "../../src/server/store";

/**
 * GET /api/audit/report-pdf?id=<lead id>&t=<access token>
 *
 * Renders the stored report to PDF on demand. Nothing is written to object
 * storage, so there is no long-lived public file to leak.
 */
export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireMethod(req, res, "GET")) return;

  try {
    const url = new URL(req.url ?? "/", "http://localhost");
    const id = url.searchParams.get("id") ?? "";
    const token = url.searchParams.get("t") ?? "";
    if (!id || !token) throw new HttpError(400, "missing_parameters", "That link is incomplete.");

    const lead = await getLeadStore().getLeadByToken(id, token);
    if (!lead || !lead.report_json) throw new HttpError(404, "not_found", "That report link is no longer valid.");

    const pdf = await renderReportPdf({
      report: lead.report_json,
      companyName: lead.company,
      recipientName: lead.name,
      generatedAt: new Date(lead.created_at),
      bookingUrl: env.bookingUrl || undefined,
      contactEmail: "hello@ibrahemahmed.com",
    });

    res.statusCode = 200;
    res.setHeader("content-type", "application/pdf");
    res.setHeader("content-length", String(pdf.length));
    res.setHeader("content-disposition", `attachment; filename="${pdfFilename(lead.company)}"`);
    res.setHeader("cache-control", "no-store");
    res.end(pdf);
  } catch (error) {
    sendError(res, error);
  }
}
