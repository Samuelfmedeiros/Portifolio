// playwright.config.ts
import { defineConfig } from '@playwright/test';
import { cpus } from 'node:os';

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
  // `retries: 0` fora do CI transformava flake de timing em regressão. O spec
  // a11y-contrast-region espera a hidratação e mede contraste com axe: sob carga
  // (host com treino em 1 core, 12 workers paralelos) ele falha por timeout e
  // passa isolado — medido em 13/11/2026, 2 passed com `violacoes=0` nas duas
  // paletas. 1 retry mata o flake sem esconder defeito real: contraste quebrado
  // falha nas duas tentativas.
  retries: 1,
  // Sem teto, cada worker pega 1 core. Com o host saturado isso é justamente o
  // que produz o timeout acima; metade dos cores deixa folga para o navegador.
  workers: process.env.CI ? 1 : Math.max(1, Math.floor(cpus().length / 2)),
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
