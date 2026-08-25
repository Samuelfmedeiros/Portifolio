import { test, expect } from '@playwright/test';

/**
 * E2E — Toggle de tema com View Transition circular (restaurada) +
 * guardas anti-flake:
 *  - NUNCA esperar getAnimations()==0 (a home tem GSAP/starfield contínuo)
 *  - Troca de classe validada por polling nativo do expect (toHaveClass)
 *  - Elementos esperados com timeout folgado (hidratação sob CPU lenta)
 */

test.describe('Theme toggle — View Transition', () => {
  // LanguageProvider NÃO lê localStorage: inicia "pt" e pós-mount usa
  // navigator.language. Para labels PT determinísticos, setamos o locale
  // do contexto do browser (não do headless default en-US).
  test.use({ locale: 'pt-BR' });

  test.beforeEach(async ({ page }) => {
    // Estado determinístico: headless vem com prefers-color-scheme LIGHT e
    // navigator.language en-US — sem seed o tema inicial seria light e os
    // labels em EN. Locale válido é "pt"|"en" (NÃO "pt-BR").
    await page.addInitScript(() => {
      localStorage.setItem('mc-theme', 'dark');
      localStorage.setItem('mc-locale', 'pt');
      localStorage.setItem('mc-analytics-consent', 'accepted');
    });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('API startViewTransition disponível e helper exposto', async ({
    page,
  }) => {
    // Hidratação sob CPU lenta pode demorar — polling, não evaluate direto
    await expect
      .poll(
        async () =>
          page.evaluate(() => typeof (window as any).__pfThemeToggle === 'function'),
        { timeout: 30_000, intervals: [500, 1_000, 2_000] },
      )
      .toBe(true);
    const api = await page.evaluate(() => ({
      hasVT: typeof (document as any).startViewTransition === 'function',
      cls: document.documentElement.className,
    }));
    expect(api.hasVT, 'Chromium precisa suportar View Transitions').toBe(true);
    expect(api.cls).toMatch(/theme-dark/);
  });

  test('troca dark→light→dark com classes + persistência', async ({
    page,
  }) => {
    const root = page.locator('html');
    const btnDarkToLight = page
      .locator('button[aria-label="Ativar modo claro"]')
      .first();

    await expect(btnDarkToLight).toBeVisible({ timeout: 30_000 });
    await btnDarkToLight.click();
    await expect(root).toHaveClass(/theme-light/, { timeout: 15_000 });

    // Persistência
    const stored = await page.evaluate(() =>
      localStorage.getItem('mc-theme'),
    );
    expect(stored).toBe('light');

    // Volta
    const btnLightToDark = page
      .locator('button[aria-label="Ativar modo escuro"]')
      .first();
    await expect(btnLightToDark).toBeVisible({ timeout: 30_000 });
    await btnLightToDark.click();
    await expect(root).toHaveClass(/theme-dark/, { timeout: 15_000 });
    expect(await page.evaluate(() => localStorage.getItem('mc-theme'))).toBe(
      'dark',
    );
  });

  test('botões da navbar são icon-only (sem fundo)', async ({ page }) => {
    const cases: Array<[string, RegExp]> = [
      ['button[data-testid="palette-toggle"]', /rgba\(0, 0, 0, 0\)|transparent/],
      ['button[data-testid="theme-toggle"]', /rgba\(0, 0, 0, 0\)|transparent/],
    ];

    for (const [sel, transparent] of cases) {
      const btn = page.locator(sel).first();
      await expect(btn).toBeVisible({ timeout: 30_000 });
      const bg = await btn.evaluate((el) => getComputedStyle(el).backgroundColor);
      expect.soft(bg, `${sel} deve ser icon-only (bg=${bg})`).toMatch(transparent);
      const bw = await btn.evaluate((el) => getComputedStyle(el).borderTopWidth);
      expect.soft(bw, `${sel} não deve ter borda visível`).toBe('0px');
    }
  });

  test('prefers-reduced-motion: troca direta sem animação de VT', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
    await page.goto('/', { waitUntil: 'networkidle' });

    const root = page.locator('html');
    await expect(root).toHaveClass(/theme-dark/, { timeout: 30_000 });

    const btn = page
      .locator('button[aria-label="Ativar modo claro"]')
      .first();
    await expect(btn).toBeVisible({ timeout: 30_000 });
    await btn.click();
    // Troca direta: classe aplica rápido (sem espera de animação)
    await expect(root).toHaveClass(/theme-light/, { timeout: 5_000 });
    expect(await page.evaluate(() => localStorage.getItem('mc-theme'))).toBe(
      'light',
    );
  });
});
