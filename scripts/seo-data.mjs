/**
 * Per-route SEO for the marketing site. This is the only place page titles,
 * descriptions, canonicals and structured data are defined; scripts/prerender.mjs
 * substitutes the output into the <!-- SEO:START --> block of each built page.
 *
 * Every factual claim in the structured data below must be independently
 * checkable: the GitHub archive, the current role, the current study. No client
 * counts, no metrics, no awards, no testimonials.
 */

const SITE = "https://ibrahemahmed.com";
const AUDIT = "https://audit.ibrahemahmed.com";
const OG_IMAGE = `${SITE}/og-image.png`;
const OG_IMAGE_AR = `${SITE}/og-image-ar.png`;
const PERSON_ID = `${SITE}/#person`;
const SITE_ID = `${SITE}/#website`;
const PUBLIC_REPO_COUNT = 22;



export const PAGES = {
  "/": {
    path: "/",
    title: "Ibrahem Ahmed — Custom CRMs, Client Portals & Internal Tools for Small Businesses",
    description:
      "I build custom CRMs, client portals, workflow automation and internal tools for 5–50 person businesses without a technical team. Start with a Systems Teardown.",
    ogTitle: "Your business shouldn't depend on spreadsheets, inboxes and someone's memory.",
    ogType: "website",
    changefreq: "monthly",
    priority: "1.0",
  },
  "/services": {
    path: "/services",
    title: "Services — Systems Teardown, Core System Build, Automation Sprint | Ibrahem Ahmed",
    description:
      "Four ways I work with small businesses: a Systems Teardown to find what is worth fixing, a Core System Build, an Automation Sprint, and an ongoing Care Plan.",
    ogTitle: "Four ways I work. One place to start.",
    ogType: "website",
    changefreq: "monthly",
    priority: "0.9",
  },
  "/how-it-works": {
    path: "/how-it-works",
    title: "How It Works — Map, Quote, Build, Hand Over | Ibrahem Ahmed",
    description:
      "Fixed scope, fixed price, fixed date. You see the system working in week one, and you keep your data, your accounts and your documentation.",
    ogTitle: "Map. Quote. Build. Hand over.",
    ogType: "website",
    changefreq: "monthly",
    priority: "0.8",
  },
  "/work": {
    path: "/work",
    title: "Work — Client Systems and Public Code | Ibrahem Ahmed",
    description: `Live client systems you can open, plus ${PUBLIC_REPO_COUNT} public repositories on GitHub including unit, API and end-to-end test suites.`,
    ogTitle: "Open it and judge it yourself.",
    ogType: "website",
    changefreq: "monthly",
    priority: "0.8",
  },
  "/about": {
    path: "/about",
    title: "About Ibrahem Ahmed — Internal Systems for Small Businesses",
    description:
      "Not an agency, not a team. You deal directly with the person writing the code. Web & AI Solutions Developer at NCASE Consulting Group, studying Applied AI at Multimedia University, Malaysia.",
    ogTitle: "You deal directly with the person writing the code.",
    ogType: "profile",
    changefreq: "yearly",
    priority: "0.7",
  },
  "/privacy": {
    path: "/privacy",
    title: "Privacy Policy | Ibrahem Ahmed",
    description: "What I collect through the site and the Systems Teardown assessment, why, who processes it, and how to have it removed.",
    ogTitle: "Privacy Policy",
    ogType: "website",
    robots: "noindex, follow",
    changefreq: "yearly",
    priority: "0.3",
  },
  "/terms": {
    path: "/terms",
    title: "Terms of Use | Ibrahem Ahmed",
    description: "Terms covering use of the site and the preliminary Systems Report produced by the assessment.",
    ogTitle: "Terms of Use",
    ogType: "website",
    robots: "noindex, follow",
    changefreq: "yearly",
    priority: "0.3",
  },
  "/ar/": {
    path: "/ar/",
    locale: "ar",
    pairedWith: "/",
    title: "إبراهيم أحمد — أنظمة CRM مخصصة وبوابات عملاء وأتمتة للشركات الصغيرة",
    description:
      "أبني أنظمة CRM مخصصة وبوابات عملاء وأتمتة لسير العمل وأدوات تشغيل داخلية للشركات التي يعمل فيها من 5 إلى 50 شخصاً وليس لديها فريق تقني داخلي. ابدأ بتفكيك الأنظمة.",
    ogTitle: "شركتك لا يجب أن تعتمد على جداول البيانات وصناديق البريد وذاكرة أحد الموظفين.",
    ogType: "website",
    changefreq: "monthly",
    priority: "1.0",
  },
  "/ar/services/": {
    path: "/ar/services/",
    locale: "ar",
    pairedWith: "/services",
    title: "الخدمات — تفكيك الأنظمة، بناء النظام الأساسي، جولة الأتمتة | إبراهيم أحمد",
    description:
      "أربع طرق للعمل مع الشركات الصغيرة: تفكيك الأنظمة لمعرفة ما يستحق الإصلاح، وبناء النظام الأساسي، وجولة الأتمتة، وخطة الرعاية المستمرة.",
    ogTitle: "أربع طرق للعمل معي. ونقطة بداية واحدة.",
    ogType: "website",
    changefreq: "monthly",
    priority: "0.9",
  },
  "/ar/how-it-works/": {
    path: "/ar/how-it-works/",
    locale: "ar",
    pairedWith: "/how-it-works",
    title: "طريقة العمل — الرسم والتسعير والبناء والتسليم | إبراهيم أحمد",
    description:
      "نطاق ثابت وسعر ثابت وتاريخ ثابت. ترى النظام يعمل في الأسبوع الأول، وتحتفظ ببياناتك وحساباتك وتوثيقك.",
    ogTitle: "الرسم. التسعير. البناء. التسليم.",
    ogType: "website",
    changefreq: "monthly",
    priority: "0.8",
  },
  "/ar/work/": {
    path: "/ar/work/",
    locale: "ar",
    pairedWith: "/work",
    title: "الأعمال — أنظمة لعملاء وكود عام | إبراهيم أحمد",
    description: `أنظمة تعمل الآن يمكنك فتحها، إضافة إلى ${PUBLIC_REPO_COUNT} مستودعاً عاماً على GitHub تتضمن اختبارات وحدة وواجهات برمجية واختبارات شاملة.`,
    ogTitle: "افتحها واحكم بنفسك.",
    ogType: "website",
    changefreq: "monthly",
    priority: "0.8",
  },
  "/ar/about/": {
    path: "/ar/about/",
    locale: "ar",
    pairedWith: "/about",
    title: "عن إبراهيم أحمد — أنظمة تشغيل داخلية للشركات الصغيرة",
    description:
      "لست وكالة ولست فريقاً. تتعامل مباشرة مع من يكتب الكود. مطوّر حلول ويب وذكاء اصطناعي في NCASE Consulting Group، ويدرس الذكاء الاصطناعي التطبيقي في جامعة الوسائط المتعددة بماليزيا.",
    ogTitle: "تتعامل مباشرة مع من يكتب الكود.",
    ogType: "profile",
    changefreq: "yearly",
    priority: "0.7",
  },
};

/** English route -> its Arabic translation. Derived so the two cannot drift. */
const TRANSLATION_PAIRS = Object.values(PAGES)
  .filter((page) => page.pairedWith)
  .reduce((map, page) => map.set(page.pairedWith, page.path), new Map());

/** FAQ answers here must match src/config/content.ts FAQS. */
const FAQ_ENTRIES = [
  [
    "What is a Systems Teardown?",
    "A 20-minute call about one process in your business, followed by a written map of where work leaks, what is worth fixing first, and a fixed quote for that fix. You get the written map within 48 hours of the call.",
  ],
  [
    "Do I need to know what I want built?",
    "No. Most owners know something is wasting time without knowing exactly where. That is what the Teardown is for. You describe how the work happens now, and I map where it leaks.",
  ],
  [
    "Who actually does the work?",
    "I do. You deal directly with the person writing the code. There is no account manager in between and no team being assembled behind the scenes.",
  ],
  [
    "What does it cost?",
    "Every build is quoted as fixed scope, fixed price, fixed date — after the Teardown, because the price depends on what the process actually needs. I don't publish price bands for work I haven't scoped.",
  ],
  [
    "Who owns the system and the data?",
    "You do. It runs on accounts in your name, your data stays yours, and you get written documentation. If you stop working with me, nothing breaks and nothing is held hostage.",
  ],
  [
    "Which businesses is this for?",
    "Owners, founders and operations managers of businesses with roughly 5 to 50 people that don't have an internal technical team. Most often trades and home services, clinics and allied health, professional services, real estate, logistics and education providers.",
  ],
];

/** Arabic FAQ entries, kept in step with FAQS_AR in src/config/content.ar.ts. */
const FAQ_ENTRIES_AR = [
  [
    "ما هو تفكيك الأنظمة؟",
    "مكالمة مدتها عشرون دقيقة حول عملية واحدة في شركتك، تتبعها خريطة مكتوبة لمواضع تسرّب العمل، وما يستحق الإصلاح أولاً، وسعر ثابت لذلك الإصلاح. تصلك الخريطة المكتوبة خلال 48 ساعة من المكالمة.",
  ],
  [
    "هل يجب أن أعرف ما الذي أريد بناءه؟",
    "لا. أغلب أصحاب الشركات يعرفون أن شيئاً ما يهدر الوقت دون أن يعرفوا أين بالضبط. أنت تصف كيف يسير العمل الآن، وأنا أرسم أين يتسرّب.",
  ],
  [
    "من الذي ينفّذ العمل فعلاً؟",
    "أنا. تتعامل مباشرة مع من يكتب الكود. لا مدير حسابات بيننا، ولا فريق يُجمَّع خلف الكواليس.",
  ],
  [
    "كم تبلغ التكلفة؟",
    "كل بناء يُسعَّر بنطاق ثابت وسعر ثابت وتاريخ ثابت، بعد التفكيك، لأن السعر يعتمد على ما تحتاجه العملية فعلاً. ولا أنشر نطاقات أسعار لعمل لم أحدد نطاقه.",
  ],
  [
    "من يملك النظام والبيانات؟",
    "أنت. النظام يعمل على حسابات باسمك، وبياناتك تبقى ملكك، وتحصل على توثيق مكتوب. وإن توقفت عن العمل معي، لا ينكسر شيء ولا يُحتجز شيء.",
  ],
  [
    "لمن هذه الخدمة؟",
    "أصحاب الشركات والمؤسسون ومديرو العمليات في شركات يعمل فيها من 5 إلى 50 شخصاً تقريباً وليس لديها فريق تقني داخلي.",
  ],
];

const SERVICES_AR_LD = [
  {
    id: "systems-teardown",
    name: "تفكيك الأنظمة",
    description:
      "مكالمة عشرين دقيقة تتبعها خريطة مكتوبة توضح أين يتسرّب العمل، وما يستحق الإصلاح أولاً، وسعر ثابت لأعلى إصلاح أولوية، تصل خلال 48 ساعة من المكالمة.",
  },
  {
    id: "core-system-build",
    name: "بناء النظام الأساسي",
    description:
      "نظام تشغيلي واحد مبني حول عملية حقيقية: نظام CRM مخصص أو بوابة عملاء أو نظام مهام وحجوزات أو لوحة تشغيل داخلية أو نظام تسعير، مع النشر ونقل البيانات والتدريب والتوثيق.",
  },
  {
    id: "automation-sprint",
    name: "جولة الأتمتة",
    description:
      "ربط الأنظمة الحالية حتى يتوقف النسخ اليدوي والمتابعة المتكررة، ويُسلَّم العمل كأتمتة مختبرة مع دليل تشغيل.",
  },
  {
    id: "care-plan",
    name: "خطة الرعاية",
    description: "مراقبة وإصلاحات وتعديلات صغيرة لنظام قائم، مع تحسين واحد كل شهر.",
  },
];

const AR_PERSON = {
  jobTitle: "مطوّر برمجيات يبني أنظمة تشغيل داخلية للشركات",
  description:
    "يبني أنظمة CRM مخصصة وبوابات عملاء وأتمتة لسير العمل وأدوات تشغيل داخلية للشركات التي يعمل فيها من 5 إلى 50 شخصاً تقريباً وليس لديها فريق تقني داخلي.",
  knowsAbout: [
    "أنظمة إدارة علاقات العملاء",
    "بوابات العملاء",
    "أتمتة العمليات",
    "برمجيات الأعمال الداخلية",
    "تصميم سير العمل",
    "تشغيل الشركات الصغيرة",
  ],
};

const personNode = (locale) => ({
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Ibrahem Ahmed Hassan Adam",
  alternateName: ["Ibrahem Ahmed", "Ibrahim Ahmed Hassan Adam", "إبراهيم أحمد حسن أدم", "إبراهيم أحمد"],
  givenName: "Ibrahem",
  familyName: "Adam",
  jobTitle: locale === "ar" ? AR_PERSON.jobTitle : "Software developer building internal business systems",
  description:
    locale === "ar"
      ? AR_PERSON.description
      : "Builds custom CRMs, client portals, workflow automation and internal tools for businesses of roughly 5 to 50 people that do not have an internal technical team.",
  url: `${SITE}/`,
  email: "mailto:hello@ibrahemahmed.com",
  sameAs: ["https://github.com/ibrahembuilds", "https://www.linkedin.com/in/ibrahem-ahmed-hassan/"],
  worksFor: { "@type": "Organization", name: "NCASE Consulting Group" },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Multimedia University",
    address: { "@type": "PostalAddress", addressCountry: "MY" },
  },
  knowsAbout:
    locale === "ar"
      ? AR_PERSON.knowsAbout
      : [
          "Customer relationship management systems",
          "Client portals",
          "Business process automation",
          "Internal business software",
          "Workflow design",
          "Small business operations",
        ],
});

const serviceNodes = (locale) =>
  locale === "ar"
    ? SERVICES_AR_LD.map((service) => ({
        "@type": "Service",
        "@id": `${SITE}/ar/#${service.id}`,
        name: service.name,
        description: service.description,
        provider: { "@id": PERSON_ID },
        areaServed: ["SA", "AE", "QA", "KW", "BH", "OM", "EG", "JO"],
        inLanguage: "ar",
        audience: {
          "@type": "BusinessAudience",
          name: "شركات من 5 إلى 50 موظفاً بلا فريق تقني داخلي",
        },
      }))
    :
  [
    {
      id: "systems-teardown",
      name: "Systems Teardown",
      description:
        "A 20-minute call followed by a written map showing where work leaks, what is worth fixing first, and a fixed quote for the highest-priority fix, delivered within 48 hours of the call.",
    },
    {
      id: "core-system-build",
      name: "Core System Build",
      description:
        "One custom operational system built around a real process: a custom CRM, client portal, job or booking system, internal dashboard or quoting system, including deployment, data migration, training and documentation.",
    },
    {
      id: "automation-sprint",
      name: "Automation Sprint",
      description:
        "Connecting existing systems so repetitive manual copying and follow-up work stops, delivered as live tested automations with a runbook.",
    },
    {
      id: "care-plan",
      name: "Care Plan",
      description:
        "Ongoing monitoring, fixes and small changes for a system already built, including one improvement per month.",
    },
  ].map((service) => ({
    "@type": "Service",
    "@id": `${SITE}/#${service.id}`,
    name: service.name,
    description: service.description,
    provider: { "@id": PERSON_ID },
    areaServed: ["US", "GB", "AU", "CA", "EU", "AE", "SA"],
    audience: { "@type": "BusinessAudience", name: "Businesses of 5 to 50 employees without an internal technical team" },
  }));

const graphFor = (page) => {
  const locale = page.locale === "ar" ? "ar" : "en";
  const url = `${SITE}${page.path === "/" ? "/" : page.path}`;
  const graph = [
    personNode(locale),
    {
      "@type": "WebSite",
      "@id": SITE_ID,
      url: `${SITE}/`,
      name: "Ibrahem Ahmed — Internal Systems for Small Businesses",
      publisher: { "@id": PERSON_ID },
      inLanguage: locale,
    },
    {
      "@type": page.ogType === "profile" ? "ProfilePage" : "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: page.title,
      description: page.description,
      isPartOf: { "@id": SITE_ID },
      about: { "@id": PERSON_ID },
      inLanguage: locale,
    },
  ];

  // The homepage of each language carries the service catalogue and the FAQ,
  // which is what answer engines quote from.
  if (page.path === "/" || page.path === "/ar/") {
    graph.push(...serviceNodes(locale));
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      inLanguage: locale,
      mainEntity: (locale === "ar" ? FAQ_ENTRIES_AR : FAQ_ENTRIES).map(([name, text]) => ({
        "@type": "Question",
        name,
        acceptedAnswer: { "@type": "Answer", text },
      })),
    });
  }

  if (page.path === "/services" || page.path === "/ar/services/") graph.push(...serviceNodes(locale));

  return { "@context": "https://schema.org", "@graph": graph };
};

/**
 * Resolves the English/Arabic pair a page belongs to, from whichever side it is
 * asked about. Returns null when the page has no translation.
 */
const translationPair = (page) => {
  if (page.pairedWith) return { en: page.pairedWith, ar: page.path };
  const arabic = TRANSLATION_PAIRS.get(page.path);
  return arabic ? { en: page.path, ar: arabic } : null;
};

const escapeAttr = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const escapeText = (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const buildSeoBlock = (routePath) => {
  const page = PAGES[routePath];
  if (!page) throw new Error(`No SEO entry for route ${routePath}`);

  const url = `${SITE}${page.path === "/" ? "/" : page.path}`;
  const locale = page.locale === "ar" ? "ar" : "en";
  const robots = page.robots ?? "index, follow, max-image-preview:large, max-snippet:-1";

  // hreflang is declared only where a real translation exists on both sides.
  // A page with no counterpart declares nothing, because claiming one is a
  // false signal that search engines act on.
  const pair = translationPair(page);
  const alternates = pair
    ? `    <link rel="alternate" hreflang="en" href="${SITE}${pair.en}" />
    <link rel="alternate" hreflang="ar" href="${SITE}${pair.ar}" />
    <link rel="alternate" hreflang="x-default" href="${SITE}${pair.en}" />
`
    : "";

  // JSON-LD is embedded in a <script> tag, so the only sequence that can break
  // out of it is "</". Escaping it keeps the payload inert.
  const jsonLd = JSON.stringify(graphFor(page), null, 2).replace(/<\//g, "<\\/");

  return `<title>${escapeText(page.title)}</title>
    <meta name="description" content="${escapeAttr(page.description)}" />
    <meta name="author" content="Ibrahem Ahmed Hassan Adam" />
    <meta name="robots" content="${escapeAttr(robots)}" />
    <link rel="canonical" href="${escapeAttr(url)}" />
${alternates}
    <meta property="og:type" content="${escapeAttr(page.ogType)}" />
    <meta property="og:url" content="${escapeAttr(url)}" />
    <meta property="og:title" content="${escapeAttr(page.ogTitle)}" />
    <meta property="og:description" content="${escapeAttr(page.description)}" />
    <meta property="og:image" content="${locale === "ar" ? OG_IMAGE_AR : OG_IMAGE}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${
      locale === "ar"
        ? "إبراهيم أحمد — أنظمة تشغيل داخلية للشركات الصغيرة"
        : "Ibrahem Ahmed — internal systems for small businesses"
    }" />
    <meta property="og:site_name" content="Ibrahem Ahmed" />
    <meta property="og:locale" content="${locale === "ar" ? "ar_AR" : "en_US"}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttr(page.ogTitle)}" />
    <meta name="twitter:description" content="${escapeAttr(page.description)}" />
    <meta name="twitter:image" content="${locale === "ar" ? OG_IMAGE_AR : OG_IMAGE}" />

    <link rel="dns-prefetch" href="${AUDIT}" />

    <script type="application/ld+json">
${jsonLd}
    </script>`;
};

export const buildSitemap = () => {
  const today = new Date().toISOString().slice(0, 10);
  const entries = Object.values(PAGES)
    .filter((page) => !(page.robots ?? "").includes("noindex"))
    .map((page) => {
      const url = `${SITE}${page.path === "/" ? "/" : page.path}`;
      const pair = translationPair(page);
      const alternates = pair
        ? `    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${pair.en}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${SITE}${pair.ar}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${pair.en}" />
`
        : "";
      return `  <url>
    <loc>${url}</loc>
${alternates}    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${entries}
</urlset>
`;
};
