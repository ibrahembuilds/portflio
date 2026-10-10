import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL, NAV_LINKS, OWNER } from "../../config/site";

const Footer = () => (
  <footer className="border-t border-border bg-surface">
    <div className="shell flex flex-col gap-8 py-10 sm:flex-row sm:justify-between">
      <div>
        <p className="text-[15px] font-semibold">{OWNER.name}</p>
        <p className="mt-1 text-[14px] text-muted">{OWNER.discipline}</p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-3 inline-block text-[14px] text-[var(--primary)] underline-offset-4 hover:underline"
        >
          {CONTACT_EMAIL}
        </a>
      </div>

      <nav className="flex flex-col gap-2.5 text-[14px]" aria-label="Footer">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} className="text-muted hover:text-ink">
            {link.label}
          </a>
        ))}
      </nav>

      <nav className="flex flex-col gap-2.5 text-[14px]" aria-label="Legal and profiles">
        <a href={GITHUB_URL} rel="noopener noreferrer" target="_blank" className="text-muted hover:text-ink">
          GitHub
        </a>
        <a href={LINKEDIN_URL} rel="noopener noreferrer" target="_blank" className="text-muted hover:text-ink">
          LinkedIn
        </a>
        <a href="/privacy" className="text-muted hover:text-ink">
          Privacy
        </a>
        <a href="/terms" className="text-muted hover:text-ink">
          Terms
        </a>
      </nav>
    </div>

    <div className="shell border-t border-border py-5">
      <p className="text-[13px] text-muted">
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {OWNER.legalName}. Internal systems built
        for small businesses.
      </p>
    </div>
  </footer>
);

export default Footer;
