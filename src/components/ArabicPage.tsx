import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpLeft,
  Bot,
  Github,
  Globe2,
  Handshake,
  Instagram,
  Layers,
  Linkedin,
  Mail,
  Menu,
  MonitorCog,
  Plus,
  Twitter,
  X,
} from "lucide-react";
import profile from "../assets/profile-new.jpeg";
import { ArabicClientWork } from "./ClientWork";
import Hero3D from "./Hero3D";

const CALENDLY = "https://calendly.com/ibrahem/conselting";
const EMAIL = "hello@ibrahemahmed.com";

type Project = {
  title: string;
  type: string;
  problem: string;
  built: string;
  role: string;
  href?: string;
  linkType?: "live" | "source";
  image?: string;
  imageAlt?: string;
};

const navLinks = [
  { href: "#work", label: "الأعمال" },
  { href: "#clients", label: "العملاء" },
  { href: "#services", label: "الخدمات" },
  { href: "#story", label: "عنّي" },
];

const facts = [
  { value: "KanyouAI", label: "مؤسس شركة ذكاء اصطناعي مسجلة في المملكة المتحدة" },
  { value: "+20", label: "منتجاً ومستودعاً برمجياً عاماً" },
  { value: "+3", label: "سنوات في بناء أنظمة الذكاء الاصطناعي" },
  { value: "MMU", label: "طالب هندسة ذكاء اصطناعي في ماليزيا" },
];

const saasProjects: Project[] = [
  {
    title: "My AI Agent Studio",
    type: "منصة تفاعل العملاء بالذكاء الاصطناعي",
    problem:
      "تحتاج الشركات المحلية إلى إجابات دقيقة وجمع بيانات العملاء المحتملين من موقعها دون إضافة عبء خدمة عملاء يدوي جديد.",
    built:
      "منصة SaaS بلا برمجة لإنشاء مساعدين بتقنية RAG يتعلمون من المواقع والوثائق ومعلومات الشركة، مع تأهيل العملاء المحتملين وحفظ المحادثات والتحليلات وتضمين الموقع بسطر واحد.",
    role: "استراتيجية المنتج، تجربة المستخدم، التطوير الكامل، هندسة الذكاء الاصطناعي والنشر",
    href: "https://www.myaiagentstudio.io/",
    linkType: "live",
    image: "/project-agent-studio-blue.webp",
    imageAlt: "تصور لقنوات تفاعل العملاء المتصلة بمساعد ذكاء اصطناعي",
  },
  {
    title: "Boltfy",
    type: "منصة نماذج وحملات بريدية",
    problem:
      "تحتاج الشركات إلى مسار آمن واحد لجمع البيانات المنظمة وإدارة الجمهور وإرسال الحملات البريدية المستهدفة.",
    built:
      "منصة متعددة المستأجرين لبناء النماذج بالسحب والإفلات، وجمع الردود، وإدارة المشتركين، وتصميم قوالب البريد وإرسال الحملات، مع مصادقة Supabase وسياسات أمان على مستوى الصفوف.",
    role: "تصميم المنتج، التطوير الكامل، أمان قاعدة البيانات والبنية البريدية",
    href: "https://boltfy.io/",
    linkType: "live",
  },
  {
    title: "FocusFlow",
    type: "مساحة إنتاجية مدعومة بالذكاء الاصطناعي",
    problem:
      "تبقى الأهداف المعقدة منفصلة غالباً عن المهام اليومية والوقت المتاح وعادات التركيز اللازمة لإنجازها.",
    built:
      "منصة تجمع إدارة المهام وجلسات بومودورو والتخطيط بالتقويم وتحليلات التقدم وتحويل الأهداف بالذكاء الاصطناعي إلى مهام قابلة للتنفيذ.",
    role: "تصميم المنتج، تكامل الذكاء الاصطناعي، التطوير الكامل والتحليلات",
    href: "https://focusflowai.site/",
    linkType: "live",
  },
];

const openSourceProjects: Project[] = [
  {
    title: "ScrapeX",
    type: "وكيل بحث مفتوح المصدر",
    problem:
      "يتوزع البحث في الويب ومنصات التواصل بين أدوات منفصلة للتحقق من المصادر وتصدير البيانات يدوياً.",
    built:
      "منصة وكيلة تبحث في الويب ومنصات التواصل، وتنفذ الأدوات، وتعرض سير العمل لحظياً، وتنتج إجابات موثقة وتصدر بيانات منظمة.",
    role: "تصميم المنتج، المعمارية، هندسة الذكاء الاصطناعي، الخلفية والواجهة",
    href: "https://github.com/ibrahembuilds/ScrapeX",
    linkType: "source",
    image: "/project-scrapex-blue.webp",
    imageAlt: "تصور لمصادر بحث تمر عبر مسار ذكاء اصطناعي قائم على الأدلة",
  },
  {
    title: "Sudan Curriculum RAG Tutor",
    type: "منصة تعليم عربية أولاً",
    problem:
      "يحتاج طلاب المنهج السوداني إلى مدرس عربي يجيب من كتبهم الفعلية بدلاً من المعرفة العامة للنموذج.",
    built:
      "نظام تعلم يستند إلى الكتب باستخدام معالجة PDF والتضمينات المتجهية والبحث الهجين وpgvector وإجابات RAG المتدفقة.",
    role: "تطوير المنتج، معمارية الاسترجاع، تكامل الذكاء الاصطناعي والتطوير الكامل",
    href: "https://github.com/ibrahembuilds/ai-student",
    linkType: "source",
    image: "/project-ai-student-blue.webp",
    imageAlt: "تصور لمعالجة الكتب واسترجاع المعرفة وتوليد مواد تعليمية عربية",
  },
  {
    title: "VeloBrand Studio",
    type: "نظام هوية متعددة الوسائط",
    problem: "يتطلب إنشاء هوية متماسكة للنص والصورة والفيديو وملفات الإنتاج أدوات كثيرة ومنفصلة.",
    built:
      "استوديو محلي ينسق نماذج النص وتحرير الصور والفيديو لإنشاء هويات متكاملة وتصدير أصول جاهزة للإنتاج.",
    role: "تصميم المنتج، تنسيق النماذج متعددة الوسائط، الواجهة وأنظمة التصدير",
    href: "https://github.com/ibrahembuilds/velobrandstudio-",
    linkType: "source",
  },
  {
    title: "AI Web Builder",
    type: "نظام إنشاء مواقع بالذكاء الاصطناعي",
    problem: "يتطلب تحويل الفكرة إلى موقع قابل للتخصيص تنسيق المواصفات وتوليد الكود والأصول المرئية والتعديلات اليدوية.",
    built:
      "نظام يعتمد موجزاً منظماً، ويوجه الطلبات بين عدة نماذج، ويدعم تعديل الكود باللغة الطبيعية وتوليد الصور وتصدير HTML وCSS وJavaScript.",
    role: "معمارية المنتج، توجيه النماذج، توليد الكود وهندسة الواجهة",
    href: "https://github.com/ibrahembuilds/AI-web-builder-",
    linkType: "source",
  },
  {
    title: "TruthCheck",
    type: "مسار تحقق قائم على الأدلة",
    problem: "يصعب التحقق من الادعاءات متعددة الوسائط عندما ينفصل جمع الأدلة عن التحليل والتوثيق.",
    built:
      "مسار للتحقق يسترجع الأدلة ويحلل الادعاءات ويتحقق من المخرجات المنظمة للنموذج وينشئ تقارير موثقة بالمصادر.",
    role: "تصميم مسار الذكاء الاصطناعي، استرجاع الأدلة، التحقق وإنشاء التقارير",
    href: "https://github.com/ibrahembuilds/TruthCheck",
    linkType: "source",
  },
  {
    title: "YT Studio",
    type: "ذكاء محتوى YouTube",
    problem: "يصعب البحث داخل الفيديوهات الطويلة وتلخيص معلوماتها والعودة إليها وإعادة استخدامها بكفاءة.",
    built:
      "مساحة معرفة تستخرج نصوصاً مرتبطة بالتوقيت، وتجيب عن محتوى الفيديو، وتولد ملخصات متعددة وتحدد لحظات مناسبة للمحتوى القصير.",
    role: "تصميم المنتج، معالجة النصوص، مسارات الذكاء الاصطناعي والتطوير الكامل",
    href: "https://github.com/ibrahembuilds/youtube-",
    linkType: "source",
  },
];

const services = [
  {
    icon: Layers,
    title: "تطوير منتجات الذكاء الاصطناعي",
    copy: "منتجات SaaS وتطبيقات مدعومة بالذكاء الاصطناعي، من تحديد النطاق إلى إصدار يعمل في السوق.",
  },
  {
    icon: MonitorCog,
    title: "أنظمة الأعمال الداخلية",
    copy: "أنظمة CRM ولوحات تحكم وبوابات ومسارات عمل تستبدل الجداول والأدوات المنفصلة.",
  },
  {
    icon: Bot,
    title: "وكلاء ومساعدون بتقنية RAG",
    copy: "مساعدون متصلون بمعرفة الشركة وبياناتها وقنوات العملاء وأدوات التشغيل الفعلية.",
  },
  {
    icon: Handshake,
    title: "شراكة تقنية للمنتج",
    copy: "تحديد النطاق والمعمارية والنماذج الأولية والتطوير الأسبوعي والاستعداد للإطلاق.",
  },
];

const milestones = [
  { year: "2023", title: "بدأت البرمجة", body: "تعلمت بناء البرمجيات ذاتياً ونشرت أول مشاريعي العامة في العام نفسه." },
  { year: "2024", title: "بنيت علناً ولعملاء حقيقيين", body: "نشرت أكثر من 20 منتجاً ومستودعاً وطورت أنظمة لمؤسسات معروفة." },
  { year: "2025", title: "أسست KanyouAI", body: "سجلت الشركة في المملكة المتحدة لبناء منتجات ذكاء اصطناعي وأنظمة أعمال متكاملة." },
  { year: "الآن", title: "أدرس هندسة الذكاء الاصطناعي في MMU", body: "أدرس في جامعة الوسائط المتعددة بماليزيا وأدير KanyouAI وأواصل تطوير منتجاتي." },
];

const processSteps = [
  { title: "فهم العملية", body: "نحدد المستخدمين ومواقع التأخير والأخطاء والقرارات البشرية والنتيجة المهمة للعمل." },
  { title: "تحديد أول نسخة مفيدة", body: "أحوّل الفكرة إلى مشكلة واضحة ونطاق مركز يمكن اختباره دون خصائص غير ضرورية." },
  { title: "التصميم والبناء", body: "أحدد الأدوار والبيانات وسلوك الذكاء الاصطناعي والتكاملات والمعمارية، ثم أعرض برنامجاً يعمل على مراحل." },
  { title: "الاختبار والإطلاق والتحسين", body: "نختبر الاستخدامات الواقعية وحالات الفشل، ثم ننشر المنتج ونحسنه وفق بيانات الاستخدام." },
];

export const arabicFaqs = [
  {
    q: "ما الاسم الكامل لإبراهيم أحمد حسن؟",
    a: "الاسم الكامل هو إبراهيم أحمد حسن أدم، ويُكتب أيضاً ابراهيم أحمد حسن أدم. يُعرف اختصاراً باسم إبراهيم أحمد حسن أو إبراهيم أحمد.",
  },
  {
    q: "من هو إبراهيم أحمد حسن؟",
    a: "إبراهيم أحمد حسن مهندس ذكاء اصطناعي ومؤسس KanyouAI، وهي شركة ذكاء اصطناعي مسجلة في المملكة المتحدة. يدرس هندسة الذكاء الاصطناعي في جامعة الوسائط المتعددة بماليزيا ويبني منتجات وأنظمة للشركات.",
  },
  {
    q: "ما خدمات تطوير الذكاء الاصطناعي التي تقدمها للشركات؟",
    a: "أطوّر منتجات SaaS مدعومة بالذكاء الاصطناعي، وأنظمة CRM ولوحات تحكم، ووكلاء ومساعدين بتقنية RAG، وأتمتة متصلة ببيانات الشركة وأدواتها.",
  },
  {
    q: "هل يمكنك بناء وكيل ذكاء اصطناعي أو مساعد RAG لشركتي؟",
    a: "نعم. أبني مساعدين يستندون إلى مواقع الشركة ووثائقها وبياناتها، مع الصلاحيات والواجهات والتحليلات والتكاملات والنشر المطلوب للاستخدام الفعلي.",
  },
  {
    q: "ما هي KanyouAI؟",
    a: "KanyouAI شركة ذكاء اصطناعي مسجلة في المملكة المتحدة أسستها لتحويل احتياجات الشركات إلى أنظمة مخصصة قابلة للاستخدام، من استراتيجية المنتج حتى التنفيذ والإطلاق.",
  },
  {
    q: "كيف يبدأ مشروع تطوير الذكاء الاصطناعي؟",
    a: "يبدأ بمكالمة مدتها 30 دقيقة لفهم عمل الشركة وموقع المشكلة والنتيجة المطلوبة. بعدها أحدد أول نسخة مفيدة ونطاقاً واضحاً للتنفيذ.",
  },
  {
    q: "هل تعمل مع شركات في الخليج والسودان وماليزيا؟",
    a: "نعم. أعمل عن بعد مع شركات ومؤسسين حول العالم، بما في ذلك السعودية ودول الخليج والسودان وماليزيا.",
  },
];

const ArabicNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="shell">
        <div className="flex h-16 items-center justify-between gap-5">
          <a href="#top" className="text-base font-bold">
            إبراهيم أحمد<span className="text-primary">.</span>
          </a>
          <nav className="hidden items-center gap-7 md:flex" aria-label="التنقل الرئيسي">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-muted transition-colors hover:text-foreground">
                {link.label}
              </a>
            ))}
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap rounded-full bg-primary px-5 py-2 text-[13px] font-semibold text-primary-foreground transition-[background-color,transform] hover:bg-primary-strong active:translate-y-px"
            >
              اعمل معي
            </a>
          </nav>
          <button
            className="rounded-full p-2 transition-colors hover:bg-primary-tint md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={open}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
        {open && (
          <nav className="flex flex-col border-t border-border px-4 pb-4 pt-1 md:hidden" aria-label="التنقل للجوال">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="border-b border-border py-3 text-base">
                {link.label}
              </a>
            ))}
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="pt-4 font-semibold text-primary">
              اعمل معي
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};

const ProjectAction = ({ project }: { project: Project }) => (
  <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
    {project.linkType === "source" ? <Github size={15} aria-hidden="true" /> : <Globe2 size={15} aria-hidden="true" />}
    {project.linkType === "source" ? "عرض المصدر على GitHub" : "زيارة المنتج"}
    <ArrowUpLeft size={14} aria-hidden="true" />
  </span>
);

const ArabicHero = () => (
  <section id="top" className="flex min-h-[100dvh] items-center pb-16 pt-24 md:pb-20">
    <div className="shell grid w-full items-center gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="text-center lg:col-span-7">
        <p className="anim-up text-sm font-semibold text-primary">مؤسس KanyouAI · مهندس ذكاء اصطناعي</p>
        <h1 className="anim-up mt-5 text-5xl font-bold leading-[1.14] [animation-delay:0.07s] sm:text-6xl lg:text-7xl">
          <span className="block">أنظمة ذكاء اصطناعي</span>
          <span className="block text-primary">لأعمال حقيقية.</span>
        </h1>
        <p className="anim-up mx-auto mt-7 max-w-[44ch] text-lg leading-[1.9] text-muted [animation-delay:0.14s]">
          أصمم وأطلق منتجات ووكلاء وبرمجيات داخلية للمؤسسين والشركات النامية.
        </p>
        <div className="anim-up mt-9 flex flex-wrap items-center justify-center gap-3 [animation-delay:0.21s]">
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-primary px-7 py-3.5 text-[15px] font-semibold text-primary-foreground transition-[background-color,transform] hover:bg-primary-strong active:translate-y-px"
          >
            اعمل معي <ArrowLeft size={17} aria-hidden="true" />
          </a>
          <a href="#work" className="whitespace-nowrap rounded-full border border-border-strong bg-surface px-7 py-3.5 text-[15px] font-semibold transition-[border-color,color,transform] hover:border-primary hover:text-primary active:translate-y-px">
            استعرض الأعمال
          </a>
        </div>
      </div>
      <figure className="anim-up relative mx-auto w-full max-w-[430px] [animation-delay:0.14s] lg:col-span-5 lg:ml-0">
        <div className="absolute -bottom-5 -left-5 h-full w-full rounded-xl bg-primary-tint" aria-hidden="true" />
        <Hero3D className="-top-10 -right-10 h-40 w-40 sm:h-48 sm:w-48" />
        <img
          src={profile}
          alt="إبراهيم أحمد حسن، مهندس ذكاء اصطناعي ومؤسس KanyouAI"
          width={800}
          height={1000}
          loading="eager"
          className="relative aspect-[4/5] w-full rounded-xl border border-border object-cover object-top shadow-card"
        />
        <figcaption className="relative mt-6 grid grid-cols-2 gap-5 text-sm leading-relaxed">
          <p className="border-t border-border-strong pt-3 text-muted">مؤسس <bdi dir="ltr" className="font-semibold text-foreground">KanyouAI</bdi></p>
          <p className="border-t border-border-strong pt-3 text-muted">هندسة الذكاء الاصطناعي في <bdi dir="ltr" className="font-semibold text-foreground">MMU</bdi></p>
        </figcaption>
      </figure>
    </div>
  </section>
);

const ArabicGlance = () => (
  <section className="border-y border-border" aria-label="نبذة سريعة">
    <div className="shell">
      <h2 className="sr-only">نبذة سريعة</h2>
      <dl className="grid grid-cols-2 lg:grid-cols-4">
        {facts.map((fact, index) => (
          <div
            key={fact.value}
            data-reveal
            className={`flex min-h-36 flex-col justify-end border-border py-7 odd:pl-5 even:border-r even:pr-5 lg:min-h-40 lg:border-r lg:border-t-0 lg:px-7 lg:first:border-r-0 lg:first:pr-0 ${index >= 2 ? "border-t" : ""}`}
            style={{ "--reveal-delay": `${index * 0.05}s` } as React.CSSProperties}
          >
            <dt className="order-2 mt-2 max-w-[23ch] text-sm leading-relaxed text-muted">{fact.label}</dt>
            <dd className="order-1 text-2xl font-bold text-primary md:text-3xl" dir={fact.value === "KanyouAI" || fact.value === "MMU" ? "ltr" : undefined}>
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  </section>
);

const ArabicWork = () => {
  const flagship = saasProjects[0];
  const featuredOpenSource = openSourceProjects.slice(0, 2);
  const openSourceIndex = openSourceProjects.slice(2);

  return (
    <section id="work" className="py-24 md:py-32">
      <div className="shell">
        <h2 className="mx-auto max-w-[19ch] text-center text-4xl font-bold leading-[1.2] md:text-5xl" data-reveal>
          منتجات في السوق. وكود متاح للجميع.
        </h2>
        <p className="mx-auto mt-5 max-w-[62ch] text-center text-lg leading-[1.9] text-muted" data-reveal>
          منتجات SaaS أديرها وأنظمة مفتوحة المصدر يمكنك تشغيلها وقراءة كودها وتقييمها مباشرة.
        </p>

        <div className="mt-16">
          <h3 className="text-center text-2xl font-bold md:text-3xl" data-reveal>منتجات SaaS أملكها</h3>
          <a
            href={flagship.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 grid overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-[box-shadow,transform] hover:shadow-card-hover active:translate-y-px lg:grid-cols-[1.2fr_0.8fr]"
            data-reveal
          >
            <figure className="min-h-[310px] overflow-hidden bg-foreground lg:min-h-[520px]">
              <img src={flagship.image} alt={flagship.imageAlt} width={1536} height={1024} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]" />
            </figure>
            <div className="flex flex-col p-7 md:p-10">
              <p className="text-sm font-medium text-muted">{flagship.type}</p>
              <h4 className="mt-3 text-3xl font-bold transition-colors group-hover:text-primary md:text-4xl" dir="ltr">{flagship.title}</h4>
              <div className="mt-8 space-y-5 text-[15px] leading-[1.9] text-muted">
                <p><b className="mb-1 block font-semibold text-foreground">المشكلة</b>{flagship.problem}</p>
                <p><b className="mb-1 block font-semibold text-foreground">ما الذي بنيته</b>{flagship.built}</p>
              </div>
              <div className="mt-auto pt-9">
                <p className="border-t border-border pt-4 text-sm leading-relaxed text-muted">{flagship.role}</p>
                <p className="mt-5"><ProjectAction project={flagship} /></p>
              </div>
            </div>
          </a>

          <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {saasProjects.slice(1).map((project, index) => (
              <a key={project.title} href={project.href} target="_blank" rel="noopener noreferrer" className="group border-t border-border-strong pt-7 transition-transform active:translate-y-px" data-reveal style={{ "--reveal-delay": `${index * 0.06}s` } as React.CSSProperties}>
                <p className="text-sm font-medium text-muted">{project.type}</p>
                <div className="mt-2 flex items-start justify-between gap-5">
                  <h4 className="text-3xl font-bold transition-colors group-hover:text-primary" dir="ltr">{project.title}</h4>
                  <ArrowUpLeft size={22} className="mt-1 shrink-0 text-muted transition-[color,transform] group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:text-primary" aria-hidden="true" />
                </div>
                <p className="mt-5 text-[15px] leading-[1.9] text-muted">{project.built}</p>
                <p className="mt-5 text-sm leading-relaxed text-muted">{project.role}</p>
                <p className="mt-4"><ProjectAction project={project} /></p>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-28 md:mt-36">
          <h3 className="text-center text-2xl font-bold md:text-3xl" data-reveal>أنظمة مفتوحة المصدر</h3>
          <p className="mx-auto mt-3 max-w-[58ch] text-center leading-[1.9] text-muted" data-reveal>الكود متاح على GitHub. يمكنك تشغيله وقراءته وتقييم جودة الهندسة مباشرة.</p>
          <div className="mt-9 grid gap-5 lg:grid-cols-12">
            {featuredOpenSource.map((project, index) => (
              <a key={project.title} href={project.href} target="_blank" rel="noopener noreferrer" className={`group overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-[box-shadow,transform] hover:shadow-card-hover active:translate-y-px ${index === 0 ? "lg:col-span-7" : "lg:col-span-5"}`} data-reveal style={{ "--reveal-delay": `${index * 0.06}s` } as React.CSSProperties}>
                <figure className="aspect-[16/10] overflow-hidden bg-foreground">
                  <img src={project.image} alt={project.imageAlt} width={1536} height={1024} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]" />
                </figure>
                <div className="p-7 md:p-8">
                  <p className="text-sm font-medium text-muted">{project.type}</p>
                  <div className="mt-2 flex items-start justify-between gap-4">
                    <h4 className="text-2xl font-bold transition-colors group-hover:text-primary md:text-3xl" dir="ltr">{project.title}</h4>
                    <ArrowUpLeft size={21} className="mt-1 shrink-0 text-muted group-hover:text-primary" aria-hidden="true" />
                  </div>
                  <p className="mt-5 text-[15px] leading-[1.9] text-muted">{project.built}</p>
                  <p className="mt-5"><ProjectAction project={project} /></p>
                </div>
              </a>
            ))}
          </div>
          <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {openSourceIndex.map((project, index) => (
              <a key={project.title} href={project.href} target="_blank" rel="noopener noreferrer" className="group border-r-2 border-primary/20 pr-5 transition-[border-color,transform] hover:border-primary active:translate-y-px" data-reveal style={{ "--reveal-delay": `${(index % 2) * 0.06}s` } as React.CSSProperties}>
                <p className="text-sm font-medium text-muted">{project.type}</p>
                <div className="mt-2 flex items-start justify-between gap-4">
                  <h4 className="text-xl font-bold transition-colors group-hover:text-primary md:text-2xl" dir="ltr">{project.title}</h4>
                  <ArrowUpLeft size={18} className="mt-1 shrink-0 text-muted group-hover:text-primary" aria-hidden="true" />
                </div>
                <p className="mt-4 text-[15px] leading-[1.9] text-muted">{project.built}</p>
                <p className="mt-4"><ProjectAction project={project} /></p>
              </a>
            ))}
          </div>
          <a href="https://github.com/ibrahembuilds" target="_blank" rel="noopener noreferrer" className="mt-12 inline-flex items-center gap-2 whitespace-nowrap text-[15px] font-semibold text-primary hover:text-primary-strong">
            استعرض جميع المشاريع على GitHub <ArrowUpLeft size={16} aria-hidden="true" />
          </a>
        </div>

      </div>
    </section>
  );
};

const ArabicServices = () => (
  <section id="services" className="border-y border-border bg-primary-tint py-24 md:py-32">
    <div className="shell grid items-start gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
      <div className="text-center lg:sticky lg:top-28">
        <p className="text-sm font-semibold text-primary" data-reveal dir="ltr">KanyouAI</p>
        <h2 className="mx-auto mt-4 max-w-[17ch] text-4xl font-bold leading-[1.2] md:text-5xl" data-reveal>تطوير ذكاء اصطناعي مخصص للشركات.</h2>
        <p className="mx-auto mt-6 max-w-[52ch] leading-[1.9] text-muted" data-reveal>
          أسست KanyouAI لتحويل مشكلات التشغيل إلى برمجيات كاملة، من أول نسخة مفيدة حتى الإطلاق والتحسين.
        </p>
        <a href="https://kanyouai.com" target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 whitespace-nowrap text-[15px] font-semibold text-primary hover:text-primary-strong" data-reveal>
          استكشف KanyouAI <ArrowUpLeft size={16} aria-hidden="true" />
        </a>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {services.map((service, index) => (
          <article key={service.title} className="rounded-xl border border-border bg-surface p-6 shadow-card transition-shadow hover:shadow-card-hover" data-reveal style={{ "--reveal-delay": `${index * 0.05}s` } as React.CSSProperties}>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground"><service.icon size={19} aria-hidden="true" /></span>
            <h3 className="mt-5 text-xl font-semibold leading-relaxed">{service.title}</h3>
            <p className="mt-3 text-[15px] leading-[1.9] text-muted">{service.copy}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const ArabicStory = () => (
  <section id="story" className="py-24 md:py-32">
    <div className="shell grid items-start gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
      <div className="text-center lg:sticky lg:top-28">
        <h2 className="mx-auto max-w-[17ch] text-4xl font-bold leading-[1.2] md:text-5xl" data-reveal>مهندس يبني المنتج كاملاً، لا نموذجاً تجريبياً فقط.</h2>
        <p className="mx-auto mt-6 max-w-[52ch] leading-[1.9] text-muted" data-reveal>
          أعمل عبر هيكل المنتج والواجهات وقواعد البيانات وتكاملات الذكاء الاصطناعي والأتمتة والنشر والتحسين المستمر.
        </p>
        <p className="mx-auto mt-9 max-w-fit rounded-xl border border-border bg-primary-tint p-5 text-sm leading-[1.9]" data-reveal>
          <b className="ml-2 text-lg text-primary">#1</b> باحث ذكاء اصطناعي في السودان، والمرتبة #461 عالمياً حسب Favikon لعام 2025.
        </p>
      </div>
      <ol className="relative border-r-2 border-border-strong pr-9 sm:pr-11">
        {milestones.map((milestone, index) => (
          <li key={milestone.year} className="relative pb-14 last:pb-0" data-reveal style={{ "--reveal-delay": `${index * 0.05}s` } as React.CSSProperties}>
            <span className="absolute -right-[47px] top-0 grid h-6 w-6 place-items-center rounded-full border-2 border-primary bg-background sm:-right-[57px]">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            </span>
            <span className="font-mono text-2xl font-bold tracking-tight text-primary md:text-3xl">{milestone.year}</span>
            <h3 className="mt-2 text-xl font-semibold">{milestone.title}</h3>
            <p className="mt-2 max-w-[54ch] text-[15px] leading-[1.9] text-muted">{milestone.body}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

const ArabicProcess = () => (
  <section id="process" className="border-t border-border py-24 md:py-32">
    <div className="shell">
      <h2 className="mx-auto max-w-[18ch] text-center text-4xl font-bold leading-[1.2] md:text-5xl" data-reveal>مسار واضح من مشكلة العمل إلى منتج جاهز.</h2>
      <ol className="mt-14 grid gap-x-16 md:grid-cols-2">
        {processSteps.map((step, index) => (
          <li key={step.title} className={`border-t border-border-strong py-8 md:py-10 ${index % 2 === 1 ? "md:translate-y-12" : ""}`} data-reveal style={{ "--reveal-delay": `${(index % 2) * 0.06}s` } as React.CSSProperties}>
            <h3 className="max-w-[20ch] text-2xl font-semibold leading-[1.45]">{step.title}</h3>
            <p className="mt-4 max-w-[48ch] text-[15px] leading-[1.9] text-muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

const ArabicFaq = () => (
  <section id="faq" className="border-t border-border py-24 md:py-32">
    <div className="shell grid items-start gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
      <h2 className="mx-auto max-w-[13ch] text-center text-4xl font-bold leading-[1.2] md:text-5xl" data-reveal>أسئلة شائعة عن خدمات الذكاء الاصطناعي.</h2>
      <div className="border-t border-border-strong">
        {arabicFaqs.map((item) => (
          <details key={item.q} className="faq-item border-b border-border-strong" data-reveal>
            <summary className="flex items-center justify-between gap-6 py-6 text-lg font-medium leading-relaxed transition-colors hover:text-primary md:py-7 md:text-xl">
              {item.q}
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-muted" aria-hidden="true"><Plus size={17} className="faq-icon" /></span>
            </summary>
            <p className="max-w-[64ch] pb-7 leading-[1.9] text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

const ArabicContact = () => (
  <section id="contact" className="border-t border-border bg-primary-tint py-24 md:py-32">
    <div className="shell grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
      <div className="text-center">
        <h2 className="mx-auto max-w-[16ch] text-4xl font-bold leading-[1.2] md:text-6xl" data-reveal>لديك مشكلة تحتاج إلى <span className="text-primary">نظام حقيقي</span>؟</h2>
        <p className="mx-auto mt-6 max-w-[50ch] text-lg leading-[1.9] text-muted" data-reveal>اشرح لي أين تتعطل العملية وما الذي تريد من البرنامج أن يتولاه.</p>
      </div>
      <div className="lg:pb-1" data-reveal>
        <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-between gap-4 rounded-full bg-primary px-7 py-4 text-[15px] font-semibold text-primary-foreground transition-[background-color,transform] hover:bg-primary-strong active:translate-y-px">
          اعمل معي <ArrowLeft size={18} aria-hidden="true" />
        </a>
        <a href={`mailto:${EMAIL}`} className="mt-3 flex w-full items-center justify-between gap-4 rounded-full border border-border-strong bg-surface px-7 py-4 text-[15px] font-semibold transition-[border-color,color,transform] hover:border-primary hover:text-primary active:translate-y-px" dir="ltr">
          {EMAIL} <Mail size={17} aria-hidden="true" />
        </a>
        <p className="mt-5 text-sm text-muted">30 دقيقة، ولا تحتاج إلى عرض تقديمي.</p>
      </div>
    </div>
  </section>
);

const ArabicFooter = () => (
  <footer className="border-t border-border py-9">
    <div className="shell flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div><a href="#top" className="text-lg font-bold">إبراهيم أحمد<span className="text-primary">.</span></a><p className="mt-2 text-sm text-muted">مؤسس KanyouAI، <span suppressHydrationWarning>{new Date().getFullYear()}</span></p></div>
      <div className="flex flex-wrap items-center gap-5">
        <a href="https://kanyouai.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 border-r border-border pr-5 text-sm font-medium hover:text-primary" dir="ltr">KanyouAI <ArrowUpLeft size={14} aria-hidden="true" /></a>
        <a href="https://github.com/ibrahembuilds" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted hover:text-primary"><Github size={18} /></a>
        <a href="https://www.linkedin.com/in/ibrahem-ahmed-hassan/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted hover:text-primary"><Linkedin size={18} /></a>
        <a href="https://x.com/ibrahembuilds" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="text-muted hover:text-primary"><Twitter size={18} /></a>
        <a href="https://www.instagram.com/ibrahembuilds" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted hover:text-primary"><Instagram size={18} /></a>
      </div>
    </div>
  </footer>
);

const ArabicPage = () => (
  <div className="arabic-page" dir="rtl">
    <ArabicNav />
    <main id="main">
      <ArabicHero />
      <ArabicGlance />
      <ArabicWork />
      <ArabicClientWork />
      <ArabicServices />
      <ArabicStory />
      <ArabicProcess />
      <ArabicFaq />
      <ArabicContact />
    </main>
    <ArabicFooter />
  </div>
);

export default ArabicPage;
