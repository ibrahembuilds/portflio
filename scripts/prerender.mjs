// Injects the server-rendered app into dist/index.html so the full page content
// is present in the static HTML for search engines and AI crawlers that do not
// execute JavaScript.
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { buildSeoBlock } from "./seo-data.mjs";

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");

const { render } = await import(pathToFileURL(path.join(dist, "server/entry-server.js")).href);

const template = readFileSync(path.join(dist, "index.html"), "utf8");
const marker = '<div id="root"></div>';
if (!template.includes(marker)) {
  throw new Error("Prerender marker <div id=\"root\"></div> not found in dist/index.html");
}

const seoMarker = /<!-- SEO:START -->[\s\S]*?<!-- SEO:END -->/;
if (!seoMarker.test(template)) {
  throw new Error("SEO marker block not found in dist/index.html");
}

const buildPage = (locale) => {
  const direction = locale === "ar" ? ' dir="rtl"' : "";
  return template
    .replace(/<html lang="en"(?: dir="ltr")?>/, `<html lang="${locale}"${direction}>`)
    .replace(seoMarker, `<!-- SEO:START -->\n${buildSeoBlock(locale)}\n    <!-- SEO:END -->`)
    .replace(marker, `<div id="root">${render(locale)}</div>`);
};

writeFileSync(path.join(dist, "index.html"), buildPage("en"));

const arabicDir = path.join(dist, "ar");
mkdirSync(arabicDir, { recursive: true });
writeFileSync(path.join(arabicDir, "index.html"), buildPage("ar"));

// The SSR bundle is only needed at build time; keep dist/ directly deployable.
rmSync(path.join(dist, "server"), { recursive: true, force: true });
console.log("Prerendered English and Arabic app content into dist/index.html and dist/ar/index.html");
