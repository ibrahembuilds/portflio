import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, Menu, X } from "lucide-react";
import { AUDIT_URL, CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL, OWNER, SITE_URL } from "../../config/site";
import { CTA_AR, NAV_LINKS_AR } from "../../config/content.ar";

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

export const ArabicNav = () => {
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
                className="text-[14px] text-muted transition-colors hover:text-[var(--primary)]"
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
              onClick={() => setOpen(false)}
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
  title: ReactNode;
  body?: string;
}) => (
  <div className="max-w-[46rem]" data-reveal>
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    <h2 className={`h-section leading-[1.35] ${eyebrow ? "mt-3" : ""}`}>{title}</h2>
    {body && <p className="lede mt-4 max-w-prose leading-[1.9]">{body}</p>}
  </div>
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
