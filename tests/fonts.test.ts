import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Every typeface is self-hosted from /public/fonts with an unhashed path, which
 * is what makes preloading possible. The cost of that choice is that a rename
 * or a missed copy fails silently: the browser 404s the face, falls back to a
 * system font, and the page still renders — so nothing in CI notices. These
 * tests are the thing that notices.
 */

const root = path.resolve(__dirname, "..");
const CSS = readFileSync(path.join(root, "src/index.css"), "utf8");
const INDEX_HTML = readFileSync(path.join(root, "index.html"), "utf8");
const SEO_DATA = readFileSync(path.join(root, "scripts/seo-data.mjs"), "utf8");

const referenced = (source: string, pattern: RegExp): string[] =>
  [...source.matchAll(pattern)].map((match) => match[1]);

describe("self-hosted fonts", () => {
  it("has a file on disk for every @font-face in the stylesheet", () => {
    const faces = referenced(CSS, /src:\s*url\("(\/fonts\/[^"]+)"\)/g);
    expect(faces.length).toBeGreaterThan(0);

    const missing = faces.filter((href) => !existsSync(path.join(root, "public", href)));
    expect(missing, "@font-face pointing at a file that is not in public/fonts").toEqual([]);
  });

  it("has a file on disk for every preloaded face", () => {
    const preloads = [
      ...referenced(INDEX_HTML, /rel="preload"\s+href="(\/fonts\/[^"]+)"/g),
      ...referenced(SEO_DATA, /rel="preload"\s+href="(\/fonts\/[^"]+)"/g),
    ];
    expect(preloads.length).toBeGreaterThan(0);

    const missing = preloads.filter((href) => !existsSync(path.join(root, "public", href)));
    expect(missing, "preload pointing at a file that is not in public/fonts").toEqual([]);
  });

  it("only preloads faces the stylesheet actually declares", () => {
    // A preload for a face no @font-face claims is a download the page never
    // uses — the browser fetches it, warns, and throws it away.
    const declared = new Set(referenced(CSS, /src:\s*url\("(\/fonts\/[^"]+)"\)/g));
    const preloads = [
      ...referenced(INDEX_HTML, /rel="preload"\s+href="(\/fonts\/[^"]+)"/g),
      ...referenced(SEO_DATA, /rel="preload"\s+href="(\/fonts\/[^"]+)"/g),
    ];

    const orphans = preloads.filter((href) => !declared.has(href));
    expect(orphans, "preloaded face that no @font-face declares").toEqual([]);
  });

  it("loads typefaces from disk rather than importing a package stylesheet", () => {
    // An @import of a fontsource package registers every subset it ships and
    // resolves to hashed build output, which cannot be preloaded.
    expect(CSS).not.toMatch(/@import\s+["']@fontsource/);
  });
});

describe("the Arabic stack", () => {
  const rtl = /\[dir="rtl"\]\s*body\s*\{([\s\S]*?)\}/.exec(CSS)?.[1] ?? "";

  it("sets a font stack on RTL pages", () => {
    expect(rtl, '[dir="rtl"] body rule not found').toContain("font-family");
  });

  it("puts the Arabic face first", () => {
    // Only the Arabic unicode subset is shipped, so this face claims Arabic
    // glyphs and nothing else.
    expect(rtl).toMatch(/font-family:\s*"Plex Arabic"/);
  });

  it("falls through to Geist for Latin runs inside Arabic copy", () => {
    // CRM, 5, 50, the domain — these have no glyph in the Arabic subset. Naming
    // Geist next is what keeps them in the site's own Latin instead of Tahoma.
    const family = /font-family:([^;]+);/.exec(rtl)?.[1] ?? "";
    const order = family.split(",").map((name) => name.trim().replace(/^"|"$/g, ""));
    expect(order.indexOf("Geist Sans")).toBe(order.indexOf("Plex Arabic") + 1);
  });
});
