const milestones = [
  {
    year: "2023",
    title: "Started programming",
    body: "Taught myself to build software and shipped my first public projects the same year.",
  },
  {
    year: "2024",
    title: "Built in public, for real clients",
    body: "Shipped 20+ public products and repositories and delivered systems for named client organizations.",
  },
  {
    year: "2025",
    title: "Founded KanyouAI",
    body: "Registered KanyouAI in the UK to build custom AI products and business systems end to end.",
  },
  {
    year: "Now",
    title: "Studying AI Engineering at MMU",
    body: "Studying at Multimedia University while running KanyouAI and continuing to build my own products.",
  },
];

const Story = () => (
  <section id="story" className="py-24 md:py-32">
    <div className="shell grid items-start gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
      <div className="text-center lg:sticky lg:top-28">
        <h2 className="mx-auto max-w-[15ch] text-4xl font-bold leading-[1.03] tracking-[-0.04em] md:text-5xl" data-reveal>
          A student who ships real products.
        </h2>
        <p className="mx-auto mt-6 max-w-[48ch] leading-relaxed text-muted" data-reveal>
          I build across the full product: structure, interfaces, databases, AI integrations, automation, deployment, and iteration.
        </p>
        <p className="mx-auto mt-9 max-w-fit rounded-xl border border-border bg-primary-tint p-5 text-sm leading-relaxed" data-reveal>
          <b className="mr-2 text-lg text-primary">#1</b>
          AI Researcher in Sudan, #461 worldwide (Favikon, 2025)
        </p>
      </div>

      <ol className="relative border-l-2 border-border-strong pl-9 sm:pl-11">
        {milestones.map((milestone, index) => (
          <li
            key={milestone.year}
            className="relative pb-14 last:pb-0"
            data-reveal
            style={{ "--reveal-delay": `${index * 0.05}s` } as React.CSSProperties}
          >
            <span className="absolute -left-[47px] top-0 grid h-6 w-6 place-items-center rounded-full border-2 border-primary bg-background sm:-left-[57px]">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            </span>
            <span className="font-mono text-2xl font-bold tracking-tight text-primary md:text-3xl">
              {milestone.year}
            </span>
            <h3 className="mt-2 text-xl font-semibold tracking-tight">{milestone.title}</h3>
            <p className="mt-2 max-w-[52ch] text-[15px] leading-relaxed text-muted">{milestone.body}</p>
          </li>
        ))}
      </ol>
    </div>

  </section>
);

export default Story;
