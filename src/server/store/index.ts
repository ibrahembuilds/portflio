import { env } from "../env";
import { MemoryLeadStore } from "./memory";
import { PostgresLeadStore } from "./postgres";
import type { LeadStore } from "./types";

let store: LeadStore | null = null;

/**
 * Returns the Postgres store when a database URL is configured, and a
 * process-local store otherwise so local development and tests run without one.
 * Callers check `store.durable` before treating a write as safe.
 */
export const getLeadStore = (): LeadStore => {
  if (!store) store = env.hasDatabase ? new PostgresLeadStore() : new MemoryLeadStore();
  return store;
};

/** Test seam. */
export const __setLeadStore = (next: LeadStore | null) => {
  store = next;
};

export * from "./types";
