/**
 * All customer-facing marketing copy. Kept out of components so the wording can
 * be reviewed as prose, and so the same strings feed the prerendered HTML, the
 * structured data and the llms.txt without drifting apart.
 */

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

export const HERO = {
  headline: "Your business shouldn't depend on spreadsheets, inboxes and someone's memory.",
  body: "I build custom CRMs, client portals, workflow automation and internal tools for 5–50 person businesses that don't have a technical team.",
  trust:
    "You deal directly with the person writing the code. Your accounts. Your data. Clear documentation. No lock-in.",
} as const;

/* -------------------------------------------------------------------------- */
/* Problem recognition — owner language, left exactly as an owner would say it */
/* -------------------------------------------------------------------------- */

export const PROBLEM_QUOTES = [
  "My team is copying the same information between three different tools.",
  "We lose leads because nobody answers fast enough.",
  "I don't know what's happening in my business without asking someone.",
  "Our client onboarding is 14 emails and a PDF.",
  "We pay for software that does 20% of what we need.",
  "Only one person knows how this works and they're on holiday.",
] as const;

/* -------------------------------------------------------------------------- */
/* What I build                                                               */
/* -------------------------------------------------------------------------- */

export type BuildItem = { title: string; body: string; examples: string[] };

export const WHAT_I_BUILD: BuildItem[] = [
  {
    title: "Custom CRMs",
    body: "One place where every lead, quote, job and customer lives, set up the way your business actually sells and delivers.",
    examples: ["Lead and enquiry tracking", "Quotes and follow-up", "Customer history in one record"],
  },
  {
    title: "Client portals",
    body: "A login where your customers see their own jobs, documents, invoices and updates instead of emailing you to ask.",
    examples: ["Job and order status", "Document and file access", "Approvals and sign-off"],
  },
  {
    title: "Workflow automation",
    body: "The repeated copying, chasing and reminding happens on its own, so nothing waits on someone remembering to do it.",
    examples: ["Lead capture and response", "Missed-call follow-up", "Reporting and reminders"],
  },
  {
    title: "Internal tools",
    body: "The screen your team opens every morning: jobs, bookings, stock, staff, or whatever your operation actually runs on.",
    examples: ["Job and booking boards", "Operations dashboards", "Quoting and pricing tools"],
  },
];

/* -------------------------------------------------------------------------- */
/* How I work                                                                 */
/* -------------------------------------------------------------------------- */

export type ProcessStep = { step: string; title: string; quote: string; detail: string };

export const PROCESS: ProcessStep[] = [
  {
    step: "01",
    title: "Map",
    quote: "I spend 20 minutes on what you actually do, not what you want built.",
    detail:
      "We walk through one process end to end: who touches it, where it stops, what gets re-typed, and what falls through. You get a written map of where work leaks and what is worth fixing first.",
  },
  {
    step: "02",
    title: "Quote",
    quote: "Fixed scope, fixed price, fixed date. If I can't fix it, I tell you and we stop.",
    detail:
      "One priority, written down in plain language, with what is included and what is not. You approve a defined piece of work, not an open-ended engagement.",
  },
  {
    step: "03",
    title: "Build",
    quote: "You see it working in week one, not at the end.",
    detail:
      "You get something you can open and click early, and it keeps getting closer to how your team works. No long silence followed by a reveal.",
  },
  {
    step: "04",
    title: "Hand over",
    quote: "Your data, your accounts, your documentation. No lock-in.",
    detail:
      "The system runs on accounts in your name. You get written documentation and your team gets trained on it. If you stop working with me, nothing breaks and nothing is held hostage.",
  },
];

/* -------------------------------------------------------------------------- */
/* Services — exactly four offers, no pricing published                        */
/* -------------------------------------------------------------------------- */

export type Service = {
  id: string;
  name: string;
  tagline: string;
  body: string;
  forYouIf: string[];
  deliverables: string[];
  note?: string;
  primary?: boolean;
};

export const SERVICES: Service[] = [
  {
    id: "systems-teardown",
    name: "Systems Teardown",
    tagline: "Start here.",
    body: "A 20-minute call, then a written map showing where work leaks, what is worth fixing first, and a fixed quote for the highest-priority fix. The written map arrives within 48 hours of the call.",
    forYouIf: [
      "You know something is wasting time but not exactly what",
      "You want a plan before you commit to a build",
      "You want to know what a fix costs before you decide",
    ],
    deliverables: [
      "20-minute call on one real process",
      "Written map of where work leaks, within 48 hours",
      "The one fix worth doing first, and why",
      "A fixed quote for that fix",
    ],
    primary: true,
  },
  {
    id: "core-system-build",
    name: "Core System Build",
    tagline: "One system, built around a real process.",
    body: "A single operational system built around how your business already works — not a template you have to bend your process around.",
    forYouIf: [
      "A process is running on spreadsheets and inboxes",
      "Off-the-shelf software does part of the job but not the important part",
      "You need one place your team can actually work from",
    ],
    deliverables: [
      "The working system, built to the agreed scope",
      "Deployed on accounts in your name",
      "Your existing data migrated in",
      "Team training and written documentation",
    ],
    note: "Examples: custom CRM, client portal, job or booking system, internal dashboard, quoting system.",
  },
  {
    id: "automation-sprint",
    name: "Automation Sprint",
    tagline: "Stop the repeated copying.",
    body: "Connect the systems you already pay for so repetitive manual copying and follow-up work stops happening by hand.",
    forYouIf: [
      "The same information is typed into more than one tool",
      "Follow-up depends on someone remembering",
      "Reports are assembled manually every week",
    ],
    deliverables: [
      "Live automations, tested against real cases",
      "A runbook covering what runs, when, and what to do if it stops",
    ],
    note: "Examples: lead capture and response, missed-call follow-up, client onboarding, reporting, document handling.",
  },
  {
    id: "care-plan",
    name: "Care Plan",
    tagline: "After the build.",
    body: "Ongoing monitoring, fixes and small changes, plus one improvement each month. For businesses running a system I built.",
    forYouIf: [
      "You have a system running and want it looked after",
      "You want small changes handled without starting a new project",
    ],
    deliverables: [
      "Monitoring and fixes",
      "Small changes as your process changes",
      "One improvement per month",
    ],
    note: "Available after a build. Not a starting point.",
  },
];

/** Pricing is deliberately not published anywhere on the site. */
export const PRICING_NOTE =
  "I don't publish prices for work I haven't scoped. You get a fixed price after the Teardown, once I know what the fix actually involves.";

/* -------------------------------------------------------------------------- */
/* Teardown explainer                                                          */
/* -------------------------------------------------------------------------- */

export const TEARDOWN_STEPS = [
  {
    title: "Answer a few questions",
    body: "A few minutes, online, about one process that is costing you time. No technical knowledge required.",
  },
  {
    title: "Get a preliminary Systems Report",
    body: "A written report showing what looks worth reviewing first, based on the answers you gave. It arrives on screen straight away.",
  },
  {
    title: "Book the 20-minute call",
    body: "If it looks like a fit, we go through the process properly together. That call is the actual Systems Teardown.",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Proof — verifiable only. Every item here is a link a prospect can open.      */
/* -------------------------------------------------------------------------- */

export type ClientSystem = {
  name: string;
  href: string;
  domain: string;
  kind: string;
  body: string;
  featured: boolean;
};

export const CLIENT_SYSTEMS: ClientSystem[] = [
  {
    name: "NCase Consulting",
    href: "https://ncase.com.sa/",
    domain: "ncase.com.sa",
    kind: "Website with a private CRM behind it",
    body: "A bilingual consulting site with an internal CRM behind it for leads, events, campaigns and customer follow-up, so enquiries land in one place instead of an inbox.",
    featured: true,
  },
  {
    name: "NCASE Intelligence",
    href: "https://ncaseai.com/",
    domain: "ncaseai.com",
    kind: "Internal market intelligence platform",
    body: "A bilingual platform for competitor tracking, monitoring and reports, replacing research that was previously assembled by hand for each request.",
    featured: true,
  },
  {
    name: "Al Mujtahid",
    href: "https://almujtahidedu.com/",
    domain: "almujtahidedu.com",
    kind: "Student enquiry and admissions flow",
    body: "An Arabic-first platform that takes a prospective student from browsing programmes to a structured admissions enquiry, so enquiries arrive complete rather than as loose messages.",
    featured: true,
  },
  {
    name: "Al-Ghufran",
    href: "https://al-ghufran.com/",
    domain: "al-ghufran.com",
    kind: "Education consultancy website",
    body: "Arabic-first site presenting study services and a clear path to a consultation.",
    featured: false,
  },
  {
    name: "Abdul Hai Trading",
    href: "https://abdulhaitrading.com/",
    domain: "abdulhaitrading.com",
    kind: "International trade website",
    body: "Bilingual corporate and product site for an agricultural commodities business.",
    featured: false,
  },
];

export const OPEN_SOURCE_NOTE =
  "Public repositories on GitHub, including unit, API, end-to-end and multi-language test suites. You can read how I write and test software before you hire me.";

/* -------------------------------------------------------------------------- */
/* FAQ — kept in sync with the FAQPage structured data in scripts/seo-data.mjs  */
/* -------------------------------------------------------------------------- */

export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: "What is a Systems Teardown?",
    a: "A 20-minute call about one process in your business, followed by a written map of where work leaks, what is worth fixing first, and a fixed quote for that fix. You get the written map within 48 hours of the call.",
  },
  {
    q: "Do I need to know what I want built?",
    a: "No. Most owners know something is wasting time without knowing exactly where. That is what the Teardown is for. You describe how the work happens now, and I map where it leaks.",
  },
  {
    q: "Who actually does the work?",
    a: "I do. You deal directly with the person writing the code. There is no account manager in between and no team being assembled behind the scenes.",
  },
  {
    q: "What does it cost?",
    a: "Every build is quoted as fixed scope, fixed price, fixed date — after the Teardown, because the price depends on what the process actually needs. I don't publish price bands for work I haven't scoped.",
  },
  {
    q: "How long does a build take?",
    a: "You get a fixed date with your quote, once the scope is defined. Before that I would be guessing, and a guessed date is worth nothing to you.",
  },
  {
    q: "Do I have to replace the software we already use?",
    a: "Usually not. Often the faster fix is connecting what you already pay for so information stops being copied between tools. If something genuinely needs replacing, I tell you why.",
  },
  {
    q: "Who owns the system and the data?",
    a: "You do. It runs on accounts in your name, your data stays yours, and you get written documentation. If you stop working with me, nothing breaks and nothing is held hostage.",
  },
  {
    q: "What if you can't help?",
    a: "I tell you and we stop. If the problem is better solved by software you can buy, or by a change that needs no software at all, that is what I will say.",
  },
  {
    q: "Which businesses is this for?",
    a: "Owners, founders and operations managers of businesses with roughly 5 to 50 people that don't have an internal technical team. Most often trades and home services, clinics and allied health, professional services, real estate, logistics and education providers.",
  },
];
