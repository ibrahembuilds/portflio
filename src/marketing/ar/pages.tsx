import { ArrowLeft, ArrowUpLeft, Check } from "lucide-react";
import { AUDIT_URL, CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL, OWNER, SITE_URL, STACK } from "../../config/site";
import {
  ABOUT_AR,
  CLIENT_SYSTEMS_AR,
  CTA_AR,
  experienceFlowAr,
  FAQS_AR,
  HERO_AR,
  OPEN_SOURCE_NOTE_AR,
  PRICING_NOTE_AR,
  PROBLEM_QUOTES_AR,
  PROCESS_AR,
  SERVICES_AR,
  STACK_GROUPS_AR,
  STACK_NOTES_AR,
  TEARDOWN_STEPS_AR,
  WHAT_I_BUILD_AR,
} from "../../config/content.ar";
import { ArabicCta, ArabicPageHeader, ArabicSectionHeader } from "./Layout";
import { BeforeAfter, Flow } from "../components/Flow";
import portrait640 from "../../assets/portrait-640.webp";
import portrait960 from "../../assets/portrait-960.webp";
import portrait1280 from "../../assets/portrait-1280.webp";

/**
 * The Arabic marketing pages.
 *
 * Structurally parallel to the English pages and sharing the same layout
 * primitives, but written rather than translated: line heights are looser,
 * connectors point right-to-left, and Latin strings (domains, stack names,
 * email) carry dir="ltr" so they are not reordered inside Arabic text.
 */

/* -------------------------------------------------------------------------- */
/* Home                                                                       */
/* -------------------------------------------------------------------------- */

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

        <figure className="card overflow-hidden p-0">
          <figcaption className="panel-accent border-x-0 border-t-0 px-6 py-3 text-[12px] font-medium text-ink md:px-7">
            شركة صغيرة، مرسومة
          </figcaption>
          <div className="p-6 md:p-7">
            <div className="mt-5">
              <Flow
                rtl
                label="من الطلب إلى الدفع"
                nodes={[
                  { label: "طلب", meta: "هاتف أو نموذج" },
                  { label: "عرض سعر", meta: "جدول بيانات" },
                  { label: "مهمة", meta: "ملاحظات أحدهم" },
                  { label: "فاتورة", meta: "برنامج محاسبة" },
                ]}
              />
            </div>
            <div className="mt-6 space-y-3 border-t border-border pt-5">
              {[
                "المعلومة تُعاد كتابتها في كل خطوة",
                "لا مكان واحد يُعرف منه أين وصلت المهمة",
                "شخص واحد يحمل العملية في رأسه",
              ].map((item) => (
                <p key={item} className="flex items-start gap-2.5 text-[13px] leading-[1.9] text-muted">
                  <span
                    className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--border-strong)]"
                    aria-hidden="true"
                  />
                  {item}
                </p>
              ))}
            </div>
          </div>
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

    <section className="section border-b border-border">
      <div className="shell">
        <ArabicSectionHeader
          eyebrow="ما الذي أبنيه"
          title="نظام واحد يفتحه فريقك بدل خمس نوافذ."
          body="كل بناء يبدأ من عملية تديرها بالفعل. لا شيء هنا قالب جاهز تضطر لتطويع شركتك حوله."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {WHAT_I_BUILD_AR.map((item, index) => (
            <article
              key={item.title}
              className="card flex flex-col p-6 md:p-7"
              data-reveal
              style={{ "--reveal-delay": `${(index % 2) * 0.05}s` } as React.CSSProperties}
            >
              <h3 className="h-card">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.9] text-muted">{item.body}</p>
              <ul className="mt-5 flex flex-wrap gap-2 border-t border-border pt-5">
                {item.examples.map((example) => (
                  <li
                    key={example}
                    className="rounded-md bg-[var(--primary-soft)] px-2.5 py-1 text-[12.5px] font-medium text-[var(--primary-strong)]"
                  >
                    {example}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-10" data-reveal>
          <BeforeAfter
            beforeTitle="كيف تسير تهيئة العميل عادةً"
            before={[
              { label: "يصل الطلب", note: "هاتف ونموذج وواتساب، في ثلاثة أماكن" },
              { label: "تُعاد كتابة التفاصيل", note: "في جدول بيانات، ثم في أداة التسعير" },
              { label: "تُرسل المستندات بالبريد", note: "ملف PDF ونموذج ورسالة متابعة" },
              { label: "لا أحد يرى الحالة", note: "لا بد من سؤال أحدهم" },
            ]}
            afterTitle="كيف تسير بعد ذلك"
            after={[
              "الطلب يصل إلى سجل واحد، من أي قناة",
              "التفاصيل تُدخل مرة واحدة وتُستخدم في كل مكان",
              "العميل يكمل التهيئة عبر بوابة خاصة",
              "الحالة ظاهرة لك دون أن تسأل أحداً",
            ]}
          />
        </div>
      </div>
    </section>

    <section className="section border-b border-border">
      <div className="shell">
        <ArabicSectionHeader
          eyebrow="طريقة العمل"
          title="أربع خطوات. بلا ارتباطات مفتوحة."
          body="تعرف دائماً ما الخطوة التالية، وما الذي تشمله، وما الذي لا تشمله."
        />

        <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-[var(--border)] md:grid-cols-2 lg:grid-cols-4">
          {PROCESS_AR.map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col bg-surface p-6 md:p-7"
              data-reveal
              style={{ "--reveal-delay": `${(index % 4) * 0.05}s` } as React.CSSProperties}
            >
              <span className="font-mono text-[12px] text-muted">{step.step}</span>
              <h3 className="h-card mt-3">{step.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.9] text-ink">«{step.quote}»</p>
            </li>
          ))}
        </ol>

        <p className="mt-8" data-reveal>
          <a
            href="/ar/how-it-works/"
            className="inline-flex items-center gap-2 text-[15px] font-medium text-[var(--primary)] underline-offset-4 hover:underline"
          >
            اطّلع على كيف يسير البناء فعلاً
            <ArrowLeft size={16} aria-hidden="true" />
          </a>
        </p>
      </div>
    </section>

    <ArabicProof />

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

    <section className="section border-b border-border">
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
/* Shared proof block                                                         */
/* -------------------------------------------------------------------------- */

const ArabicProof = () => {
  const featured = CLIENT_SYSTEMS_AR.filter((item) => item.featured);

  return (
    <section className="section border-b border-border">
      <div className="shell">
        <ArabicSectionHeader
          eyebrow="أعمال مختارة"
          title="أنظمة تعمل الآن، وكود يمكنك قراءته."
          body="افتح أياً منها بنفسك. أفضّل أن تفحص العمل على أن تقرأ ادعاءً عنه."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {featured.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card group flex flex-col p-6 transition-colors hover:border-[var(--primary)]"
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

        <div
          className="card mt-5 flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-7"
          data-reveal
        >
          <div>
            <h3 className="h-card">{OWNER.publicRepoCount} مستودعاً عاماً على GitHub</h3>
            <p className="mt-2 max-w-prose text-[14px] leading-[1.9] text-muted">{OPEN_SOURCE_NOTE_AR}</p>
          </div>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn btn-secondary shrink-0">
            اقرأ الكود
          </a>
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* Services                                                                   */
/* -------------------------------------------------------------------------- */

export const ArabicServices = () => (
  <>
    <ArabicPageHeader
      eyebrow="الخدمات"
      title="أربع طرق للعمل معي. ونقطة بداية واحدة."
      body="كل تعاون يبدأ بتفكيك الأنظمة، لأنني لا أسعّر بناءً لعملية لم أرها."
    >
      <a href={AUDIT_URL} className="btn btn-primary mt-8">
        {CTA_AR.primary}
        <ArrowLeft size={17} aria-hidden="true" />
      </a>
    </ArabicPageHeader>

    <section className="section">
      <div className="shell grid gap-5">
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
                  <h2 className="h-section !text-[1.5rem] leading-[1.4] md:!text-[1.75rem]">{service.name}</h2>
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
                  <h3 className="eyebrow">مناسبة لك إن كنت</h3>
                  <ul className="mt-4 space-y-2.5">
                    {service.forYouIf.map((item) => (
                      <li key={item} className="text-[14px] leading-[1.9] text-muted">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="eyebrow">ما الذي تحصل عليه</h3>
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
    </section>

    <section className="section-tight border-t border-border">
      <div className="shell">
        <div className="max-w-prose" data-reveal>
          <h2 className="h-card">عن السعر</h2>
          <p className="mt-3 text-[15px] leading-[1.95] text-muted">{PRICING_NOTE_AR}</p>
        </div>
      </div>
    </section>
  </>
);

/* -------------------------------------------------------------------------- */
/* How it works                                                               */
/* -------------------------------------------------------------------------- */

export const ArabicHowItWorks = () => (
  <>
    <ArabicPageHeader
      eyebrow="طريقة العمل"
      title="الرسم. التسعير. البناء. التسليم."
      body="أربع خطوات بهذا الترتيب. يمكنك التوقف بعد أي واحدة منها، وتملك كل ما أُنتج حتى تلك النقطة."
    />

    <section className="section">
      <div className="shell">
        <ol className="grid gap-5">
          {PROCESS_AR.map((step, index) => (
            <li
              key={step.title}
              className="card grid gap-7 p-7 md:grid-cols-[auto_1fr] md:gap-12 md:p-10"
              data-reveal
              style={{ "--reveal-delay": `${Math.min(index, 2) * 0.05}s` } as React.CSSProperties}
            >
              <div className="flex items-baseline gap-4 md:w-[9rem] md:flex-col md:gap-2">
                <span className="font-mono text-[12px] text-muted">{step.step}</span>
                <h2 className="h-section !text-[1.5rem] leading-[1.4]">{step.title}</h2>
              </div>
              <div>
                <p className="max-w-prose text-[17px] leading-[1.8] text-ink">«{step.quote}»</p>
                <p className="mt-4 max-w-prose text-[15px] leading-[1.95] text-muted">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>

    <section className="section border-t border-border bg-surface">
      <div className="shell">
        <ArabicSectionHeader
          eyebrow="كيف يبدو البناء"
          title="ترى برمجيات تعمل مبكراً، لا تقرير تقدّم."
          body="لا شيء يبقى مخفياً حتى النهاية. النظام شيء تفتحه وتضغط عليه وهو ما يزال قيد البناء."
        />
        <div className="mt-10" data-reveal>
          <Flow
            rtl
            label="تسلسل البناء"
            nodes={[
              { label: "الاتفاق على النطاق", meta: "نطاق وسعر وتاريخ ثابت" },
              { label: "تفتح النسخة الأولى", meta: "الأسبوع الأول، على شكل بياناتك" },
              { label: "تُشكَّل حول فريقك", meta: "وفق طريقة سير العمل فعلاً" },
              { label: "تعمل مباشرة", meta: "حساباتك، بياناتك" },
              { label: "تُسلَّم إليك", meta: "تدريب وتوثيق" },
            ]}
          />
        </div>
      </div>
    </section>

    <section className="section border-t border-border">
      <div className="shell">
        <ArabicSectionHeader eyebrow="ما الذي يتغير" title="الهدف ليس برنامجاً جديداً، بل عملاً يتوقف عن التسرّب." />
        <div className="mt-10" data-reveal>
          <BeforeAfter
            beforeTitle="قبل"
            before={[
              { label: "يصل عميل محتمل", note: "يُرى حين يفتح أحدهم البريد" },
              { label: "تُنسخ التفاصيل", note: "إلى جدول بيانات، ثم إلى عرض السعر" },
              { label: "المتابعة", note: "إن تذكّرها أحد" },
              { label: "تطلب تحديثاً", note: "لا بد أن يذهب أحدهم ليبحث" },
            ]}
            afterTitle="بعد"
            after={[
              "كل طلب يصل إلى سجل واحد، بوقت محدد",
              "التفاصيل تُدخل مرة واحدة وتُستخدم",
              "المتابعة تحدث دون أن يتذكرها أحد",
              "ترى الحالة دون أن تسأل أحداً",
            ]}
          />
        </div>
      </div>
    </section>

    <ArabicCta
      title="يبدأ الأمر بعشرين دقيقة على عملية واحدة."
      body="أجب عن بضعة أسئلة أولاً، حتى تبدأ المكالمة من شيء ملموس لا من الصفر."
    />
  </>
);

/* -------------------------------------------------------------------------- */
/* Work                                                                       */
/* -------------------------------------------------------------------------- */

export const ArabicWork = () => {
  const featured = CLIENT_SYSTEMS_AR.filter((item) => item.featured);
  const other = CLIENT_SYSTEMS_AR.filter((item) => !item.featured);

  return (
    <>
      <ArabicPageHeader
        eyebrow="الأعمال"
        title="افتحها واحكم بنفسك."
        body="كل ما في الأسفل رابط يعمل أو كود مفتوح. لا أنشر أعداد عملاء ولا أرقام توفير ولا شهادات — ما أستطيع أن أريك إياه هو العمل نفسه."
      />

      <section className="section">
        <div className="shell">
          <ArabicSectionHeader eyebrow="أنظمة لعملاء" title="مُسلَّمة وتعمل." />

          <div className="mt-10 grid gap-5">
            {featured.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card group grid gap-6 p-7 transition-colors hover:border-[var(--primary)] md:grid-cols-[1fr_1.35fr] md:gap-12 md:p-10"
                data-reveal
                style={{ "--reveal-delay": `${Math.min(index, 2) * 0.05}s` } as React.CSSProperties}
              >
                <div>
                  <span className="font-mono text-[12px] text-muted" dir="ltr">
                    {item.domain}
                  </span>
                  <h3 className="h-section mt-2 !text-[1.375rem] group-hover:text-[var(--primary)]" dir="ltr">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-[14px] font-medium text-[var(--primary-strong)]">{item.kind}</p>
                </div>
                <div className="flex items-start justify-between gap-6">
                  <p className="max-w-prose text-[15px] leading-[1.95] text-muted">{item.body}</p>
                  <ArrowUpLeft
                    size={20}
                    className="mt-1 shrink-0 text-muted group-hover:text-[var(--primary)]"
                    aria-hidden="true"
                  />
                </div>
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
        </div>
      </section>

      <section className="section border-t border-border bg-surface">
        <div className="shell">
          <ArabicSectionHeader
            eyebrow="كود عام"
            title={`${OWNER.publicRepoCount} مستودعاً يمكنك قراءتها.`}
            body={OPEN_SOURCE_NOTE_AR}
          />
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center" data-reveal>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" dir="ltr">
              github.com/ibrahembuilds
            </a>
            <p className="text-[14px] leading-[1.9] text-muted">
              قراءة اختبارات أحدهم تخبرك عن طريقة بنائه أكثر من أي دراسة حالة.
            </p>
          </div>
        </div>
      </section>

      <ArabicCta
        title="تريد أن تعرف كيف سيبدو هذا في شركتك؟"
        body="ابدأ بعملية واحدة. تحصل على تقرير مكتوب يوضح ما الذي يبدو جديراً بالإصلاح أولاً."
      />
    </>
  );
};

/* -------------------------------------------------------------------------- */
/* About                                                                      */
/* -------------------------------------------------------------------------- */

export const ArabicAbout = () => {
  const facts = [
    { label: "العمل الحالي", value: "مطوّر حلول ويب وذكاء اصطناعي، NCASE Consulting Group" },
    { label: "الدراسة", value: "الذكاء الاصطناعي التطبيقي، جامعة الوسائط المتعددة، ماليزيا" },
    { label: "كود عام", value: `${OWNER.publicRepoCount} مستودعاً على GitHub` },
    { label: "من تتعامل معه", value: "أنا. مباشرة." },
  ];

  return (
    <>
      <ArabicPageHeader eyebrow="عني" title={ABOUT_AR.title} body={ABOUT_AR.lede} />

      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="max-w-prose text-[16px] leading-[1.95] text-muted" data-reveal>
            <p className="text-ink">
              أنا إبراهيم أحمد. أدرس الذكاء الاصطناعي التطبيقي في جامعة الوسائط المتعددة بماليزيا، وأعمل مطوّر
              حلول ويب وذكاء اصطناعي في {OWNER.employer}. وإلى جانب هذا وذاك، أبني برمجيات وأنشرها للعامة —{" "}
              {OWNER.publicRepoCount} مستودعاً، أغلبها باختبارات حقيقية، لأنني أفضّل أن تقرأ كيف أعمل بدل أن تأخذ
              كلامي فقط.
            </p>
            {ABOUT_AR.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="mt-5">
                {paragraph}
              </p>
            ))}
          </div>

          <div data-reveal>
            <figure className="overflow-hidden rounded-xl border border-border">
              <img
                src={portrait960}
                srcSet={`${portrait640} 640w, ${portrait960} 960w, ${portrait1280} 1280w`}
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                width={960}
                height={960}
                alt="إبراهيم أحمد حسن أدم، الذي يبني الأنظمة الموصوفة في هذا الموقع"
                className="aspect-square w-full bg-[var(--background)] object-cover"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="border-t border-border bg-surface px-5 py-4">
                <p className="text-[15px] font-semibold text-ink">إبراهيم أحمد</p>
                <p className="mt-0.5 text-[13px] text-muted">أنظمة تشغيل داخلية للشركات الصغيرة</p>
              </figcaption>
            </figure>

            <dl className="mt-5 overflow-hidden rounded-xl border border-border">
              {facts.map((fact) => (
                <div key={fact.label} className="border-b border-border bg-surface p-5 last:border-b-0">
                  <dt className="eyebrow">{fact.label}</dt>
                  <dd className="mt-2 text-[15px] leading-[1.85] text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn btn-secondary mt-5 w-full" dir="ltr">
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
      </section>

      <section className="section border-t border-border bg-surface">
        <div className="shell">
          <ArabicSectionHeader
            eyebrow="الخبرة"
            title="ما أعمل عليه الآن، لا سيرة ذاتية لما فعلته سابقاً."
            body="بلا تواريخ أدناه. أفضّل أن أريك أربعة أمور يمكنك التحقق منها بدل جدول زمني أخمّن فيه سنة."
          />
          <div className="mt-10" data-reveal>
            <Flow
              label="الخبرة"
              rtl
              nodes={experienceFlowAr(OWNER.publicRepoCount, CLIENT_SYSTEMS_AR.length)}
            />
          </div>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="shell">
          <ArabicSectionHeader
            eyebrow="الأدوات"
            title="ما أبني به، ولماذا كل واحدة منها موجودة."
            body="مذكورة هنا لا في الصدر الرئيسي، لأنك توظفني لإصلاح عملية، لا لشراء حزمة تقنية. المهم أنها تعمل على حسابات باسمك."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2" data-reveal>
            {STACK.map((group) => (
              <div key={group.group} className="card p-6 md:p-7">
                <h3 className="h-card">{STACK_GROUPS_AR[group.group] ?? group.group}</h3>
                <p className="mt-2 font-mono text-[13px] text-[var(--primary-strong)]" dir="ltr">
                  {group.items.join(" · ")}
                </p>
                <p className="mt-3 text-[14px] leading-[1.9] text-muted">{STACK_NOTES_AR[group.group] ?? group.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-border bg-surface">
        <div className="shell">
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
      </section>

      <ArabicCta
        title="أسرع طريقة لمعرفة إن كنت أستطيع المساعدة."
        body="أجب عن بضعة أسئلة حول عملية واحدة. تحصل على تقرير مكتوب على الشاشة، ونكمل من هناك."
      />

      <p className="sr-only">
        <a href={`${SITE_URL}/about`} hrefLang="en">
          English version
        </a>
      </p>
    </>
  );
};
