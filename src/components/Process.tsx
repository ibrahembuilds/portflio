const steps = [
  {
    title: "Understand the process",
    body: "We identify the users, where delays or errors happen, what needs judgement, and what result matters to the business.",
  },
  {
    title: "Define the first useful version",
    body: "I reduce the idea to one meaningful problem and a focused scope that can be tested without unnecessary features.",
  },
  {
    title: "Design and build",
    body: "I define the roles, data, AI behaviour, integrations, and architecture, then demonstrate working software in stages.",
  },
  {
    title: "Test, launch, improve",
    body: "We test realistic use cases and failures, deploy the product, and improve it through evidence from real use.",
  },
];

const Process = () => (
  <section id="process" className="py-24 md:py-32">
    <div className="shell">
      <h2 className="mx-auto max-w-[16ch] text-center text-4xl font-bold leading-[1.03] tracking-[-0.04em] md:text-5xl" data-reveal>
        A direct path from problem to production.
      </h2>
      <ol className="mt-14 grid gap-x-16 md:grid-cols-2">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className={`border-t border-border-strong py-8 md:py-10 ${index % 2 === 1 ? "md:translate-y-12" : ""}`}
            data-reveal
            style={{ "--reveal-delay": `${(index % 2) * 0.06}s` } as React.CSSProperties}
          >
            <h3 className="max-w-[18ch] text-2xl font-semibold leading-tight tracking-tight">{step.title}</h3>
            <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default Process;
