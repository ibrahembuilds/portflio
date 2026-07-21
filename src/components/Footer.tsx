import { ArrowUpRight, Github, Instagram, Linkedin, Twitter } from "lucide-react";

const socials = [
  { href: "https://github.com/ibrahembuilds", icon: Github, label: "GitHub" },
  { href: "https://www.linkedin.com/in/ibrahem-ahmed-hassan/", icon: Linkedin, label: "LinkedIn" },
  { href: "https://x.com/ibrahembuilds", icon: Twitter, label: "X (Twitter)" },
  { href: "https://www.instagram.com/ibrahembuilds", icon: Instagram, label: "Instagram" },
];

const Footer = () => (
  <footer className="border-t border-border py-9">
    <div className="shell flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <a href="#top" className="text-lg font-bold tracking-tight">
          Ibrahem Ahmed<span className="text-primary">.</span>
        </a>
        <p className="mt-2 text-sm text-muted">
          Founder of KanyouAI, <span suppressHydrationWarning>{new Date().getFullYear()}</span>
        </p>
      </div>
      <div className="flex items-center gap-5">
        <a
          href="https://kanyouai.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 border-r border-border pr-5 text-sm font-medium transition-colors hover:text-primary"
        >
          KanyouAI <ArrowUpRight size={14} aria-hidden="true" />
        </a>
        {socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="text-muted transition-[color,transform] hover:-translate-y-0.5 hover:text-primary"
          >
            <social.icon size={18} />
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
