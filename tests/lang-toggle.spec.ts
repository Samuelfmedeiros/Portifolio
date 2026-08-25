import { test, expect } from '@playwright/test';

/**
 * E2E — Toggle de idioma PT↔EN
 * Reproduz a validação manual feita em produção (24/08/2026):
 * troca de idioma via React state (SPA, sem reload), html.lang sincronizado,
 * conteúdo realmente traduzido, ida e volta, zero erros de console.
 *
 * Rodar contra produção:  TEST_BASE_URL=https://samuelmedeiros.vercel.app npx playwright test tests/lang-toggle.spec.ts
 */

const HERO_PROJECTS = /ver projetos|view projects/i;
const TOGGLE_LABEL = /mudar para inglês|mudar para português/i;

function collectErrors(page: import('@playwright/test').Page) {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => pageErrors.push(e.message));
  return { consoleErrors, pageErrors };
}

for (const vp of [
  { name: 'desktop', viewport: { width: 1366, height: 900 } },
  { name: 'mobile', viewport: { width: 390, height: 844 } },
]) {
  test(`idioma PT→EN→PT sem reload (${vp.name})`, async ({ page }) => {
    await page.setViewportSize(vp.viewport);
    const { consoleErrors, pageErrors } = collectErrors(page);

    // Contexto brasileiro determinístico (getInitialLocale usa navigator.language pós-hidratação)
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'language', { get: () => 'pt-BR' });
      Object.defineProperty(navigator, 'languages', { get: () => ['pt-BR'] });
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const urlInicial = page.url();

    const toggle = page.getByRole('button', { name: TOGGLE_LABEL }).first();
    const projectsBtn = page.getByRole('link', { name: HERO_PROJECTS }).first();

    // Estado inicial: PT
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');

    // PT → EN
    await toggle.click();
    // AnimatePresence anima a troca do label (0.2s) — aguardar o texto estabilizar
    await expect(projectsBtn).toHaveText(/view projects/i);
    await expect(toggle).toHaveText('PT', { timeout: 5000 });
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    expect(page.url()).toBe(urlInicial); // prova de SPA: mesma URL, sem navegação

    // EN → PT (ida e volta)
    await toggle.click();
    await expect(projectsBtn).toHaveText(/ver projetos/i);
    await expect(toggle).toHaveText('EN', { timeout: 5000 });
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    expect(page.url()).toBe(urlInicial);

    // Console limpo durante toda a interação
    expect(consoleErrors, 'erros de console').toEqual([]);
    expect(pageErrors, 'exceções de página').toEqual([]);
  });
}
