import { neon } from "@neondatabase/serverless";
import { env } from "../env";
import type { AnalyticsEvent, LeadRecord, LeadStore, LeadUpdate, NewLead } from "./types";

/**
 * Vercel Postgres (Neon) store, over the driver's HTTP endpoint so a serverless
 * invocation does not hold a TCP connection open.
 *
 * Schema lives in db/migrations/0001_systems_teardown.sql and must be applied
 * before this store is used.
 */

type SqlClient = (query: string, params?: unknown[]) => Promise<Record<string, unknown>[]>;

let client: SqlClient | null = null;

const getClient = (): SqlClient => {
  if (!client) {
    const url = env.databaseUrl;
    if (!url) throw new Error("No database URL configured");
    client = neon(url) as unknown as SqlClient;
  }
  return client;
};

/** Test seam: lets a test inject a fake client and reset it afterwards. */
export const __setSqlClient = (next: SqlClient | null) => {
  client = next;
};

const toDate = (value: unknown): string =>
  value instanceof Date ? value.toISOString() : String(value ?? new Date().toISOString());

const toNullableDate = (value: unknown): string | null =>
  value === null || value === undefined ? null : toDate(value);

/** Postgres returns jsonb already parsed, but a text column would arrive as a
 *  string; handle both so a column type change cannot silently break reads. */
const parseJson = <T>(value: unknown): T | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }
  return value as T;
};

const mapRow = (row: Record<string, unknown>): LeadRecord => ({
  id: String(row.id),
  created_at: toDate(row.created_at),
  updated_at: toDate(row.updated_at),
  session_id: String(row.session_id ?? ""),
  access_token: String(row.access_token ?? ""),
  name: String(row.name ?? ""),
  email: String(row.email ?? ""),
  company: String(row.company ?? ""),
  website: String(row.website ?? ""),
  country: String(row.country ?? ""),
  employee_range: String(row.employee_range ?? ""),
  role: String(row.role ?? ""),
  process_problem: String(row.process_problem ?? ""),
  weekly_frequency: String(row.weekly_frequency ?? ""),
  people_involved: String(row.people_involved ?? ""),
  current_tools: (parseJson<string[]>(row.current_tools) ?? []) as string[],
  previous_attempts: String(row.previous_attempts ?? ""),
  estimated_value: String(row.estimated_value ?? ""),
  marketing_consent: Boolean(row.marketing_consent),
  marketing_consent_timestamp: toNullableDate(row.marketing_consent_timestamp),
  privacy_policy_version: String(row.privacy_policy_version ?? ""),
  assessment_answers_json: parseJson(row.assessment_answers_json) as LeadRecord["assessment_answers_json"],
  website_context_json: parseJson(row.website_context_json) as LeadRecord["website_context_json"],
  report_json: parseJson(row.report_json) as LeadRecord["report_json"],
  report_pdf_url: String(row.report_pdf_url ?? ""),
  fit_status: String(row.fit_status ?? "not_current_fit") as LeadRecord["fit_status"],
  report_status: String(row.report_status ?? "pending") as LeadRecord["report_status"],
  email_status: String(row.email_status ?? "pending") as LeadRecord["email_status"],
  source: String(row.source ?? ""),
  utm_source: String(row.utm_source ?? ""),
  utm_medium: String(row.utm_medium ?? ""),
  utm_campaign: String(row.utm_campaign ?? ""),
  referrer: String(row.referrer ?? ""),
});

export class PostgresLeadStore implements LeadStore {
  readonly kind = "postgres";
  readonly durable = true;

  async createLead(lead: NewLead): Promise<LeadRecord> {
    const sql = getClient();
    const answers = lead.answers;

    const rows = await sql(
      `INSERT INTO teardown_leads (
         session_id, access_token, name, email, company, website, country,
         employee_range, role, process_problem, weekly_frequency, people_involved,
         current_tools, previous_attempts, estimated_value,
         marketing_consent, marketing_consent_timestamp, privacy_policy_version,
         assessment_answers_json, website_context_json,
         fit_status, report_status, email_status,
         source, utm_source, utm_medium, utm_campaign, referrer
       ) VALUES (
         $1, $2, $3, $4, $5, $6, $7,
         $8, $9, $10, $11, $12,
         $13, $14, $15,
         $16, $17, $18,
         $19, $20,
         $21, 'pending', 'pending',
         $22, $23, $24, $25, $26
       )
       RETURNING *`,
      [
        lead.session_id,
        lead.access_token,
        lead.name,
        lead.email,
        answers.company_name,
        answers.company_website,
        answers.country,
        answers.employee_range,
        answers.respondent_role,
        answers.process_problem,
        answers.weekly_frequency,
        answers.people_involved,
        JSON.stringify(answers.current_tools),
        answers.previous_attempts,
        answers.estimated_value,
        lead.marketing_consent,
        lead.marketing_consent_timestamp,
        lead.privacy_policy_version,
        JSON.stringify(answers),
        lead.website_context ? JSON.stringify(lead.website_context) : null,
        lead.fit_status,
        lead.attribution.source,
        lead.attribution.utm_source,
        lead.attribution.utm_medium,
        lead.attribution.utm_campaign,
        lead.attribution.referrer,
      ],
    );

    return mapRow(rows[0]);
  }

  async updateLead(id: string, patch: LeadUpdate): Promise<LeadRecord | null> {
    const sql = getClient();
    const rows = await sql(
      `UPDATE teardown_leads SET
         report_json    = COALESCE($2::jsonb, report_json),
         report_status  = COALESCE($3, report_status),
         report_pdf_url = COALESCE($4, report_pdf_url),
         email_status   = COALESCE($5, email_status),
         updated_at     = now()
       WHERE id = $1
       RETURNING *`,
      [
        id,
        patch.report_json ? JSON.stringify(patch.report_json) : null,
        patch.report_status ?? null,
        patch.report_pdf_url ?? null,
        patch.email_status ?? null,
      ],
    );
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async getLead(id: string): Promise<LeadRecord | null> {
    const sql = getClient();
    const rows = await sql(`SELECT * FROM teardown_leads WHERE id = $1`, [id]);
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async getLeadByToken(id: string, token: string): Promise<LeadRecord | null> {
    const sql = getClient();
    const rows = await sql(`SELECT * FROM teardown_leads WHERE id = $1 AND access_token = $2`, [id, token]);
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async listLeads(limit: number, offset: number): Promise<LeadRecord[]> {
    const sql = getClient();
    const rows = await sql(`SELECT * FROM teardown_leads ORDER BY created_at DESC LIMIT $1 OFFSET $2`, [limit, offset]);
    return rows.map(mapRow);
  }

  async recordEvent(event: AnalyticsEvent): Promise<void> {
    const sql = getClient();
    await sql(
      `INSERT INTO teardown_events (session_id, event, properties, utm_source, utm_medium, utm_campaign, referrer)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        event.session_id,
        event.event,
        JSON.stringify(event.properties ?? {}),
        event.attribution.utm_source ?? "",
        event.attribution.utm_medium ?? "",
        event.attribution.utm_campaign ?? "",
        event.attribution.referrer ?? "",
      ],
    );
  }

  /**
   * Fixed-window counter. The upsert is atomic, so two concurrent invocations
   * of the same function cannot both read a stale count.
   */
  async hitRateLimit(key: string, windowSeconds: number): Promise<number> {
    const sql = getClient();
    const rows = await sql(
      `INSERT INTO teardown_rate_limits (bucket_key, window_start, hits)
       VALUES ($1, to_timestamp(floor(extract(epoch from now()) / $2) * $2), 1)
       ON CONFLICT (bucket_key, window_start)
       DO UPDATE SET hits = teardown_rate_limits.hits + 1
       RETURNING hits`,
      [key, windowSeconds],
    );
    return Number(rows[0]?.hits ?? 1);
  }
}
