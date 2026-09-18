import { ArrowLeft, ArrowUpLeft, Check } from "lucide-react";
import { AUDIT_URL, CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL, OWNER } from "../../config/site";
import {
  ABOUT_AR,
  CLIENT_SYSTEMS_AR,
  CTA_AR,
  FAQS_AR,
  HERO_AR,
  OPEN_SOURCE_NOTE_AR,
  PRICING_NOTE_AR,
  PROBLEM_QUOTES_AR,
  PROCESS_AR,
  PRODUCTS_AR,
  PRODUCTS_INTRO_AR,
  SERVICES_AR,
  TEARDOWN_STEPS_AR,
} from "../../config/content.ar";
import { ArabicCta, ArabicSectionHeader } from "./Layout";
import { TechMarquee } from "../components/TechMarquee";
import { CountUp } from "../components/CountUp";
import portrait640 from "../../assets/portrait-640.webp";
import portrait960 from "../../assets/portrait-960.webp";
import portrait1280 from "../../assets/portrait-1280.webp";

/**
 * The Arabic marketing page.
 *
 * A single scrolling page, structurally parallel to the English one-pager and
 * sharing the same layout primitives, but written rather than translated:
 * line heights are looser, connectors point right-to-left, and Latin strings
 * (domains, stack names, email, CTO) carry dir="ltr" so they are not
 * reordered inside Arabic text.
 */

export const ArabicHome = () => (
  <>
    <section className="border-b border-border">
      <div className="shell grid items-center gap-12 pb-16 pt-14 md:pb-24 md:pt-20 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
        <div>
          <h1 className="h-display max-w-[20ch] leading-[1.3]">{HERO_AR.headline}</h1>
          <p className="lede mt-7 max-w-prose leading-[1.9]">{HERO_AR.body}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={AUDIT_URL} className="btn btn-primary">
              {CTA_AR.primary}
              <ArrowLeft size={17} aria-hidden="true" />
            </a>
            <a href={CTA_AR.secondaryHref} className="btn btn-secondary">
              {CTA_AR.secondary}
            </a>
          </div>

          <p className="mt-8 max-w-[56ch] border-e-2 border-[var(--primary)] pe-4 text-[14px] leading-[1.9] text-muted">
            {HERO_AR.trust}
          </p>
        </div>

        <figure className="overflow-hidden rounded-xl border border-border" data-reveal>
          <img
            src={portrait960}
            srcSet={`${portrait640} 640w, ${portrait960} 960w, ${portrait1280} 1280w`}
            sizes="(min-width: 1024px) 420px, (min-width: 640px) 60vw, 100vw"
            width={960}
            height={960}
            alt={`${OWNER.legalName}، الذي يبني الأنظمة الموصوفة في هذا الموقع`}
            className="aspect-square w-full bg-[var(--background)] object-cover"
            decoding="async"
          />
          <figcaption className="border-t border-border bg-surface px-6 py-4">
            <p className="text-[15px] font-semibold text-ink">إبراهيم أحمد</p>
            <p className="mt-0.5 text-[13px] text-muted">أنظمة تشغيل داخلية للشركات الصغيرة</p>
          </figcaption>
        </figure>
      </div>
    </section>

    <section className="section border-b border-border">
      <div className="shell">
        <ArabicSectionHeader
          eyebrow="هل يبدو هذا مألوفاً"
          title="أغلب أصحاب الشركات لا يصفون هذه المشكلة كمشكلة برمجية."
          body="يصفونها هكذا. إن كانت أكثر من واحدة منها تنطبق على شركتك، فغالباً هناك إصلاح يستحق التنفيذ."
        />

        <ul className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEM_QUOTES_AR.map((quote, index) => (
            <li
              key={quote}
              className="bg-surface p-6"
              data-reveal
              style={{ "--reveal-delay": `${(index % 3) * 0.05}s` } as React.CSSProperties}
            >
              <blockquote className="text-[15px] leading-[1.9] text-ink">«{quote}»</blockquote>
            </li>
          ))}
        </ul>
      </div>
    </section>

    <ArabicExperience />
    <ArabicProjects />
    <ArabicProducts />

    <section className="section border-b border-border" id="services">
      <div className="shell">
        <ArabicSectionHeader
          eyebrow="الخدمات"
          title="أربع طرق لإحضار الجانب التقني الذي تفتقده."
          body="كل تعاون يبدأ بتفكيك الأنظمة، لأنني لا أسعّر بناءً لعملية لم أرها."
        />

        <div className="mt-12 grid gap-5">
          {SERVICES_AR.map((service, index) => (
            <article
              key={service.id}
              id={service.id}
              className={`card p-7 md:p-10 ${service.primary ? "border-[var(--primary)] bg-[var(--primary-soft)]" : ""}`}
              data-reveal
              style={{ "--reveal-delay": `${Math.min(index, 2) * 0.05}s` } as React.CSSProperties}
            >
              <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-14">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="h-section !text-[1.5rem] leading-[1.4] md:!text-[1.75rem]">{service.name}</h3>
                    {service.primary && (
                      <span className="rounded-md bg-[var(--primary)] px-2 py-1 text-[11px] font-medium text-white">
                        ابدأ من هنا
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[14px] font-medium text-[var(--primary-strong)]">{service.tagline}</p>
                  <p className="mt-5 max-w-prose text-[15px] leading-[1.95] text-ink">{service.body}</p>
                  {service.note && (
                    <p className="mt-4 max-w-prose text-[14px] leading-[1.9] text-muted">{service.note}</p>
                  )}
                </div>

                <div className="grid gap-7 sm:grid-cols-2 lg:gap-8">
                  <div>
                    <h4 className="eyebrow">مناسبة لك إن كنت</h4>
                    <ul className="mt-4 space-y-2.5">
                      {service.forYouIf.map((item) => (
                        <li key={item} className="text-[14px] leading-[1.9] text-muted">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="eyebrow">ما الذي تحصل عليه</h4>
                    <ul className="mt-4 space-y-2.5">
                      {service.deliverables.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-[14px] leading-[1.9] text-ink">
                          <Check size={15} className="mt-[6px] shrink-0 text-[var(--success)]" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {service.primary && (
                <div className="mt-9 border-t border-[var(--primary)]/25 pt-7">
                  <a href={AUDIT_URL} className="btn btn-primary">
                    {CTA_AR.primary}
                    <ArrowLeft size={17} aria-hidden="true" />
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="mt-8 max-w-prose" data-reveal>
          <h3 className="h-card">عن السعر</h3>
          <p className="mt-3 text-[15px] leading-[1.95] text-muted">{PRICING_NOTE_AR}</p>
        </div>
      </div>
    </section>

    <section className="section border-b border-border" id="how-i-work">
      <div className="shell">
        <ArabicSectionHeader
          eyebrow="طريقة العمل"
          title="أربع خطوات. بلا ارتباطات مفتوحة."
          body="تعرف دائماً ما الخطوة التالية، وما الذي تشمله، وما الذي لا تشمله."
        />

        <ol className="mt-12 grid gap-5 md:grid-cols-2">
          {PROCESS_AR.map((step, index) => (
            <li
              key={step.title}
              className="card flex flex-col p-6 md:p-7"
              data-reveal
              style={{ "--reveal-delay": `${(index % 4) * 0.05}s` } as React.CSSProperties}
            >
              <span className="font-mono text-[12px] text-muted">{step.step}</span>
              <h3 className="h-card mt-3">{step.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.8] text-ink">«{step.quote}»</p>
              <p className="mt-3 text-[14px] leading-[1.9] text-muted">{step.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>

    <section className="section border-b border-border bg-surface">
      <div className="shell grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div data-reveal>
          <p className="eyebrow">تفكيك الأنظمة</p>
          <h2 className="h-section mt-3 max-w-[20ch] leading-[1.35]">
            اعرف ما الذي يستحق الإصلاح قبل أن تنفق شيئاً.
          </h2>
          <p className="lede mt-5 max-w-prose leading-[1.9]">
            مكالمة عشرين دقيقة حول عملية واحدة في شركتك، ثم خريطة مكتوبة لمواضع تسرّب العمل، وما يُصلَح أولاً، وسعر
            ثابت لذلك الإصلاح. تصلك الخريطة خلال 48 ساعة من المكالمة.
          </p>
          <a href={AUDIT_URL} className="btn btn-primary mt-8">
            {CTA_AR.primary}
            <ArrowLeft size={17} aria-hidden="true" />
          </a>
        </div>

        <ol className="grid gap-px overflow-hidden rounded-xl border border-border bg-[var(--border)]" data-reveal>
          {TEARDOWN_STEPS_AR.map((step, index) => (
            <li key={step.title} className="flex gap-4 bg-surface p-6">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--primary-soft)] font-mono text-[12px] font-medium text-[var(--primary-strong)]">
                {index + 1}
              </span>
              <div>
                <h3 className="h-card">{step.title}</h3>
                <p className="mt-2 text-[14px] leading-[1.9] text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>

    <section className="section border-b border-border" id="faq">
      <div className="shell grid gap-10 lg:grid-cols-[0.6fr_1.4fr] lg:gap-16">
        <ArabicSectionHeader title="أسئلة يطرحها أصحاب الشركات." />
        <div className="border-t border-border">
          {FAQS_AR.map((item) => (
            <details key={item.q} className="group border-b border-border" data-reveal>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[16px] font-medium leading-[1.8] [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  className="mt-1.5 grid h-5 w-5 shrink-0 place-items-center text-muted transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M6.5 0v13M0 6.5h13" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </span>
              </summary>
              <p className="max-w-prose pb-6 text-[15px] leading-[1.95] text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>

    <ArabicCta
      title="ابدأ بعملية واحدة تكلفك وقتاً."
      body="أجب عن بضعة أسئلة حول طريقة عمل فريقك. تحصل على تقرير أنظمة أولي على الشاشة، وإن بدا الأمر مناسباً نحجز مكالمة العشرين دقيقة."
    />
  </>
);

/* -------------------------------------------------------------------------- */
/* Experience                                                                 */
/* -------------------------------------------------------------------------- */

const ArabicExperience = () => {
  const facts = [
    { label: "العمل الحالي", value: "مؤسس KanyouAI" },
    { label: "الدراسة", value: "الذكاء الاصطناعي التطبيقي، جامعة الوسائط المتعددة، ماليزيا" },
    { label: "كود عام", value: `${OWNER.publicRepoCount} مستودعاً على GitHub` },
    { label: "من تتعامل معه", value: "أنا. مباشرة." },
  ];

  return (
    <section className="section border-b border-border" id="experience">
      <div className="shell grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div data-reveal>
          <p className="eyebrow">الخبرة</p>
          <h2 className="h-section mt-3 max-w-[22ch] leading-[1.35]">{ABOUT_AR.title}</h2>
          <div className="mt-6 max-w-prose text-[16px] leading-[1.95] text-muted">
            {ABOUT_AR.paragraphs.map((paragraph, index) => (
              <p key={paragraph.slice(0, 24)} className={index === 0 ? "text-ink" : "mt-5"}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div data-reveal>
          <dl className="overflow-hidden rounded-xl border border-border">
            {facts.map((fact) => (
              <div key={fact.label} className="border-b border-border bg-surface p-5 last:border-b-0">
                <dt className="eyebrow">{fact.label}</dt>
                <dd className="mt-2 text-[15px] leading-[1.85] text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary mt-5 w-full"
            dir="ltr"
          >
            github.com/ibrahembuilds
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="btn btn-secondary mt-2 w-full">
            LinkedIn
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-ghost mt-2 w-full" dir="ltr">
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>

      <div className="shell mt-16">
        <ArabicSectionHeader eyebrow="لمن هذا" title="أصحاب الشركات ومديرو العمليات، لا لجان المشتريات." />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="card p-6 md:p-7" data-reveal>
            <h3 className="h-card">{ABOUT_AR.goodFitTitle}</h3>
            <ul className="mt-4 space-y-2.5 text-[15px] leading-[1.9] text-muted">
              {ABOUT_AR.goodFit.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="card p-6 md:p-7" data-reveal>
            <h3 className="h-card">{ABOUT_AR.badFitTitle}</h3>
            <ul className="mt-4 space-y-2.5 text-[15px] leading-[1.9] text-muted">
              {ABOUT_AR.badFit.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="shell mt-16" data-reveal>
        <p className="eyebrow">الأدوات التي أعمل بها</p>
        <div className="mt-5">
          <TechMarquee />
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* Projects                                                                   */
/* -------------------------------------------------------------------------- */

const ArabicProjects = () => {
  const featured = CLIENT_SYSTEMS_AR.filter((item) => item.featured);
  const other = CLIENT_SYSTEMS_AR.filter((item) => !item.featured);

  return (
    <section className="section border-b border-border" id="projects">
      <div className="shell">
        <ArabicSectionHeader
          eyebrow="المشاريع"
          title="افتحها واحكم بنفسك."
          body="أنظمة تعمل الآن، وكود مفتوح المصدر. لا أنشر أعداد عملاء ولا أرقام توفير ولا شهادات — ما أستطيع أن أريك إياه هو العمل نفسه."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {featured.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card group flex flex-col p-6 transition hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-lg"
              data-reveal
              style={{ "--reveal-delay": `${(index % 3) * 0.05}s` } as React.CSSProperties}
            >
              <span className="font-mono text-[12px] text-muted" dir="ltr">
                {item.domain}
              </span>
              <h3 className="h-card mt-3 group-hover:text-[var(--primary)]" dir="ltr">
                {item.name}
              </h3>
              <p className="mt-1.5 text-[13px] font-medium text-[var(--primary-strong)]">{item.kind}</p>
              <p className="mt-3 text-[14px] leading-[1.9] text-muted">{item.body}</p>
            </a>
          ))}
        </div>

        <div className="mt-10" data-reveal>
          <h3 className="eyebrow">أعمال أخرى مُسلَّمة</h3>
          <ul className="mt-4 grid gap-px overflow-hidden rounded-xl border border-border bg-[var(--border)] sm:grid-cols-2">
            {other.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col bg-surface p-6 transition-colors hover:bg-[var(--primary-soft)]"
                >
                  <span className="font-mono text-[12px] text-muted" dir="ltr">
                    {item.domain}
                  </span>
                  <span className="h-card mt-2 group-hover:text-[var(--primary)]" dir="ltr">
                    {item.name}
                  </span>
                  <span className="mt-1 text-[13px] text-muted">{item.kind}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="card mt-5 flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-7"
          data-reveal
        >
          <div>
            <h3 className="h-card">
              <CountUp value={OWNER.publicRepoCount} /> مستودعاً عاماً على GitHub
            </h3>
            <p className="mt-2 max-w-prose text-[14px] leading-[1.9] text-muted">{OPEN_SOURCE_NOTE_AR}</p>
          </div>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn btn-secondary shrink-0">
            اقرأ الكود
            <ArrowUpLeft size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};

const ArabicProducts = () => {
  const featured = PRODUCTS_AR.filter((item) => item.featured);
  const other = PRODUCTS_AR.filter((item) => !item.featured);

  return (
    <section className="section border-b border-border bg-surface" id="products">
      <div className="shell">
        <ArabicSectionHeader
          eyebrow="المنتجات"
          title={
            <>
              <CountUp value={PRODUCTS_AR.length} /> منتجات أطلقتها بنفسي.
            </>
          }
          body={PRODUCTS_INTRO_AR}
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {featured.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card group flex flex-col p-6 transition hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-lg"
              data-reveal
              style={{ "--reveal-delay": `${(index % 3) * 0.05}s` } as React.CSSProperties}
            >
              <span className="font-mono text-[12px] text-muted" dir="ltr">
                {item.domain}
              </span>
              <h3 className="h-card mt-3 group-hover:text-[var(--primary)]" dir="ltr">
                {item.name}
              </h3>
              <p className="mt-1.5 text-[13px] font-medium text-[var(--primary-strong)]">{item.kind}</p>
              <p className="mt-3 text-[14px] leading-[1.9] text-muted">{item.body}</p>
            </a>
          ))}
        </div>

        {other.length > 0 && (
          <div className="mt-10" data-reveal>
            <h3 className="eyebrow">أُطلقت أيضاً</h3>
            <ul
              className={`mt-4 grid gap-px overflow-hidden rounded-xl border border-border bg-[var(--border)] ${other.length > 1 ? "sm:grid-cols-2" : "sm:max-w-md"}`}
            >
              {other.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col bg-[var(--background)] p-6 transition-colors hover:bg-[var(--primary-soft)]"
                  >
                    <span className="font-mono text-[12px] text-muted" dir="ltr">
                      {item.domain}
                    </span>
                    <span className="h-card mt-2 group-hover:text-[var(--primary)]" dir="ltr">
                      {item.name}
                    </span>
                    <span className="mt-1 text-[13px] text-muted">{item.kind}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
