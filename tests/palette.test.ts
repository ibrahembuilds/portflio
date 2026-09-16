import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The palette is chosen, the contrast is not. These tests hold the two rules
 * that make the brand usable rather than merely attractive:
 *
 *   1. Every text/background pair the site actually renders clears WCAG AA.
 *   2. The accent is a fill. At 1.24:1 against white and 1.18:1 against the
 *      page it can never be type, an icon, or a hairline — so nothing in the
 *      source is allowed to use it that way.
 *
 * Changing a token without changing these is the failure mode they exist for.
 */

const CSS = readFileSync(path.resolve(__dirname, "../src/index.css"), "utf8");

const token = (name: string): string => {
  const match = new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`).exec(CSS);
  if (!match) throw new Error(`Token --${name} not found in src/index.css`);
  return match[1].toLowerCase();
};

const luminance = (hex: string): number => {
  const channel = (offset: number) => {
    const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
};

const contrast = (a: string, b: string): number => {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
};

const WHITE = "#ffffff";
const AA_TEXT = 4.5;
const AA_LARGE = 3;

describe("palette contrast", () => {
  const ink = token("ink");
  const accent = token("accent");
  const background = token("background");
  const surface = token("surface");
  const primary = token("primary");
  const muted = token("muted");
  const soft = token("primary-soft");
  const strong = token("primary-strong");

  it("uses the requested brand colours", () => {
    expect(accent).toBe("#d4f53c");
    expect(background).toBe("#faf9f6");
  });

  it("clears AA for body text on the page and on cards", () => {
    expect(contrast(ink, background)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrast(ink, surface)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrast(muted, background)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrast(muted, surface)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it("clears AA for the primary button", () => {
    expect(contrast(primary, WHITE)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it("clears AA for the button's hover state, which flips to the accent", () => {
    // The flip is only safe because ink on accent is well clear of the bar.
    expect(contrast(ink, accent)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it("clears AA for text on the tinted panel", () => {
    expect(contrast(ink, soft)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrast(strong, soft)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrast(muted, soft)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it("records why the accent cannot carry light text or stand alone", () => {
    // These are the measurements the rest of the rules are built on. If either
    // stops being true the accent's role can be revisited.
    expect(contrast(accent, WHITE)).toBeLessThan(AA_LARGE);
    expect(contrast(accent, background)).toBeLessThan(AA_LARGE);
  });
});

/* -------------------------------------------------------------------------- */

const sourceFiles = (dir: string, out: string[] = []): string[] => {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    else if (/\.(tsx|ts|css)$/.test(entry)) out.push(full);
  }
  return out;
};

describe("the accent is only ever a fill", () => {
  const root = path.resolve(__dirname, "../src");
  const files = sourceFiles(root);

  it("is never used as a text colour", () => {
    const offenders = files.filter((file) => /text-\[var\(--accent\)\]/.test(readFileSync(file, "utf8")));
    expect(offenders, "accent used as text colour").toEqual([]);
  });

  it("is never used as a border on its own", () => {
    // .panel-accent pairs the fill with --accent-deep, which is the one
    // legitimate border use; a bare --accent border is not.
    const offenders = files.filter((file) => /border-\[var\(--accent\)\]/.test(readFileSync(file, "utf8")));
    expect(offenders, "accent used as a bare border").toEqual([]);
  });

  it("is never painted as a hairline", () => {
    // A 1px–2px band of the accent against the page is invisible. Anything
    // using it as a fill must be a block with its own content.
    const offenders = files.filter((file) => {
      const source = readFileSync(file, "utf8");
      return /h-\[?[12]p?x?\]?\s+bg-\[var\(--accent\)\]|bg-\[var\(--accent\)\][^"]*\bh-[12]\b/.test(source);
    });
    expect(offenders, "accent painted as a hairline").toEqual([]);
  });

  it("no longer references the retired green tokens", () => {
    const offenders = files.filter((file) => /--brand\b|#02d169|#017e40/i.test(readFileSync(file, "utf8")));
    expect(offenders, "stale green tokens still referenced").toEqual([]);
  });
});
