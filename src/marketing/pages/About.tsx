import { ArrowRight, ArrowUpRight } from "lucide-react";
import { AUDIT_URL, CONTACT_EMAIL, CTA, GITHUB_URL, LINKEDIN_URL, OWNER, STACK } from "../../config/site";
import { experienceFlow } from "../../config/content";
import { PageHeader, SectionHeader } from "../components/Section";
import { Flow } from "../components/Flow";
import portrait640 from "../../assets/portrait-640.webp";
import portrait960 from "../../assets/portrait-960.webp";
import portrait1280 from "../../assets/portrait-1280.webp";

const FACTS = [
  { label: "Current role", value: `${OWNER.role}, ${OWNER.employer}` },
  { label: "Studying", value: `${OWNER.study}, ${OWNER.university}` },
  { label: "Public code", value: `${OWNER.publicRepoCount} repositories on GitHub` },
  { label: "You work with", value: "Me. Directly." },
];

const About = () => (
  <>
    <PageHeader
      eyebrow="About"
      title="I build the internal systems small businesses end up running on."
      body="Not an agency. Not a team. You deal directly with the person writing the code."
    />

    <section className="section">
      <div className="shell grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div className="prose-block max-w-prose text-[16px] leading-relaxed text-muted" data-reveal>
          <p className="text-ink">
            I'm {OWNER.name}. I study {OWNER.study} at {OWNER.university}, and I work as a {OWNER.role} at{" "}
            {OWNER.employer}. Outside both, I build and ship software in public — {OWNER.publicRepoCount}{" "}
            repositories, most with real test suites, because I'd rather you read how I work than take my word for
            it.
          </p>
          <p>
            Most businesses between 5 and 50 people run on a set of tools that were each added to solve one problem,
            and never designed to work together. A spreadsheet here, an inbox there, a booking tool that does part of
            the job, and a person who remembers the rest.
          </p>
          <p>
            It works, until it does not. A lead sits unanswered. An invoice never gets raised. The one person who
            knows how a process runs takes a week off. Nobody set out to build it this way — it accumulated.
          </p>
          <p>
            I build the system that replaces that: a custom CRM, a client portal, a job or booking system, an
            internal dashboard, or the automation that connects what you already pay for. Built around a process you
            already run, deployed on accounts in your name, documented so your team can use it without me.
          </p>
          <p>
            I work on a fixed scope, a fixed price and a fixed date, quoted after I have seen the process. If I do
            not think I can fix the problem, I say so and we stop. That is a better outcome for both of us than a
            project that should not have started.
          </p>
        </div>

        <div data-reveal>
          {/* The photograph is keyed onto the page colour by scripts/portrait.mjs,
              so it sits in the layout without a second background showing
              through behind it. */}
          <figure className="overflow-hidden rounded-xl border border-border">
            <img
              src={portrait960}
              srcSet={`${portrait640} 640w, ${portrait960} 960w, ${portrait1280} 1280w`}
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
              width={960}
              height={960}
              alt={`${OWNER.legalName}, who builds the systems described on this site`}
              className="aspect-square w-full bg-[var(--background)] object-cover"
              loading="lazy"
              decoding="async"
            />
            <figcaption className="border-t border-border bg-surface px-5 py-4">
              <p className="text-[15px] font-semibold text-ink">{OWNER.name}</p>
              <p className="mt-0.5 text-[13px] text-muted">{OWNER.discipline}</p>
            </figcaption>
          </figure>

          <dl className="mt-5 overflow-hidden rounded-xl border border-border">
            {FACTS.map((fact) => (
              <div key={fact.label} className="border-b border-border bg-surface p-5 last:border-b-0">
                <dt className="eyebrow">{fact.label}</dt>
                <dd className="mt-2 text-[15px] leading-snug text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary mt-5 w-full"
          >
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
    </section>

    <section className="section border-t border-border bg-surface">
      <div className="shell">
        <SectionHeader
          eyebrow="Experience"
          title="What I'm doing right now, not a résumé of what I used to do."
          body="No dates below. I'd rather show you four things you can check than a timeline with a year I'm guessing at."
        />
        <div className="mt-10" data-reveal>
          <Flow label="Experience" nodes={experienceFlow(OWNER.publicRepoCount)} />
        </div>
      </div>
    </section>

    <section className="section border-t border-border">
      <div className="shell">
        <SectionHeader
          eyebrow="Tools"
          title="What I build with, and why each one is there."
          body="Named here, not in the hero, because you're hiring me to fix a process, not to buy a stack. What matters is that it's deployed on accounts in your name."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2" data-reveal>
          {STACK.map((group) => (
            <div key={group.group} className="card p-6 md:p-7">
              <h3 className="h-card">{group.group}</h3>
              <p className="mt-2 font-mono text-[13px] text-[var(--primary-strong)]">{group.items.join(" · ")}</p>
              <p className="mt-3 text-[14px] leading-snug text-muted">{group.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="section border-t border-border bg-surface">
      <div className="shell">
        <SectionHeader
          eyebrow="Who this is for"
          title="Owners and operations managers, not procurement committees."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="card p-6 md:p-7" data-reveal>
            <h3 className="h-card">A good fit</h3>
            <ul className="mt-4 space-y-2.5 text-[15px] leading-snug text-muted">
              <li>Roughly 5 to 50 people, with no internal technical team</li>
              <li>An owner, founder or operations manager who can make the decision</li>
              <li>One process you can point at that is costing time or losing work</li>
              <li>Trades and home services, clinics and allied health, professional services, real estate, logistics, education providers</li>
            </ul>
          </div>
          <div className="card p-6 md:p-7" data-reveal>
            <h3 className="h-card">Not a fit</h3>
            <ul className="mt-4 space-y-2.5 text-[15px] leading-snug text-muted">
              <li>You want a marketing website rather than an operational system</li>
              <li>You want the cheapest possible quote rather than the right fix</li>
              <li>You already have an internal development team who own this work</li>
              <li>Nobody on your side can describe how the process currently runs</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section className="section border-t border-border">
      <div className="shell">
        <div className="card bg-[var(--primary-soft)] p-8 md:p-12" data-reveal>
          <h2 className="h-section max-w-[18ch]">The fastest way to find out if I can help.</h2>
          <p className="lede mt-5 max-w-prose text-pretty">
            Answer a few questions about one process. You get a written report on screen, and we go from there.
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

export default About;
