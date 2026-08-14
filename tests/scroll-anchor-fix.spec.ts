import { test, expect } from '@playwright/test';

/**
 * Fix: scroll "volta sozinho" após clique em âncora + rolagem manual.
 *
 * Causa raiz (14/08): o settle loop do fix #45 media o drift após o scrollend
 * e puxava o scroll DE VOLTA pro alvo mesmo quando o usuário tinha rolado
 * manualmente pra outro ponto durante o pouso (luta site × usuário).
 *
 * Guardas adicionadas:
 *  - interruptedRef: wheel/touchmove/keydown durante a navegação = usuário
 *    tomou controle → NÃO corrigir
 *  - distância |scrollY - targetTop| > 120px: usuário foi pra longe do alvo →
 *    não é drift residual de layout → NÃO corrigir
 *  - navGenRef: geração do clique invalida settles de cliques anteriores
 */

test.describe('navbar anchor scroll — não luta contra o usuário', () => {
  test('clique + rolagem manual durante o pouso NÃO volta pro alvo', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    // Clica em #projects na navbar (desktop)
    await page.evaluate(() => {
      const a = [...document.querySelectorAll('nav a[href="#projects"]')].find((x) => x.offsetParent !== null);
      if (a) (a as HTMLAnchorElement).click();
    });

    // Durante o smooth scroll (~300ms), o usuário rola manualmente pra longe
    await page.waitForTimeout(300);
    await page.mouse.wheel(0, 4000);
    await page.waitForTimeout(800);
    const afterUserScroll = await page.evaluate(() => window.scrollY);
    expect(afterUserScroll).toBeGreaterThan(0);

    // Espera qualquer settle pendente (scrollend + 2.5s de margem)
    await page.waitForTimeout(3500);

    // O scroll NÃO deve ter voltado pro alvo #projects
    const now = await page.evaluate(() => window.scrollY);
    const drift = Math.abs(now - afterUserScroll);
    expect(drift).toBeLessThanOrEqual(120);
  });

  test('clique normal SEM interrupção continua pousando no alvo', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    await page.evaluate(() => {
      const a = [...document.querySelectorAll('nav a[href="#projects"]')].find((x) => x.offsetParent !== null);
      if (a) (a as HTMLAnchorElement).click();
    });

    // Sem interação do usuário: espera o smooth scroll + settle convergir
    await page.waitForTimeout(4000);

    const pos = await page.evaluate(() => {
      const el = document.getElementById('projects');
      if (!el) return null;
      const sp = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 80;
      return { topRel: Math.round(el.getBoundingClientRect().top), sp };
    });
    expect(pos).not.toBeNull();
    // Alvo pousa perto do scroll-padding (tolerância de layout residual)
    expect(Math.abs(pos!.topRel - pos!.sp)).toBeLessThanOrEqual(30);
  });
});
