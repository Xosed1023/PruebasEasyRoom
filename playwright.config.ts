import { defineConfig } from "@playwright/test"

export default defineConfig({
    testDir: "./src/tests",
    testMatch: /.*\.spec\.ts/,
    timeout: 60000,
    use: {
        headless: false,
        trace: "on-first-retry",
    },
})
