import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL, NAV_LINKS, OWNER, STACK } from "../../config/site";

/**
 * The stack lives here, at the very bottom of every page — never near a hero
 * and never in a headline. Owners buy the outcome; the tooling is a footnote.
 */
const Footer = ({ showStack = true }: { showStack?: boolean }) => (
  <footer className="border-t border-border bg-surface">
    {showStack && (
      <div className="shell border-b border-border py-10">
        <h2 className="eyebrow">Built with</h2>
        <div className="mt-5 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {STACK.map((group) => (
            <div key={group.group} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="w-full text-[12px] font-medium uppercase tracking-[0.08em] text-muted sm:w-auto">
                {group.group}
              </span>
              <span className="font-mono text-[13px] text-ink">{group.items.join(" · ")}</span>
            </div>
          ))}
        </div>
      </div>
    )}

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
