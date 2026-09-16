import { countryLabel, EMPLOYEE_RANGES, optionLabel, ROLES, VALUE_BANDS, WEEKLY_FREQUENCY } from "../config/assessment";
import { env } from "./env";
import { getEmailProvider, type EmailProvider } from "./email/provider";
import { leadNotificationEmail, reportEmail } from "./email/messages";
import { newAccessToken, reportUrlFor } from "./http";
import { pdfFilename, renderReportPdf } from "./pdf/render";
import { assessFit, type FitStatus } from "./qualification";
import { generateReport, type ReportStatus } from "./report/generate";
import { toolLabels } from "./report/heuristics";
import type { SystemsReport } from "./report/schema";
import { getLeadStore } from "./store";
import type { LeadStore } from "./store/types";
import type { WebsiteContext } from "./website/fetchContext";
import type { LeadSubmission } from "./validation";

/**
 * The submit pipeline, kept out of the HTTP handler so each failure mode can be
 * tested directly.
 *
 * Ordering matters and is deliberate: the lead is persisted before any
 * downstream integration runs. A model outage, a PDF failure or a bounced email
 * degrades the response but can never lose the enquiry.
 */

export type NextAction =
  | { kind: "book"; heading: string; body: string; label: string; url: string }
  | { kind: "book_pending"; heading: string; body: string; contactEmail: string }
  | { kind: "no_pitch"; heading: string; body: string; contactEmail: string };

export type SubmitOutcome = {
  leadId: string;
  accessToken: string;
  reportUrl: string;
  report: SystemsReport;
  reportStatus: ReportStatus;
  fitStatus: FitStatus;
  nextAction: NextAction;
  /** Surfaced to the client only so it can show an honest fallback message. */
  delivery: { persisted: boolean; emailed: boolean; pdf: boolean };
};

const CONTACT_EMAIL = "hello@ibrahemahmed.com";

export const buildNextAction = (fitStatus: FitStatus): NextAction => {
  if (fitStatus === "not_current_fit") {
    return {
      kind: "no_pitch",
      heading: "This report is yours either way",
      body: "From what you've told me, I'm probably not the right person for this right now — and I'd rather say that than sell you a call. The report is still yours to use or pass on internally. If something changes, or you think I've read it wrong, tell me.",
      contactEmail: CONTACT_EMAIL,
    };
  }

  const qualified = fitStatus === "qualified";

  const heading = qualified
    ? "Continue with a 20-minute Systems Teardown"
    : "If it would help, we can go through this properly";

  const body = qualified
    ? "This is the part the report can't do: 20 minutes on one real example, end to end. After that you get a written map and a fixed quote for the highest-priority fix. No obligation, and no pitch deck."
    : "It looks like there may be something here worth 20 minutes. If you'd like to go through one real example together, the call is the next step — and if it turns out I'm not the right fit, I'll say so.";

  if (!env.bookingUrl) {
    return { kind: "book_pending", heading, body, contactEmail: CONTACT_EMAIL };
  }

  return {
    kind: "book",
    heading,
    body,
    label: qualified ? "Continue with a 20-minute Systems Teardown" : "Book a 20-minute call",
    url: env.bookingUrl,
  };
};

const answersSummary = (submission: LeadSubmission): string => {
  const { answers } = submission;
  return [
    `Company: ${answers.company_name}`,
    `Website: ${answers.company_website || "(none)"}`,
    `Country: ${countryLabel(answers.country)}`,
    `Team size: ${optionLabel(EMPLOYEE_RANGES, answers.employee_range)}`,
    `Role: ${optionLabel(ROLES, answers.respondent_role)}`,
    `Contact: ${answers.respondent_name}`,
    "",
    `Problem: ${answers.process_problem}`,
    `Frequency: ${optionLabel(WEEKLY_FREQUENCY, answers.weekly_frequency)}`,
    `Who does it: ${answers.people_involved}`,
    `Tools: ${toolLabels(answers.current_tools).join(", ")}`,
    `Already tried: ${answers.previous_attempts || "(not answered)"}`,
    `Stated value: ${optionLabel(VALUE_BANDS, answers.estimated_value)}`,
    "",
    `Marketing consent: ${submission.consent.marketing_consent ? "yes" : "no"}`,
  ].join("\n");
};

export type SubmitDeps = {
  store?: LeadStore;
  email?: EmailProvider;
  /** Disabled in tests that do not need a PDF. */
  renderPdf?: boolean;
};

export const submitLead = async (
  submission: LeadSubmission,
  websiteContext: WebsiteContext | null,
  deps: SubmitDeps = {},
): Promise<SubmitOutcome> => {
  const store = deps.store ?? getLeadStore();
  const emailProvider = deps.email ?? getEmailProvider();

  const fit = assessFit(submission.answers);
  const accessToken = newAccessToken();

  /* 1. Persist first. Everything after this point is best-effort. ---------- */
  let leadId = "";
  let persisted = false;
  try {
    const record = await store.createLead({
      session_id: submission.session_id,
      access_token: accessToken,
      name: submission.first_name,
      email: submission.email,
      answers: submission.answers,
      website_context: websiteContext,
      marketing_consent: submission.consent.marketing_consent,
      // Timestamp is only recorded when consent was actually given.
      marketing_consent_timestamp: submission.consent.marketing_consent ? new Date().toISOString() : null,
      privacy_policy_version: submission.consent.privacy_policy_version,
      fit_status: fit.status,
      attribution: submission.attribution,
    });
    leadId = record.id;
    persisted = store.durable;
  } catch (error) {
    console.error("[submit] failed to persist lead", error);
  }

  const reportUrl = leadId ? reportUrlFor(leadId, accessToken) : `${env.auditSiteUrl}/`;

  /* 2. Report. A provider outage produces the deterministic report, not an
        error page. ---------------------------------------------------------- */
  const generated = await generateReport(submission.answers, websiteContext);
  if (generated.rejections.length > 0) {
    console.warn(`[submit] model output rejected: ${generated.rejections.join(" | ")}`);
  }

  if (leadId) {
    try {
      await store.updateLead(leadId, {
        report_json: generated.report,
        report_status: generated.status,
        report_pdf_url: reportUrl,
      });
    } catch (error) {
      console.error("[submit] failed to store report", error);
    }
  }

  /* 3. PDF, then email. Neither can fail the request. --------------------- */
  let pdf: Buffer | undefined;
  if (deps.renderPdf !== false) {
    try {
      pdf = await renderReportPdf({
        report: generated.report,
        companyName: submission.answers.company_name,
        recipientName: submission.first_name,
        bookingUrl: env.bookingUrl || undefined,
        contactEmail: CONTACT_EMAIL,
      });
    } catch (error) {
      console.error("[submit] PDF generation failed", error);
    }
  }

  let emailed = false;
  if (emailProvider.available) {
    const result = await emailProvider.send(
      reportEmail({
        to: submission.email,
        firstName: submission.first_name,
        companyName: submission.answers.company_name,
        report: generated.report,
        reportUrl,
        pdf,
        pdfFilename: pdf ? pdfFilename(submission.answers.company_name) : undefined,
      }),
    );
    emailed = result.ok;
    if (!result.ok) console.error(`[submit] report email failed: ${result.reason}`);

    // The internal notification doubles as the backup copy when the database
    // write did not land.
    const notification = await emailProvider.send(
      leadNotificationEmail({
        firstName: submission.first_name,
        email: submission.email,
        companyName: submission.answers.company_name,
        fitStatus: fit.status,
        reportUrl,
        answersSummary: answersSummary(submission),
        persisted,
      }),
    );
    if (!notification.ok) console.error(`[submit] lead notification failed: ${notification.reason}`);
  }

  if (leadId) {
    try {
      await store.updateLead(leadId, {
        email_status: emailProvider.available ? (emailed ? "sent" : "failed") : "not_configured",
      });
    } catch (error) {
      console.error("[submit] failed to record email status", error);
    }
  }

  if (!persisted && !emailed) {
    // Both records failed. Log the whole lead so it is at least recoverable
    // from the platform's logs rather than lost outright.
    console.error(`[submit] LEAD NOT PERSISTED AND NOT EMAILED:\n${answersSummary(submission)}\n${submission.email}`);
  }

  return {
    leadId,
    accessToken,
    reportUrl,
    report: generated.report,
    reportStatus: generated.status,
    fitStatus: fit.status,
    nextAction: buildNextAction(fit.status),
    delivery: { persisted, emailed, pdf: Boolean(pdf) },
  };
};
