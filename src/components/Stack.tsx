const stack = [
  { name: "TypeScript", slug: "typescript" },
  { name: "React", slug: "react" },
  { name: "Next.js", slug: "nextdotjs" },
  { name: "Python", slug: "python" },
  { name: "Firebase", slug: "firebase" },
  { name: "Node.js", slug: "nodedotjs" },
  { name: "Tailwind CSS", slug: "tailwindcss" },
  { name: "n8n", slug: "n8n" },
  { name: "Docker", slug: "docker" },
  { name: "Vercel", slug: "vercel" },
  { name: "Git", slug: "git" },
];

const ICON_COLOR = "5c6470";

const StackGroup = ({ hidden = false }: { hidden?: boolean }) => (
  <ul className="stack-marquee-group" aria-hidden={hidden || undefined}>
    {stack.map((tech) => (
      <li key={tech.slug} className="flex items-center gap-3 whitespace-nowrap px-7 text-sm font-medium text-muted">
        <img
          src={`https://cdn.simpleicons.org/${tech.slug}/${ICON_COLOR}`}
          alt=""
          width={18}
          height={18}
          loading="lazy"
        />
        {tech.name}
        <span className="ml-4 text-primary" aria-hidden="true">
          /
        </span>
      </li>
    ))}
  </ul>
);

const Stack = () => (
  <section aria-label="Technology stack" className="overflow-hidden border-y border-border py-7">
    <h2 className="sr-only">Technology stack</h2>
    <div className="stack-marquee-track">
      <StackGroup />
      <StackGroup hidden />
    </div>
  </section>
);

export default Stack;
