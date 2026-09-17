/**
 * Single source of truth for every externally verifiable business fact on the
 * site. Nothing in the UI may state a client count, a revenue figure, an hours
 * saved number, a percentage, a testimonial or a price — if a claim is not in
 * this file with a checkable source, it does not get rendered.
 */

export const SITE_URL = "https://ibrahemahmed.com";
export const AUDIT_URL = "https://audit.ibrahemahmed.com";
export const CONTACT_EMAIL = "hello@ibrahemahmed.com";
export const GITHUB_URL = "https://github.com/ibrahembuilds";
export const LINKEDIN_URL = "https://www.linkedin.com/in/ibrahem-ahmed-hassan/";

/**
 * Booking link. The live value comes from SYSTEMS_TEARDOWN_BOOKING_URL on the
 * server so it can be changed without a deploy; this constant is only the
 * display label used where the URL itself would be too long to read.
 */
export const BOOKING_LABEL = "Book a 20-minute Systems Teardown";

/** Bumped whenever the text of /privacy changes. Stored against every consent
 *  record so a historical consent can be tied to the wording it was given for. */
export const PRIVACY_POLICY_VERSION = "2026-09-15";

export const OWNER = {
  name: "Ibrahem Ahmed",
  /** Used in structured data only, where the legal name matters for identity. */
  legalName: "Ibrahem Ahmed Hassan Adam",
  discipline: "Internal Systems for Small Businesses",
  /** Verifiable: current role. */
  role: "Web & AI Solutions Developer",
  employer: "NCASE Consulting Group",
  /** Verifiable: current study. */
  study: "Applied AI",
  university: "Multimedia University, Malaysia",
  /** Verifiable: public repository count at github.com/ibrahembuilds.
   *  Update this number when the public archive changes. */
  publicRepoCount: 22,
} as const;

export const CTA = {
  primary: "Start a Systems Teardown",
  primaryHref: AUDIT_URL,
  secondary: "See what I build",
  secondaryHref: "/#projects",
} as const;

export type NavLink = { href: string; label: string };

/** The site is a single scrolling page now; every link below is an anchor on
 *  "/", not a separate route. They are written as "/#id" rather than "#id" so
 *  they still resolve correctly from /privacy and /terms. */
export const NAV_LINKS: NavLink[] = [
  { href: "/#experience", label: "Experience" },
  { href: "/#projects", label: "Projects" },
  { href: "/#services", label: "Services" },
  { href: "/#faq", label: "FAQ" },
];

export const ROUTES = ["/", "/privacy", "/terms"] as const;

export type Route = (typeof ROUTES)[number];

/**
 * Technology stack. Deliberately surfaced only in the footer — never near a
 * hero, and never named in a headline.
 */
export const STACK: { group: string; items: string[] }[] = [
  { group: "Interfaces", items: ["React", "Next.js", "TypeScript"] },
  { group: "Services", items: ["Python", "FastAPI", "Node"] },
  { group: "Data", items: ["Supabase", "Firebase", "Postgres"] },
  { group: "Automation", items: ["n8n", "Make.com", "Twilio"] },
  { group: "Language models", items: ["OpenRouter / LLM APIs", "RAG pipelines"] },
  { group: "Hosting", items: ["Vercel", "Cloudflare", "Docker"] },
];

/* -------------------------------------------------------------------------- */
/* What it costs                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Indicative investment bands shown in the report and the PDF.
 *
 * SET THESE TO YOUR REAL NUMBERS BEFORE LAUNCH.
 *
 * Every band is null by default and nothing invented is ever published. With
 * all of them null the report still carries a "What this would cost" section —
 * it explains what moves the price and states that the fixed figure comes after
 * the call. Fill a band in and the range appears alongside that explanation.
 *
 * A band is a starting range, not a quote. The report always says so, because
 * a number a prospect treats as a quote and you treat as a guess is the fastest
 * way to lose a client you already won.
 */
export type InvestmentBand = {
  /** e.g. "from £4,000" or "£4,000 – £9,000". Currency included. */
  range: string;
  /** One line on what the lower end buys. */
  note: string;
};

export type DeliveryPath = "systems_teardown" | "automation_sprint" | "core_system_build" | "unclear";

export const INVESTMENT_BANDS: Record<DeliveryPath, InvestmentBand | null> = {
  systems_teardown: null,
  automation_sprint: null,
  core_system_build: null,
  unclear: null,
};

/** True once at least one real band has been filled in. */
export const hasPublishedPricing = (): boolean =>
  Object.values(INVESTMENT_BANDS).some((band) => band !== null);

/**
 * What actually moves the price. This is published whether or not a band is,
 * because it is true, it is useful, and it sets expectations without committing
 * to a figure before the process has been seen.
 */
export const PRICE_DRIVERS: string[] = [
  "How many steps of the process the system has to cover",
  "How many tools have to talk to each other, and whether they have an API",
  "Whether existing data needs migrating in, and what state it is in",
  "How many people need to use it, and how different their jobs are",
  "Whether your customers get a login of their own",
];

export const PRICING_PROMISE =
  "You get one fixed price for a defined piece of work after the 20-minute call, not an hourly rate and not an open-ended estimate. If the scope changes later, that is a new quote you approve before anything is built.";
