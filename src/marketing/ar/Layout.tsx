import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Menu, X } from "lucide-react";
import { AUDIT_URL, CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL, OWNER, SITE_URL, STACK } from "../../config/site";
import { CTA_AR, NAV_LINKS_AR, STACK_GROUPS_AR } from "../../config/content.ar";

/**
 * Chrome for the Arabic routes.
 *
 * Direction is set on the <html> element at build time by the prerender script,
 * so layout primitives that use logical properties mirror automatically. What
 * has to be handled by hand is the line height — Arabic needs noticeably more
 * than Latin to stay readable — and the language of the links back to the
 * English pages, which are marked hreflang="en" so a crawler is not told they
 * are Arabic.
 */

export const ArabicNav = ({ current }: { current: string }) => {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[var(--background)]/92 backdrop-blur-sm">
      <div className="shell">
        <div className="flex h-[68px] items-center justify-between gap-4">
          <a href="/ar/" className="text-[15px] font-semibold" aria-label="إبراهيم أحمد — الصفحة الرئيسية">
            إبراهيم أحمد
          </a>

          <nav className="hidden items-center gap-8 md:flex" aria-label="التنقل الرئيسي">
            {NAV_LINKS_AR.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={current === link.href ? "page" : undefined}
                className={`text-[14px] transition-colors hover:text-[var(--primary)] ${
                  current === link.href ? "font-medium text-ink" : "text-muted"
                }`}
              >
                {link.label}
              </a>
            ))}
            <a href={SITE_URL} hrefLang="en" lang="en" dir="ltr" className="text-[14px] text-muted hover:text-ink">
              English
            </a>
            <a href={AUDIT_URL} className="btn btn-primary !px-4 !py-2.5 !text-[14px]">
              {CTA_AR.primary}
            </a>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className="-ms-2 rounded-md p-2 text-ink md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav-ar"
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div id="mobile-nav-ar" hidden={!open} className="border-t border-border bg-surface md:hidden">
        <nav className="shell flex flex-col py-2" aria-label="قائمة الجوال">
          {NAV_LINKS_AR.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={current === link.href ? "page" : undefined}
              className="border-b border-border py-3.5 text-[15px]"
            >
              {link.label}
            </a>
          ))}
          <a href={SITE_URL} hrefLang="en" lang="en" dir="ltr" className="border-b border-border py-3.5 text-[15px]">
            English
          </a>
          <a href={AUDIT_URL} className="btn btn-primary my-4 w-full">
            {CTA_AR.primary}
          </a>
        </nav>
      </div>
    </header>
  );
};

export const ArabicFooter = () => (
  <footer className="border-t border-border bg-surface">
    <div className="shell border-b border-border py-10">
      <h2 className="eyebrow">مبني باستخدام</h2>
      <div className="mt-5 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
        {STACK.map((group) => (
          <div key={group.group} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="w-full text-[12px] font-medium text-muted sm:w-auto">
              {STACK_GROUPS_AR[group.group] ?? group.group}
            </span>
            <span className="font-mono text-[13px] text-ink" dir="ltr">
              {group.items.join(" · ")}
            </span>
          </div>
        ))}
      </div>
    </div>

    <div className="shell flex flex-col gap-8 py-10 sm:flex-row sm:justify-between">
      <div>
        <p className="text-[15px] font-semibold">إبراهيم أحمد</p>
        <p className="mt-1 text-[14px] text-muted">أنظمة تشغيل داخلية للشركات الصغيرة</p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          dir="ltr"
          className="mt-3 inline-block text-[14px] text-[var(--primary)] underline-offset-4 hover:underline"
        >
          {CONTACT_EMAIL}
        </a>
      </div>

      <nav className="flex flex-col gap-2.5 text-[14px]" aria-label="روابط الموقع">
        {NAV_LINKS_AR.map((link) => (
          <a key={link.href} href={link.href} className="text-muted hover:text-ink">
            {link.label}
          </a>
        ))}
      </nav>

      <nav className="flex flex-col gap-2.5 text-[14px]" aria-label="روابط أخرى">
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-ink">
          GitHub
        </a>
        <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-ink">
          LinkedIn
        </a>
        <a href="/privacy" hrefLang="en" className="text-muted hover:text-ink">
          الخصوصية
        </a>
        <a href="/terms" hrefLang="en" className="text-muted hover:text-ink">
          الشروط
        </a>
      </nav>
    </div>

    <div className="shell border-t border-border py-5">
      <p className="text-[13px] leading-[1.9] text-muted">
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {OWNER.legalName}. أنظمة تشغيل داخلية مبنية
        للشركات الصغيرة.
      </p>
    </div>
  </footer>
);

/** Section header used across the Arabic pages. */
export const ArabicSectionHeader = ({
  eyebrow,
  title,
  body,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
}) => (
  <div className="max-w-[46rem]" data-reveal>
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    <h2 className={`h-section leading-[1.35] ${eyebrow ? "mt-3" : ""}`}>{title}</h2>
    {body && <p className="lede mt-4 max-w-prose leading-[1.9]">{body}</p>}
  </div>
);

export const ArabicPageHeader = ({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  children?: React.ReactNode;
}) => (
  <section className="border-b border-border">
    <div className="shell pb-12 pt-14 md:pb-16 md:pt-20">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="h-display mt-4 max-w-[22ch] leading-[1.3]">{title}</h1>
      {body && <p className="lede mt-6 max-w-prose leading-[1.9]">{body}</p>}
      {children}
    </div>
  </section>
);

/** Final call to action, repeated at the foot of every Arabic page. */
export const ArabicCta = ({ title, body }: { title: string; body: string }) => (
  <section className="section border-t border-border">
    <div className="shell">
      <div className="panel-accent overflow-hidden rounded-xl" data-reveal>
        <div className="p-8 md:p-12">
          <h2 className="h-section max-w-[24ch] leading-[1.35]">{title}</h2>
          <p className="mt-5 max-w-prose text-[1.0625rem] leading-[1.9] text-ink/80 sm:text-[1.1875rem]">{body}</p>
          <a href={AUDIT_URL} className="btn btn-primary mt-8">
            {CTA_AR.primary}
            <ArrowLeft size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  </section>
);
