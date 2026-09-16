import {
  COMMON_TOOLS,
  optionLabel,
  VALUE_BANDS,
  WEEKLY_FREQUENCY,
  countryLabel,
  EMPLOYEE_RANGES,
} from "../../config/assessment";
import type { AssessmentAnswers } from "../validation";
import type { SystemsReport, ReportPriority } from "./schema";
import { NOT_ENOUGH_INFORMATION } from "./schema";

/**
 * Deterministic analysis of the prospect's own answers.
 *
 * Two jobs:
 *   1. The free preview shown before the email gate. No model call is made
 *      before an email is given, which keeps anonymous visitors from running up
 *      model cost.
 *   2. The fallback report when the model is unavailable or its output fails
 *      validation. A lead never sees an error page because a provider is down.
 *
 * Everything below is derived only from what the prospect entered. No number,
 * cost, hour or percentage is introduced here that they did not supply.
 */

export type Signal = {
  id: string;
  title: string;
  evidence: string;
  business_effect: string;
  priority: ReportPriority;
};

const HIGH_FREQUENCY = new Set(["20-50", "50-plus"]);
const MODERATE_FREQUENCY = new Set(["5-20"]);
const HIGH_VALUE = new Set(["significant", "critical"]);

const MANUAL_TOOLS = new Set(["spreadsheets", "email", "whatsapp", "paper"]);

const LEAD_WORDS = /\b(lead|leads|enquir|inquir|quote|quotes|quoting|call|calls|customer|client|booking|missed)\b/i;
const COPY_WORDS = /\b(copy|copied|copying|re-?type|retyp|paste|duplicate|twice|again|manually|by hand|transfer)\b/i;
const VISIBILITY_WORDS = /\b(track|tracking|visib|status|overview|dashboard|see what|know what|find out|report)\b/i;
const ONBOARDING_WORDS = /\b(onboard|welcome|intake|sign-?up|paperwork|contract|form|document|pdf)\b/i;
const SINGLE_PERSON = /\b(only|just|one person|me|myself|i do|single|sole)\b/i;

export const toolLabels = (tools: string[]): string[] =>
  tools.map((tool) => optionLabel(COMMON_TOOLS, tool)).filter(Boolean);

const listPhrase = (items: string[]): string => {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
};

/** Trims the prospect's own words down to a quotable fragment. */
const quote = (value: string, max = 180): string => {
  const text = value.replace(/\s+/g, " ").trim();
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
};

export const detectSignals = (answers: AssessmentAnswers): Signal[] => {
  const signals: Signal[] = [];
  const problem = answers.process_problem;
  const labels = toolLabels(answers.current_tools);
  const manualCount = answers.current_tools.filter((tool) => MANUAL_TOOLS.has(tool)).length;
  const highValue = HIGH_VALUE.has(answers.estimated_value);
  const frequencyLabel = optionLabel(WEEKLY_FREQUENCY, answers.weekly_frequency).toLowerCase();

  if (HIGH_FREQUENCY.has(answers.weekly_frequency)) {
    signals.push({
      id: "repetition",
      title: "A manual step is repeating at volume",
      evidence: `You said this happens ${frequencyLabel}.`,
      business_effect:
        "At that rate the cost is not the single instance, it is the accumulation. Work repeated this often is usually the first thing worth removing, because the saving repeats too.",
      priority: "critical",
    });
  } else if (MODERATE_FREQUENCY.has(answers.weekly_frequency)) {
    signals.push({
      id: "repetition",
      title: "A manual step repeats every week",
      evidence: `You said this happens ${frequencyLabel}.`,
      business_effect:
        "Repeating weekly is enough for the work to be worth removing, and enough for a mistake to eventually get through.",
      priority: "important",
    });
  }

  if (answers.current_tools.length >= 3) {
    signals.push({
      id: "fragmentation",
      title: "The same information lives in more than one place",
      evidence: `You told me this work happens across ${listPhrase(labels)}.`,
      business_effect:
        "Every extra place the same information is held is another place it can disagree with the others. It also means nobody can answer a question without checking several of them.",
      priority: highValue ? "critical" : "important",
    });
  }

  if (COPY_WORDS.test(problem)) {
    signals.push({
      id: "re-entry",
      title: "Information is being entered more than once",
      evidence: `In your own words: “${quote(problem)}”`,
      business_effect:
        "Re-entry costs time on every job and it is where details get dropped. It is also the kind of work that is usually straightforward to stop.",
      priority: "critical",
    });
  }

  if (LEAD_WORDS.test(problem)) {
    signals.push({
      id: "lead-handling",
      title: "Work arriving from customers depends on someone picking it up",
      evidence: `You described a problem involving customer-facing work: “${quote(problem, 140)}”`,
      business_effect:
        "When incoming work depends on a person noticing it, response time varies with how busy that person is. That variation is invisible until something is missed.",
      priority: "important",
    });
  }

  if (VISIBILITY_WORDS.test(problem)) {
    signals.push({
      id: "visibility",
      title: "There is no single place to see the current state",
      evidence: `Your description points at knowing where things stand: “${quote(problem, 140)}”`,
      business_effect:
        "Without one view, checking status means asking someone. That interrupts them, and it means you are always looking at a slightly out-of-date picture.",
      priority: "important",
    });
  }

  if (ONBOARDING_WORDS.test(problem)) {
    signals.push({
      id: "onboarding",
      title: "A customer-facing process is spread across documents and messages",
      evidence: `You mentioned documents or forms as part of this process: “${quote(problem, 140)}”`,
      business_effect:
        "When a customer has to be walked through a process by email, the pace is set by whoever replies slowest, and nothing can be checked at a glance.",
      priority: "important",
    });
  }

  if (SINGLE_PERSON.test(answers.people_involved)) {
    signals.push({
      id: "key-person",
      title: "The process depends on one person",
      evidence: `You said this is handled by: “${quote(answers.people_involved, 120)}”`,
      business_effect:
        "A process that lives with one person works until they are away. It also makes hiring harder, because the process has to be taught rather than followed.",
      priority: highValue ? "critical" : "important",
    });
  }

  if (manualCount >= 2) {
    signals.push({
      id: "manual-capture",
      title: "Work is being captured in tools that were not built to hold it",
      evidence: `You listed ${listPhrase(toolLabels(answers.current_tools.filter((tool) => MANUAL_TOOLS.has(tool))))} as part of this process.`,
      business_effect:
        "These are fine for communication and bad for state. Nothing enforces that a step happened, so the only check is someone remembering.",
      priority: "important",
    });
  }

  if (answers.previous_attempts.trim().length > 12) {
    signals.push({
      id: "previous-attempt",
      title: "A previous attempt to fix this did not stick",
      evidence: `You told me: “${quote(answers.previous_attempts, 160)}”`,
      business_effect:
        "That is worth understanding before anything is built. A fix that the team works around is more expensive than the original problem.",
      priority: "later",
    });
  }

  return signals;
};

const PRIORITY_RANK: Record<ReportPriority, number> = { critical: 0, important: 1, later: 2 };

export const rankSignals = (signals: Signal[]): Signal[] =>
  [...signals].sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);

/**
 * The preview shown before the email gate. Short, honest, and enough to make
 * the full report worth an email address.
 */
export type PreviewFinding = { title: string; body: string; priority: ReportPriority };

export const buildPreview = (answers: AssessmentAnswers): PreviewFinding[] =>
  rankSignals(detectSignals(answers))
    .slice(0, 3)
    .map((signal) => ({ title: signal.title, body: signal.evidence, priority: signal.priority }));

export const likelyDeliveryPath = (answers: AssessmentAnswers): SystemsReport["likely_delivery_path"] => {
  const problem = answers.process_problem;
  const manyTools = answers.current_tools.length >= 3;
  const frequent = HIGH_FREQUENCY.has(answers.weekly_frequency) || MODERATE_FREQUENCY.has(answers.weekly_frequency);
  const copying = COPY_WORDS.test(problem);
  const needsOnePlace = VISIBILITY_WORDS.test(problem) || ONBOARDING_WORDS.test(problem);

  if (copying && manyTools && frequent && !needsOnePlace) return "automation_sprint";
  if (needsOnePlace) return "core_system_build";
  if (copying && frequent) return "automation_sprint";
  if (answers.weekly_frequency === "unsure" && !copying && !needsOnePlace) return "unclear";
  return "systems_teardown";
};

const DEFAULT_QUESTIONS = [
  "Walk me through one real example from last week, start to finish.",
  "What happens today when this step is skipped or done wrong?",
  "Who else needs to see this information, and when?",
];

/**
 * A complete, valid report built only from the prospect's answers. Used when
 * the model is unavailable or returns something that fails validation.
 */
export const buildFallbackReport = (answers: AssessmentAnswers): SystemsReport => {
  const ranked = rankSignals(detectSignals(answers));
  const labels = toolLabels(answers.current_tools);
  const frequencyLabel = optionLabel(WEEKLY_FREQUENCY, answers.weekly_frequency);
  const sizeLabel = optionLabel(EMPLOYEE_RANGES, answers.employee_range);
  const valueLabel = optionLabel(VALUE_BANDS, answers.estimated_value);

  const findings = ranked.slice(0, 5).map((signal) => ({
    title: signal.title,
    evidence: signal.evidence,
    business_effect: signal.business_effect,
    priority: signal.priority,
  }));

  // The schema requires at least two findings. If the answers were thin, say so
  // plainly rather than padding with invented detail.
  while (findings.length < 2) {
    findings.push({
      title: "There is not enough detail yet to be specific",
      evidence: `Based on the information you entered, this is what I have: “${quote(answers.process_problem, 200)}”`,
      business_effect: `${NOT_ENOUGH_INFORMATION} Walking through one real example on a call would change that quickly.`,
      priority: "later" as ReportPriority,
    });
  }

  const primary = ranked[0];

  return {
    executive_summary: `Based on the information you entered, ${answers.company_name} described one process that runs ${frequencyLabel.toLowerCase()} and currently lives across ${labels.length > 0 ? listPhrase(labels) : "the tools you named"}. This is a preliminary view built from your answers alone — it has not been checked against how the work actually runs day to day. The purpose is to show what looks worth examining first, not to give you a final answer.`,
    business_context: {
      business: `${answers.company_name} — ${sizeLabel}, ${countryLabel(answers.country)}`,
      process_reviewed: quote(answers.process_problem, 560),
      frequency: frequencyLabel,
      people_involved: quote(answers.people_involved, 280),
      current_tools: labels.slice(0, 15),
    },
    findings,
    recommended_first_fix: {
      title: primary ? primary.title.replace(/^A |^The /, "") : "Map the process properly before changing anything",
      reason: primary
        ? `${primary.business_effect} You also said the impact on the business is: “${valueLabel}”.`
        : `${NOT_ENOUGH_INFORMATION} The first useful step is walking through one real example together.`,
      operational_change:
        "The aim is that the information is entered once, in one place, and everything downstream reads from it instead of being re-typed. Nothing about what your team does changes; where they do it does.",
      example_flow: [
        "Work arrives and is captured once, in one record",
        "The record carries everything the next step needs",
        "The next step is prompted rather than remembered",
        "Status is visible without asking anyone",
      ],
    },
    likely_delivery_path: likelyDeliveryPath(answers),
    questions_for_call: DEFAULT_QUESTIONS,
    assumptions: [
      "This is built only from the answers you gave, not from seeing the work happen.",
      "Nothing here has been checked against your actual data, volumes or costs.",
    ],
    next_step:
      "The next step is a 20-minute Systems Teardown call, where we walk through one real example end to end. After that you get a written map and a fixed quote for the highest-priority fix.",
  };
};
