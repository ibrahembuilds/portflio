const SITE = "https://ibrahemahmed.com";

const projectNodes = [
  {
    "@type": "SoftwareApplication",
    "@id": `${SITE}/#my-ai-agent-studio`,
    name: "My AI Agent Studio",
    url: "https://www.myaiagentstudio.io/",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "No-code platform for RAG-powered website assistants trained on company websites, documents, and business information, with lead capture, conversations, analytics, and a one-line embed.",
  },
  {
    "@type": "SoftwareApplication",
    "@id": `${SITE}/#boltfy`,
    name: "Boltfy",
    url: "https://boltfy.io/",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Multi-tenant form, audience, email-template, and campaign platform with secure Supabase authentication and Row-Level Security.",
  },
  {
    "@type": "SoftwareApplication",
    "@id": `${SITE}/#focusflow`,
    name: "FocusFlow",
    url: "https://focusflowai.site/",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web",
    description:
      "AI-assisted productivity workspace combining tasks, focus sessions, calendar planning, analytics, and goal decomposition.",
  },
  {
    "@type": "SoftwareSourceCode",
    "@id": `${SITE}/#scrapex`,
    name: "ScrapeX",
    codeRepository: "https://github.com/ibrahembuilds/ScrapeX",
    description:
      "Open-source agentic research platform for web and social search, tool execution, cited answers, and structured dataset export.",
  },
  {
    "@type": "SoftwareSourceCode",
    "@id": `${SITE}/#sudan-rag-tutor`,
    name: "Sudan Curriculum RAG Tutor",
    codeRepository: "https://github.com/ibrahembuilds/ai-student",
    description:
      "Arabic-first textbook-grounded tutor using PDF ingestion, vector embeddings, hybrid retrieval, pgvector, and streaming RAG responses.",
  },
  {
    "@type": "SoftwareSourceCode",
    "@id": `${SITE}/#velobrand-studio`,
    name: "VeloBrand Studio",
    codeRepository: "https://github.com/ibrahembuilds/velobrandstudio-",
    description:
      "Local-first multimodal AI studio that coordinates text, image-editing, and video models to create and export brand systems.",
  },
  {
    "@type": "SoftwareSourceCode",
    "@id": `${SITE}/#ai-web-builder`,
    name: "AI Web Builder",
    codeRepository: "https://github.com/ibrahembuilds/AI-web-builder-",
    description:
      "AI website-generation system with structured briefs, multi-provider routing, natural-language code editing, image generation, and exportable frontend code.",
  },
  {
    "@type": "SoftwareSourceCode",
    "@id": `${SITE}/#truthcheck`,
    name: "TruthCheck",
    codeRepository: "https://github.com/ibrahembuilds/TruthCheck",
    description:
      "Multimodal fact-checking workflow for evidence retrieval, claim analysis, structured-output validation, and cited reports.",
  },
  {
    "@type": "SoftwareSourceCode",
    "@id": `${SITE}/#yt-studio`,
    name: "YT Studio",
    codeRepository: "https://github.com/ibrahembuilds/youtube-",
    description:
      "YouTube intelligence workspace for timestamped transcripts, video question answering, summaries, and short-form content discovery.",
  },
].map((project) => ({
  ...project,
  author: { "@id": `${SITE}/#person` },
}));

const arabicProjectDescriptions = {
  [`${SITE}/#my-ai-agent-studio`]:
    "منصة بلا برمجة لإنشاء مساعدين بتقنية RAG يتعلمون من مواقع الشركات ووثائقها، مع جمع العملاء المحتملين والمحادثات والتحليلات والتضمين بسطر واحد.",
  [`${SITE}/#boltfy`]:
    "منصة متعددة المستأجرين لبناء النماذج وإدارة الجمهور وقوالب البريد والحملات، مع مصادقة Supabase وسياسات أمان على مستوى الصفوف.",
  [`${SITE}/#focusflow`]:
    "مساحة إنتاجية مدعومة بالذكاء الاصطناعي تجمع المهام وجلسات التركيز والتقويم والتحليلات وتحويل الأهداف إلى مهام.",
  [`${SITE}/#scrapex`]:
    "منصة بحث وكيلة مفتوحة المصدر للبحث في الويب ومنصات التواصل وتنفيذ الأدوات وتقديم إجابات موثقة وتصدير بيانات منظمة.",
  [`${SITE}/#sudan-rag-tutor`]:
    "مدرس عربي يستند إلى الكتب باستخدام معالجة PDF والتضمينات المتجهية والبحث الهجين وpgvector وإجابات RAG المتدفقة.",
  [`${SITE}/#velobrand-studio`]:
    "استوديو ذكاء اصطناعي محلي متعدد الوسائط ينسق نماذج النص وتحرير الصور والفيديو لإنشاء هويات وتصدير أصول جاهزة للإنتاج.",
  [`${SITE}/#ai-web-builder`]:
    "نظام لإنشاء المواقع بموجز منظم وتوجيه متعدد النماذج وتعديل الكود باللغة الطبيعية وتوليد الصور وتصدير كود الواجهة.",
  [`${SITE}/#truthcheck`]:
    "مسار تحقق متعدد الوسائط لاسترجاع الأدلة وتحليل الادعاءات والتحقق من المخرجات المنظمة وإنشاء تقارير موثقة.",
  [`${SITE}/#yt-studio`]:
    "مساحة معرفة للفيديوهات تستخرج النصوص المرتبطة بالتوقيت وتجيب عن المحتوى وتلخصه وتحدد لحظات للمحتوى القصير.",
};

const serviceNodes = [
  {
    "@type": "Service",
    "@id": `${SITE}/#service-ai-product-development`,
    name: "AI product development",
    description: "AI-enabled products and SaaS applications from early scope to a working release.",
  },
  {
    "@type": "Service",
    "@id": `${SITE}/#service-internal-business-systems`,
    name: "Internal business systems",
    description: "CRMs, dashboards, portals, and workflow systems that replace spreadsheets and disconnected tools.",
  },
  {
    "@type": "Service",
    "@id": `${SITE}/#service-ai-assistants-and-agents`,
    name: "AI assistants and agents",
    description: "Assistants connected to company knowledge, customer channels, data, and real operational actions.",
  },
  {
    "@type": "Service",
    "@id": `${SITE}/#service-technical-product-partnership`,
    name: "Technical product partnership",
    description: "Ongoing product scoping, architecture, rapid prototyping, weekly iteration, and launch preparation.",
  },
].map((service) => ({
  ...service,
  serviceType: service.name,
  provider: { "@id": "https://kanyouai.com/#organization" },
  areaServed: { "@type": "Country", name: "Worldwide" },
}));

const arabicServiceNames = {
  [`${SITE}/#service-ai-product-development`]: "تطوير منتجات الذكاء الاصطناعي",
  [`${SITE}/#service-internal-business-systems`]: "أنظمة الأعمال الداخلية",
  [`${SITE}/#service-ai-assistants-and-agents`]: "وكلاء ومساعدون بتقنية RAG",
  [`${SITE}/#service-technical-product-partnership`]: "شراكة تقنية للمنتج",
};

const arabicServiceDescriptions = {
  [`${SITE}/#service-ai-product-development`]:
    "منتجات SaaS وتطبيقات مدعومة بالذكاء الاصطناعي، من تحديد النطاق إلى إصدار يعمل في السوق.",
  [`${SITE}/#service-internal-business-systems`]:
    "أنظمة CRM ولوحات تحكم وبوابات ومسارات عمل تستبدل الجداول والأدوات المنفصلة.",
  [`${SITE}/#service-ai-assistants-and-agents`]:
    "مساعدون متصلون بمعرفة الشركة وبياناتها وقنوات العملاء وأدوات التشغيل الفعلية.",
  [`${SITE}/#service-technical-product-partnership`]:
    "تحديد النطاق والمعمارية والنماذج الأولية والتطوير الأسبوعي والاستعداد للإطلاق.",
};

const clientNodes = [
  {
    "@type": "CreativeWork",
    "@id": `${SITE}/#client-ncase-intelligence`,
    name: "NCASE Intelligence",
    url: "https://ncaseai.com/",
    description:
      "Bilingual market intelligence platform for the GCC covering competitor tracking, persona generation, monitoring, and executive-ready reports.",
  },
  {
    "@type": "CreativeWork",
    "@id": `${SITE}/#client-ncase-consulting`,
    name: "NCase Consulting",
    url: "https://ncase.com.sa/",
    description:
      "Bilingual consulting website supported by a private CRM for leads, events, campaigns, and customer follow-up.",
  },
  {
    "@type": "CreativeWork",
    "@id": `${SITE}/#client-al-ghufran`,
    name: "Al-Ghufran",
    url: "https://al-ghufran.com/",
    description:
      "Arabic-first education consultancy website presenting study services, university options, proof, and a clear consultation path.",
  },
  {
    "@type": "CreativeWork",
    "@id": `${SITE}/#client-abdul-hai-trading`,
    name: "Abdul Hai Trading",
    url: "https://abdulhaitrading.com/",
    description:
      "Bilingual corporate and product website for an agricultural commodities company serving cross-border buyers and partners.",
  },
  {
    "@type": "CreativeWork",
    "@id": `${SITE}/#client-al-mujtahid`,
    name: "Al Mujtahid",
    url: "https://almujtahidedu.com/",
    description:
      "Arabic-first study-in-Malaysia platform guiding prospective students from program discovery to an admissions enquiry.",
  },
].map((project) => ({
  ...project,
  creator: { "@id": `${SITE}/#person` },
}));

const arabicClientDescriptions = {
  [`${SITE}/#client-ncase-intelligence`]:
    "منصة استخبارات سوق ثنائية اللغة لدول الخليج تغطي تتبع المنافسين وتوليد الشخصيات الاستهلاكية والمراقبة والتقارير التنفيذية.",
  [`${SITE}/#client-ncase-consulting`]:
    "موقع استشارات ثنائي اللغة مدعوم بنظام CRM خاص للعملاء المحتملين والفعاليات والحملات والمتابعة.",
  [`${SITE}/#client-al-ghufran`]:
    "موقع استشارات تعليمية يبدأ بالعربية ويعرض خدمات الدراسة والجامعات وأدلة الثقة ومساراً واضحاً للاستشارة.",
  [`${SITE}/#client-abdul-hai-trading`]:
    "موقع مؤسسي وتجاري ثنائي اللغة لشركة سلع زراعية تخدم المشترين والشركاء عبر الأسواق الدولية.",
  [`${SITE}/#client-al-mujtahid`]:
    "منصة عربية للدراسة في ماليزيا تقود الطالب من استكشاف البرامج إلى إرسال طلب استشارة للقبول.",
};

const copy = {
  en: {
    lang: "en",
    dir: "ltr",
    locale: "en_US",
    alternateLocale: "ar_AR",
    url: `${SITE}/`,
    title: "Ibrahem Ahmed Hassan Adam | Sudanese AI Engineer & KanyouAI Founder",
    description:
      "Sudanese AI engineer and KanyouAI founder and CEO building custom AI products, RAG assistants, AI agents, automation, and internal business systems for companies.",
    ogDescription:
      "Custom AI products, RAG assistants, agents, automation, and internal systems built from business problem to production.",
    image: `${SITE}/og-image.png`,
    imageWidth: 1200,
    imageHeight: 630,
    imageAlt: "Ibrahem Ahmed Hassan Adam, Sudanese AI engineer and founder and CEO of KanyouAI",
    personName: "Ibrahem Ahmed Hassan",
    alternateName: [
      "Ibrahem Ahmed Hassan Adam",
      "Ibrahim Ahmed Hassan Adam",
      "Ibrahim Ahmed Hassan",
      "Ibrahem Ahmed",
      "Ibrahim Ahmed",
      "Ibrahem",
      "Ibrahim",
      "إبراهيم أحمد حسن أدم",
      "ابراهيم أحمد حسن أدم",
      "إبراهيم أحمد حسن",
      "ابراهيم أحمد حسن",
      "إبراهيم أحمد",
      "ابراهيم أحمد",
      "إبراهيم احمد",
    ],
    personDescription:
      "Ibrahem Ahmed Hassan Adam is a Sudanese AI engineer, and the founder and CEO of KanyouAI and an AI Engineering student at Multimedia University Malaysia. Builds custom AI products, RAG assistants, AI agents, automation, and internal business systems for companies.",
    companyDescription:
      "UK-registered AI development company building custom AI products, RAG assistants, AI agents, automation, and internal business systems.",
    faq: [
      [
        "What is Ibrahem Ahmed Hassan's full name?",
        "My full name is Ibrahem Ahmed Hassan Adam, also written Ibrahim Ahmed Hassan Adam. I am usually found online as Ibrahem Ahmed Hassan, Ibrahem Ahmed, or Ibrahem.",
      ],
      [
        "What does Ibrahem Ahmed Hassan do?",
        "I design and build AI products, internal business systems, and AI agents end to end: product structure, interfaces, databases, AI integration, automation, and deployment.",
      ],
      [
        "What is KanyouAI?",
        "KanyouAI is a UK-registered AI development company I founded to close the gap between AI strategy and implementation. We build custom systems around how a business actually works.",
      ],
      [
        "What kind of projects do you take on?",
        "AI product development, internal systems such as CRMs and dashboards, AI assistants and agents connected to real operations, and ongoing technical product partnership.",
      ],
      [
        "Can you build a RAG assistant or AI agent for my company?",
        "Yes. I build RAG assistants grounded in company websites and documents, AI agents connected to business data and tools, and the interfaces, permissions, analytics, and deployment needed to use them safely.",
      ],
      [
        "How does a project start?",
        "With a 30-minute call. You describe what your business does, where the process fails, and what the system should handle. From there I define the first useful version and a focused scope.",
      ],
      [
        "Where are you based and do you work remotely?",
        "I am based in Malaysia, studying AI Engineering at Multimedia University, and work remotely with clients worldwide, including the Gulf region.",
      ],
    ],
  },
  ar: {
    lang: "ar",
    dir: "rtl",
    locale: "ar_AR",
    alternateLocale: "en_US",
    url: `${SITE}/ar/`,
    title: "إبراهيم أحمد حسن أدم | مهندس ذكاء اصطناعي سوداني ومؤسس KanyouAI",
    description:
      "مهندس ذكاء اصطناعي سوداني، مؤسس والرئيس التنفيذي لشركة KanyouAI. أبني منتجات ووكلاء ذكاء اصطناعي وأنظمة RAG وأتمتة وأنظمة أعمال مخصصة للشركات.",
    ogDescription:
      "تطوير منتجات ذكاء اصطناعي ووكلاء وأنظمة RAG وأتمتة وأنظمة أعمال مخصصة، من مشكلة العمل حتى الإطلاق.",
    image: `${SITE}/og-image-ar.png`,
    imageWidth: 1731,
    imageHeight: 909,
    imageAlt: "إبراهيم أحمد حسن أدم، مهندس ذكاء اصطناعي سوداني ومؤسس KanyouAI",
    personName: "إبراهيم أحمد حسن",
    alternateName: [
      "إبراهيم أحمد حسن أدم",
      "ابراهيم أحمد حسن أدم",
      "ابراهيم أحمد حسن",
      "إبراهيم أحمد",
      "ابراهيم أحمد",
      "إبراهيم احمد",
      "Ibrahem Ahmed Hassan Adam",
      "Ibrahim Ahmed Hassan Adam",
      "Ibrahem Ahmed Hassan",
      "Ibrahim Ahmed Hassan",
      "Ibrahem Ahmed",
      "Ibrahim Ahmed",
      "Ibrahem",
      "Ibrahim",
    ],
    personDescription:
      "إبراهيم أحمد حسن أدم مهندس ذكاء اصطناعي سوداني، ومؤسس والرئيس التنفيذي لشركة KanyouAI، وطالب هندسة ذكاء اصطناعي في جامعة الوسائط المتعددة بماليزيا. يبني منتجات ووكلاء وأنظمة RAG وأتمتة وأنظمة أعمال مخصصة للشركات.",
    companyDescription:
      "شركة تطوير ذكاء اصطناعي مسجلة في المملكة المتحدة تبني منتجات ووكلاء وأنظمة RAG وأتمتة وأنظمة أعمال مخصصة.",
    faq: [
      [
        "ما الاسم الكامل لإبراهيم أحمد حسن؟",
        "الاسم الكامل هو إبراهيم أحمد حسن أدم، ويُكتب أيضاً ابراهيم أحمد حسن أدم. يُعرف اختصاراً باسم إبراهيم أحمد حسن أو إبراهيم أحمد.",
      ],
      [
        "من هو إبراهيم أحمد حسن؟",
        "إبراهيم أحمد حسن مهندس ذكاء اصطناعي ومؤسس KanyouAI، وهي شركة ذكاء اصطناعي مسجلة في المملكة المتحدة. يدرس هندسة الذكاء الاصطناعي في جامعة الوسائط المتعددة بماليزيا ويبني منتجات وأنظمة للشركات.",
      ],
      [
        "ما خدمات تطوير الذكاء الاصطناعي التي تقدمها للشركات؟",
        "أطوّر منتجات SaaS مدعومة بالذكاء الاصطناعي، وأنظمة CRM ولوحات تحكم، ووكلاء ومساعدين بتقنية RAG، وأتمتة متصلة ببيانات الشركة وأدواتها.",
      ],
      [
        "هل يمكنك بناء وكيل ذكاء اصطناعي أو مساعد RAG لشركتي؟",
        "نعم. أبني مساعدين يستندون إلى مواقع الشركة ووثائقها وبياناتها، مع الصلاحيات والواجهات والتحليلات والتكاملات والنشر المطلوب للاستخدام الفعلي.",
      ],
      [
        "ما هي KanyouAI؟",
        "KanyouAI شركة ذكاء اصطناعي مسجلة في المملكة المتحدة أسستها لتحويل احتياجات الشركات إلى أنظمة مخصصة قابلة للاستخدام، من استراتيجية المنتج حتى التنفيذ والإطلاق.",
      ],
      [
        "كيف يبدأ مشروع تطوير الذكاء الاصطناعي؟",
        "يبدأ بمكالمة مدتها 30 دقيقة لفهم عمل الشركة وموقع المشكلة والنتيجة المطلوبة. بعدها أحدد أول نسخة مفيدة ونطاقاً واضحاً للتنفيذ.",
      ],
      [
        "هل تعمل مع شركات في الخليج والسودان وماليزيا؟",
        "نعم. أعمل عن بعد مع شركات ومؤسسين حول العالم، بما في ذلك السعودية ودول الخليج والسودان وماليزيا.",
      ],
    ],
  },
};

const buildGraph = (locale) => {
  const data = copy[locale];
  const localizedProjects = projectNodes.map((project) => ({
    ...project,
    description: locale === "ar" ? arabicProjectDescriptions[project["@id"]] : project.description,
    inLanguage: data.lang,
  }));
  const localizedClients = clientNodes.map((project) => ({
    ...project,
    description: locale === "ar" ? arabicClientDescriptions[project["@id"]] : project.description,
    inLanguage: data.lang,
  }));
  const localizedServices = serviceNodes.map((service) => ({
    ...service,
    name: locale === "ar" ? arabicServiceNames[service["@id"]] : service.name,
    serviceType: locale === "ar" ? arabicServiceNames[service["@id"]] : service.serviceType,
    description: locale === "ar" ? arabicServiceDescriptions[service["@id"]] : service.description,
    inLanguage: data.lang,
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE}/#person`,
        name: data.personName,
        alternateName: data.alternateName,
        givenName: "Ibrahem",
        additionalName: "Ahmed Hassan",
        familyName: "Adam",
        jobTitle:
          locale === "ar"
            ? "مهندس ذكاء اصطناعي، مؤسس والرئيس التنفيذي لشركة KanyouAI"
            : "AI Engineer, Founder and CEO of KanyouAI",
        description: data.personDescription,
        url: `${SITE}/`,
        image: `${SITE}/og-image.png`,
        email: "mailto:hello@ibrahemahmed.com",
        sameAs: [
          "https://github.com/ibrahembuilds",
          "https://www.linkedin.com/in/ibrahem-ahmed-hassan/",
          "https://x.com/ibrahembuilds",
          "https://www.instagram.com/ibrahembuilds",
          "https://kanyouai.com",
        ],
        worksFor: { "@id": "https://kanyouai.com/#organization" },
        affiliation: {
          "@type": "CollegeOrUniversity",
          name: "Multimedia University",
          url: "https://www.mmu.edu.my/",
          address: { "@type": "PostalAddress", addressCountry: "MY" },
        },
        homeLocation: { "@type": "Country", name: "Malaysia" },
        nationality: { "@type": "Country", name: locale === "ar" ? "السودان" : "Sudan" },
        knowsLanguage: [
          { "@type": "Language", name: "English", alternateName: "en" },
          { "@type": "Language", name: "Arabic", alternateName: "ar" },
        ],
        knowsAbout: [
          "Artificial Intelligence Engineering",
          "AI Product Development",
          "Retrieval-Augmented Generation",
          "AI Agents",
          "Business Process Automation",
          "Internal Business Systems",
          "Full-Stack Software Development",
        ],
        hasOccupation: [
          {
            "@type": "Occupation",
            name: locale === "ar" ? "مهندس ذكاء اصطناعي" : "AI Engineer",
          },
          {
            "@type": "Occupation",
            name: locale === "ar" ? "مؤسس" : "Founder",
          },
          {
            "@type": "Occupation",
            name: locale === "ar" ? "الرئيس التنفيذي" : "CEO",
          },
        ],
        award: [
          "#1 AI Researcher & Innovator in Sudan (Favikon, 2025)",
          "#461 AI Researcher Worldwide (Favikon, 2025)",
        ],
      },
      {
        "@type": "Organization",
        "@id": "https://kanyouai.com/#organization",
        name: "KanyouAI",
        url: "https://kanyouai.com",
        description: data.companyDescription,
        founder: { "@id": `${SITE}/#person` },
        address: { "@type": "PostalAddress", addressCountry: "GB" },
        knowsAbout: [
          "AI product development",
          "RAG assistants",
          "AI agents",
          "business automation",
          "internal software systems",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: locale === "ar" ? "الخدمات" : "Services",
          itemListElement: serviceNodes.map((service) => ({ "@id": service["@id"] })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: `${SITE}/`,
        name: "Ibrahem Ahmed Hassan",
        alternateName: "إبراهيم أحمد حسن",
        publisher: { "@id": `${SITE}/#person` },
        inLanguage: ["en", "ar"],
      },
      {
        "@type": "ProfilePage",
        "@id": `${data.url}#webpage`,
        url: data.url,
        name: data.title,
        description: data.description,
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": `${SITE}/#person` },
        mainEntity: { "@id": `${SITE}/#person` },
        dateModified: "2026-07-20",
        inLanguage: data.lang,
        hasPart: [...projectNodes, ...clientNodes, ...serviceNodes].map((node) => ({ "@id": node["@id"] })),
      },
      {
        "@type": "FAQPage",
        "@id": `${data.url}#faq`,
        url: `${data.url}#faq`,
        inLanguage: data.lang,
        mainEntity: data.faq.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${data.url}#selected-work`,
        name: locale === "ar" ? "أعمال إبراهيم أحمد حسن المختارة" : "Selected work by Ibrahem Ahmed Hassan",
        numberOfItems: projectNodes.length,
        itemListElement: projectNodes.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: { "@id": project["@id"] },
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${data.url}#client-work`,
        name: locale === "ar" ? "مشاريع العملاء" : "Client work",
        numberOfItems: clientNodes.length,
        itemListElement: clientNodes.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: { "@id": project["@id"] },
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${data.url}#services`,
        name: locale === "ar" ? "خدمات KanyouAI" : "Services offered by KanyouAI",
        numberOfItems: serviceNodes.length,
        itemListElement: serviceNodes.map((service, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: { "@id": service["@id"] },
        })),
      },
      ...localizedProjects,
      ...localizedClients,
      ...localizedServices,
    ],
  };
};

const escapeAttribute = (value) =>
  value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export const buildSeoBlock = (locale = "en") => {
  const data = copy[locale];
  const structuredData = JSON.stringify(buildGraph(locale), null, 2).replaceAll("<", "\\u003c");

  return `    <title>${data.title}</title>
    <meta name="title" content="${escapeAttribute(data.title)}" />
    <meta name="description" content="${escapeAttribute(data.description)}" />
    <meta name="author" content="Ibrahem Ahmed Hassan" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${data.url}" />
    <link rel="alternate" hreflang="en" href="${SITE}/" />
    <link rel="alternate" hreflang="ar" href="${SITE}/ar/" />
    <link rel="alternate" hreflang="x-default" href="${SITE}/" />
    <link rel="me" href="https://github.com/ibrahembuilds" />
    <link rel="me" href="https://www.linkedin.com/in/ibrahem-ahmed-hassan/" />
    <link rel="me" href="https://x.com/ibrahembuilds" />
    <link rel="me" href="https://www.instagram.com/ibrahembuilds" />

    <meta property="og:type" content="profile" />
    <meta property="og:url" content="${data.url}" />
    <meta property="og:title" content="${escapeAttribute(data.title)}" />
    <meta property="og:description" content="${escapeAttribute(data.ogDescription)}" />
    <meta property="og:image" content="${data.image}" />
    <meta property="og:image:width" content="${data.imageWidth}" />
    <meta property="og:image:height" content="${data.imageHeight}" />
    <meta property="og:image:alt" content="${escapeAttribute(data.imageAlt)}" />
    <meta property="og:site_name" content="Ibrahem Ahmed Hassan" />
    <meta property="og:locale" content="${data.locale}" />
    <meta property="og:locale:alternate" content="${data.alternateLocale}" />
    <meta property="profile:first_name" content="Ibrahem" />
    <meta property="profile:last_name" content="Ahmed Hassan" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${data.url}" />
    <meta name="twitter:title" content="${escapeAttribute(data.title)}" />
    <meta name="twitter:description" content="${escapeAttribute(data.ogDescription)}" />
    <meta name="twitter:image" content="${data.image}" />
    <meta name="twitter:image:alt" content="${escapeAttribute(data.imageAlt)}" />
    <meta name="twitter:creator" content="@ibrahembuilds" />
    <meta name="twitter:site" content="@ibrahembuilds" />

    <script id="structured-data" type="application/ld+json">
${structuredData}
    </script>`;
};

export const locales = copy;
