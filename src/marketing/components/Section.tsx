import type { ReactNode } from "react";

export const SectionHeader = ({
  eyebrow,
  title,
  body,
  align = "start",
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: string;
  align?: "start" | "center";
}) => (
  <div className={align === "center" ? "mx-auto max-w-[46rem] text-center" : "max-w-[46rem]"} data-reveal>
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    <h2 className={`h-section ${eyebrow ? "mt-3" : ""}`}>{title}</h2>
    {body && <p className="lede mt-4 max-w-prose text-pretty">{body}</p>}
  </div>
);

export const PageHeader = ({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  children?: ReactNode;
}) => (
  <section className="border-b border-border">
    <div className="shell pb-12 pt-14 md:pb-16 md:pt-20">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="h-display mt-4 max-w-[20ch]">{title}</h1>
      {body && <p className="lede mt-6 max-w-prose text-pretty">{body}</p>}
      {children}
    </div>
  </section>
);
