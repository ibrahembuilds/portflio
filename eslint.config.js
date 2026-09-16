import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default tseslint.config(
  { ignores: ["dist", "dist-server", "node_modules", "playwright-report", "test-results", ".vercel"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { "react-hooks": reactHooks, "react-refresh": reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      eqeqeq: ["error", "smart"],
    },
  },
  {
    files: ["src/server/**/*.ts", "api/**/*.ts", "scripts/**/*.mjs", "tests/**/*.ts", "e2e/**/*.ts"],
    rules: { "no-console": "off" },
  },
  {
    files: ["**/*.mjs", "**/*.js"],
    languageOptions: { globals: { ...globals.node } },
    rules: { "@typescript-eslint/no-unused-vars": "off" },
  },
);
