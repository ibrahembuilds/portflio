import { randomUUID } from "node:crypto";
import type { AnalyticsEvent, LeadRecord, LeadStore, LeadUpdate, NewLead } from "./types";

/**
 * Process-local store. Used by tests and by local development so the whole
 * funnel can be exercised without a database.
 *
 * `durable` is false, and the submit handler uses that flag to decide whether a
 * failure to persist is recoverable — a lead written only here is not safe, so
 * the notification email becomes the record of last resort.
 */
export class MemoryLeadStore implements LeadStore {
  readonly kind = "memory";
  readonly durable = false;

  private leads = new Map<string, LeadRecord>();
  private events: AnalyticsEvent[] = [];
  private buckets = new Map<string, { windowStart: number; hits: number }>();

  async createLead(lead: NewLead): Promise<LeadRecord> {
    const now = new Date().toISOString();
    const record: LeadRecord = {
      id: randomUUID(),
      created_at: now,
      updated_at: now,
      session_id: lead.session_id,
      access_token: lead.access_token,
      name: lead.name,
      email: lead.email,
      company: lead.answers.company_name,
      website: lead.answers.company_website,
      country: lead.answers.country,
      employee_range: lead.answers.employee_range,
      role: lead.answers.respondent_role,
      process_problem: lead.answers.process_problem,
      weekly_frequency: lead.answers.weekly_frequency,
      people_involved: lead.answers.people_involved,
      current_tools: lead.answers.current_tools,
      previous_attempts: lead.answers.previous_attempts,
      estimated_value: lead.answers.estimated_value,
      marketing_consent: lead.marketing_consent,
      marketing_consent_timestamp: lead.marketing_consent_timestamp,
      privacy_policy_version: lead.privacy_policy_version,
      assessment_answers_json: lead.answers,
      website_context_json: lead.website_context,
      report_json: null,
      report_pdf_url: "",
      fit_status: lead.fit_status,
      report_status: "pending",
      email_status: "pending",
      source: lead.attribution.source,
      utm_source: lead.attribution.utm_source,
      utm_medium: lead.attribution.utm_medium,
      utm_campaign: lead.attribution.utm_campaign,
      referrer: lead.attribution.referrer,
    };
    this.leads.set(record.id, record);
    return record;
  }

  async updateLead(id: string, patch: LeadUpdate): Promise<LeadRecord | null> {
    const existing = this.leads.get(id);
    if (!existing) return null;
    const next: LeadRecord = { ...existing, ...patch, updated_at: new Date().toISOString() };
    this.leads.set(id, next);
    return next;
  }

  async getLead(id: string): Promise<LeadRecord | null> {
    return this.leads.get(id) ?? null;
  }

  async getLeadByToken(id: string, token: string): Promise<LeadRecord | null> {
    const lead = this.leads.get(id);
    return lead && lead.access_token === token ? lead : null;
  }

  async listLeads(limit: number, offset: number): Promise<LeadRecord[]> {
    return [...this.leads.values()]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(offset, offset + limit);
  }

  async recordEvent(event: AnalyticsEvent): Promise<void> {
    this.events.push(event);
    if (this.events.length > 2_000) this.events.splice(0, this.events.length - 2_000);
  }

  async hitRateLimit(key: string, windowSeconds: number): Promise<number> {
    const windowStart = Math.floor(Date.now() / 1_000 / windowSeconds) * windowSeconds;
    const bucket = this.buckets.get(key);
    if (!bucket || bucket.windowStart !== windowStart) {
      this.buckets.set(key, { windowStart, hits: 1 });
      return 1;
    }
    bucket.hits += 1;
    return bucket.hits;
  }

  /* Test helpers -------------------------------------------------------- */
  get recordedEvents(): AnalyticsEvent[] {
    return this.events;
  }

  reset() {
    this.leads.clear();
    this.events = [];
    this.buckets.clear();
  }
}
