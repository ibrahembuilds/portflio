import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");

if (container) {
  const path = window.location.pathname;
  const route = path === "/ar" || path.startsWith("/ar/") ? "/ar/" : path.replace(/\/+$/, "") || "/";

  document.documentElement.lang = route === "/ar/" ? "ar" : "en";
  document.documentElement.dir = route === "/ar/" ? "rtl" : "ltr";

  // Production HTML is prerendered per route at build time, so hydrate it.
  // In dev the container is empty and we render from scratch.
  if (container.hasChildNodes()) {
    hydrateRoot(container, <App route={route} />);
  } else {
    createRoot(container).render(<App route={route} />);
  }
}
