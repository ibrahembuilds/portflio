import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(root, "./src") },
  },
  build: {
    // Three independent apps: the marketing site (prerendered to static HTML
    // per route), the Systems Teardown assessment, and the private lead view.
    // Separate Rollup inputs stop a marketing-page visitor from ever
    // downloading the assessment, or a prospect the admin screen.
    rollupOptions: {
      input: {
        main: path.resolve(root, "index.html"),
        audit: path.resolve(root, "audit/index.html"),
        admin: path.resolve(root, "admin/index.html"),
      },
    },
    cssCodeSplit: true,
    assetsInlineLimit: 2048,
  },
});
