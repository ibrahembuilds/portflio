import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 4319);

/**
 * Some environments ship a preinstalled Chromium whose build number does not
 * match this Playwright release. Setting PLAYWRIGHT_CHROMIUM_PATH points the
 * runner at that binary instead of failing with "browser not installed".
 * Unset locally, Playwright uses its own managed download as normal.
 */
const chromiumPath = process.env.PLAYWRIGHT_CHROMIUM_PATH?.trim();
const launchOptions = chromiumPath ? { executablePath: chromiumPath } : {};

/**
 * E2E runs against the real production build served by scripts/dev-server.mjs,
 * which serves dist/ statically and mounts the api/ handlers on /api/* exactly
 * as Vercel does. That means the assessment funnel is exercised end to end
 * against the same code that ships.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: process.env.CI ? [["list"]] : [["list"]],
  timeout: 60_000,
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "off",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], launchOptions } },
    { name: "mobile", use: { ...devices["Pixel 5"], launchOptions } },
  ],
  webServer: {
    command: `node scripts/dev-server.mjs`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      E2E_PORT: String(PORT),
      SYSTEMS_TEARDOWN_BOOKING_URL: "https://example.com/book-teardown",
      // The production default (5/hour) is deliberately low. Both Playwright
      // projects share one server process and one hour-long window, so the
      // limit is lifted here; tests/ratelimit.test.ts asserts the limiter.
      TEARDOWN_RATE_LIMIT_SUBMIT: "500",
      TEARDOWN_RATE_LIMIT_WEBSITE: "500",
    },
  },
});
