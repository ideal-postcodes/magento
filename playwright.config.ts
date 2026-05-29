import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./test/playwright",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  timeout: 60000,
  use: {
    baseURL: "http://localhost:60154",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "snapshot",
      testDir: "./test/playwright/snapshot",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "e2e",
      testDir: "./test/playwright/e2e",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3000",
      },
    },
  ],
  webServer: {
    command: "npx http-server . -p 60154 -c-1 --silent",
    url: "http://localhost:60154",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
