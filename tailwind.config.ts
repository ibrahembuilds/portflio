import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["Space Mono", "ui-monospace", "monospace"],
      },
      colors: {
        background: "hsl(var(--background))",
        surface: "hsl(var(--surface))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        "border-strong": "hsl(var(--border-strong))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          strong: "hsl(var(--primary-strong))",
          tint: "hsl(var(--primary-tint))",
          foreground: "hsl(var(--primary-foreground))",
        },
      },
      boxShadow: {
        card: "0 1px 2px hsl(222 25% 11% / 0.04), 0 8px 24px hsl(222 25% 11% / 0.05)",
        "card-hover": "0 2px 4px hsl(222 25% 11% / 0.05), 0 14px 34px hsl(222 25% 11% / 0.09)",
      },
    },
  },
  plugins: [],
} satisfies Config;
