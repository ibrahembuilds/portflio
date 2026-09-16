import { z } from "zod";
import {
  ALL_COUNTRY_VALUES,
  BUDGET_STATE,
  DECISION_TIMING,
  EMPLOYEE_RANGES,
  ROLES,
  VALUE_BANDS,
  WEEKLY_FREQUENCY,
} from "../config/assessment";

/**
 * Server-side validation. The client validates too, for a better experience,
 * but nothing reaches storage or a model without passing through here first.
 */

const values = (options: { value: string }[]) => options.map((option) => option.value);

/** Strips control characters and collapses runaway whitespace on every free-text
 *  field, so stored answers and model prompts stay clean. */
// Matching control characters is the whole point here: this pattern removes them.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = new RegExp("[\\u0000-\\u0008\\u000b\\u000c\\u000e-\\u001f\\u007f-\\u009f\\u200b-\\u200f\\u2028\\u2029\\u202a-\\u202e\\ufeff]", "g");

export const sanitiseText = (value: string): string =>
  value
    .replace(CONTROL_CHARS, " ")
    // Stripped characters leave a gap behind; a space is safer than deleting,
    // because deleting can silently join two separate words together.
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const text = (max: number, min = 0) =>
  z
    .string()
    .max(max, `Please keep this under ${max} characters.`)
    .transform(sanitiseText)
    .refine((value) => value.length >= min, { message: min > 0 ? `Please write at least ${min} characters.` : undefined });

const enumOf = (options: { value: string }[], message: string) =>
  z.string().refine((value) => values(options).includes(value), { message });

export const assessmentAnswersSchema = z.object({
  company_name: text(120, 2),
  company_website: z.string().max(300).transform(sanitiseText).optional().default(""),
  country: z.string().refine((value) => ALL_COUNTRY_VALUES.includes(value), { message: "Please choose a country." }),
  employee_range: enumOf(EMPLOYEE_RANGES, "Please choose a team size."),
  respondent_role: enumOf(ROLES, "Please choose your role."),
  respondent_name: text(120, 2),
  process_problem: text(2_000, 25),
  weekly_frequency: enumOf(WEEKLY_FREQUENCY, "Please choose how often this happens."),
  people_involved: text(300, 2),
  current_tools: z
    .array(z.string().max(80).transform(sanitiseText))
    .min(1, "Please pick at least one.")
    .max(12)
    .transform((tools) => tools.filter((tool) => tool.length > 0)),
  previous_attempts: text(1_200).optional().default(""),
  estimated_value: enumOf(VALUE_BANDS, "Please choose an answer."),
  decision_timing: enumOf(DECISION_TIMING, "Please choose a timeframe."),
  budget_state: enumOf(BUDGET_STATE, "Please choose an answer."),
});

export type AssessmentAnswers = z.infer<typeof assessmentAnswersSchema>;

/**
 * Marketing consent is a separate field from the report request, and defaults
 * to false. A missing value is never treated as agreement.
 */
export const consentSchema = z.object({
  marketing_consent: z.boolean().default(false),
  privacy_policy_version: z.string().min(1).max(40),
});

const UTM_PATTERN = /^[\w .:/+%-]{0,120}$/;
const utmField = z
  .string()
  .max(120)
  .transform(sanitiseText)
  .refine((value) => UTM_PATTERN.test(value), { message: "Invalid tracking value." })
  .optional()
  .default("");

export const attributionSchema = z.object({
  source: z.string().max(60).transform(sanitiseText).optional().default("audit"),
  utm_source: utmField,
  utm_medium: utmField,
  utm_campaign: utmField,
  referrer: z.string().max(500).transform(sanitiseText).optional().default(""),
});

export type Attribution = z.infer<typeof attributionSchema>;

/**
 * Email. Deliberately permissive about the domain: plenty of five-person trades
 * businesses run entirely on a Gmail address, and rejecting them would cost
 * real leads for no benefit.
 */
export const emailSchema = z
  .string()
  .min(5)
  .max(254)
  .transform((value) => value.trim().toLowerCase())
  .refine((value) => /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value), { message: "Please enter a valid email address." });

export const leadSubmissionSchema = z.object({
  session_id: z.string().uuid("Missing session."),
  first_name: text(80, 1),
  email: emailSchema,
  answers: assessmentAnswersSchema,
  consent: consentSchema,
  attribution: attributionSchema,
  website_context: z.unknown().optional(),
  turnstile_token: z.string().max(4_000).optional().default(""),
});

export type LeadSubmission = z.infer<typeof leadSubmissionSchema>;

export const websiteLookupSchema = z.object({
  session_id: z.string().uuid(),
  url: z.string().min(3).max(300),
});

export const analyticsEventSchema = z.object({
  session_id: z.string().uuid(),
  event: z.enum([
    "audit_started",
    "audit_business_completed",
    "audit_process_completed",
    "audit_completed",
    "email_submitted",
    "report_generated",
    "report_viewed",
    "booking_clicked",
  ]),
  attribution: attributionSchema.optional(),
  /** Low-cardinality, non-identifying properties only. Enforced below. */
  properties: z.record(z.union([z.string().max(60), z.number(), z.boolean()])).optional().default({}),
});

export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;

/**
 * Analytics must never carry the operational problem text or the email address.
 * This strips anything that is not on the allow-list rather than trusting the
 * caller to have been careful.
 */
const ALLOWED_EVENT_PROPERTIES = new Set([
  "question_index",
  "question_id",
  "employee_range",
  "country",
  "role",
  "weekly_frequency",
  "decision_timing",
  "budget_state",
  "fit_status",
  "readiness",
  "report_status",
  "has_website",
  "duration_ms",
  "step_count",
]);

export const stripEventProperties = (
  properties: Record<string, string | number | boolean>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(Object.entries(properties).filter(([key]) => ALLOWED_EVENT_PROPERTIES.has(key)));

export type FieldErrors = Record<string, string>;

/** Flattens a zod error into { field: firstMessage } for the UI. */
export const toFieldErrors = (error: z.ZodError): FieldErrors => {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
};
