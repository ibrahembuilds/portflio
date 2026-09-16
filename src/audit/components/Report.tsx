import { ArrowRight, Download, Linkedin, Mail } from "lucide-react";
import { buildInvestmentSection } from "../../config/investment";
import { CONTACT_EMAIL, LINKEDIN_URL, OWNER, SITE_URL } from "../../config/site";
import type { SystemsReport } from "../../server/report/schema";
import type { NextAction } from "../api";

/**
 * The on-screen Systems Report.
 *
 * Every value here comes from data that passed server-side schema validation.
 * Nothing model-generated is ever rendered as HTML — it is read out of typed
 * fields and placed into these components as text.
 */

const PRIORITY_LABEL: Record<string, string> = {
  critical: "Fix first",
  important: "Worth fixing",
  later: "Can wait",
};

const PRIORITY_ORDER: Record<string, number> = { critical: 0, important: 1, later: 2 };

const DELIVERY_PATH_COPY: Record<SystemsReport["likely_delivery_path"], string> = {
  systems_teardown:
    "The next step is the Systems Teardown itself: 20 minutes on one process, then a written map and a fixed quote for the highest-priority fix.",
  automation_sprint:
    "From what you described, this may be an Automation Sprint — connecting the systems you already use so the repeated copying and chasing stops. That gets confirmed on the call, not before.",
  core_system_build:
    "From what you described, this may be a Core System Build — one operational system built around the process you described, replacing the spreadsheets and inboxes it runs on today. That gets confirmed on the call, not before.",
  unclear:
    "There isn't enough detail yet to say what kind of work this needs. That is exactly what the 20-minute call is for.",
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="border-t border-border pt-8">
    <h2 className="text-[12px] font-medium uppercase tracking-[0.09em] text-muted">{title}</h2>
    <div className="mt-4">{children}</div>
  </section>
);

const PriorityChip = ({ priority }: { priority: string }) => (
  <span
    className={`shrink-0 rounded-md px-2 py-1 text-[11px] font-medium uppercase tracking-[0.05em] ${
      priority === "critical"
        ? "bg-[var(--primary-soft)] text-[var(--primary-strong)]"
        : priority === "important"
          ? "bg-[#F1F3F7] text-ink"
          : "bg-[#F1F3F7] text-muted"
    }`}
  >
    {PRIORITY_LABEL[priority] ?? priority}
  </span>
);

type Props = {
  report: SystemsReport;
  companyName: string;
  firstName: string;
  generatedAt: string;
  nextAction: NextAction;
  pdfHref: string | null;
  onBookingClick: () => void;
  notice?: string | null;
};

const Report = ({
  report,
  companyName,
  firstName,
  generatedAt,
  nextAction,
  pdfHref,
  onBookingClick,
  notice,
}: Props) => {
  const ordered = [...report.findings].sort(
    (a, b) => (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9),
  );

  const grouped = (["critical", "important", "later"] as const)
    .map((priority) => ({ priority, items: ordered.filter((finding) => finding.priority === priority) }))
    .filter((group) => group.items.length > 0);

  const generatedLabel = new Date(generatedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="pb-20">
      <header className="border-b border-border pb-8">
        <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-muted">Preliminary</p>
        <h1 className="mt-3 text-[2rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[2.5rem]">
          Systems Report
        </h1>
        <p className="mt-2 text-[1.0625rem] text-[var(--primary)]">{companyName}</p>
        <p className="mt-1 text-[14px] text-muted">
          Prepared for {firstName} · {generatedLabel}
        </p>

        <div className="no-print mt-7 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {pdfHref && (
            <a href={pdfHref} className="btn btn-secondary" download>
              <Download size={16} aria-hidden="true" />
              Download PDF
            </a>
          )}
          {nextAction.kind === "book" && (
            <a
              href={nextAction.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onBookingClick}
              className="btn btn-primary"
            >
              {nextAction.label}
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          )}
        </div>

        {notice && (
          <p className="no-print mt-5 rounded-lg border border-border bg-surface px-4 py-3 text-[13px] leading-relaxed text-muted">
            {notice}
          </p>
        )}
      </header>

      <div className="mt-8 grid gap-8">
        <p className="text-[17px] leading-relaxed text-ink">{report.executive_summary}</p>

        <Section title="Business snapshot">
          <dl className="grid gap-px overflow-hidden rounded-xl border border-border bg-[var(--border)] sm:grid-cols-2">
            {[
              ["Business", report.business_context.business],
              ["How often this happens", report.business_context.frequency],
              ["Who does it today", report.business_context.people_involved],
              [
                "Where the work happens now",
                report.business_context.current_tools.length > 0
                  ? report.business_context.current_tools.join(", ")
                  : "Not answered",
              ],
            ].map(([term, value]) => (
              <div key={term} className="bg-surface p-5">
                <dt className="text-[12px] font-medium uppercase tracking-[0.07em] text-muted">{term}</dt>
                <dd className="mt-1.5 text-[15px] leading-snug text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title="Process reviewed">
          <blockquote className="border-l-2 border-[var(--primary)] pl-4 text-[15px] leading-relaxed text-muted">
            {report.business_context.process_reviewed}
          </blockquote>
        </Section>

        <Section title="Where work is leaking">
          <ol className="grid gap-4">
            {ordered.map((finding, index) => (
              <li key={`${finding.title}-${index}`} className="card p-5 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-[1.0625rem] font-semibold leading-snug">
                    {index + 1}. {finding.title}
                  </h3>
                  <PriorityChip priority={finding.priority} />
                </div>
                <div className="mt-4 grid gap-3">
                  <div>
                    <p className="text-[12px] font-medium uppercase tracking-[0.07em] text-muted">
                      What this is based on
                    </p>
                    <p className="mt-1 text-[14.5px] leading-relaxed text-muted">{finding.evidence}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-medium uppercase tracking-[0.07em] text-muted">
                      Effect on the business
                    </p>
                    <p className="mt-1 text-[14.5px] leading-relaxed text-ink">{finding.business_effect}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Priority map">
          <div className="grid gap-4 sm:grid-cols-3">
            {grouped.map((group) => (
              <div key={group.priority} className="card p-5">
                <PriorityChip priority={group.priority} />
                <ul className="mt-3 grid gap-2">
                  {group.items.map((item, index) => (
                    <li key={`${item.title}-${index}`} className="text-[14px] leading-snug text-ink">
                      {item.title}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Recommended first fix">
          <div className="card bg-[var(--primary-soft)] p-6 md:p-8">
            <h3 className="text-[1.25rem] font-semibold leading-snug">{report.recommended_first_fix.title}</h3>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.07em] text-muted">Why this one first</p>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink">{report.recommended_first_fix.reason}</p>
              </div>
              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.07em] text-muted">
                  What changes day to day
                </p>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink">
                  {report.recommended_first_fix.operational_change}
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Example future workflow">
          <ol className="grid gap-2">
            {report.recommended_first_fix.example_flow.map((step, index) => (
              <li key={`${step}-${index}`} className="flex gap-3.5 rounded-lg border border-border bg-surface px-4 py-3">
                <span className="font-mono text-[12px] text-[var(--primary)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-[14.5px] leading-snug text-ink">{step}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="How Ibrahem may be able to help">
          <p className="text-[15px] leading-relaxed text-ink">{DELIVERY_PATH_COPY[report.likely_delivery_path]}</p>
          <p className="mt-3 text-[14px] leading-relaxed text-muted">
            Scope, price and timing are agreed after that conversation, never before. If the right answer turns out to be
            software you can buy, or a change that needs no software at all, that is what you will be told.
          </p>
        </Section>

        <Section title="What this would cost">
          {(() => {
            const investment = buildInvestmentSection(report.likely_delivery_path);
            return (
              <div className="grid gap-5">
                <p className="text-[15px] leading-relaxed text-ink">{investment.offer}</p>

                {investment.range && (
                  <div className="card bg-[var(--primary-soft)] p-5 md:p-6">
                    <p className="text-[12px] font-medium uppercase tracking-[0.07em] text-muted">
                      {investment.offerName}
                    </p>
                    <p className="mt-1.5 text-[1.5rem] font-semibold tracking-[-0.02em] text-[var(--primary)]">
                      {investment.range}
                    </p>
                    {investment.rangeNote && (
                      <p className="mt-2 text-[14px] leading-relaxed text-muted">{investment.rangeNote}</p>
                    )}
                  </div>
                )}

                {investment.included.length > 0 && (
                  <div>
                    <p className="text-[12px] font-medium uppercase tracking-[0.07em] text-muted">
                      What {investment.offerName} includes
                    </p>
                    <ul className="mt-2.5 grid gap-2">
                      {investment.included.map((item) => (
                        <li key={item} className="flex gap-3 text-[14.5px] leading-relaxed text-ink">
                          <span
                            className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)]"
                            aria-hidden="true"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <p className="text-[12px] font-medium uppercase tracking-[0.07em] text-muted">
                    What moves the price
                  </p>
                  <ul className="mt-2.5 grid gap-2">
                    {investment.drivers.map((driver) => (
                      <li key={driver} className="flex gap-3 text-[14.5px] leading-relaxed text-muted">
                        <span className="mt-[10px] h-px w-3 shrink-0 bg-[var(--border-strong)]" aria-hidden="true" />
                        {driver}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-[14.5px] leading-relaxed text-ink">{investment.promise}</p>
                <p className="text-[13.5px] leading-relaxed text-muted">{investment.disclaimer}</p>
              </div>
            );
          })()}
        </Section>

        <Section title="Questions to resolve during the Teardown">
          <ul className="grid gap-2.5">
            {report.questions_for_call.map((question, index) => (
              <li key={`${question}-${index}`} className="flex gap-3 text-[15px] leading-relaxed text-ink">
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)]" aria-hidden="true" />
                {question}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Assumptions">
          {report.assumptions.length === 0 ? (
            <p className="text-[15px] leading-relaxed text-muted">
              No assumptions were needed beyond the answers you gave.
            </p>
          ) : (
            <ul className="grid gap-2.5">
              {report.assumptions.map((assumption, index) => (
                <li key={`${assumption}-${index}`} className="flex gap-3 text-[15px] leading-relaxed text-muted">
                  <span className="mt-[10px] h-px w-3 shrink-0 bg-[var(--border-strong)]" aria-hidden="true" />
                  {assumption}
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Next step">
          <p className="text-[15px] leading-relaxed text-ink">{report.next_step}</p>

          <div className="no-print mt-6 card p-6 md:p-8">
            <h3 className="text-[1.125rem] font-semibold leading-snug">{nextAction.heading}</h3>
            <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-muted">{nextAction.body}</p>

            {nextAction.kind === "book" && (
              <a
                href={nextAction.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onBookingClick}
                className="btn btn-primary mt-6"
              >
                {nextAction.label}
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            )}

            {nextAction.kind === "book_pending" && (
              <div className="mt-6">
                <p className="text-[14px] font-medium text-ink">Booking link coming soon.</p>
                <a href={`mailto:${nextAction.contactEmail}`} className="btn btn-secondary mt-3">
                  <Mail size={16} aria-hidden="true" />
                  {nextAction.contactEmail}
                </a>
              </div>
            )}

            {nextAction.kind === "no_pitch" && (
              <a href={`mailto:${nextAction.contactEmail}`} className="btn btn-secondary mt-6">
                <Mail size={16} aria-hidden="true" />
                {nextAction.contactEmail}
              </a>
            )}
          </div>
        </Section>
      </div>

      <footer className="mt-12 overflow-hidden rounded-xl border border-border">
        <div className="panel-accent border-x-0 border-t-0 px-6 py-3">
          <p className="text-[15px] font-semibold text-ink">{OWNER.name}</p>
          <p className="mt-0.5 text-[13px] text-ink/70">{OWNER.discipline}</p>
        </div>
        <div className="flex flex-col gap-5 bg-surface p-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="hidden sm:block" />
          <div className="flex flex-col gap-2 text-[13.5px] sm:items-end">
            {nextAction.kind === "book" && (
              <a
                href={nextAction.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onBookingClick}
                className="font-medium text-[var(--primary)] underline-offset-4 hover:underline"
              >
                Book a 20-minute call
              </a>
            )}
            <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 text-muted hover:text-ink">
              <Mail size={14} aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted hover:text-ink"
            >
              <Linkedin size={14} aria-hidden="true" />
              LinkedIn
            </a>
            <a href={SITE_URL} className="text-muted hover:text-ink">
              {SITE_URL.replace(/^https?:\/\//, "")}
            </a>
          </div>
        </div>
      </footer>
    </article>
  );
};

export default Report;
