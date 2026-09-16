import { useEffect } from "react";
import Nav from "./marketing/components/Nav";
import Footer from "./marketing/components/Footer";
import Home from "./marketing/pages/Home";
import Services from "./marketing/pages/Services";
import HowItWorks from "./marketing/pages/HowItWorks";
import Work from "./marketing/pages/Work";
import About from "./marketing/pages/About";
import { Privacy, Terms } from "./marketing/pages/Legal";
import ArabicPage from "./marketing/pages/ArabicPage";

export type Route = "/" | "/services" | "/how-it-works" | "/work" | "/about" | "/privacy" | "/terms" | "/ar/";

const PAGES: Record<string, () => JSX.Element> = {
  "/": Home,
  "/services": Services,
  "/how-it-works": HowItWorks,
  "/work": Work,
  "/about": About,
  "/privacy": Privacy,
  "/terms": Terms,
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

  if (route === "/ar/" || route === "/ar") {
    return (
      <>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--primary)] focus:px-4 focus:py-2 focus:text-white">
          انتقل إلى المحتوى
        </a>
        <ArabicPage />
      </>
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
