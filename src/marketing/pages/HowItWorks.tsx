import { ArrowRight } from "lucide-react";
import { AUDIT_URL, CTA } from "../../config/site";
import { PROCESS } from "../../config/content";
import { PageHeader, SectionHeader } from "../components/Section";
import { BeforeAfter, Flow } from "../components/Flow";

const HowItWorks = () => (
  <>
    <PageHeader
      eyebrow="How it works"
      title="Map. Quote. Build. Hand over."
      body="Four steps, in that order. You can stop after any of them, and you own everything produced up to that point."
    />

    <section className="section">
      <div className="shell">
        <ol className="grid gap-5">
          {PROCESS.map((step, index) => (
            <li
              key={step.title}
              className="card grid gap-7 p-7 md:grid-cols-[auto_1fr] md:gap-12 md:p-10"
              data-reveal
              style={{ "--reveal-delay": `${Math.min(index, 2) * 0.05}s` } as React.CSSProperties}
            >
              <div className="flex items-baseline gap-4 md:w-[9rem] md:flex-col md:gap-2">
                <span className="font-mono text-[12px] text-muted">{step.step}</span>
                <h2 className="h-section !text-[1.5rem]">{step.title}</h2>
              </div>
              <div>
                <p className="max-w-prose text-[17px] leading-snug text-ink">“{step.quote}”</p>
                <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-muted">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>

    <section className="section border-t border-border bg-surface">
      <div className="shell">
        <SectionHeader
          eyebrow="What a build looks like"
          title="You see working software early, not a progress report."
          body="Nothing is hidden until the end. The system is something you can open and click while it is still being built."
        />
        <div className="mt-10" data-reveal>
          <Flow
            label="Build sequence"
            nodes={[
              { label: "Scope agreed", meta: "Fixed scope, price and date" },
              { label: "You open v1", meta: "Week one, on your real data shape" },
              { label: "Shaped to your team", meta: "Against how the work actually runs" },
              { label: "Live", meta: "Your accounts, your data" },
              { label: "Handed over", meta: "Training and documentation" },
            ]}
          />
        </div>
      </div>
    </section>

    <section className="section border-t border-border">
      <div className="shell">
        <SectionHeader
          eyebrow="What changes"
          title="The point is not new software. It is work that stops leaking."
        />
        <div className="mt-10" data-reveal>
          <BeforeAfter
            beforeTitle="Before"
            before={[
              { label: "A lead comes in", note: "Seen when someone next checks the inbox" },
              { label: "Details copied", note: "Into a spreadsheet, and again into the quote" },
              { label: "Follow-up", note: "If someone remembers" },
              { label: "You ask for an update", note: "Someone has to go and look" },
            ]}
            afterTitle="After"
            after={[
              "Every lead lands in one record, with a timestamp",
              "Details entered once and reused",
              "Follow-up happens without being remembered",
              "You can see status without asking anyone",
            ]}
          />
        </div>
      </div>
    </section>

    <section className="section border-t border-border">
      <div className="shell">
        <div className="card bg-[var(--primary-soft)] p-8 md:p-12" data-reveal>
          <h2 className="h-section max-w-[18ch]">It starts with 20 minutes on one process.</h2>
          <p className="lede mt-5 max-w-prose text-pretty">
            Answer a few questions first so the call starts from something concrete rather than from scratch.
          </p>
          <a href={AUDIT_URL} className="btn btn-primary mt-8">
            {CTA.primary}
            <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  </>
);

export default HowItWorks;
