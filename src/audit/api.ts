import type { SystemsReport } from "../server/report/schema";
import type { Attribution } from "./state";

/**
 * Client for the assessment API. The SystemsReport type is imported with
 * `import type`, so the schema (and zod with it) never reaches this bundle.
 */

export type PreviewFinding = { title: string; body: string; priority: "critical" | "important" | "later" };

export type NextAction =
  | { kind: "book"; heading: string; body: string; label: string; url: string }
  | { kind: "book_pending"; heading: string; body: string; contactEmail: string }
  | { kind: "no_pitch"; heading: string; body: string; contactEmail: string };

export type LeadResponse = {
  lead_id: string;
  access_token: string;
  report_url: string;
  report: SystemsReport;
  report_status: string;
  next_action: NextAction;
  delivery: { persisted: boolean; emailed: boolean; pdf: boolean };
};

export type ApiFailure = { ok: false; status: number; code: string; message: string; details?: Record<string, string> };
export type ApiSuccess<T> = { ok: true; data: T };
export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

const request = async <T>(path: string, init: RequestInit): Promise<ApiResult<T>> => {
  try {
    const response = await fetch(path, {
      ...init,
      headers: { "content-type": "application/json", ...(init.headers ?? {}) },
    });

    if (response.status === 204) return { ok: true, data: undefined as T };

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const body = payload as { error?: string; message?: string; details?: Record<string, string> };
      return {
        ok: false,
        status: response.status,
        code: body.error ?? "request_failed",
        message: body.message ?? "Something went wrong. Please try again.",
        details: body.details,
      };
    }

    return { ok: true, data: payload as T };
  } catch {
    return {
      ok: false,
      status: 0,
      code: "network_error",
      message: "I couldn't reach the server. Check your connection and try again.",
    };
  }
};

export type AuditConfig = {
  booking_configured: boolean;
  turnstile_site_key: string;
  contact_email: string;
  site_url: string;
};

export const fetchConfig = () => request<AuditConfig>("/api/audit/config", { method: "GET" });

export const fetchPreview = (answers: Record<string, unknown>) =>
  request<{ count: number; findings: PreviewFinding[] }>("/api/audit/preview", {
    method: "POST",
    body: JSON.stringify(answers),
  });

export type WebsiteContext = {
  requestedUrl: string;
  finalUrl: string;
  title: string;
  description: string;
  siteName: string;
  headings: string[];
  summaryText: string;
  fetchedAt: string;
};

export const lookupWebsite = (sessionId: string, url: string) =>
  request<{ ok: boolean; context?: WebsiteContext }>("/api/audit/website", {
    method: "POST",
    body: JSON.stringify({ session_id: sessionId, url }),
  });

export const submitLead = (payload: {
  session_id: string;
  first_name: string;
  email: string;
  answers: Record<string, unknown>;
  consent: { marketing_consent: boolean; privacy_policy_version: string };
  attribution: Attribution;
  website_context?: WebsiteContext | null;
  turnstile_token?: string;
}) => request<LeadResponse>("/api/audit/lead", { method: "POST", body: JSON.stringify(payload) });

export type StoredReport = {
  lead_id: string;
  report: SystemsReport;
  report_status: string;
  company_name: string;
  first_name: string;
  next_action: NextAction;
  created_at: string;
};

export const fetchStoredReport = (id: string, token: string) =>
  request<StoredReport>(`/api/audit/report?id=${encodeURIComponent(id)}&t=${encodeURIComponent(token)}`, {
    method: "GET",
  });

export const pdfUrl = (id: string, token: string) =>
  `/api/audit/report-pdf?id=${encodeURIComponent(id)}&t=${encodeURIComponent(token)}`;

/* -------------------------------------------------------------------------- */
/* Funnel events                                                              */
/* -------------------------------------------------------------------------- */

export type FunnelEvent =
  | "audit_started"
  | "audit_business_completed"
  | "audit_process_completed"
  | "audit_completed"
  | "email_submitted"
  | "report_generated"
  | "report_viewed"
  | "booking_clicked";

const sent = new Set<string>();

/**
 * Fire-and-forget funnel counts. Only the low-cardinality properties on the
 * server's allow-list are ever accepted, so nothing a prospect typed and no
 * email address can leave through here.
 */
export const track = (
  event: FunnelEvent,
  sessionId: string,
  attribution: Attribution,
  properties: Record<string, string | number | boolean> = {},
  once = true,
) => {
  const key = `${event}:${sessionId}`;
  if (once && sent.has(key)) return;
  sent.add(key);

  const body = JSON.stringify({ session_id: sessionId, event, attribution, properties });

  // sendBeacon survives the page being closed mid-flight; fetch is the fallback.
  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    try {
      navigator.sendBeacon("/api/audit/event", new Blob([body], { type: "application/json" }));
      return;
    } catch {
      /* fall through */
    }
  }

  void fetch("/api/audit/event", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    /* analytics must never surface an error */
  });
};
