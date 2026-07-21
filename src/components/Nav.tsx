import { useState } from "react";
import { Menu, X } from "lucide-react";

const CALENDLY = "https://calendly.com/ibrahem/conselting";

const links = [
  { href: "#work", label: "Work" },
  { href: "#clients", label: "Clients" },
  { href: "#services", label: "Services" },
  { href: "#story", label: "Story" },
];

const Nav = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="shell">
        <div className="flex h-16 items-center justify-between gap-6">
          <a href="#top" className="text-base font-bold tracking-tight">
            Ibrahem Ahmed<span className="text-primary">.</span>
          </a>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap rounded-full bg-primary px-5 py-2 text-[13px] font-semibold text-primary-foreground transition-[background-color,transform] hover:bg-primary-strong active:translate-y-px"
            >
              Work with me
            </a>
          </nav>

          <button
            className="rounded-full p-2 transition-colors hover:bg-primary-tint md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {open && (
          <nav className="flex flex-col border-t border-border px-4 pb-4 pt-1 md:hidden" aria-label="Mobile">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-border py-3 text-base"
              >
                {link.label}
              </a>
            ))}
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="pt-4 text-base font-semibold text-primary"
            >
              Work with me
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Nav;
