import { describe, expect, it } from "vitest";
import {
  analyticsEventSchema,
  assessmentAnswersSchema,
  attributionSchema,
  emailSchema,
  sanitiseText,
  stripEventProperties,
  toFieldErrors,
} from "../src/server/validation";
import { COMMON_TOOLS, QUESTIONS } from "../src/config/assessment";
import { toSubmissionAnswers } from "../src/audit/state";

/** Built from code points so they stay visible in the source. */
const NUL = String.fromCharCode(0x00);
const RLO = String.fromCharCode(0x202e);
const ZWSP = String.fromCharCode(0x200b);

const valid = {
  company_name: "Riverside Plumbing",
  company_website: "riverside.com",
  country: "GB",
  employee_range: "5-19",
  respondent_role: "owner",
  respondent_name: "Sam Hall",
  process_problem: "Every job is written on paper, then copied into the spreadsheet, then typed into the invoice.",
  weekly_frequency: "20-50",
  people_involved: "Office manager",
  current_tools: ["spreadsheets"],
  previous_attempts: "",
  estimated_value: "significant",
  decision_timing: "asap",
  budget_state: "would_find",
};

describe("sanitiseText", () => {
  it("removes control and bidirectional characters", () => {
    // A stripped character leaves a space, not a join: "hello" and "world"
    // must not be silently welded into one token.
    expect(sanitiseText(`hello${NUL}${RLO}world${ZWSP}`)).toBe("hello world");
    expect(sanitiseText(`hello${NUL}${RLO}world${ZWSP}`)).not.toMatch(new RegExp(`[${NUL}${RLO}${ZWSP}]`));
  });

  it("collapses runaway whitespace without destroying paragraphs", () => {
    expect(sanitiseText("a\n\n\n\n\nb")).toBe("a\n\nb");
    expect(sanitiseText("  padded  ")).toBe("padded");
    expect(sanitiseText("too      many spaces")).toBe("too many spaces");
  });
});

describe("assessmentAnswersSchema", () => {
  it("accepts a complete set of answers", () => {
    expect(assessmentAnswersSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an unknown country, team size, role, frequency or value band", () => {
    for (const [field, bad] of [
      ["country", "ZZ"],
      ["employee_range", "5 people"],
      ["respondent_role", "ceo"],
      ["weekly_frequency", "often"],
      ["estimated_value", "lots"],
    ] as const) {
      expect(assessmentAnswersSchema.safeParse({ ...valid, [field]: bad }).success).toBe(false);
    }
  });

  it("rejects a problem description too short to be usable", () => {
    expect(assessmentAnswersSchema.safeParse({ ...valid, process_problem: "It's slow" }).success).toBe(false);
  });

  it("requires at least one tool", () => {
    expect(assessmentAnswersSchema.safeParse({ ...valid, current_tools: [] }).success).toBe(false);
  });

  it("caps the number of tools", () => {
    const tools = Array.from({ length: 30 }, (_, index) => `tool-${index}`);
    expect(assessmentAnswersSchema.safeParse({ ...valid, current_tools: tools }).success).toBe(false);
  });

  it("rejects oversized free text", () => {
    expect(assessmentAnswersSchema.safeParse({ ...valid, process_problem: "x".repeat(5_000) }).success).toBe(false);
  });

  it("treats the website and previous attempts as optional", () => {
    const parsed = assessmentAnswersSchema.safeParse({ ...valid, company_website: undefined, previous_attempts: undefined });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.company_website).toBe("");
      expect(parsed.data.previous_attempts).toBe("");
    }
  });

  it("strips control characters from stored answers", () => {
    const parsed = assessmentAnswersSchema.safeParse({
      ...valid,
      company_name: `Riverside${NUL} Plumbing`,
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.company_name).not.toContain(NUL);
  });

  it("covers exactly the questions the UI asks", () => {
    const schemaKeys = Object.keys(assessmentAnswersSchema.shape).sort();
    const questionIds = QUESTIONS.map((question) => question.id).sort();
    expect(schemaKeys).toEqual(questionIds);
  });
});

describe("emailSchema", () => {
  it.each(["sam@riverside.com", "sam.hall+leads@riverside.co.uk", "a@b.io"])("accepts %s", (value) => {
    expect(emailSchema.safeParse(value).success).toBe(true);
  });

  it.each(["sam", "sam@", "@riverside.com", "sam@riverside", "sam riverside.com", ""])("rejects %s", (value) => {
    expect(emailSchema.safeParse(value).success).toBe(false);
  });

  it("normalises case and whitespace", () => {
    const parsed = emailSchema.safeParse("  SAM@Riverside.COM ");
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data).toBe("sam@riverside.com");
  });
});

describe("attribution", () => {
  it("defaults missing tracking values to empty strings", () => {
    const parsed = attributionSchema.safeParse({});
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data).toMatchObject({ source: "audit", utm_source: "", referrer: "" });
  });

  it("rejects tracking values carrying markup", () => {
    expect(attributionSchema.safeParse({ utm_source: '"><script>alert(1)</script>' }).success).toBe(false);
  });

  it("accepts ordinary campaign values", () => {
    expect(attributionSchema.safeParse({ utm_source: "linkedin", utm_campaign: "spring-2026" }).success).toBe(true);
  });
});

describe("analytics events", () => {
  it("rejects an event name that is not on the funnel list", () => {
    expect(
      analyticsEventSchema.safeParse({ session_id: "3f2504e0-4f89-41d3-9a0c-0305e82c3301", event: "custom_thing" })
        .success,
    ).toBe(false);
  });

  it("drops any property that is not on the allow-list", () => {
    const stripped = stripEventProperties({
      country: "GB",
      fit_status: "qualified",
      email: "sam@riverside.com",
      process_problem: "Everything is copied by hand",
      company_name: "Riverside",
    });

    expect(stripped).toEqual({ country: "GB", fit_status: "qualified" });
    expect(stripped).not.toHaveProperty("email");
    expect(stripped).not.toHaveProperty("process_problem");
  });
});

describe("toFieldErrors", () => {
  it("maps the first message per field for the UI", () => {
    const parsed = assessmentAnswersSchema.safeParse({ ...valid, country: "ZZ", process_problem: "no" });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const errors = toFieldErrors(parsed.error);
      expect(errors.country).toBeTruthy();
      expect(errors.process_problem).toBeTruthy();
    }
  });
});

/**
 * The client builds its payload from the same question list the server
 * validates against. This guards the failure mode where a question is added to
 * the UI, the hand-written client mapping misses it, and every submission is
 * rejected for a field the user actually answered.
 */
describe("client payload matches the server schema", () => {
  const uiAnswers: Record<string, string | string[]> = {
    company_name: "Riverside Plumbing",
    company_website: "riverside.com",
    country: "GB",
    employee_range: "5-19",
    respondent_role: "owner",
    respondent_name: "Sam Hall",
    process_problem: "Every job is written on paper, then copied into the spreadsheet, then typed into the invoice.",
    weekly_frequency: "20-50",
    people_involved: "Office manager",
    current_tools: [COMMON_TOOLS[0].value],
    previous_attempts: "",
    estimated_value: "significant",
    decision_timing: "asap",
    budget_state: "would_find",
  };

  it("produces a key for every question the UI asks", () => {
    const payload = toSubmissionAnswers(uiAnswers);
    expect(Object.keys(payload).sort()).toEqual(QUESTIONS.map((question) => question.id).sort());
  });

  it("produces a payload the server accepts", () => {
    const parsed = assessmentAnswersSchema.safeParse(toSubmissionAnswers(uiAnswers));
    expect(parsed.success, parsed.success ? "" : JSON.stringify(parsed.error.issues)).toBe(true);
  });

  it("keeps multi-select answers as arrays and everything else as trimmed strings", () => {
    const payload = toSubmissionAnswers({ ...uiAnswers, company_name: "  Padded  " });
    expect(payload.company_name).toBe("Padded");
    expect(Array.isArray(payload.current_tools)).toBe(true);
  });
});
