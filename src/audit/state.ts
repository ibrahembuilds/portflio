import { QUESTIONS } from "../config/assessment";

/**
 * Assessment state, autosave and attribution.
 *
 * Progress is kept in the visitor's own browser until they ask for the report.
 * Nothing reaches the server before that, which is both the honest thing to do
 * and what makes a refresh safe to recover from.
 */

export type Answers = Record<string, string | string[]>;

export type Stage = "landing" | "questions" | "preview" | "email" | "report";

export type Attribution = {
  source: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  referrer: string;
};

export type SavedState = {
  version: 2;
  sessionId: string;
  stage: Stage;
  index: number;
  answers: Answers;
  attribution: Attribution;
  startedAt: string;
  /** Set once a report exists, so a refresh reopens it instead of restarting. */
  report?: { leadId: string; accessToken: string };
};

const STORAGE_KEY = "systems-teardown/v2";
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 14;

export const newSessionId = (): string => {
  const source = typeof globalThis.crypto !== "undefined" ? globalThis.crypto : undefined;
  if (source && typeof source.randomUUID === "function") return source.randomUUID();

  // Fallback for browsers without randomUUID: the server only requires a
  // well-formed v4 uuid, not a cryptographically unguessable one.
  const bytes = new Uint8Array(16);
  source?.getRandomValues?.(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

const SAFE_UTM = /^[\w .:/+%-]{0,120}$/;

export const readAttribution = (): Attribution => {
  if (typeof window === "undefined") {
    return { source: "audit", utm_source: "", utm_medium: "", utm_campaign: "", referrer: "" };
  }
  const params = new URLSearchParams(window.location.search);
  const pick = (key: string) => {
    const value = (params.get(key) ?? "").slice(0, 120);
    return SAFE_UTM.test(value) ? value : "";
  };
  return {
    source: "audit",
    utm_source: pick("utm_source"),
    utm_medium: pick("utm_medium"),
    utm_campaign: pick("utm_campaign"),
    referrer: (document.referrer ?? "").slice(0, 500),
  };
};

export const createInitialState = (): SavedState => ({
  version: 2,
  sessionId: newSessionId(),
  stage: "landing",
  index: 0,
  answers: {},
  attribution: readAttribution(),
  startedAt: new Date().toISOString(),
});

/**
 * Storage access is wrapped: a private window, blocked site data or a full quota
 * must degrade to "no autosave", never to a broken assessment.
 */
export const loadState = (): SavedState | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<SavedState>;
    if (parsed.version !== 2 || !parsed.sessionId || !parsed.answers) return null;

    const age = Date.now() - new Date(parsed.startedAt ?? 0).getTime();
    if (!Number.isFinite(age) || age > MAX_AGE_MS) return null;

    // A saved index must still be in range if the question set changed.
    const index = Math.min(Math.max(parsed.index ?? 0, 0), QUESTIONS.length - 1);

    return {
      version: 2,
      sessionId: parsed.sessionId,
      stage: parsed.stage ?? "questions",
      index,
      answers: parsed.answers as Answers,
      attribution: parsed.attribution ?? readAttribution(),
      startedAt: parsed.startedAt ?? new Date().toISOString(),
      report: parsed.report,
    };
  } catch {
    return null;
  }
};

export const saveState = (state: SavedState): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Autosave is a convenience. Losing it must not interrupt anything.
  }
};

export const clearState = (): void => {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
};

export const answeredCount = (answers: Answers): number =>
  QUESTIONS.filter((question) => {
    const value = answers[question.id];
    return Array.isArray(value) ? value.length > 0 : Boolean(value && String(value).trim());
  }).length;

/** True when every required question has a usable answer. */
export const isComplete = (answers: Answers): boolean =>
  QUESTIONS.every((question) => {
    if (!question.required) return true;
    const value = answers[question.id];
    if (Array.isArray(value)) return value.length > 0;
    const text = String(value ?? "").trim();
    return text.length >= (question.minLength ?? 1);
  });

/**
 * Converts UI answers into the shape the API expects.
 *
 * Derived from QUESTIONS rather than hand-listed: a hand-written mapping
 * silently drops any question added later, and the server then rejects the
 * whole submission for a field the UI did collect.
 */
export const toSubmissionAnswers = (answers: Answers): Record<string, string | string[]> => {
  const payload: Record<string, string | string[]> = {};

  for (const question of QUESTIONS) {
    const value = answers[question.id];

    if (question.type === "multichoice") {
      payload[question.id] = Array.isArray(value) ? value : [];
      continue;
    }

    payload[question.id] = String(value ?? "").trim();
  }

  return payload;
};
