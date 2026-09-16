import { ArrowLeft, ArrowRight } from "lucide-react";

export type FlowNode = { label: string; meta?: string };

/**
 * A plain left-to-right workflow strip. Renders as an ordered list so a screen
 * reader hears it as a sequence; the arrows are decorative only and collapse to
 * a vertical stack on small screens.
 */
export const Flow = ({ nodes, label, rtl = false }: { nodes: FlowNode[]; label: string; rtl?: boolean }) => {
  // The connector follows reading order: right in LTR, left in RTL, and down
  // on phones where the strip stacks in both directions.
  const Arrow = rtl ? ArrowLeft : ArrowRight;
  const downward = rtl ? "-rotate-90" : "rotate-90";

  return (
  <div role="group" aria-label={label}>
    <ol className="flex flex-col sm:flex-row sm:items-stretch">
      {nodes.map((node, index) => (
        <li key={node.label} className="flex flex-col sm:flex-1 sm:flex-row sm:items-stretch">
          <div className="flex min-h-[68px] w-full flex-1 flex-col justify-center rounded-lg border border-border bg-surface px-3.5 py-3">
            <span className="text-[13px] font-medium leading-snug text-ink">{node.label}</span>
            {node.meta && <span className="mt-1 text-[12px] leading-snug text-muted">{node.meta}</span>}
          </div>
          {index < nodes.length - 1 && (
            // Stacked on phones, so the connector points down between steps;
            // in a row from sm up, so it points along the flow.
            <span
              className="grid shrink-0 place-items-center self-center py-1.5 text-[var(--border-strong)] sm:px-2 sm:py-0"
              aria-hidden="true"
            >
              <Arrow size={16} className={`${downward} sm:rotate-0`} />
            </span>
          )}
        </li>
      ))}
    </ol>
  </div>
  );
};

export type BreakPoint = { label: string; note: string };

/**
 * Two-column "how it runs now / how it could run" diagram. The left column is
 * deliberately drawn as a broken chain — that is the thing an owner recognises.
 */
export const BeforeAfter = ({
  beforeTitle,
  before,
  afterTitle,
  after,
}: {
  beforeTitle: string;
  before: BreakPoint[];
  afterTitle: string;
  after: string[];
}) => (
  <div className="grid gap-4 md:grid-cols-2 md:gap-5">
    <div className="card p-6">
      <h3 className="eyebrow">{beforeTitle}</h3>
      <ol className="mt-5 space-y-0">
        {before.map((item, index) => (
          <li key={item.label} className="relative ps-7">
            <span
              className="absolute start-[7px] top-[22px] h-[calc(100%-14px)] w-px border-s border-dashed border-[var(--border-strong)] last:hidden"
              aria-hidden="true"
              hidden={index === before.length - 1}
            />
            <span
              className="absolute start-0 top-[6px] h-[15px] w-[15px] rounded-full border border-[var(--border-strong)] bg-[var(--background)]"
              aria-hidden="true"
            />
            <div className="pb-5">
              <p className="text-[14px] font-medium leading-snug text-ink">{item.label}</p>
              <p className="mt-0.5 text-[13px] leading-snug text-muted">{item.note}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>

    <div className="card border-[var(--primary-soft)] bg-[var(--primary-soft)] p-6">
      <h3 className="eyebrow text-[var(--primary-strong)]">{afterTitle}</h3>
      <ol className="mt-5 space-y-0">
        {after.map((item, index) => (
          <li key={item} className="relative ps-7">
            <span
              className="absolute start-[7px] top-[22px] h-[calc(100%-14px)] w-px bg-[var(--primary)]/35"
              aria-hidden="true"
              hidden={index === after.length - 1}
            />
            <span
              className="absolute start-0 top-[6px] grid h-[15px] w-[15px] place-items-center rounded-full bg-[var(--primary)]"
              aria-hidden="true"
            >
              <span className="h-[5px] w-[5px] rounded-full bg-white" />
            </span>
            <p className="pb-5 text-[14px] font-medium leading-snug text-ink">{item}</p>
          </li>
        ))}
      </ol>
    </div>
  </div>
);
