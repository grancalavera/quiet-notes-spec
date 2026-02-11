import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./specs",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "setup",
      testDir: "./fixtures",
      testMatch: "auth.setup.ts",
    },
    {
      name: "chromium",
      use: {
        browserName: "chromium",
        storageState: ".auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],
});
