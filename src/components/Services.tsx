import { ArrowUpRight, Bot, Handshake, Layers, MonitorCog } from "lucide-react";

const services = [
  {
    icon: Layers,
    title: "AI product development",
    copy: "AI-enabled products and SaaS applications from early scope to a working release.",
  },
  {
    icon: MonitorCog,
    title: "Internal business systems",
    copy: "CRMs, dashboards, portals, and workflow systems that replace spreadsheets and disconnected tools.",
  },
  {
    icon: Bot,
    title: "AI assistants and agents",
    copy: "Assistants connected to company knowledge, customer channels, data, and real operational actions.",
  },
  {
    icon: Handshake,
    title: "Technical product partnership",
    copy: "Ongoing product scoping, architecture, rapid prototyping, weekly iteration, and launch preparation.",
  },
];

const Services = () => (
  <section id="services" className="border-y border-border bg-primary-tint py-24 md:py-32">
    <div className="shell grid items-start gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
      <div className="text-center lg:sticky lg:top-28">
        <p className="text-sm font-semibold text-primary" data-reveal>
          KanyouAI
        </p>
        <h2 className="mx-auto mt-4 max-w-[15ch] text-4xl font-bold leading-[1.03] tracking-[-0.04em] md:text-5xl" data-reveal>
          Custom systems when standard software does not fit.
        </h2>
        <p className="mx-auto mt-6 max-w-[50ch] leading-relaxed text-muted" data-reveal>
          I founded KanyouAI as a UK-registered AI development company to turn operational problems into complete software, from the first useful version through launch.
        </p>
        <a
          href="https://kanyouai.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-2 whitespace-nowrap text-[15px] font-semibold text-primary transition-colors hover:text-primary-strong"
          data-reveal
        >
          Explore KanyouAI <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {services.map((service, index) => (
          <article
            key={service.title}
            className="rounded-xl border border-border bg-surface p-6 shadow-card transition-shadow hover:shadow-card-hover"
            data-reveal
            style={{ "--reveal-delay": `${index * 0.05}s` } as React.CSSProperties}
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground">
              <service.icon size={19} aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-xl font-semibold leading-snug tracking-tight">{service.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{service.copy}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
