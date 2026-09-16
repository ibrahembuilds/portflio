/**
 * Server configuration. Read lazily on every access so tests can set and clear
 * variables between cases, and so a serverless instance picks up a changed
 * value without a cold start being required to observe it.
 *
 * Nothing here is ever imported by client code. Secrets have no VITE_ prefix,
 * which is what keeps them out of the browser bundle.
 */

const read = (name: string): string => (process.env[name] ?? "").trim();

const readNumber = (name: string, fallback: number): number => {
  const value = Number(read(name));
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

export const env = {
  /* Database ------------------------------------------------------------- */
  /** Vercel Postgres exposes POSTGRES_URL; DATABASE_URL is accepted as a
   *  fallback so the same code runs against any Postgres. */
  get databaseUrl() {
    return read("POSTGRES_URL") || read("DATABASE_URL");
  },
  get hasDatabase() {
    return this.databaseUrl.length > 0;
  },

  /* Language model ------------------------------------------------------- */
  get llmApiKey() {
    return read("OPENROUTER_API_KEY");
  },
  get llmBaseUrl() {
    return read("OPENROUTER_BASE_URL") || "https://openrouter.ai/api/v1";
  },
  /** Required. No default is shipped: a guessed model id fails in production
   *  in a way that is hard to see. Unset means the deterministic report is used. */
  get llmModel() {
    return read("TEARDOWN_LLM_MODEL");
  },
  /** Per attempt. Two attempts plus the PDF and two emails must fit inside the
   *  function's maxDuration, so this default is deliberately conservative. */
  get llmTimeoutMs() {
    return readNumber("TEARDOWN_LLM_TIMEOUT_MS", 20_000);
  },
  get llmMaxOutputTokens() {
    return readNumber("TEARDOWN_LLM_MAX_TOKENS", 2_600);
  },
  get hasLlm() {
    return this.llmApiKey.length > 0 && this.llmModel.length > 0;
  },

  /* Email ---------------------------------------------------------------- */
  get resendApiKey() {
    return read("RESEND_API_KEY");
  },
  get fromEmail() {
    return read("TEARDOWN_FROM_EMAIL");
  },
  /** Where new-lead notifications go. Falls back to the public contact address. */
  get notifyEmail() {
    return read("TEARDOWN_NOTIFY_EMAIL") || "hello@ibrahemahmed.com";
  },
  get hasEmail() {
    return this.resendApiKey.length > 0 && this.fromEmail.length > 0;
  },

  /* Booking -------------------------------------------------------------- */
  /** Never hard-coded. When unset the report says the link is coming soon and
   *  offers the email address instead of inventing a URL. */
  get bookingUrl() {
    return read("SYSTEMS_TEARDOWN_BOOKING_URL");
  },

  /* Bot protection ------------------------------------------------------- */
  get turnstileSecret() {
    return read("TURNSTILE_SECRET_KEY");
  },
  get hasTurnstile() {
    return this.turnstileSecret.length > 0;
  },

  /* Admin ---------------------------------------------------------------- */
  get adminToken() {
    return read("TEARDOWN_ADMIN_TOKEN");
  },

  /* Rate limiting -------------------------------------------------------- */
  get rateLimitSubmitPerHour() {
    return readNumber("TEARDOWN_RATE_LIMIT_SUBMIT", 5);
  },
  get rateLimitWebsitePerHour() {
    return readNumber("TEARDOWN_RATE_LIMIT_WEBSITE", 12);
  },
  get rateLimitEventPerHour() {
    return readNumber("TEARDOWN_RATE_LIMIT_EVENT", 200);
  },

  /* Misc ----------------------------------------------------------------- */
  get publicSiteUrl() {
    return read("TEARDOWN_PUBLIC_SITE_URL") || "https://ibrahemahmed.com";
  },
  get auditSiteUrl() {
    return read("TEARDOWN_PUBLIC_AUDIT_URL") || "https://audit.ibrahemahmed.com";
  },
  get isProduction() {
    return read("VERCEL_ENV") === "production" || read("NODE_ENV") === "production";
  },
};

export type Env = typeof env;
