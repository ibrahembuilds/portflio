import type { Config } from "tailwindcss";

/**
 * Brand tokens live as raw hex on :root in src/index.css, so the palette can be
 * read straight out of the stylesheet. The green is sampled from the profile
 * photograph; see that file for the contrast reasoning behind the two tones.
 */
export default {
  content: ["./index.html", "./audit/index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist Sans", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        ink: "var(--ink)",
        /* Fill only — never text, never an icon, never a hairline.
           See the contrast table in src/index.css. */
        accent: {
          DEFAULT: "var(--accent)",
          deep: "var(--accent-deep)",
          soft: "var(--accent-soft)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          strong: "var(--primary-strong)",
          soft: "var(--primary-soft)",
          foreground: "var(--primary-foreground)",
        },
        background: "var(--background)",
        surface: "var(--surface)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        success: "var(--success)",
        muted: "var(--muted)",
      },
      borderColor: {
        DEFAULT: "var(--border)",
      },
      maxWidth: {
        prose: "68ch",
      },
      boxShadow: {
        card: "0 1px 2px rgb(11 18 32 / 0.04)",
        raised: "0 1px 2px rgb(11 18 32 / 0.05), 0 12px 28px rgb(11 18 32 / 0.06)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
