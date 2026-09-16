import { useEffect } from "react";
import Nav from "./marketing/components/Nav";
import Footer from "./marketing/components/Footer";
import Home from "./marketing/pages/Home";
import Services from "./marketing/pages/Services";
import HowItWorks from "./marketing/pages/HowItWorks";
import Work from "./marketing/pages/Work";
import About from "./marketing/pages/About";
import { Privacy, Terms } from "./marketing/pages/Legal";
import { ArabicFooter, ArabicNav } from "./marketing/ar/Layout";
import { ArabicAbout, ArabicHome, ArabicHowItWorks, ArabicServices, ArabicWork } from "./marketing/ar/pages";

export type Route =
  | "/"
  | "/services"
  | "/how-it-works"
  | "/work"
  | "/about"
  | "/privacy"
  | "/terms"
  | "/ar/"
  | "/ar/services/"
  | "/ar/how-it-works/"
  | "/ar/work/"
  | "/ar/about/";

const PAGES: Record<string, () => JSX.Element> = {
  "/": Home,
  "/services": Services,
  "/how-it-works": HowItWorks,
  "/work": Work,
  "/about": About,
  "/privacy": Privacy,
  "/terms": Terms,
};

/** Arabic routes keep a trailing slash, which is how they are already indexed. */
const ARABIC_PAGES: Record<string, () => JSX.Element> = {
  "/ar/": ArabicHome,
  "/ar/services/": ArabicServices,
  "/ar/how-it-works/": ArabicHowItWorks,
  "/ar/work/": ArabicWork,
  "/ar/about/": ArabicAbout,
};

/** One short reveal on scroll, skipped entirely under reduced motion. */
const useReveal = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nodes = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -48px 0px" },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
};

const App = ({ route = "/" }: { route?: string }) => {
  useReveal();

  if (route.startsWith("/ar")) {
    const ArabicPage = ARABIC_PAGES[route] ?? ArabicHome;
    return (
      <div dir="rtl" lang="ar">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--primary)] focus:px-4 focus:py-2 focus:text-white"
        >
          انتقل إلى المحتوى
        </a>
        <ArabicNav current={route} />
        <main id="main">
          <ArabicPage />
        </main>
        <ArabicFooter />
      </div>
    );
  }

  const Page = PAGES[route] ?? Home;

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--primary)] focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <Nav current={route} />
      <main id="main">
        <Page />
      </main>
      <Footer />
    </>
  );
};

export default App;
