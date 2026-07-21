const facts = [
  { value: "KanyouAI", label: "Founder of a UK-registered AI company" },
  { value: "20+", label: "Public products and repositories" },
  { value: "3+", label: "Years building AI systems" },
  { value: "MMU", label: "AI Engineering student in Malaysia" },
];

const Glance = () => (
  <section className="border-y border-border" aria-label="Profile at a glance">
    <div className="shell">
      <h2 className="sr-only">At a glance</h2>
      <dl className="grid grid-cols-2 lg:grid-cols-4">
        {facts.map((fact, index) => (
          <div
            key={fact.value}
            data-reveal
            className={`flex min-h-36 flex-col justify-end border-border py-7 odd:pr-5 even:border-l even:pl-5 lg:min-h-40 lg:border-l lg:border-t-0 lg:px-7 lg:first:border-l-0 lg:first:pl-0 ${
              index >= 2 ? "border-t" : ""
            }`}
            style={{ "--reveal-delay": `${index * 0.05}s` } as React.CSSProperties}
          >
            <dt className="order-2 mt-2 max-w-[22ch] text-sm leading-snug text-muted">{fact.label}</dt>
            <dd className="order-1 text-2xl font-bold tracking-tight text-primary md:text-3xl">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  </section>
);

export default Glance;
