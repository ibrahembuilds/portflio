import { ArrowRight } from "lucide-react";
import profile from "../assets/profile-new.jpeg";
import Hero3D from "./Hero3D";

const CALENDLY = "https://calendly.com/ibrahem/conselting";

const Hero = () => (
  <section id="top" className="flex min-h-[100dvh] items-center pb-16 pt-24 md:pb-20">
    <div className="shell grid w-full items-center gap-14 lg:grid-cols-12 lg:gap-16">
      <div className="text-center lg:col-span-7">
        <p className="anim-up text-sm font-semibold text-primary">Founder of KanyouAI · AI Engineer</p>
        <h1 className="anim-up mt-5 text-5xl font-bold leading-[0.98] tracking-[-0.055em] [animation-delay:0.07s] sm:text-6xl lg:text-7xl">
          <span className="block">I build AI systems</span>
          <span className="block text-primary">for real business.</span>
        </h1>
        <p className="anim-up mx-auto mt-7 max-w-[48ch] text-lg leading-relaxed text-muted [animation-delay:0.14s]">
          I design and ship AI products, agents, and internal software for founders and growing companies.
        </p>
        <div className="anim-up mt-9 flex flex-wrap items-center justify-center gap-3 [animation-delay:0.21s]">
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-primary px-7 py-3.5 text-[15px] font-semibold text-primary-foreground transition-[background-color,transform] hover:bg-primary-strong active:translate-y-px"
          >
            Work with me <ArrowRight size={17} aria-hidden="true" />
          </a>
          <a
            href="#work"
            className="inline-flex items-center whitespace-nowrap rounded-full border border-border-strong bg-surface px-7 py-3.5 text-[15px] font-semibold transition-[border-color,color,transform] hover:border-primary hover:text-primary active:translate-y-px"
          >
            View selected work
          </a>
        </div>
      </div>

      <figure className="anim-up relative mx-auto w-full max-w-[430px] lg:col-span-5 lg:mr-0 [animation-delay:0.12s]">
        <div className="absolute -bottom-5 -right-5 h-full w-full rounded-xl bg-primary-tint" aria-hidden="true" />
        <Hero3D className="-top-10 -left-10 h-40 w-40 sm:h-48 sm:w-48" />
        <img
          src={profile}
          alt="Ibrahem Ahmed Hassan"
          width={840}
          height={1050}
          {...({ fetchpriority: "high" } as React.ImgHTMLAttributes<HTMLImageElement>)}
          className="relative aspect-[4/5] w-full rounded-xl border border-border object-cover object-top shadow-card"
        />
        <figcaption className="relative mt-6 grid grid-cols-2 gap-5 text-sm">
          <p className="border-t border-border-strong pt-3 text-muted">
            Founder of <span className="font-semibold text-foreground">KanyouAI</span>
          </p>
          <p className="border-t border-border-strong pt-3 text-muted">
            AI Engineering at <span className="font-semibold text-foreground">MMU</span>
          </p>
        </figcaption>
      </figure>
    </div>
  </section>
);

export default Hero;
