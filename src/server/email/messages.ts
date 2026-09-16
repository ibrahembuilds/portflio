import { env } from "../env";
import type { FitStatus, Readiness } from "../qualification";
import type { SystemsReport } from "../report/schema";
import type { EmailMessage } from "./provider";

/**
 * The email is deliberately short. The report is the value — the message just
 * carries it and points at the one next step.
 */

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const reportEmail = (params: {
  to: string;
  firstName: string;
  companyName: string;
  report: SystemsReport;
  reportUrl: string;
  pdf?: Buffer;
  pdfFilename?: string;
}): EmailMessage => {
  const firstFix = params.report.recommended_first_fix.title;
  const bookingLine = env.bookingUrl
    ? `Book the 20-minute Systems Teardown: ${env.bookingUrl}`
    : `Reply to this email and we'll find 20 minutes.`;

  const text = `Hi ${params.firstName},

Your Systems Report for ${params.companyName} is attached, and it's also online here:
${params.reportUrl}

The one thing I'd look at first: ${firstFix}

It's preliminary — built from your answers, not from watching the work happen. The 20-minute call is where it gets real.

${bookingLine}

Ibrahem
Internal Systems for Small Businesses
ibrahemahmed.com`;

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f7f7f3;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#0b1220;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #dde1e8;border-radius:12px;padding:28px;">
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">Hi ${escapeHtml(params.firstName)},</p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">Your Systems Report for <strong>${escapeHtml(params.companyName)}</strong> is attached to this email, and it's online here:</p>
    <p style="margin:0 0 20px;"><a href="${escapeHtml(params.reportUrl)}" style="color:#3157d5;font-size:15px;">${escapeHtml(params.reportUrl)}</a></p>
    <p style="margin:0 0 6px;font-size:13px;color:#667085;">The one thing I'd look at first</p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.5;font-weight:600;">${escapeHtml(firstFix)}</p>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#667085;">It's preliminary — built from your answers, not from watching the work happen. The 20-minute call is where it gets real.</p>
    ${
      env.bookingUrl
        ? `<p style="margin:0 0 24px;"><a href="${escapeHtml(env.bookingUrl)}" style="display:inline-block;background:#3157d5;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-size:15px;font-weight:500;">Book the 20-minute Teardown</a></p>`
        : `<p style="margin:0 0 24px;font-size:15px;line-height:1.6;">Reply to this email and we'll find 20 minutes.</p>`
    }
    <p style="margin:0;font-size:14px;line-height:1.6;">Ibrahem<br><span style="color:#667085;">Internal Systems for Small Businesses · ibrahemahmed.com</span></p>
  </div>
</body></html>`;

  return {
    to: params.to,
    subject: `Your Systems Report — ${params.companyName}`,
    text,
    html,
    attachments:
      params.pdf && params.pdfFilename
        ? [{ filename: params.pdfFilename, content: params.pdf, contentType: "application/pdf" }]
        : undefined,
  };
};

/**
 * Internal notification. Also the record of last resort: if the database write
 * failed, this email is the only copy of the lead, so it carries the answers.
 */
export const leadNotificationEmail = (params: {
  firstName: string;
  email: string;
  companyName: string;
  fitStatus: FitStatus;
  readiness: Readiness;
  reportUrl: string;
  answersSummary: string;
  persisted: boolean;
}): EmailMessage => {
  const flag = params.persisted ? "" : "\n\n*** NOT SAVED TO THE DATABASE — THIS EMAIL IS THE ONLY COPY ***\n";

  return {
    to: env.notifyEmail,
    replyTo: params.email,
    subject: `${params.fitStatus === "qualified" && params.readiness === "ready" ? "[HOT] " : params.fitStatus === "qualified" ? "[QUALIFIED] " : ""}Teardown lead — ${params.companyName}`,
    text: `${params.firstName} <${params.email}>
Company: ${params.companyName}
Fit: ${params.fitStatus} · Readiness: ${params.readiness}
Report: ${params.reportUrl}
${flag}
${params.answersSummary}`,
  };
};
