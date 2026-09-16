import type { Config } from "tailwindcss";

/**
 * Brand tokens come from the commercial brand direction: precise, calm,
 * operational. Values are stored as raw hex on :root in src/index.css so the
 * palette in the spec can be read back out of the stylesheet without decoding
 * an HSL triple.
 */
export default {
  content: ["./index.html", "./audit/index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist Sans", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "SFMono-Regular", "monospace"],
        arabic: ['"Noto Sans Arabic Variable"', "Tahoma", "Arial", "sans-serif"],
      },
      colors: {
        ink: "var(--ink)",
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
