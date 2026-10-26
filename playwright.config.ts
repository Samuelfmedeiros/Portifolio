// playwright.config.ts
import { defineConfig } from '@playwright/test';

// 25/10 (r6-r8 "3450 is already used"): UM dono de preview — o webServer
// plugin ABORTAVA antes do command (health-check com reuse:false + orfao na
// porta) e o fuser do command nunca rodava; globalSetup roda depois do plugin,
// entao duas subidas nunca podiam coexistir. Agora o dono e o
// tests/global-setup.ts: limpa a porta (fuser -k), sobe o next start do build
// da branch na porta do TEST_BASE_URL (local), valida IDENTIDADE HTTP real
// antes de liberar a suíte e derruba no teardown. URL remota (producao) e
// noop la dentro. Causa raiz lida do fonte do Playwright 1.63
// (WebServerPlugin._startProcess: isURLAvailable roda ANTES do command).
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: './tests',
  globalSetup: './tests/global-setup.ts',
  timeout: 60 * 1000,
  expect: {
    timeout: 10000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'list' : 'html',
  use: {
    actionTimeout: 15000,
    navigationTimeout: 30000,
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        viewport: { width: 1280, height: 720 },
        baseURL: BASE_URL,
      },
    },
  ],
});
