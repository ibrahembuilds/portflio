import { z } from "zod";

/**
 * The Systems Report contract. The model is required to return exactly this
 * shape; anything else is rejected and retried, then replaced by a
 * deterministic report built from the prospect's own answers.
 *
 * The client imports SystemsReport with `import type`, so zod never reaches
 * the browser bundle while the type stays the single definition.
 */

const short = (max: number) => z.string().trim().min(1).max(max);

export const findingSchema = z.object({
  title: short(120),
  /** What in the prospect's own answers this is based on. */
  evidence: short(600),
  business_effect: short(600),
  priority: z.enum(["critical", "important", "later"]),
});

export const systemsReportSchema = z.object({
  executive_summary: z.string().trim().min(40).max(1_200),
  business_context: z.object({
    business: short(200),
    process_reviewed: short(600),
    frequency: short(160),
    people_involved: short(300),
    current_tools: z.array(short(80)).max(15),
  }),
  findings: z.array(findingSchema).min(2).max(6),
  recommended_first_fix: z.object({
    title: short(140),
    reason: short(800),
    operational_change: short(800),
    example_flow: z.array(short(120)).min(3).max(7),
  }),
  likely_delivery_path: z.enum(["systems_teardown", "automation_sprint", "core_system_build", "unclear"]),
  questions_for_call: z.array(short(220)).min(2).max(6),
  assumptions: z.array(short(260)).max(6),
  next_step: short(600),
});

export type SystemsReport = z.infer<typeof systemsReportSchema>;
export type Finding = z.infer<typeof findingSchema>;
export type ReportPriority = Finding["priority"];

export const PRIORITY_ORDER: Record<ReportPriority, number> = { critical: 0, important: 1, later: 2 };

export const PRIORITY_LABEL: Record<ReportPriority, string> = {
  critical: "Fix first",
  important: "Worth fixing",
  later: "Can wait",
};

/**
 * Numbers a report is allowed to state must have come from the prospect. This
 * catches a model inventing "saves 12 hours a week" or "30% of leads" — the
 * single most damaging thing it could do to a first impression.
 */
const NUMERIC_CLAIM_PATTERNS = [
  /[$£€¥]\s?\d[\d,.]*/g,
  /\b\d[\d,.]*\s?%/g,
  /\b\d[\d,.]*\s?(?:hours?|hrs?|minutes?|mins?|days?|weeks?|months?)\b/gi,
  /\b\d[\d,.]*\s?(?:k|m)\b(?!\w)/gi,
  /\b(?:usd|gbp|eur|aud|cad|sar|aed)\s?\d[\d,.]*/gi,
];

const collectStrings = (value: unknown, out: string[] = []): string[] => {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => collectStrings(item, out));
  return out;
};

const digitsOf = (value: string): string => value.replace(/[^\d]/g, "");

/**
 * Returns the numeric claims in `report` that do not appear anywhere in
 * `sourceText` (the prospect's own answers). Empty array means the report
 * states no number the prospect did not supply.
 */
export const findUnsupportedNumbers = (report: unknown, sourceText: string): string[] => {
  const sourceDigits = new Set<string>();
  for (const pattern of NUMERIC_CLAIM_PATTERNS) {
    for (const match of sourceText.matchAll(pattern)) sourceDigits.add(digitsOf(match[0]));
  }
  // Bare numbers in the source count too: "we do this 40 times a week".
  for (const match of sourceText.matchAll(/\d[\d,.]*/g)) sourceDigits.add(digitsOf(match[0]));

  const unsupported: string[] = [];
  for (const text of collectStrings(report)) {
    for (const pattern of NUMERIC_CLAIM_PATTERNS) {
      for (const match of text.matchAll(pattern)) {
        const digits = digitsOf(match[0]);
        if (digits && !sourceDigits.has(digits)) unsupported.push(match[0].trim());
      }
    }
  }
  return [...new Set(unsupported)];
};

/** Phrases the report must never contain, whatever the model was asked. */
const BANNED_PHRASES = [
  /\bguarantee[sd]?\b/i,
  /\bwe\s+(?:will|can|guarantee)\b/i,
  /\broi\b/i,
  /\breturn on investment\b/i,
  /\bwithin \d+ (?:days?|weeks?)\b/i,
];

export const findBannedPhrases = (report: unknown): string[] => {
  const found: string[] = [];
  for (const text of collectStrings(report)) {
    for (const pattern of BANNED_PHRASES) {
      const match = pattern.exec(text);
      if (match) found.push(match[0]);
    }
  }
  return [...new Set(found)];
};

export const NOT_ENOUGH_INFORMATION = "Not enough information to estimate.";
