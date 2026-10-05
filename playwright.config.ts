// playwright.config.ts
import { defineConfig } from '@playwright/test';

// 16/09 (loop r2): TEST_BASE_URL LOCAL antes desligava o webServer inteiro — a
// porta do preview (ex: :3450) ficava sem servidor da branch e as specs de
// identidade abortavam com "porta NAO serve o Portifolio" (a machine tem
// serviço antigo no :3000 e o harness usa :3450). Agora o webServer sobe na
// porta do TEST_BASE_URL quando ele é local; só URL remota (produção) roda
// sem webServer, como antes.
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const isLocalBase = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/.test(BASE_URL);
const previewPort = (() => {
  try {
    return new URL(BASE_URL).port || '3000';
  } catch {
    return '3000';
  }
})();

export default defineConfig({
  testDir: './tests',
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

  webServer: isLocalBase ? {
    command: `./node_modules/.bin/next start -p ${previewPort}`,
    url: BASE_URL,
    // TEST_BASE_URL local explicit = o operador já definiu a porta; se algo
    // saudável responde nela, reusa (evita conflito com preview já subido).
    reuseExistingServer: process.env.TEST_BASE_URL ? true : !process.env.CI,
    timeout: 120000,
    stdout: 'pipe',
    stderr: 'pipe',
  } : undefined,

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
