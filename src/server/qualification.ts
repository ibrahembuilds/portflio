import type { AssessmentAnswers } from "./validation";

/**
 * Internal fit assessment. This is never shown to a prospect as a score, a
 * grade or a percentage — it only decides which next action the report offers
 * and how a lead is flagged for follow-up.
 */

export type FitStatus = "qualified" | "potential" | "not_current_fit";

export type FitCriteria = {
  employeeRange: boolean;
  geography: boolean;
  role: boolean;
  specificProblem: boolean;
};

export type FitAssessment = {
  status: FitStatus;
  criteria: FitCriteria;
  metCount: number;
};

/** Criterion 1: 5–50 employees. */
const TARGET_EMPLOYEE_RANGES = new Set(["5-19", "20-50"]);

/**
 * Criterion 2: geography.
 *
 * The brief states the qualification geography as US / UK / Australia / Canada
 * / EU, and separately lists the Gulf among the primary buyer markets. Both are
 * treated as in-market here. Removing the Gulf is a one-line change to this set.
 */
const EU_MEMBER_STATES = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
];

const GULF_STATES = ["SA", "AE", "QA", "KW", "BH", "OM"];

export const TARGET_COUNTRIES = new Set(["US", "GB", "AU", "CA", ...EU_MEMBER_STATES, ...GULF_STATES]);

/** Criterion 3: the respondent can make the decision. */
const DECISION_MAKER_ROLES = new Set(["owner", "founder", "operations", "general_manager"]);

const MIN_PROBLEM_CHARACTERS = 40;
const MIN_PROBLEM_WORDS = 8;

/**
 * Criterion 4: a specific manual-process or lost-lead problem was described.
 *
 * This is a substance check, not a sentiment check. "Everything is a mess" is a
 * real feeling but nothing can be mapped from it, so it does not count.
 */
export const describesSpecificProblem = (value: string): boolean => {
  const text = value.trim();
  if (text.length < MIN_PROBLEM_CHARACTERS) return false;

  const words = text.split(/\s+/).filter((word) => /[a-z0-9؀-ۿ]/i.test(word));
  if (words.length < MIN_PROBLEM_WORDS) return false;

  // Reject padding: the same token repeated, or one character held down.
  const distinct = new Set(words.map((word) => word.toLowerCase()));
  if (distinct.size < Math.max(4, Math.ceil(words.length * 0.4))) return false;
  if (/(.)\1{9,}/.test(text)) return false;

  return true;
};

export const assessFit = (answers: AssessmentAnswers): FitAssessment => {
  const criteria: FitCriteria = {
    employeeRange: TARGET_EMPLOYEE_RANGES.has(answers.employee_range),
    geography: TARGET_COUNTRIES.has(answers.country),
    role: DECISION_MAKER_ROLES.has(answers.respondent_role),
    specificProblem: describesSpecificProblem(answers.process_problem),
  };

  const metCount = Object.values(criteria).filter(Boolean).length;

  // All four criteria met is a qualified lead. Three is worth a conversation.
  // Two or fewer is not a current fit, which is said plainly rather than dressed
  // up as a lower score.
  const status: FitStatus = metCount === 4 ? "qualified" : metCount === 3 ? "potential" : "not_current_fit";

  return { status, criteria, metCount };
};
