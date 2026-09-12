import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Regressão das violações axe encontradas na home em produção (12/09/2026):
 *  - serious color-contrast: texto branco no botão WhatsApp (1.98:1, todos os temas)
 *    e link `repo` dos mini-games com --accent-alt cru (4.41:1 no dark).
 *  - moderate region: linha de Apoio/Consultoria do layout ficava fora de landmark.
 *
 * Prevenção: falha o CI se qualquer uma dessas classes voltar.
 */
test.describe('a11y — contraste e landmarks (regressão)', () => {
  const themes = [
    { name: 'dark', value: 'dark' },
    { name: 'light', value: 'light' },
  ];

  for (const theme of themes) {
    test(`home ${theme.name} — sem color-contrast nem region fora de landmark`, async ({ page }) => {
      await page.addInitScript((t) => {
        localStorage.setItem('mc-theme', t);
        localStorage.setItem('mc-analytics-consent', 'accepted');
      }, theme.value);

      // Sem rede externa: capas do RSS/AdSense só adicionam latência e flake.
      // Mas a própria origem sob teste (baseURL) sempre passa — inclusive em produção.
      const baseHost = new URL(process.env.TEST_BASE_URL || 'http://localhost:3000').host;
      await page.route('**/*', (route) => {
        const url = route.request().url();
        if (url.startsWith('data:') || url.includes('localhost') || url.includes('127.0.0.1') || url.includes(baseHost)) {
          return route.continue();
        }
        return route.abort();
      });

      await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(3000);

      // Seções lazy (contato/games) só montam perto da viewport — scroll progressivo.
      const height = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < height; y += 400) {
        await page.evaluate((v) => window.scrollTo(0, v), y);
        await page.waitForTimeout(100);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(600);

      const results = await new AxeBuilder({ page })
        .withRules(['color-contrast', 'region'])
        .analyze();

      const failing = results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => n.target.join(' ')).slice(0, 6),
        why: v.nodes[0]?.failureSummary?.replace(/\n/g, ' | ').slice(0, 200),
      }));

      console.log(`[a11y ${theme.name}] ${new Date().toISOString()} violacoes=${failing.length}`);
      expect(failing, JSON.stringify(failing, null, 2)).toEqual([]);
    });
  }
});
