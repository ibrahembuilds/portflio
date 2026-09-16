import { ArrowLeft } from "lucide-react";
import { AUDIT_URL, CONTACT_EMAIL, GITHUB_URL, OWNER, SITE_URL } from "../../config/site";
import { CLIENT_SYSTEMS } from "../../config/content";

/**
 * Arabic route (/ar/). It exists because it is already indexed, so it is kept
 * and repointed at the business-systems positioning rather than deleted. It is
 * a condensed version of the English site, not a full mirror.
 */

const PROBLEMS = [
  "فريقي ينسخ نفس المعلومة بين ثلاث أدوات مختلفة.",
  "نفقد عملاء محتملين لأن أحداً لا يرد بسرعة كافية.",
  "لا أعرف ما الذي يجري في شركتي دون أن أسأل أحداً.",
  "تهيئة العميل الجديد عندنا أربعة عشر إيميلاً وملف PDF.",
  "ندفع اشتراك برنامج يغطي 20% مما نحتاجه فعلاً.",
  "شخص واحد فقط يعرف كيف يسير هذا العمل، وهو في إجازة.",
];

const BUILDS = [
  { title: "أنظمة CRM مخصصة", body: "مكان واحد يجمع كل عميل محتمل وعرض سعر ومهمة وعميل حالي، مبني على طريقة عملك أنت." },
  { title: "بوابات العملاء", body: "حساب يدخل منه عميلك ليرى مهامه ومستنداته وفواتيره وتحديثاته بدل أن يراسلك ليسأل." },
  { title: "أتمتة سير العمل", body: "النسخ والمتابعة والتذكير المتكرر يحدث تلقائياً، دون انتظار أن يتذكره أحد." },
  { title: "أدوات تشغيل داخلية", body: "الشاشة التي يفتحها فريقك كل صباح: المهام، الحجوزات، المخزون، أو ما يقوم عليه تشغيلك فعلاً." },
];

const STEPS = [
  { title: "الرسم", quote: "أقضي عشرين دقيقة على ما تفعله فعلاً، لا على ما تريد بناءه." },
  { title: "التسعير", quote: "نطاق ثابت، سعر ثابت، تاريخ ثابت. وإن لم أستطع حل المشكلة أخبرك ونتوقف." },
  { title: "البناء", quote: "ترى النظام يعمل في الأسبوع الأول، لا في النهاية." },
  { title: "التسليم", quote: "بياناتك، وحساباتك، وتوثيقك. بلا ارتباط إجباري بي." },
];

const ArabicPage = () => (
  <div dir="rtl" lang="ar">
    <header className="sticky top-0 z-40 border-b border-border bg-[var(--background)]/92 backdrop-blur-sm">
      <div className="shell flex h-[68px] items-center justify-between gap-4">
        <a href="/ar/" className="text-[15px] font-semibold">
          إبراهيم أحمد
        </a>
        <div className="flex items-center gap-4">
          <a href={SITE_URL} className="text-[14px] text-muted hover:text-ink" hrefLang="en">
            English
          </a>
          <a href={AUDIT_URL} className="btn btn-primary !px-4 !py-2.5 !text-[14px]">
            ابدأ تفكيك الأنظمة
          </a>
        </div>
      </div>
    </header>

    <main id="main">
      <section className="border-b border-border">
        <div className="shell pb-16 pt-14 md:pb-24 md:pt-20">
          <h1 className="h-display max-w-[20ch] leading-[1.25]">
            شركتك لا يجب أن تعتمد على جداول البيانات وصناديق البريد وذاكرة أحد الموظفين.
          </h1>
          <p className="lede mt-7 max-w-prose leading-[1.9]">
            أبني أنظمة CRM مخصصة وبوابات عملاء وأتمتة لسير العمل وأدوات تشغيل داخلية للشركات التي يعمل فيها من 5 إلى 50
            شخصاً وليس لديها فريق تقني داخلي.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href={AUDIT_URL} className="btn btn-primary">
              ابدأ تفكيك الأنظمة
              <ArrowLeft size={17} aria-hidden="true" />
            </a>
            <a href={SITE_URL} className="btn btn-secondary" hrefLang="en">
              اطّلع على ما أبنيه
            </a>
          </div>
          <p className="mt-8 max-w-[56ch] border-r-2 border-[var(--primary)] pr-4 text-[14px] leading-[1.9] text-muted">
            تتعامل مباشرة مع من يكتب الكود. حساباتك، وبياناتك، وتوثيق واضح، وبلا ارتباط إجباري.
          </p>
        </div>
      </section>

      <section className="section border-b border-border">
        <div className="shell">
          <h2 className="h-section max-w-[24ch]">أغلب أصحاب الشركات لا يصفون هذه المشكلة كمشكلة برمجية.</h2>
          <p className="lede mt-4 max-w-prose leading-[1.9]">يصفونها هكذا. إن كانت أكثر من واحدة منها تنطبق عليك، فغالباً هناك ما يستحق الإصلاح.</p>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
            {PROBLEMS.map((quote) => (
              <li key={quote} className="bg-surface p-6">
                <blockquote className="text-[15px] leading-[1.9] text-ink">«{quote}»</blockquote>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section border-b border-border">
        <div className="shell">
          <h2 className="h-section max-w-[24ch]">نظام واحد يفتحه فريقك بدل خمس نوافذ.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {BUILDS.map((item) => (
              <article key={item.title} className="card p-6 md:p-7">
                <h3 className="h-card">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.9] text-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-b border-border">
        <div className="shell">
          <h2 className="h-section max-w-[24ch]">أربع خطوات. بلا ارتباطات مفتوحة.</h2>
          <ol className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-[var(--border)] md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="bg-surface p-6 md:p-7">
                <span className="font-mono text-[12px] text-muted">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="h-card mt-3">{step.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.9] text-ink">«{step.quote}»</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section border-b border-border">
        <div className="shell">
          <h2 className="h-section max-w-[24ch]">أنظمة تعمل الآن، وكود يمكنك قراءته.</h2>
          <p className="lede mt-4 max-w-prose leading-[1.9]">
            افتح أياً منها بنفسك. أفضّل أن تفحص العمل على أن تقرأ ادعاءً عنه.
          </p>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {CLIENT_SYSTEMS.filter((item) => item.featured).map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card group flex flex-col p-6 transition-colors hover:border-[var(--primary)]"
              >
                <span className="font-mono text-[12px] text-muted" dir="ltr">
                  {item.domain}
                </span>
                <h3 className="h-card mt-3 group-hover:text-[var(--primary)]" dir="ltr">
                  {item.name}
                </h3>
              </a>
            ))}
          </div>
          <p className="mt-6 text-[14px] text-muted">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-[var(--primary)]">
              {OWNER.publicRepoCount} مستودعاً عاماً على GitHub
            </a>{" "}
            تتضمن اختبارات وحدة وواجهات برمجية واختبارات شاملة.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="card bg-[var(--primary-soft)] p-8 md:p-12">
            <h2 className="h-section max-w-[24ch]">ابدأ بعملية واحدة تكلفك وقتاً.</h2>
            <p className="lede mt-5 max-w-prose leading-[1.9]">
              أجب عن بضعة أسئلة حول طريقة عمل فريقك، وستحصل على تقرير أولي مباشرة على الشاشة.
            </p>
            <a href={AUDIT_URL} className="btn btn-primary mt-8">
              ابدأ تفكيك الأنظمة
              <ArrowLeft size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </main>

    <footer className="border-t border-border bg-surface">
      <div className="shell flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[15px] font-semibold">إبراهيم أحمد</p>
          <p className="mt-1 text-[14px] text-muted">أنظمة تشغيل داخلية للشركات الصغيرة</p>
        </div>
        <div className="flex flex-wrap items-center gap-5 text-[14px]">
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-[var(--primary)]" dir="ltr">
            {CONTACT_EMAIL}
          </a>
          <a href="/privacy" className="text-muted hover:text-ink" hrefLang="en">
            الخصوصية
          </a>
          <a href="/terms" className="text-muted hover:text-ink" hrefLang="en">
            الشروط
          </a>
        </div>
      </div>
    </footer>
  </div>
);

export default ArabicPage;
