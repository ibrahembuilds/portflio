import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Glance from "./components/Glance";
import Work from "./components/Work";
import ClientWork from "./components/ClientWork";
import Services from "./components/Services";
import Story from "./components/Story";
import Stack from "./components/Stack";
import Process from "./components/Process";
import Faq from "./components/Faq";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ArabicPage from "./components/ArabicPage";

export type Locale = "en" | "ar";

const App = ({ locale = "en" }: { locale?: Locale }) => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (locale === "ar") {
    return (
      <>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-50 focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          انتقل إلى المحتوى
        </a>
        <ArabicPage />
        <Analytics />
      </>
    );
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Glance />
        <Work />
        <ClientWork />
        <Services />
        <Story />
        <Stack />
        <Process />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <Analytics />
    </>
  );
};

export default App;
