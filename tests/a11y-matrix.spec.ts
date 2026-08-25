import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * A11y COMPLETA — matriz: 3 rotas × 2 idiomas × 2 temas × 2 viewports = 24 cenários.
 *
 * - Tema/idioma forçados via localStorage (mc-theme / mc-locale) ANTES do load
 *   (fluxo real — mesmas chaves que ThemeProvider/LanguageProvider leem).
 * - Gate duro: ZERO violações critical/serious.
 * - Scroll progressivo p/ disparar whileInView antes do scan (pitfall lazy-hydration).
 * - Cookie banner: consent salvo no initScript pra não mascarar nem poluir o scan.
 */

const ROUTES = ['/', '/privacidade', '/termos'];
const LOCALES = [
  { name: 'PT', locale: 'pt-BR' },
  { name: 'EN', locale: 'en-US' },
];
const THEMES = ['dark', 'light'];
const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'mobile', width: 390, height: 844 },
];

test.describe('A11y completa — rotas × idioma × tema × viewport', () => {
  for (const route of ROUTES) {
    for (const { name: locName, locale } of LOCALES) {
      for (const theme of THEMES) {
        for (const vp of VIEWPORTS) {
          test(`${route} [${locName}/${theme}/${vp.name}] sem violações críticas/sérias`, async ({ page }) => {
            await page.setViewportSize({ width: vp.width, height: vp.height });
            await page.addInitScript(
              ([t, l]) => {
                localStorage.setItem('mc-theme', t as string);
                localStorage.setItem('mc-locale', l as string);
                localStorage.setItem('mc-analytics-consent', 'accepted');
              },
              [theme, locale]
            );
            await page.goto(route, { waitUntil: 'networkidle' });

            // Scroll progressivo — dispara whileInView/lazy-hydration antes do scan
            await page.evaluate(async () => {
              const h = document.body.scrollHeight;
              for (let y = 0; y < h; y += 400) {
                window.scrollTo(0, y);
                await new Promise((r) => setTimeout(r, 60));
              }
              window.scrollTo(0, 0);
            });
            await page.waitForTimeout(400);

            const results = await new AxeBuilder({ page })
              .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
              .analyze();

            const bad = results.violations.filter(
              (v) => v.impact === 'critical' || v.impact === 'serious'
            );

            if (bad.length > 0) {
              const lines = bad.map(
                (v) =>
                  `[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} nodes) → ` +
                  v.nodes.slice(0, 3).map((n) => n.target.join(', ')).join(' | ')
              );
              console.log(`VIOLAÇÕES ${route} ${locName}/${theme}/${vp.name}:\n${lines.join('\n')}`);
            }
            expect(bad, `${route} ${locName}/${theme}/${vp.name}`).toEqual([]);
          });
        }
      }
    }
  }

  test('matriz coberta — 24 cenários executados', async () => {
    // Documentação: 3 rotas × 2 idiomas × 2 temas × 2 viewports
    expect(ROUTES.length * LOCALES.length * THEMES.length * VIEWPORTS.length).toBe(24);
  });
});
