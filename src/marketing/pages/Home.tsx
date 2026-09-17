import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { AUDIT_URL, CONTACT_EMAIL, CTA, GITHUB_URL, LINKEDIN_URL, OWNER } from "../../config/site";
import {
  CLIENT_SYSTEMS,
  EXPERIENCE_INTRO,
  FAQS,
  GOOD_FIT,
  HERO,
  NOT_A_FIT,
  OPEN_SOURCE_NOTE,
  PRICING_NOTE,
  PROBLEM_QUOTES,
  PROCESS,
  SERVICES,
  TEARDOWN_STEPS,
} from "../../config/content";
import { SectionHeader } from "../components/Section";
import portrait640 from "../../assets/portrait-640.webp";
import portrait960 from "../../assets/portrait-960.webp";
import portrait1280 from "../../assets/portrait-1280.webp";

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

      <figure className="overflow-hidden rounded-xl border border-border" data-reveal>
        <img
          src={portrait960}
          srcSet={`${portrait640} 640w, ${portrait960} 960w, ${portrait1280} 1280w`}
          sizes="(min-width: 1024px) 420px, (min-width: 640px) 60vw, 100vw"
          width={960}
          height={960}
          alt={`${OWNER.legalName}, who builds the systems described on this site`}
          className="aspect-square w-full bg-[var(--background)] object-cover"
          decoding="async"
        />
        <figcaption className="border-t border-border bg-surface px-6 py-4">
          <p className="text-[15px] font-semibold text-ink">{OWNER.name}</p>
          <p className="mt-0.5 text-[13px] text-muted">{OWNER.role}, {OWNER.employer}</p>
        </figcaption>
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

const Experience = () => {
  const facts = [
    { label: "Current role", value: `${OWNER.role}, ${OWNER.employer}` },
    { label: "Studying", value: `${OWNER.study}, ${OWNER.university}` },
    { label: "Public code", value: `${OWNER.publicRepoCount} repositories on GitHub` },
    { label: "You work with", value: "Me. Directly." },
  ];

  return (
    <section className="section border-b border-border" id="experience">
      <div className="shell grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div data-reveal>
          <p className="eyebrow">Experience</p>
          <h2 className="h-section mt-3 max-w-[22ch]">I build the internal systems small businesses end up running on.</h2>
          <div className="prose-block mt-6 max-w-prose text-[16px] leading-relaxed text-muted">
            {EXPERIENCE_INTRO.map((paragraph, index) => (
              <p key={paragraph.slice(0, 24)} className={index === 0 ? "text-ink" : "mt-4"}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div data-reveal>
          <dl className="overflow-hidden rounded-xl border border-border">
            {facts.map((fact) => (
              <div key={fact.label} className="border-b border-border bg-surface p-5 last:border-b-0">
                <dt className="eyebrow">{fact.label}</dt>
                <dd className="mt-2 text-[15px] leading-snug text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn btn-secondary mt-5 w-full">
            github.com/ibrahembuilds
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="btn btn-secondary mt-2 w-full">
            LinkedIn
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-ghost mt-2 w-full">
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>

      <div className="shell mt-16">
        <SectionHeader eyebrow="Who this is for" title="Owners and operations managers, not procurement committees." />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {[GOOD_FIT, NOT_A_FIT].map((fit) => (
            <div key={fit.title} className="card p-6 md:p-7" data-reveal>
              <h3 className="h-card">{fit.title}</h3>
              <ul className="mt-4 space-y-2.5 text-[15px] leading-snug text-muted">
                {fit.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Projects = () => {
  const featured = CLIENT_SYSTEMS.filter((item) => item.featured);
  const other = CLIENT_SYSTEMS.filter((item) => !item.featured);

  return (
    <section className="section border-b border-border" id="projects">
      <div className="shell">
        <SectionHeader
          eyebrow="Projects"
          title="Open it and judge it yourself."
          body="Live client systems and public source code. No client numbers, savings figures or testimonials — what I can show you is the work."
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

        <div className="mt-10" data-reveal>
          <h3 className="eyebrow">Also delivered</h3>
          <ul className="mt-4 grid gap-px overflow-hidden rounded-xl border border-border bg-[var(--border)] sm:grid-cols-2">
            {other.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col bg-surface p-6 transition-colors hover:bg-[var(--primary-soft)]"
                >
                  <span className="font-mono text-[12px] text-muted">{item.domain}</span>
                  <span className="h-card mt-2 group-hover:text-[var(--primary)]">{item.name}</span>
                  <span className="mt-1 text-[13px] text-muted">{item.kind}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="card mt-5 flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-7" data-reveal>
          <div>
            <h3 className="h-card">{OWNER.publicRepoCount} public repositories on GitHub</h3>
            <p className="mt-2 max-w-prose text-[14px] leading-relaxed text-muted">{OPEN_SOURCE_NOTE}</p>
          </div>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn btn-secondary shrink-0">
            Read the code
          </a>
        </div>
      </div>
    </section>
  );
};

const Offers = () => (
  <section className="section border-b border-border" id="services">
    <div className="shell">
      <SectionHeader
        eyebrow="Services"
        title="Four ways to bring in the technical side you don't have."
        body="Every engagement starts with a Systems Teardown, because I will not quote a build for a process I have not seen."
      />

      <div className="mt-12 grid gap-5">
        {SERVICES.map((service, index) => (
          <article
            key={service.id}
            id={service.id}
            className={`card p-7 md:p-10 ${service.primary ? "border-[var(--primary)] bg-[var(--primary-soft)]" : ""}`}
            data-reveal
            style={{ "--reveal-delay": `${Math.min(index, 2) * 0.05}s` } as React.CSSProperties}
          >
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-14">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="h-section !text-[1.5rem] md:!text-[1.75rem]">{service.name}</h3>
                  {service.primary && (
                    <span className="rounded-md bg-[var(--primary)] px-2 py-1 text-[11px] font-medium uppercase tracking-[0.07em] text-white">
                      Start here
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[14px] font-medium text-[var(--primary-strong)]">{service.tagline}</p>
                <p className="mt-5 max-w-prose text-[15px] leading-relaxed text-ink">{service.body}</p>
                {service.note && <p className="mt-4 max-w-prose text-[14px] leading-relaxed text-muted">{service.note}</p>}
              </div>

              <div className="grid gap-7 sm:grid-cols-2 lg:gap-8">
                <div>
                  <h4 className="eyebrow">For you if</h4>
                  <ul className="mt-4 space-y-2.5">
                    {service.forYouIf.map((item) => (
                      <li key={item} className="text-[14px] leading-snug text-muted">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="eyebrow">What you get</h4>
                  <ul className="mt-4 space-y-2.5">
                    {service.deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[14px] leading-snug text-ink">
                        <Check size={15} className="mt-[3px] shrink-0 text-[var(--success)]" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {service.primary && (
              <div className="mt-9 border-t border-[var(--primary)]/25 pt-7">
                <a href={AUDIT_URL} className="btn btn-primary">
                  {CTA.primary}
                  <ArrowRight size={17} aria-hidden="true" />
                </a>
              </div>
            )}
          </article>
        ))}
      </div>

      <div className="mt-8 max-w-prose" data-reveal>
        <h3 className="h-card">On price</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">{PRICING_NOTE}</p>
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

      <ol className="mt-12 grid gap-5 md:grid-cols-2">
        {PROCESS.map((step, index) => (
          <li
            key={step.title}
            className="card flex flex-col p-6 md:p-7"
            data-reveal
            style={{ "--reveal-delay": `${(index % 4) * 0.05}s` } as React.CSSProperties}
          >
            <span className="font-mono text-[12px] text-muted">{step.step}</span>
            <h3 className="h-card mt-3">{step.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink">“{step.quote}”</p>
            <p className="mt-3 text-[14px] leading-relaxed text-muted">{step.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

const TeardownExplainer = () => (
  <section className="section border-b border-border bg-surface">
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
      <div className="panel-accent overflow-hidden rounded-xl" data-reveal>
        <div className="p-8 md:p-14">
        <div className="max-w-[46rem]">
          <h2 className="h-section max-w-[18ch]">Start with one process that is costing you time.</h2>
          <p className="mt-5 max-w-prose text-pretty text-[1.0625rem] leading-relaxed text-ink/80 sm:text-[1.1875rem]">
            Answer a few questions about how your team works. You get a preliminary Systems Report on screen, and if it
            looks like a fit, we book the 20-minute Teardown.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={AUDIT_URL} className="btn btn-primary">
              {CTA.primary}
              <ArrowRight size={17} aria-hidden="true" />
            </a>
            <a href="/#services" className="btn btn-secondary">
              See the four ways I work
            </a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {["Takes a few minutes", "No technical knowledge required", "No obligation"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-[14px] text-ink/75">
                <Check size={15} className="text-ink" aria-hidden="true" />
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
    <Experience />
    <Projects />
    <Offers />
    <HowIWork />
    <TeardownExplainer />
    <FaqSection />
    <FinalCta />
  </>
);

export default Home;
