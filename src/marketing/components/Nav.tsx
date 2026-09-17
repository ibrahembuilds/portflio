import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { AUDIT_URL, CTA, NAV_LINKS, OWNER } from "../../config/site";

const Nav = () => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
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
          <a href="/" className="text-[15px] font-semibold tracking-tight" aria-label={`${OWNER.name} — home`}>
            {OWNER.name}
          </a>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[14px] text-muted transition-colors hover:text-[var(--primary)]"
              >
                {link.label}
              </a>
            ))}
            <a href={AUDIT_URL} className="btn btn-primary !px-4 !py-2.5 !text-[14px]">
              {CTA.primary}
            </a>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className="-mr-2 rounded-md p-2 text-ink md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        ref={panelRef}
        hidden={!open}
        className="border-t border-border bg-surface md:hidden"
      >
        <nav className="shell flex flex-col py-2" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-border py-3.5 text-[15px]"
            >
              {link.label}
            </a>
          ))}
          <a href={AUDIT_URL} className="btn btn-primary my-4 w-full">
            {CTA.primary}
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Nav;
