import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import Nav from "./marketing/components/Nav";
import Footer from "./marketing/components/Footer";
import Home from "./marketing/pages/Home";
import { Privacy, Terms } from "./marketing/pages/Legal";
import { ArabicFooter, ArabicNav } from "./marketing/ar/Layout";
import { ArabicHome } from "./marketing/ar/pages";

export type Route = "/" | "/privacy" | "/terms" | "/ar/";

const PAGES: Record<string, () => JSX.Element> = {
  "/": Home,
  "/privacy": Privacy,
  "/terms": Terms,
};

/** Arabic routes keep a trailing slash, which is how they are already indexed. */
const ARABIC_PAGES: Record<string, () => JSX.Element> = {
  "/ar/": ArabicHome,
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
        <ArabicNav />
        <main id="main">
          <ArabicPage />
        </main>
        <ArabicFooter />
        <Analytics />
      </div>
    );
  }

  const Page = PAGES[route] ?? Home;

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--primary)] focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Page />
      </main>
      <Footer />
      <Analytics />
    </>
  );
};

export default App;
