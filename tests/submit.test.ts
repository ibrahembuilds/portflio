import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryLeadStore } from "../src/server/store/memory";
import { buildNextAction, submitLead } from "../src/server/submitLead";
import type { EmailMessage, EmailProvider, SendResult } from "../src/server/email/provider";
import type { LeadRecord, LeadStore, NewLead } from "../src/server/store/types";
import type { LeadSubmission } from "../src/server/validation";
import { leadSubmissionSchema } from "../src/server/validation";

/* Fixtures ----------------------------------------------------------------- */

const rawSubmission = {
  session_id: "3f2504e0-4f89-41d3-9a0c-0305e82c3301",
  first_name: "Sam",
  email: "Sam@Riverside.com",
  answers: {
    company_name: "Riverside Plumbing",
    company_website: "riverside.com",
    country: "GB",
    employee_range: "5-19",
    respondent_role: "owner",
    respondent_name: "Sam Hall",
    process_problem:
      "Every job is written on a paper sheet, copied into a spreadsheet, then typed again into the invoice.",
    weekly_frequency: "20-50",
    people_involved: "Office manager",
    current_tools: ["spreadsheets", "email"],
    previous_attempts: "",
    estimated_value: "significant",
    decision_timing: "asap",
    budget_state: "would_find",
  },
  consent: { marketing_consent: false, privacy_policy_version: "2026-09-15" },
  attribution: { source: "audit", utm_source: "linkedin", utm_medium: "", utm_campaign: "", referrer: "" },
};

const parse = (overrides: Record<string, unknown> = {}): LeadSubmission => {
  const result = leadSubmissionSchema.safeParse({ ...rawSubmission, ...overrides });
  if (!result.success) throw new Error(`fixture invalid: ${result.error.message}`);
  return result.data;
};

class RecordingEmail implements EmailProvider {
  readonly name = "recording";
  sent: EmailMessage[] = [];

  constructor(
    readonly available = true,
    private readonly result: SendResult = { ok: true, id: "e_1" },
  ) {}

  async send(message: EmailMessage): Promise<SendResult> {
    this.sent.push(message);
    return this.result;
  }
}

/** A store whose writes always fail, to prove a lead is never silently lost. */
class BrokenStore implements LeadStore {
  readonly kind = "broken";
  readonly durable = true;

  async createLead(_lead: NewLead): Promise<LeadRecord> {
    throw new Error("connection refused");
  }
  async updateLead(): Promise<LeadRecord | null> {
    throw new Error("connection refused");
  }
  async getLead(): Promise<LeadRecord | null> {
    return null;
  }
  async getLeadByToken(): Promise<LeadRecord | null> {
    return null;
  }
  async listLeads(): Promise<LeadRecord[]> {
    return [];
  }
  async recordEvent(): Promise<void> {
    /* no-op */
  }
  async hitRateLimit(): Promise<number> {
    return 1;
  }
}

beforeEach(() => {
  process.env.SYSTEMS_TEARDOWN_BOOKING_URL = "";
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  delete process.env.SYSTEMS_TEARDOWN_BOOKING_URL;
  vi.restoreAllMocks();
});

/* -------------------------------------------------------------------------- */

describe("lead persistence", () => {
  it("stores the whole enquiry, with the answers and the fit status", async () => {
    const store = new MemoryLeadStore();
    const email = new RecordingEmail();

    const outcome = await submitLead(parse(), null, { store, email, renderPdf: false });
    const lead = await store.getLead(outcome.leadId);

    expect(lead).not.toBeNull();
    expect(lead?.company).toBe("Riverside Plumbing");
    expect(lead?.email).toBe("sam@riverside.com"); // normalised by validation
    expect(lead?.country).toBe("GB");
    expect(lead?.current_tools).toEqual(["spreadsheets", "email"]);
    expect(lead?.fit_status).toBe("qualified");
    expect(lead?.utm_source).toBe("linkedin");
    expect(lead?.assessment_answers_json.process_problem).toContain("paper sheet");
  });

  it("stores the generated report and its status against the lead", async () => {
    const store = new MemoryLeadStore();
    const outcome = await submitLead(parse(), null, { store, email: new RecordingEmail(), renderPdf: false });
    const lead = await store.getLead(outcome.leadId);

    expect(lead?.report_json).not.toBeNull();
    expect(lead?.report_status).toBe("fallback_no_provider");
    expect(lead?.email_status).toBe("sent");
  });

  it("only returns a report to someone holding the access token", async () => {
    const store = new MemoryLeadStore();
    const outcome = await submitLead(parse(), null, { store, email: new RecordingEmail(), renderPdf: false });

    expect(await store.getLeadByToken(outcome.leadId, outcome.accessToken)).not.toBeNull();
    expect(await store.getLeadByToken(outcome.leadId, "guessed-token")).toBeNull();
  });
});

describe("marketing consent", () => {
  it("does not opt someone in just because they asked for the report", async () => {
    const store = new MemoryLeadStore();
    const outcome = await submitLead(parse(), null, { store, email: new RecordingEmail(), renderPdf: false });
    const lead = await store.getLead(outcome.leadId);

    expect(lead?.marketing_consent).toBe(false);
    expect(lead?.marketing_consent_timestamp).toBeNull();
  });

  it("records the time and the policy version when consent is given", async () => {
    const store = new MemoryLeadStore();
    const submission = parse({ consent: { marketing_consent: true, privacy_policy_version: "2026-09-15" } });

    const outcome = await submitLead(submission, null, { store, email: new RecordingEmail(), renderPdf: false });
    const lead = await store.getLead(outcome.leadId);

    expect(lead?.marketing_consent).toBe(true);
    expect(lead?.privacy_policy_version).toBe("2026-09-15");
    expect(Number.isNaN(Date.parse(lead?.marketing_consent_timestamp ?? ""))).toBe(false);
  });

  it("treats a missing consent value as no", () => {
    const parsed = leadSubmissionSchema.safeParse({
      ...rawSubmission,
      consent: { privacy_policy_version: "2026-09-15" },
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.consent.marketing_consent).toBe(false);
  });

  it("keeps report delivery and marketing status as separate fields", async () => {
    const store = new MemoryLeadStore();
    const outcome = await submitLead(parse(), null, { store, email: new RecordingEmail(), renderPdf: false });
    const lead = await store.getLead(outcome.leadId);

    expect(lead?.email_status).toBe("sent");
    expect(lead?.marketing_consent).toBe(false);
  });
});

describe("graceful failure", () => {
  it("still returns a usable report when email delivery fails", async () => {
    const store = new MemoryLeadStore();
    const email = new RecordingEmail(true, { ok: false, reason: "http-500" });

    const outcome = await submitLead(parse(), null, { store, email, renderPdf: false });

    expect(outcome.report.findings.length).toBeGreaterThan(0);
    expect(outcome.delivery.emailed).toBe(false);
    expect((await store.getLead(outcome.leadId))?.email_status).toBe("failed");
  });

  it("records email as not configured when no provider exists", async () => {
    const store = new MemoryLeadStore();
    const outcome = await submitLead(parse(), null, { store, email: new RecordingEmail(false), renderPdf: false });
    expect((await store.getLead(outcome.leadId))?.email_status).toBe("not_configured");
  });

  it("does not lose the lead when the database write fails", async () => {
    const email = new RecordingEmail();
    const outcome = await submitLead(parse(), null, { store: new BrokenStore(), email, renderPdf: false });

    // The prospect still gets their report...
    expect(outcome.report.executive_summary.length).toBeGreaterThan(0);
    expect(outcome.delivery.persisted).toBe(false);

    // ...and the enquiry still reaches a human, flagged as unsaved.
    const notification = email.sent.find((message) => message.subject.includes("Teardown lead"));
    expect(notification).toBeDefined();
    expect(notification?.text).toContain("NOT SAVED TO THE DATABASE");
    expect(notification?.text).toContain("Riverside Plumbing");
    expect(notification?.replyTo).toBe("sam@riverside.com");
  });

  it("logs the whole enquiry when both the database and email fail", async () => {
    const errorSpy = vi.spyOn(console, "error");
    await submitLead(parse(), null, {
      store: new BrokenStore(),
      email: new RecordingEmail(true, { ok: false, reason: "http-500" }),
      renderPdf: false,
    });

    const logged = errorSpy.mock.calls.flat().join("\n");
    expect(logged).toContain("LEAD NOT PERSISTED AND NOT EMAILED");
    expect(logged).toContain("sam@riverside.com");
  });

  it("marks the lead as not durable when only the in-memory store is available", async () => {
    const outcome = await submitLead(parse(), null, {
      store: new MemoryLeadStore(),
      email: new RecordingEmail(),
      renderPdf: false,
    });
    expect(outcome.delivery.persisted).toBe(false);
  });
});

describe("report email", () => {
  it("names the company in the subject and links the report", async () => {
    const email = new RecordingEmail();
    const outcome = await submitLead(parse(), null, {
      store: new MemoryLeadStore(),
      email,
      renderPdf: false,
    });

    const report = email.sent.find((message) => message.subject.startsWith("Your Systems Report"));
    expect(report?.subject).toBe("Your Systems Report — Riverside Plumbing");
    expect(report?.to).toBe("sam@riverside.com");
    expect(report?.text).toContain(outcome.reportUrl);
  });

  it("flags a qualified, ready lead as hot so it can be triaged from the inbox", async () => {
    const email = new RecordingEmail();
    await submitLead(parse(), null, { store: new MemoryLeadStore(), email, renderPdf: false });

    const notification = email.sent.find((message) => message.subject.includes("Teardown lead"));
    expect(notification?.subject).toContain("[HOT]");
    expect(notification?.text).toContain("Fit: qualified · Readiness: ready");
  });

  it("flags a qualified but unfunded lead as qualified, not hot", async () => {
    const email = new RecordingEmail();
    const submission = parse({
      answers: { ...rawSubmission.answers, decision_timing: "3-6-months", budget_state: "needs_number" },
    });

    await submitLead(submission, null, { store: new MemoryLeadStore(), email, renderPdf: false });

    const notification = email.sent.find((message) => message.subject.includes("Teardown lead"));
    expect(notification?.subject).toContain("[QUALIFIED]");
    expect(notification?.subject).not.toContain("[HOT]");
    expect(notification?.text).toContain("Readiness: exploring");
  });

  it("records the timing and budget answers for follow-up", async () => {
    const email = new RecordingEmail();
    await submitLead(parse(), null, { store: new MemoryLeadStore(), email, renderPdf: false });

    const notification = email.sent.find((message) => message.subject.includes("Teardown lead"));
    expect(notification?.text).toContain("Timing: As soon as I can");
    expect(notification?.text).toContain("Budget: Not set aside, but I'd find it for the right fix");
  });
});

describe("next action", () => {
  it("offers the booking link when one is configured", () => {
    process.env.SYSTEMS_TEARDOWN_BOOKING_URL = "https://cal.example.com/teardown";
    const action = buildNextAction("qualified");
    expect(action.kind).toBe("book");
    if (action.kind === "book") expect(action.url).toBe("https://cal.example.com/teardown");
  });

  it("never invents a booking URL when none is configured", () => {
    process.env.SYSTEMS_TEARDOWN_BOOKING_URL = "";
    const action = buildNextAction("qualified");
    expect(action.kind).toBe("book_pending");
    if (action.kind === "book_pending") expect(action.contactEmail).toBe("hello@ibrahemahmed.com");
  });

  it("softens the ask for a potential lead", () => {
    process.env.SYSTEMS_TEARDOWN_BOOKING_URL = "https://cal.example.com/teardown";
    const action = buildNextAction("potential");
    expect(action.kind).toBe("book");
    if (action.kind === "book") expect(action.label).toBe("Book a 20-minute call");
  });

  it("does not claim to be a good fit when the lead is not one", () => {
    process.env.SYSTEMS_TEARDOWN_BOOKING_URL = "https://cal.example.com/teardown";
    const action = buildNextAction("not_current_fit");
    expect(action.kind).toBe("no_pitch");
    expect(action.body).toContain("probably not the right person");
    expect(JSON.stringify(action)).not.toContain("cal.example.com");
  });
});
