import { ArrowRight, Mail } from "lucide-react";

const EMAIL = "hello@ibrahemahmed.com";
const CALENDLY = "https://calendly.com/ibrahem/conselting";

const Contact = () => (
  <section id="contact" className="border-t border-border bg-primary-tint py-24 md:py-32">
    <div className="shell grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
      <div className="text-center">
        <h2 className="mx-auto max-w-[14ch] text-4xl font-bold leading-[1.02] tracking-[-0.045em] md:text-6xl" data-reveal>
          Have a problem that needs a <span className="text-primary">real system</span>?
        </h2>
        <p className="mx-auto mt-6 max-w-[48ch] text-lg leading-relaxed text-muted" data-reveal>
          Tell me where the process is failing and what you want the software to handle.
        </p>
      </div>

      <div className="lg:pb-1" data-reveal>
        <a
          href={CALENDLY}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-between gap-4 rounded-full bg-primary px-7 py-4 text-[15px] font-semibold text-primary-foreground transition-[background-color,transform] hover:bg-primary-strong active:translate-y-px"
        >
          Work with me <ArrowRight size={18} aria-hidden="true" />
        </a>
        <a
          href={`mailto:${EMAIL}`}
          className="mt-3 flex w-full items-center justify-between gap-4 rounded-full border border-border-strong bg-surface px-7 py-4 text-[15px] font-semibold transition-[border-color,color,transform] hover:border-primary hover:text-primary active:translate-y-px"
        >
          {EMAIL} <Mail size={17} aria-hidden="true" />
        </a>
        <p className="mt-5 text-sm text-muted">30 minutes. No pitch deck required.</p>
      </div>
    </div>
  </section>
);

export default Contact;
