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
  secondaryHref: "/work",
} as const;

export type NavLink = { href: string; label: string };

export const NAV_LINKS: NavLink[] = [
  { href: "/services", label: "Services" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
];

export const ROUTES = [
  "/",
  "/services",
  "/how-it-works",
  "/work",
  "/about",
  "/privacy",
  "/terms",
] as const;

export type Route = (typeof ROUTES)[number];

/**
 * Technology stack. Deliberately surfaced only at the bottom of /about and
 * /how-it-works — never near a hero, and never named in a headline.
 */
export const STACK: { group: string; items: string[] }[] = [
  { group: "Interfaces", items: ["React", "Next.js", "TypeScript"] },
  { group: "Services", items: ["Python", "FastAPI", "Node"] },
  { group: "Data", items: ["Supabase", "Firebase", "Postgres"] },
  { group: "Automation", items: ["n8n", "Make.com", "Twilio"] },
  { group: "Language models", items: ["OpenRouter / LLM APIs", "RAG pipelines"] },
  { group: "Hosting", items: ["Vercel", "Cloudflare", "Docker"] },
];
