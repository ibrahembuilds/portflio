/**
 * Renders every marketing route to its own static HTML file so the full page
 * content is in the markup for search engines and answer engines that do not
 * execute JavaScript. The client hydrates whatever was prerendered.
 *
 * The Systems Teardown app (dist/audit/index.html) is deliberately NOT
 * prerendered: it is an interactive tool, not an indexable document.
 */
import { mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { buildSeoBlock, buildSitemap, PAGES } from "./seo-data.mjs";

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const serverEntry = path.join(dist, "server/entry-server.js");

if (!existsSync(serverEntry)) {
  throw new Error(`SSR bundle missing at ${serverEntry}. Run the full build script, not vite build alone.`);
}

const { render } = await import(pathToFileURL(serverEntry).href);

const template = readFileSync(path.join(dist, "index.html"), "utf8");

const ROOT_MARKER = '<div id="root"></div>';
const SEO_MARKER = /<!-- SEO:START -->[\s\S]*?<!-- SEO:END -->/;

if (!template.includes(ROOT_MARKER)) {
  throw new Error('Prerender marker <div id="root"></div> not found in dist/index.html');
}
if (!SEO_MARKER.test(template)) {
  throw new Error("SEO marker block not found in dist/index.html");
}

const buildPage = (routePath) => {
  const page = PAGES[routePath];
  const isArabic = page.locale === "ar";
  const htmlTag = isArabic ? '<html lang="ar" dir="rtl">' : '<html lang="en" dir="ltr">';

  return template
    .replace(/<html lang="en"(?: dir="ltr")?>/, htmlTag)
    .replace(SEO_MARKER, `<!-- SEO:START -->\n${buildSeoBlock(routePath)}\n    <!-- SEO:END -->`)
    .replace(ROOT_MARKER, `<div id="root">${render(routePath)}</div>`);
};

let count = 0;
for (const routePath of Object.keys(PAGES)) {
  const html = buildPage(routePath);
  if (routePath === "/") {
    writeFileSync(path.join(dist, "index.html"), html);
  } else {
    const dir = path.join(dist, routePath.replace(/^\/|\/$/g, ""));
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, "index.html"), html);
  }
  count += 1;
}

// Sitemap is generated from the same route table, so a new route can never be
// added to the site without appearing in the sitemap.
writeFileSync(path.join(dist, "sitemap.xml"), buildSitemap());

// The SSR bundle is only needed at build time; keep dist/ directly deployable.
rmSync(path.join(dist, "server"), { recursive: true, force: true });

console.log(`Prerendered ${count} routes and regenerated sitemap.xml`);
