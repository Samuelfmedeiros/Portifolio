import { test, expect } from '@playwright/test';

/**
 * Visual Regression Testing — Portifolio Samuel
 * Foco nas seções principais. Portifolio usa Framer Motion + GitHub API —
 * por isso: reducedMotion no navegador + espera de rede + scroll determinístico.
 * Baseline: TEST_BASE_URL=https://samuelmedeiros.vercel.app pnpm exec playwright test --update-snapshots
 */
const ROTAS = [
  { rota: '/', nome: 'home' },
  { rota: '/#projects', nome: 'projetos' },
  { rota: '/#games', nome: 'games' },
  { rota: '/#contact', nome: 'contato' },
];

test.beforeEach(async ({ page }) => {
  // desliga animações de verdade (Framer Motion respeita prefers-reduced-motion)
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

for (const r of ROTAS) {
  test(`visual: ${r.nome}`, async ({ page }) => {
    await page.addStyleTag({
      content: '* { transition: none !important; caret-color: transparent !important; }',
    });
    await page.goto(r.rota, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    if (r.rota.includes('#')) {
      const id = r.rota.split('#')[1];
      await page.evaluate((secId) => {
        const el = document.getElementById(secId);
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, id);
    } else {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    }
    // espera animações/API terminarem
    await page.waitForTimeout(1500);
    // 🔴 12/08/2026 lazy-hydration: GameShowcase/ContactForm hidratam via
    // next/dynamic quando o scroll chega. Scroolla até o fim para disparar a
    // hidratação de TODAS as seções lazy, espera o fallback sumir, e volta ao
    // topo para o fullPage capturar o conteúdo REAL (determinístico).
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    await page.waitForFunction(
      () => !document.body.innerText.toLowerCase().includes("carregando"),
      null,
      { timeout: 20000 }
    );
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot(`${r.nome}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    });
  });
}
