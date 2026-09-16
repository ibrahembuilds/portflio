import { ArrowRight, ArrowUpRight } from "lucide-react";
import { AUDIT_URL, CTA, GITHUB_URL, OWNER } from "../../config/site";
import { CLIENT_SYSTEMS, OPEN_SOURCE_NOTE } from "../../config/content";
import { PageHeader, SectionHeader } from "../components/Section";

const Work = () => {
  const featured = CLIENT_SYSTEMS.filter((item) => item.featured);
  const other = CLIENT_SYSTEMS.filter((item) => !item.featured);

  return (
    <>
      <PageHeader
        eyebrow="Work"
        title="Open it and judge it yourself."
        body="Everything below is a live URL or public source code. I don't publish client numbers, savings figures or testimonials — what I can show you is the work."
      />

      <section className="section">
        <div className="shell">
          <SectionHeader eyebrow="Client systems" title="Delivered and running." />

          <div className="mt-10 grid gap-5">
            {featured.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card group grid gap-6 p-7 transition-colors hover:border-[var(--primary)] md:grid-cols-[1fr_1.35fr] md:gap-12 md:p-10"
                data-reveal
                style={{ "--reveal-delay": `${Math.min(index, 2) * 0.05}s` } as React.CSSProperties}
              >
                <div>
                  <span className="font-mono text-[12px] text-muted">{item.domain}</span>
                  <h3 className="h-section mt-2 !text-[1.375rem] group-hover:text-[var(--primary)]">{item.name}</h3>
                  <p className="mt-2 text-[14px] font-medium text-[var(--primary-strong)]">{item.kind}</p>
                </div>
                <div className="flex items-start justify-between gap-6">
                  <p className="max-w-prose text-[15px] leading-relaxed text-muted">{item.body}</p>
                  <ArrowUpRight
                    size={20}
                    className="mt-1 shrink-0 text-muted group-hover:text-[var(--primary)]"
                    aria-hidden="true"
                  />
                </div>
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
        </div>
      </section>

      <section className="section border-t border-border bg-surface">
        <div className="shell">
          <SectionHeader
            eyebrow="Public code"
            title={`${OWNER.publicRepoCount} repositories you can read.`}
            body={OPEN_SOURCE_NOTE}
          />
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center" data-reveal>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              github.com/ibrahembuilds
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <p className="text-[14px] text-muted">
              Reading someone's tests tells you more about how they build than any case study.
            </p>
          </div>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="shell">
          <div className="card bg-[var(--primary-soft)] p-8 md:p-12" data-reveal>
            <h2 className="h-section max-w-[20ch]">Want to know what this would look like in your business?</h2>
            <p className="lede mt-5 max-w-prose text-pretty">
              Start with one process. You get a written report showing what looks worth fixing first.
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
};

export default Work;
