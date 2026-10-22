import { defineConfig, devices } from "@playwright/test";
process.env.PLAYWRIGHT_BROWSERS_PATH ||= ".cache/ms-playwright";
// Allows production-build verification without stopping a developer's server.
const externalBase = process.env.MMS_E2E_BASE_URL;
if (externalBase && !["localhost", "127.0.0.1"].includes(new URL(externalBase).hostname)) throw new Error("E2E external server must be local");
export default defineConfig({
  testDir: "./e2e", fullyParallel: false, retries: process.env.CI ? 1 : 0,
  // Next's first-route compilation is slow on Windows; keep concurrency bounded.
  workers: 2, timeout: 60000,
  use: { baseURL: externalBase || "http://127.0.0.1:3100", trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: externalBase ? undefined : { command: "npm run dev -- --hostname 127.0.0.1 --port 3100", url: "http://127.0.0.1:3100", reuseExistingServer: false, timeout: 180000,
    env: { DATABASE_URL: process.env.MMS_TEST_DATABASE_URL || "postgresql://mms:mms@127.0.0.1:5432/mms_test", SMTP_PASSWORD: "", WHATSAPP_ACCESS_TOKEN: "" } },
});
