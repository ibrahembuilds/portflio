import { ArrowRight, Check } from "lucide-react";
import { AUDIT_URL, CTA, GITHUB_URL, OWNER } from "../../config/site";
import {
  CLIENT_SYSTEMS,
  FAQS,
  HERO,
  OPEN_SOURCE_NOTE,
  PROBLEM_QUOTES,
  PROCESS,
  TEARDOWN_STEPS,
  WHAT_I_BUILD,
} from "../../config/content";
import { SectionHeader } from "../components/Section";
import { BeforeAfter, Flow } from "../components/Flow";

const Hero = () => (
  <section className="border-b border-border">
    <div className="shell grid items-center gap-12 pb-16 pt-14 md:pb-24 md:pt-20 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
      <div>
        <h1 className="h-display max-w-[17ch] text-balance">{HERO.headline}</h1>
        <p className="lede mt-7 max-w-prose text-pretty">{HERO.body}</p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href={AUDIT_URL} className="btn btn-primary">
            {CTA.primary}
            <ArrowRight size={17} aria-hidden="true" />
          </a>
          <a href={CTA.secondaryHref} className="btn btn-secondary">
            {CTA.secondary}
          </a>
        </div>

        <p className="mt-8 max-w-[52ch] border-l-2 border-[var(--primary)] pl-4 text-[14px] leading-relaxed text-muted">
          {HERO.trust}
        </p>
      </div>

      {/* A plain operational map, not decoration: this is the shape of the
          problem the offer addresses. */}
      <figure className="card overflow-hidden p-0">
        <div className="h-1 bg-[var(--brand)]" aria-hidden="true" />
        <div className="p-6 md:p-7">
        <figcaption className="eyebrow">A small business, mapped</figcaption>
        <div className="mt-5">
          <Flow
            label="Enquiry to payment"
            nodes={[
              { label: "Enquiry", meta: "Phone, form, WhatsApp" },
              { label: "Quote", meta: "Spreadsheet" },
              { label: "Job", meta: "Someone's notes" },
              { label: "Invoice", meta: "Accounting tool" },
            ]}
          />
        </div>
        <div className="mt-6 space-y-3 border-t border-border pt-5">
          {[
            "Information re-typed at every step",
            "No single place to see where a job is",
            "One person holds the process in their head",
          ].map((item) => (
            <p key={item} className="flex items-start gap-2.5 text-[13px] leading-snug text-muted">
              <span
                className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--border-strong)]"
                aria-hidden="true"
              />
              {item}
            </p>
          ))}
        </div>
        </div>
      </figure>
    </div>
  </section>
);

const ProblemRecognition = () => (
  <section className="section border-b border-border" aria-labelledby="problems">
    <div className="shell">
      <div className="max-w-[46rem]" data-reveal>
        <p className="eyebrow">Sound familiar</p>
        <h2 id="problems" className="h-section mt-3">
          Most owners don't describe this as a software problem.
        </h2>
        <p className="lede mt-4 max-w-prose text-pretty">
          They describe it like this. If more than one of these is true in your business, there is usually a fix worth
          doing.
        </p>
      </div>

      <ul className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
        {PROBLEM_QUOTES.map((quote, index) => (
          <li
            key={quote}
            className="bg-surface p-6"
            data-reveal
            style={{ "--reveal-delay": `${(index % 3) * 0.05}s` } as React.CSSProperties}
          >
            <blockquote className="text-[15px] leading-relaxed text-ink">“{quote}”</blockquote>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

const WhatIBuild = () => (
  <section className="section border-b border-border" id="what-i-build">
    <div className="shell">
      <SectionHeader
        eyebrow="What I build"
        title="One system your team opens instead of five tabs."
        body="Every build starts from a process you already run. Nothing here is a template you have to bend your business around."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {WHAT_I_BUILD.map((item, index) => (
          <article
            key={item.title}
            className="card flex flex-col p-6 md:p-7"
            data-reveal
            style={{ "--reveal-delay": `${(index % 2) * 0.05}s` } as React.CSSProperties}
          >
            <h3 className="h-card">{item.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{item.body}</p>
            <ul className="mt-5 flex flex-wrap gap-2 border-t border-border pt-5">
              {item.examples.map((example) => (
                <li
                  key={example}
                  className="rounded-md bg-[var(--primary-soft)] px-2.5 py-1 text-[12.5px] font-medium text-[var(--primary-strong)]"
                >
                  {example}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-10" data-reveal>
        <BeforeAfter
          beforeTitle="How client onboarding usually runs"
          before={[
            { label: "Enquiry arrives", note: "Phone, form and WhatsApp, in three places" },
            { label: "Details re-typed", note: "Into a spreadsheet, then into the quoting tool" },
            { label: "Documents emailed", note: "A PDF, a form and a follow-up chase" },
            { label: "Nobody can see the status", note: "Someone has to be asked" },
          ]}
          afterTitle="How it runs after"
          after={[
            "Enquiry lands in one record, from any channel",
            "Details entered once, reused everywhere",
            "Client completes onboarding in a portal",
            "Status visible to you without asking anyone",
          ]}
        />
      </div>
    </div>
  </section>
);

const HowIWork = () => (
  <section className="section border-b border-border" id="how-i-work">
    <div className="shell">
      <SectionHeader
        eyebrow="How I work"
        title="Four steps. No open-ended engagements."
        body="You always know what happens next, what it includes, and what it does not."
      />

      <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-[var(--border)] md:grid-cols-2 lg:grid-cols-4">
        {PROCESS.map((step, index) => (
          <li
            key={step.title}
            className="flex flex-col bg-surface p-6 md:p-7"
            data-reveal
            style={{ "--reveal-delay": `${(index % 4) * 0.05}s` } as React.CSSProperties}
          >
            <span className="font-mono text-[12px] text-muted">{step.step}</span>
            <h3 className="h-card mt-3">{step.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink">“{step.quote}”</p>
          </li>
        ))}
      </ol>

      <p className="mt-8" data-reveal>
        <a
          href="/how-it-works"
          className="inline-flex items-center gap-2 text-[15px] font-medium text-[var(--primary)] underline-offset-4 hover:underline"
        >
          See how a build actually runs
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      </p>
    </div>
  </section>
);

const SelectedProof = () => {
  const featured = CLIENT_SYSTEMS.filter((item) => item.featured);

  return (
    <section className="section border-b border-border" id="proof">
      <div className="shell">
        <SectionHeader
          eyebrow="Selected proof"
          title="Systems that are live, and code you can read."
          body="Open any of these. I would rather you check the work than read a claim about it."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {featured.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card group flex flex-col p-6 transition-colors hover:border-[var(--primary)]"
              data-reveal
              style={{ "--reveal-delay": `${(index % 3) * 0.05}s` } as React.CSSProperties}
            >
              <span className="font-mono text-[12px] text-muted">{item.domain}</span>
              <h3 className="h-card mt-3 group-hover:text-[var(--primary)]">{item.name}</h3>
              <p className="mt-1.5 text-[13px] font-medium text-[var(--primary-strong)]">{item.kind}</p>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">{item.body}</p>
            </a>
          ))}
        </div>

        <div className="card mt-5 flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-7" data-reveal>
          <div>
            <h3 className="h-card">
              {OWNER.publicRepoCount} public repositories on GitHub
            </h3>
            <p className="mt-2 max-w-prose text-[14px] leading-relaxed text-muted">{OPEN_SOURCE_NOTE}</p>
          </div>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn btn-secondary shrink-0">
            Read the code
          </a>
        </div>

        <p className="mt-6 text-[14px] text-muted" data-reveal>
          <a href="/work" className="text-[var(--primary)] underline-offset-4 hover:underline">
            See everything I have delivered
          </a>
        </p>
      </div>
    </section>
  );
};

const TeardownExplainer = () => (
  <section className="section border-b border-border bg-surface" id="systems-teardown">
    <div className="shell">
      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div data-reveal>
          <p className="eyebrow">The Systems Teardown</p>
          <h2 className="h-section mt-3 max-w-[16ch]">Find out what is worth fixing before you spend anything.</h2>
          <p className="lede mt-5 max-w-prose text-pretty">
            A 20-minute call about one process in your business, then a written map of where work leaks, what to fix
            first, and a fixed quote for that fix. The written map arrives within 48 hours of the call.
          </p>
          <a href={AUDIT_URL} className="btn btn-primary mt-8">
            {CTA.primary}
            <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>

        <ol className="grid gap-px overflow-hidden rounded-xl border border-border bg-[var(--border)]" data-reveal>
          {TEARDOWN_STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4 bg-surface p-6">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--primary-soft)] font-mono text-[12px] font-medium text-[var(--primary-strong)]">
                {index + 1}
              </span>
              <div>
                <h3 className="h-card">{step.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </section>
);

const FaqSection = () => (
  <section className="section border-b border-border" id="faq">
    <div className="shell grid gap-10 lg:grid-cols-[0.6fr_1.4fr] lg:gap-16">
      <SectionHeader title="Questions owners ask." />
      <div className="border-t border-border">
        {FAQS.map((item) => (
          <details key={item.q} className="group border-b border-border" data-reveal>
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[16px] font-medium leading-snug [&::-webkit-details-marker]:hidden">
              {item.q}
              <span
                className="mt-1 grid h-5 w-5 shrink-0 place-items-center text-muted transition-transform group-open:rotate-45"
                aria-hidden="true"
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.5 0v13M0 6.5h13" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </span>
            </summary>
            <p className="max-w-prose pb-6 text-[15px] leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

const FinalCta = () => (
  <section className="section">
    <div className="shell">
      <div className="card overflow-hidden bg-[var(--primary-soft)] p-0" data-reveal>
        <div className="h-1 bg-[var(--brand)]" aria-hidden="true" />
        <div className="p-8 md:p-14">
        <div className="max-w-[46rem]">
          <h2 className="h-section max-w-[18ch]">Start with one process that is costing you time.</h2>
          <p className="lede mt-5 max-w-prose text-pretty">
            Answer a few questions about how your team works. You get a preliminary Systems Report on screen, and if it
            looks like a fit, we book the 20-minute Teardown.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={AUDIT_URL} className="btn btn-primary">
              {CTA.primary}
              <ArrowRight size={17} aria-hidden="true" />
            </a>
            <a href="/services" className="btn btn-secondary">
              See the four ways I work
            </a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {["Takes a few minutes", "No technical knowledge required", "No obligation"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-[14px] text-muted">
                <Check size={15} className="text-[var(--success)]" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        </div>
      </div>
    </div>
  </section>
);

const Home = () => (
  <>
    <Hero />
    <ProblemRecognition />
    <WhatIBuild />
    <HowIWork />
    <SelectedProof />
    <TeardownExplainer />
    <FaqSection />
    <FinalCta />
  </>
);

export default Home;
