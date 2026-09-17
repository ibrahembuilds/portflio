import {
  SiCloudflare,
  SiDocker,
  SiFastapi,
  SiFirebase,
  SiMake,
  SiN8N,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenrouter,
  SiPostgresql,
  SiPython,
  SiReact,
  SiSupabase,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import type { IconType } from "react-icons";
import { STACK } from "../../config/site";

type TechLogo = { name: string; Icon: IconType };

/**
 * A curated subset of STACK (site.ts) — Twilio and "RAG pipelines" have no
 * brand mark to show, so they stay out of the animated row rather than
 * forcing a mismatched icon into a line of real logos. The full list still
 * reaches assistive tech via the sr-only text below, built from STACK
 * directly so the two can never drift apart.
 */
const TECH_LOGOS: TechLogo[] = [
  { name: "React", Icon: SiReact },
  { name: "Next.js", Icon: SiNextdotjs },
  { name: "TypeScript", Icon: SiTypescript },
  { name: "Python", Icon: SiPython },
  { name: "FastAPI", Icon: SiFastapi },
  { name: "Node.js", Icon: SiNodedotjs },
  { name: "Supabase", Icon: SiSupabase },
  { name: "Firebase", Icon: SiFirebase },
  { name: "PostgreSQL", Icon: SiPostgresql },
  { name: "n8n", Icon: SiN8N },
  { name: "Make", Icon: SiMake },
  { name: "OpenRouter", Icon: SiOpenrouter },
  { name: "Vercel", Icon: SiVercel },
  { name: "Cloudflare", Icon: SiCloudflare },
  { name: "Docker", Icon: SiDocker },
];

/**
 * A continuously-scrolling row of the tools behind the systems, never named
 * in a headline or put near the hero — this is a footnote of proof, not part
 * of the sell. The track is the logo list twice back to back, translated
 * exactly half its own width, so the loop point is invisible. Screen readers
 * get the same list once, as plain text, since the animated copy is
 * marked decorative.
 */
export const TechMarquee = () => (
  <div dir="ltr">
    <p className="sr-only">Built with: {STACK.flatMap((group) => group.items).join(", ")}.</p>
    <div className="tech-marquee" aria-hidden="true">
      <div className="tech-marquee__track">
        {[...TECH_LOGOS, ...TECH_LOGOS].map((item, index) => (
          <span className="tech-marquee__item" key={`${item.name}-${index}`}>
            <item.Icon size={20} aria-hidden="true" />
            {item.name}
          </span>
        ))}
      </div>
    </div>
  </div>
);
