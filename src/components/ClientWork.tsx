import { ArrowUpLeft, ArrowUpRight } from "lucide-react";

type ClientProject = {
  name: string;
  href: string;
  domain: string;
  scope: string;
  description: string;
  scopeAr: string;
  descriptionAr: string;
};

export const clientProjects: ClientProject[] = [
  {
    name: "NCASE Intelligence",
    href: "https://ncaseai.com/",
    domain: "ncaseai.com",
    scope: "Market intelligence platform",
    description: "A bilingual market intelligence platform for the GCC covering competitor tracking, persona generation, monitoring, and executive-ready reports.",
    scopeAr: "منصة استخبارات السوق",
    descriptionAr: "منصة استخبارات سوق ثنائية اللغة لدول الخليج تغطي تتبع المنافسين وتوليد الشخصيات الاستهلاكية والمراقبة والتقارير التنفيذية.",
  },
  {
    name: "NCase Consulting",
    href: "https://ncase.com.sa/",
    domain: "ncase.com.sa",
    scope: "Website and operations platform",
    description: "A bilingual consulting website supported by a private CRM for leads, events, campaigns, and customer follow-up.",
    scopeAr: "موقع ومنصة تشغيل",
    descriptionAr: "موقع استشارات ثنائي اللغة مدعوم بنظام CRM خاص للعملاء المحتملين والفعاليات والحملات والمتابعة.",
  },
  {
    name: "Al-Ghufran",
    href: "https://al-ghufran.com/",
    domain: "al-ghufran.com",
    scope: "Arabic-first education website",
    description: "An Arabic-first education consultancy website that presents study services, university options, proof, and a clear consultation path.",
    scopeAr: "موقع تعليمي عربي أولاً",
    descriptionAr: "موقع استشارات تعليمية يبدأ بالعربية ويعرض خدمات الدراسة والجامعات وأدلة الثقة ومساراً واضحاً للاستشارة.",
  },
  {
    name: "Abdul Hai Trading",
    href: "https://abdulhaitrading.com/",
    domain: "abdulhaitrading.com",
    scope: "International trade website",
    description: "A bilingual corporate and product website for an agricultural commodities company serving cross-border buyers and partners.",
    scopeAr: "موقع للتجارة الدولية",
    descriptionAr: "موقع مؤسسي وتجاري ثنائي اللغة لشركة سلع زراعية تخدم المشترين والشركاء عبر الأسواق الدولية.",
  },
  {
    name: "Al Mujtahid",
    href: "https://almujtahidedu.com/",
    domain: "almujtahidedu.com",
    scope: "Student admissions platform",
    description: "An Arabic-first study-in-Malaysia platform that guides prospective students from program discovery to an admissions enquiry.",
    scopeAr: "منصة قبول طلاب",
    descriptionAr: "منصة عربية للدراسة في ماليزيا تقود الطالب من استكشاف البرامج إلى إرسال طلب استشارة للقبول.",
  },
];

const ClientWork = () => {
  const [featured, ...rest] = clientProjects;

  return (
    <section id="clients" className="border-y border-border bg-surface py-24 md:py-32">
      <div className="shell">
        <h2 className="mx-auto max-w-[15ch] text-center text-4xl font-bold leading-[1.02] tracking-[-0.04em] md:text-5xl" data-reveal>
          Client work in the real world.
        </h2>
        <p className="mx-auto mt-5 max-w-[54ch] text-center text-lg leading-relaxed text-muted" data-reveal>
          Five live digital projects across market intelligence, consulting, education, and international trade.
        </p>

        <div className="mt-12 grid gap-5 lg:grid-cols-12">
          <a
            href={featured.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between gap-8 rounded-xl border border-border bg-primary-tint p-8 transition-[box-shadow,transform] hover:shadow-card-hover active:translate-y-px md:p-10 lg:col-span-12 lg:flex-row lg:items-end"
            data-reveal
          >
            <div>
              <p className="font-mono text-xs text-muted">{featured.domain}</p>
              <h3 className="mt-3 text-3xl font-bold tracking-[-0.025em] transition-colors group-hover:text-primary md:text-4xl">
                {featured.name}
              </h3>
              <p className="mt-4 text-sm font-semibold text-foreground">{featured.scope}</p>
              <p className="mt-2 max-w-[58ch] text-[15px] leading-relaxed text-muted">{featured.description}</p>
            </div>
            <ArrowUpRight
              size={26}
              className="shrink-0 text-muted transition-[color,transform] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary"
              aria-hidden="true"
            />
          </a>

          {rest.map((project, index) => (
            <a
              key={project.name}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-xl border border-border bg-surface p-7 shadow-card transition-shadow hover:shadow-card-hover lg:col-span-6"
              data-reveal
              style={{ "--reveal-delay": `${(index % 2) * 0.06}s` } as React.CSSProperties}
            >
              <div className="flex items-start justify-between gap-4">
                <p className="font-mono text-xs text-muted">{project.domain}</p>
                <ArrowUpRight
                  size={18}
                  className="shrink-0 text-muted transition-[color,transform] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary"
                  aria-hidden="true"
                />
              </div>
              <h3 className="mt-3 text-2xl font-bold tracking-[-0.02em] transition-colors group-hover:text-primary">
                {project.name}
              </h3>
              <p className="mt-3 text-sm font-semibold text-foreground">{project.scope}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{project.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export const ArabicClientWork = () => {
  const [featured, ...rest] = clientProjects;

  return (
    <section id="clients" className="border-y border-border bg-surface py-24 md:py-32">
      <div className="shell">
        <h2 className="mx-auto max-w-[17ch] text-center text-4xl font-bold leading-[1.2] md:text-5xl" data-reveal>
          أعمال حقيقية لعملاء حقيقيين.
        </h2>
        <p className="mx-auto mt-5 max-w-[54ch] text-center text-lg leading-[1.9] text-muted" data-reveal>
          خمسة مشاريع رقمية منشورة في استخبارات السوق والاستشارات والتعليم والتجارة الدولية.
        </p>

        <div className="mt-12 grid gap-5 lg:grid-cols-12">
          <a
            href={featured.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between gap-8 rounded-xl border border-border bg-primary-tint p-8 transition-[box-shadow,transform] hover:shadow-card-hover active:translate-y-px md:p-10 lg:col-span-12 lg:flex-row-reverse lg:items-end"
            data-reveal
          >
            <div>
              <p className="font-mono text-xs text-muted" dir="ltr">{featured.domain}</p>
              <h3 className="mt-3 text-3xl font-bold transition-colors group-hover:text-primary md:text-4xl" dir="ltr">
                {featured.name}
              </h3>
              <p className="mt-4 text-sm font-semibold text-foreground">{featured.scopeAr}</p>
              <p className="mt-2 max-w-[58ch] text-[15px] leading-[1.9] text-muted">{featured.descriptionAr}</p>
            </div>
            <ArrowUpLeft
              size={26}
              className="shrink-0 text-muted transition-[color,transform] group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:text-primary"
              aria-hidden="true"
            />
          </a>

          {rest.map((project, index) => (
            <a
              key={project.name}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-xl border border-border bg-surface p-7 shadow-card transition-shadow hover:shadow-card-hover lg:col-span-6"
              data-reveal
              style={{ "--reveal-delay": `${(index % 2) * 0.06}s` } as React.CSSProperties}
            >
              <div className="flex items-start justify-between gap-4">
                <p className="font-mono text-xs text-muted" dir="ltr">{project.domain}</p>
                <ArrowUpLeft
                  size={18}
                  className="shrink-0 text-muted transition-[color,transform] group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:text-primary"
                  aria-hidden="true"
                />
              </div>
              <h3 className="mt-3 text-2xl font-bold transition-colors group-hover:text-primary" dir="ltr">
                {project.name}
              </h3>
              <p className="mt-3 text-sm font-semibold text-foreground">{project.scopeAr}</p>
              <p className="mt-2 text-[15px] leading-[1.9] text-muted">{project.descriptionAr}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientWork;
