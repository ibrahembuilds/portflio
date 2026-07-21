import { ArrowUpRight, Github, Globe2 } from "lucide-react";

type Project = {
  title: string;
  type: string;
  problem: string;
  built: string;
  role: string;
  href?: string;
  linkType?: "live" | "source";
  image?: string;
  imageAlt?: string;
};

const saasProjects: Project[] = [
  {
    title: "My AI Agent Studio",
    type: "AI customer engagement platform",
    problem:
      "Local businesses need accurate website support and lead capture without adding another manual customer-service workflow.",
    built:
      "A no-code SaaS platform for RAG assistants trained on websites, documents, and business information, with qualified lead capture, conversation history, analytics, and a one-line website embed.",
    role: "Product strategy, UX, full-stack engineering, AI architecture, and deployment",
    href: "https://www.myaiagentstudio.io/",
    linkType: "live",
    image: "/project-agent-studio-blue.webp",
    imageAlt: "Conceptual visualization of connected AI customer engagement channels",
  },
  {
    title: "Boltfy",
    type: "Form and email campaign platform",
    problem:
      "Businesses need one secure workflow for collecting structured data, managing audiences, and sending targeted email campaigns.",
    built:
      "A multi-tenant platform with drag-and-drop forms, structured submissions, subscriber management, email templates, and campaigns, backed by Supabase authentication, Row-Level Security, anonymous submission RPCs, and server-side delivery.",
    role: "Product design, full-stack engineering, database security, and email infrastructure",
    href: "https://boltfy.io/",
    linkType: "live",
  },
  {
    title: "FocusFlow",
    type: "AI-assisted productivity workspace",
    problem:
      "Complex goals often stay disconnected from the daily tasks, calendar time, and focus habits required to complete them.",
    built:
      "A productivity platform combining task management, Pomodoro sessions, calendar planning, progress analytics, and AI goal decomposition into actionable subtasks.",
    role: "Product design, AI integration, full-stack engineering, and analytics",
    href: "https://focusflowai.site/",
    linkType: "live",
  },
];

const openSourceProjects: Project[] = [
  {
    title: "ScrapeX",
    type: "Open-source AI research agent",
    problem:
      "Web and social research is fragmented across search tools, source-checking workflows, and manual data exports.",
    built:
      "An agentic platform that searches the web and social media, executes tools, streams its reasoning process, produces cited answers, and exports structured datasets.",
    role: "Product design, architecture, AI engineering, backend, and interface",
    href: "https://github.com/ibrahembuilds/ScrapeX",
    linkType: "source",
    image: "/project-scrapex-blue.webp",
    imageAlt: "Conceptual visualization of research sources passing through an AI evidence pipeline",
  },
  {
    title: "Sudan Curriculum RAG Tutor",
    type: "Arabic-first learning platform",
    problem:
      "Sudanese students need an Arabic-first tutor that answers from their actual curriculum instead of generic model knowledge.",
    built:
      "A textbook-grounded learning system using PDF ingestion, vector embeddings, hybrid retrieval, pgvector, and streaming RAG responses.",
    role: "Product development, retrieval architecture, AI integration, and full-stack engineering",
    href: "https://github.com/ibrahembuilds/ai-student",
    linkType: "source",
    image: "/project-ai-student-blue.webp",
    imageAlt: "Conceptual visualization of textbook ingestion, retrieval, and generated learning material",
  },
  {
    title: "VeloBrand Studio",
    type: "Multimodal AI brand system",
    problem:
      "Creating a coherent brand identity across copy, imagery, video, and production files requires too many disconnected tools.",
    built:
      "A local-first AI studio that orchestrates text, image-editing, and video models to generate complete brand identities and export production-ready assets.",
    role: "Product design, multimodal orchestration, interface, and export systems",
    href: "https://github.com/ibrahembuilds/velobrandstudio-",
    linkType: "source",
  },
  {
    title: "AI Web Builder",
    type: "AI website generation system",
    problem:
      "Turning an idea into a customizable website still requires coordinating product briefs, code generation, visual assets, and manual edits.",
    built:
      "A website-generation system with structured briefs, multi-provider model routing, natural-language code editing, image generation, and exportable HTML, CSS, and JavaScript.",
    role: "Product architecture, model routing, code generation, and interface engineering",
    href: "https://github.com/ibrahembuilds/AI-web-builder-",
    linkType: "source",
  },
  {
    title: "TruthCheck",
    type: "Evidence-grounded verification pipeline",
    problem:
      "Multimodal claims are difficult to verify when evidence retrieval, structured analysis, and citation reporting happen in separate steps.",
    built:
      "A fact-checking workflow that retrieves evidence, analyzes claims, validates structured model output, and generates cited reports.",
    role: "AI pipeline design, evidence retrieval, validation, and report generation",
    href: "https://github.com/ibrahembuilds/TruthCheck",
    linkType: "source",
  },
  {
    title: "YT Studio",
    type: "AI-powered YouTube intelligence",
    problem:
      "Valuable information inside long videos is difficult to search, summarize, revisit, and repurpose efficiently.",
    built:
      "A knowledge workspace that extracts timestamped transcripts, answers questions about video content, generates multiple summary formats, and identifies promising moments for short-form content.",
    role: "Product design, transcript processing, AI workflows, and full-stack engineering",
    href: "https://github.com/ibrahembuilds/youtube-",
    linkType: "source",
  },
];

const ProjectAction = ({ project }: { project: Project }) => (
  <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
    {project.linkType === "source" ? (
      <Github size={15} aria-hidden="true" />
    ) : (
      <Globe2 size={15} aria-hidden="true" />
    )}
    {project.linkType === "source" ? "View source on GitHub" : "Visit live product"}
    <ArrowUpRight size={14} aria-hidden="true" />
  </span>
);

const Work = () => {
  const flagship = saasProjects[0];
  const featuredOpenSource = openSourceProjects.slice(0, 2);
  const openSourceIndex = openSourceProjects.slice(2);

  return (
    <section id="work" className="py-24 md:py-32">
      <div className="shell">
        <h2 className="mx-auto max-w-[18ch] text-center text-4xl font-bold leading-[1.02] tracking-[-0.04em] md:text-5xl" data-reveal>
          Products in market. Code in public.
        </h2>
        <p className="mx-auto mt-5 max-w-[58ch] text-center text-lg leading-relaxed text-muted" data-reveal>
          SaaS products I run and open-source systems you can inspect, clone, and judge directly.
        </p>

        <div className="mt-16">
          <h3 className="text-center text-2xl font-bold tracking-tight md:text-3xl" data-reveal>
            SaaS products I own
          </h3>

          <a
            href={flagship.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 grid overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-[box-shadow,transform] hover:shadow-card-hover active:translate-y-px lg:grid-cols-[1.2fr_0.8fr]"
            data-reveal
          >
            <figure className="min-h-[310px] overflow-hidden bg-foreground lg:min-h-[520px]">
              <img
                src={flagship.image}
                alt={flagship.imageAlt}
                width={1536}
                height={1024}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
              />
            </figure>
            <div className="flex flex-col p-7 md:p-10">
              <p className="text-sm font-medium text-muted">{flagship.type}</p>
              <h4 className="mt-3 text-3xl font-bold tracking-[-0.035em] transition-colors group-hover:text-primary md:text-4xl">
                {flagship.title}
              </h4>
              <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-muted">
                <p>
                  <b className="mb-1 block font-semibold text-foreground">Problem</b>
                  {flagship.problem}
                </p>
                <p>
                  <b className="mb-1 block font-semibold text-foreground">What I built</b>
                  {flagship.built}
                </p>
              </div>
              <div className="mt-auto pt-9">
                <p className="border-t border-border pt-4 text-sm text-muted">{flagship.role}</p>
                <p className="mt-5">
                  <ProjectAction project={flagship} />
                </p>
              </div>
            </div>
          </a>

          <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {saasProjects.slice(1).map((project, index) => (
              <a
                key={project.title}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group border-t border-border-strong pt-7 transition-transform active:translate-y-px"
                data-reveal
                style={{ "--reveal-delay": `${index * 0.06}s` } as React.CSSProperties}
              >
                <p className="text-sm font-medium text-muted">{project.type}</p>
                <div className="mt-2 flex items-start justify-between gap-5">
                  <h4 className="text-3xl font-bold tracking-tight transition-colors group-hover:text-primary">
                    {project.title}
                  </h4>
                  <ArrowUpRight
                    size={22}
                    className="mt-1 shrink-0 text-muted transition-[color,transform] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-5 text-[15px] leading-relaxed text-muted">{project.built}</p>
                <p className="mt-5 text-sm text-muted">{project.role}</p>
                <p className="mt-4">
                  <ProjectAction project={project} />
                </p>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-28 md:mt-36">
          <h3 className="text-center text-2xl font-bold tracking-tight md:text-3xl" data-reveal>
            Open-source systems
          </h3>
          <p className="mx-auto mt-3 max-w-[56ch] text-center leading-relaxed text-muted" data-reveal>
            Public code on GitHub. Clone it, read it, and judge the engineering directly.
          </p>

          <div className="mt-9 grid gap-5 lg:grid-cols-12">
            {featuredOpenSource.map((project, index) => (
              <a
                key={project.title}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-[box-shadow,transform] hover:shadow-card-hover active:translate-y-px ${
                  index === 0 ? "lg:col-span-7" : "lg:col-span-5"
                }`}
                data-reveal
                style={{ "--reveal-delay": `${index * 0.06}s` } as React.CSSProperties}
              >
                <figure className="aspect-[16/10] overflow-hidden bg-foreground">
                  <img
                    src={project.image}
                    alt={project.imageAlt}
                    width={1536}
                    height={1024}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  />
                </figure>
                <div className="p-7 md:p-8">
                  <p className="text-sm font-medium text-muted">{project.type}</p>
                  <div className="mt-2 flex items-start justify-between gap-4">
                    <h4 className="text-2xl font-bold tracking-tight transition-colors group-hover:text-primary md:text-3xl">
                      {project.title}
                    </h4>
                    <ArrowUpRight
                      size={21}
                      className="mt-1 shrink-0 text-muted transition-[color,transform] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-5 text-[15px] leading-relaxed text-muted">{project.built}</p>
                  <p className="mt-5">
                    <ProjectAction project={project} />
                  </p>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {openSourceIndex.map((project, index) => (
              <a
                key={project.title}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group border-l-2 border-primary/20 pl-5 transition-[border-color,transform] hover:border-primary active:translate-y-px"
                data-reveal
                style={{ "--reveal-delay": `${(index % 2) * 0.06}s` } as React.CSSProperties}
              >
                <p className="text-sm font-medium text-muted">{project.type}</p>
                <div className="mt-2 flex items-start justify-between gap-4">
                  <h4 className="text-xl font-bold tracking-tight transition-colors group-hover:text-primary md:text-2xl">
                    {project.title}
                  </h4>
                  <ArrowUpRight size={18} className="mt-1 shrink-0 text-muted group-hover:text-primary" aria-hidden="true" />
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-muted">{project.built}</p>
                <p className="mt-4">
                  <ProjectAction project={project} />
                </p>
              </a>
            ))}
          </div>

          <a
            href="https://github.com/ibrahembuilds"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-12 inline-flex items-center gap-2 whitespace-nowrap text-[15px] font-semibold text-primary transition-colors hover:text-primary-strong"
          >
            Review the full GitHub archive <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>

      </div>
    </section>
  );
};

export default Work;
