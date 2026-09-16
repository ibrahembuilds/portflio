import type { FitStatus } from "../qualification";
import type { ReportStatus } from "../report/generate";
import type { SystemsReport } from "../report/schema";
import type { WebsiteContext } from "../website/fetchContext";
import type { AssessmentAnswers, Attribution } from "../validation";

export type EmailStatus = "pending" | "sent" | "failed" | "not_configured";

export type LeadRecord = {
  id: string;
  created_at: string;
  updated_at: string;
  session_id: string;
  /** Random token in the report URL. Without it a lead id alone reveals nothing. */
  access_token: string;

  name: string;
  email: string;
  company: string;
  website: string;
  country: string;
  employee_range: string;
  role: string;

  process_problem: string;
  weekly_frequency: string;
  people_involved: string;
  current_tools: string[];
  previous_attempts: string;
  estimated_value: string;

  marketing_consent: boolean;
  marketing_consent_timestamp: string | null;
  privacy_policy_version: string;

  assessment_answers_json: AssessmentAnswers;
  website_context_json: WebsiteContext | null;
  report_json: SystemsReport | null;
  report_pdf_url: string;

  fit_status: FitStatus;
  report_status: ReportStatus | "pending";
  email_status: EmailStatus;

  source: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  referrer: string;
};

export type NewLead = {
  session_id: string;
  access_token: string;
  name: string;
  email: string;
  answers: AssessmentAnswers;
  website_context: WebsiteContext | null;
  marketing_consent: boolean;
  marketing_consent_timestamp: string | null;
  privacy_policy_version: string;
  fit_status: FitStatus;
  attribution: Attribution;
};

export type LeadUpdate = Partial<
  Pick<LeadRecord, "report_json" | "report_status" | "report_pdf_url" | "email_status">
>;

export type AnalyticsEvent = {
  session_id: string;
  event: string;
  properties: Record<string, string | number | boolean>;
  attribution: Partial<Attribution>;
};

export interface LeadStore {
  readonly kind: string;
  readonly durable: boolean;
  /** Writes the lead before any downstream work happens. */
  createLead(lead: NewLead): Promise<LeadRecord>;
  updateLead(id: string, patch: LeadUpdate): Promise<LeadRecord | null>;
  getLead(id: string): Promise<LeadRecord | null>;
  /** Report retrieval is by id + token, never by id alone. */
  getLeadByToken(id: string, token: string): Promise<LeadRecord | null>;
  listLeads(limit: number, offset: number): Promise<LeadRecord[]>;
  recordEvent(event: AnalyticsEvent): Promise<void>;
  /** Returns the number of hits in the window after counting this one. */
  hitRateLimit(key: string, windowSeconds: number): Promise<number>;
}
