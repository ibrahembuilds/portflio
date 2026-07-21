import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("root")!;
const locale = window.location.pathname === "/ar" || window.location.pathname.startsWith("/ar/") ? "ar" : "en";

document.documentElement.lang = locale;
document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";

// Production HTML is prerendered at build time (scripts/prerender.mjs), so hydrate it.
// In dev the container is empty, so render from scratch.
if (container.hasChildNodes()) {
  hydrateRoot(container, <App locale={locale} />);
} else {
  createRoot(container).render(<App locale={locale} />);
}
