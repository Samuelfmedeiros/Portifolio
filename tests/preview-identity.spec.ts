import { test, expect } from '@playwright/test';

/**
 * Rodada 2 do test-loop (16/09/2026): gap "ERRO_IDENTIDADE_PREVIEW: 3450 nao
 * serve o portifolio" — o preview local da branch precisa responder na porta
 * sob teste com o app CERTO (a máquina tem systemd `next start` no :3000 e
 * ports efêmeras do harness; reusar servidor alheio passava despercebido até
 * o axe auditar um site estrangeiro).
 *
 * Este é o contrato de identidade EXPLÍCITO, com os mesmos sinais do guard de
 * a11y-contrast-region (main#main-content + skip-link), mas barato e sem axe:
 * falha cedo, na primeira navegação, com causa clara. Roda em qualquer porta:
 * webServer embutido (default :3000 no CI) ou TEST_BASE_URL local (:3450).
 */
test.describe('preview identity — porta sob teste serve o Portifolio', () => {
  test('home responde com main#main-content + skip-link + título', async ({ page }) => {
    const baseHost = new URL(process.env.TEST_BASE_URL || 'http://localhost:3000').host;
    // Rede externa bloqueada (RSS/AdSense/umami): só a origem sob teste passa.
    await page.route('**/*', (route) => {
      const url = route.request().url();
      if (
        url.startsWith('data:') ||
        url.includes('localhost') ||
        url.includes('127.0.0.1') ||
        url.includes(baseHost)
      ) {
        return route.continue();
      }
      return route.abort();
    });

    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });

    const title = await page.title();
    await expect(
      page.locator('main#main-content'),
      `título servido foi "${title}" — porta não serve o Portifolio?`,
    ).toBeAttached();
    await expect(page.getByRole('link', { name: /^pular para/i }).first()).toBeAttached();
    await expect(page).toHaveTitle(/Samuel/);
  });

  test('rota inexistente cai na 404 page do Next (não em app estrangeiro)', async ({ page }) => {
    const response = await page.goto('/rota-que-nao-existe-preview-identity-404', {
      waitUntil: 'domcontentloaded',
    });
    expect(response?.status()).toBe(404);
    await expect(page.locator('main#main-content')).toBeAttached();
  });
});
