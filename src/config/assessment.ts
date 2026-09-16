/**
 * The Systems Teardown question set. This single definition drives the client
 * UI, the server-side validation and the analytics section boundaries, so a
 * question cannot exist in one place and not the other.
 */

export type QuestionType = "text" | "longtext" | "url" | "choice" | "multichoice";

export type Option = { value: string; label: string; hint?: string };

export type Question = {
  id: string;
  section: "business" | "process";
  type: QuestionType;
  prompt: string;
  help?: string;
  placeholder?: string;
  required: boolean;
  minLength?: number;
  maxLength: number;
  options?: Option[];
  /** multichoice only: allows a free-text entry alongside the options. */
  allowOther?: boolean;
  maxSelections?: number;
};

export const EMPLOYEE_RANGES: Option[] = [
  { value: "1-4", label: "1–4 people", hint: "Just starting out" },
  { value: "5-19", label: "5–19 people" },
  { value: "20-50", label: "20–50 people" },
  { value: "51-200", label: "51–200 people" },
  { value: "200+", label: "More than 200 people" },
];

export const ROLES: Option[] = [
  { value: "owner", label: "Owner" },
  { value: "founder", label: "Founder" },
  { value: "operations", label: "Operations" },
  { value: "general_manager", label: "General Manager" },
  { value: "other", label: "Something else" },
];

export const WEEKLY_FREQUENCY: Option[] = [
  { value: "under-5", label: "Fewer than 5 times a week" },
  { value: "5-20", label: "5 to 20 times a week" },
  { value: "20-50", label: "20 to 50 times a week" },
  { value: "50-plus", label: "More than 50 times a week" },
  { value: "unsure", label: "I'm not sure" },
];

export const VALUE_BANDS: Option[] = [
  { value: "unsure", label: "I honestly don't know yet" },
  { value: "small", label: "It's an irritation, not a cost" },
  { value: "meaningful", label: "It costs us real time every week" },
  { value: "significant", label: "It's costing us work or customers" },
  { value: "critical", label: "It's one of the biggest problems in the business" },
];

export const COMMON_TOOLS: Option[] = [
  { value: "spreadsheets", label: "Spreadsheets" },
  { value: "email", label: "Email inbox" },
  { value: "whatsapp", label: "WhatsApp or SMS" },
  { value: "paper", label: "Paper or whiteboard" },
  { value: "crm", label: "A CRM" },
  { value: "accounting", label: "Accounting software" },
  { value: "booking", label: "Booking or scheduling software" },
  { value: "project", label: "Project management tool" },
  { value: "shared-drive", label: "Shared drive or cloud folders" },
  { value: "custom", label: "Something custom-built" },
];

/**
 * Countries. The list is deliberately grouped: the target markets are offered
 * first so an owner in one of them does not scroll, and "Somewhere else" is a
 * real answer rather than a dead end.
 */
export const COUNTRY_GROUPS: { label: string; options: Option[] }[] = [
  {
    label: "Most common",
    options: [
      { value: "US", label: "United States" },
      { value: "GB", label: "United Kingdom" },
      { value: "AU", label: "Australia" },
      { value: "CA", label: "Canada" },
    ],
  },
  {
    label: "European Union",
    options: [
      { value: "AT", label: "Austria" },
      { value: "BE", label: "Belgium" },
      { value: "BG", label: "Bulgaria" },
      { value: "HR", label: "Croatia" },
      { value: "CY", label: "Cyprus" },
      { value: "CZ", label: "Czechia" },
      { value: "DK", label: "Denmark" },
      { value: "EE", label: "Estonia" },
      { value: "FI", label: "Finland" },
      { value: "FR", label: "France" },
      { value: "DE", label: "Germany" },
      { value: "GR", label: "Greece" },
      { value: "HU", label: "Hungary" },
      { value: "IE", label: "Ireland" },
      { value: "IT", label: "Italy" },
      { value: "LV", label: "Latvia" },
      { value: "LT", label: "Lithuania" },
      { value: "LU", label: "Luxembourg" },
      { value: "MT", label: "Malta" },
      { value: "NL", label: "Netherlands" },
      { value: "PL", label: "Poland" },
      { value: "PT", label: "Portugal" },
      { value: "RO", label: "Romania" },
      { value: "SK", label: "Slovakia" },
      { value: "SI", label: "Slovenia" },
      { value: "ES", label: "Spain" },
      { value: "SE", label: "Sweden" },
    ],
  },
  {
    label: "Gulf",
    options: [
      { value: "SA", label: "Saudi Arabia" },
      { value: "AE", label: "United Arab Emirates" },
      { value: "QA", label: "Qatar" },
      { value: "KW", label: "Kuwait" },
      { value: "BH", label: "Bahrain" },
      { value: "OM", label: "Oman" },
    ],
  },
  {
    label: "Elsewhere",
    options: [{ value: "OTHER", label: "Somewhere else" }],
  },
];

export const ALL_COUNTRY_VALUES: string[] = COUNTRY_GROUPS.flatMap((group) =>
  group.options.map((option) => option.value),
);

export const QUESTIONS: Question[] = [
  {
    id: "company_name",
    section: "business",
    type: "text",
    prompt: "What's the name of your business?",
    placeholder: "e.g. Riverside Plumbing",
    required: true,
    minLength: 2,
    maxLength: 120,
  },
  {
    id: "company_website",
    section: "business",
    type: "url",
    prompt: "Do you have a website?",
    help: "Optional. It helps me understand what you do before we speak.",
    placeholder: "riversideplumbing.com",
    required: false,
    maxLength: 300,
  },
  {
    id: "country",
    section: "business",
    type: "choice",
    prompt: "Where is the business based?",
    required: true,
    maxLength: 10,
    options: COUNTRY_GROUPS.flatMap((group) => group.options),
  },
  {
    id: "employee_range",
    section: "business",
    type: "choice",
    prompt: "How many people work there?",
    help: "Including you, part-time and regular subcontractors.",
    required: true,
    maxLength: 20,
    options: EMPLOYEE_RANGES,
  },
  {
    id: "respondent_role",
    section: "business",
    type: "choice",
    prompt: "What's your role?",
    required: true,
    maxLength: 30,
    options: ROLES,
  },
  {
    id: "respondent_name",
    section: "business",
    type: "text",
    prompt: "And your name?",
    placeholder: "First and last name",
    required: true,
    minLength: 2,
    maxLength: 120,
  },
  {
    id: "process_problem",
    section: "process",
    type: "longtext",
    prompt: "What's one thing in your business that takes too long or keeps going wrong?",
    help: "In your own words. The more specific you are, the more useful your report will be.",
    placeholder:
      "e.g. Every new job gets written on a job sheet, then typed into the spreadsheet, then typed again into the invoice. Things get missed.",
    required: true,
    minLength: 25,
    maxLength: 2_000,
  },
  {
    id: "weekly_frequency",
    section: "process",
    type: "choice",
    prompt: "How often does that happen in a typical week?",
    required: true,
    maxLength: 20,
    options: WEEKLY_FREQUENCY,
  },
  {
    id: "people_involved",
    section: "process",
    type: "text",
    prompt: "Who does it at the moment?",
    help: "A role is fine — no names needed.",
    placeholder: "e.g. Office manager, and me when she's away",
    required: true,
    minLength: 2,
    maxLength: 300,
  },
  {
    id: "current_tools",
    section: "process",
    type: "multichoice",
    prompt: "What does that work happen in today?",
    help: "Pick everything that's involved.",
    required: true,
    maxLength: 400,
    options: COMMON_TOOLS,
    allowOther: true,
    maxSelections: 12,
  },
  {
    id: "previous_attempts",
    section: "process",
    type: "longtext",
    prompt: "Have you already tried to fix it?",
    help: "Optional. Knowing what didn't work saves us both time.",
    placeholder: "e.g. We bought a scheduling tool last year but nobody used it.",
    required: false,
    maxLength: 1_200,
  },
  {
    id: "estimated_value",
    section: "process",
    type: "choice",
    prompt: "If this were fixed properly, what would that be worth to the business?",
    help: "Your own judgement. There's no wrong answer.",
    required: true,
    maxLength: 30,
    options: VALUE_BANDS,
  },
];

export const QUESTION_BY_ID: Record<string, Question> = Object.fromEntries(
  QUESTIONS.map((question) => [question.id, question]),
);

/** Index of the last "business" question — the analytics section boundary. */
export const BUSINESS_SECTION_END = QUESTIONS.filter((question) => question.section === "business").length - 1;

export const optionLabel = (options: Option[] | undefined, value: string): string =>
  options?.find((option) => option.value === value)?.label ?? value;

export const countryLabel = (value: string): string =>
  COUNTRY_GROUPS.flatMap((group) => group.options).find((option) => option.value === value)?.label ?? value;
