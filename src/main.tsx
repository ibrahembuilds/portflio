import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");

if (container) {
  const path = window.location.pathname;

  // Arabic routes are addressed with a trailing slash; English routes without.
  const isArabic = path === "/ar" || path.startsWith("/ar/");
  const route = isArabic
    ? `${path.replace(/\/+$/, "")}/`
    : path.replace(/\/+$/, "") || "/";

  document.documentElement.lang = isArabic ? "ar" : "en";
  document.documentElement.dir = isArabic ? "rtl" : "ltr";

  // Production HTML is prerendered per route at build time, so hydrate it.
  // In dev the container is empty and we render from scratch.
  if (container.hasChildNodes()) {
    hydrateRoot(container, <App route={route} />);
  } else {
    createRoot(container).render(<App route={route} />);
  }
}
