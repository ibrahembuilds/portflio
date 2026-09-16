import { ArrowRight, Check } from "lucide-react";
import { AUDIT_URL, CTA } from "../../config/site";
import { PRICING_NOTE, SERVICES } from "../../config/content";
import { PageHeader } from "../components/Section";

const Services = () => (
  <>
    <PageHeader
      eyebrow="Services"
      title="Four ways I work. One place to start."
      body="Every engagement begins with a Systems Teardown, because I will not quote a build for a process I have not seen."
    >
      <a href={AUDIT_URL} className="btn btn-primary mt-8">
        {CTA.primary}
        <ArrowRight size={17} aria-hidden="true" />
      </a>
    </PageHeader>

    <section className="section">
      <div className="shell grid gap-5">
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
                  <h2 className="h-section !text-[1.5rem] md:!text-[1.75rem]">{service.name}</h2>
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
                  <h3 className="eyebrow">For you if</h3>
                  <ul className="mt-4 space-y-2.5">
                    {service.forYouIf.map((item) => (
                      <li key={item} className="text-[14px] leading-snug text-muted">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="eyebrow">What you get</h3>
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
    </section>

    <section className="section-tight border-t border-border">
      <div className="shell">
        <div className="max-w-prose" data-reveal>
          <h2 className="h-card">On price</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">{PRICING_NOTE}</p>
        </div>
      </div>
    </section>
  </>
);

export default Services;
