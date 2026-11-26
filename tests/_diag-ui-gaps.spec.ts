import { test } from '@playwright/test';

// DIAGNÓSTICO TEMPORÁRIO (não commitar) — mede os 3 achados do gap da rodada.
const DESKTOP = { width: 1280, height: 720 };
const MOBILE = { width: 390, height: 844 };

test.describe('diag', () => {
  test('borda direita + overflow', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.addInitScript(() => localStorage.setItem('mc-analytics-consent', 'accepted'));
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);
    const info = await page.evaluate(() => {
      const de = document.documentElement;
      const vw = window.innerWidth;
      const out: any[] = [];
      document.querySelectorAll('*').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0 && (r.right > vw + 0.5 || r.left < -0.5)) {
          const cs = getComputedStyle(el);
          out.push({
            tag: el.tagName,
            cls: (el.className || '').toString().slice(0, 120),
            left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width),
            pos: cs.position, overflowX: cs.overflowX,
            borderRight: cs.borderRightWidth + ' ' + cs.borderRightColor,
            bg: cs.backgroundColor,
          });
        }
      });
      return { scrollW: de.scrollWidth, clientW: de.clientWidth, bodyScrollW: document.body.scrollWidth, count: out.length, items: out.slice(0, 25) };
    });
    console.log('EDGE:', JSON.stringify(info, null, 1));
  });

  test('SOBRE contraste', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.addInitScript(() => localStorage.setItem('mc-analytics-consent', 'accepted'));
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);
    for (const theme of ['dark', 'light']) {
      await page.evaluate((t) => localStorage.setItem('mc-theme', t), theme);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      const res = await page.evaluate(() => {
        const h = Array.from(document.querySelectorAll('h2')).find((e) => e.textContent?.trim() === 'SOBRE');
        if (!h) return null;
        const cs = getComputedStyle(h);
        // fundo efetivo: sobe a árvore até achar cor não transparente
        let bgEl: Element | null = h; let bg = 'rgba(0, 0, 0, 0)';
        while (bgEl) { const c = getComputedStyle(bgEl).backgroundColor; if (c && !c.includes('rgba(0, 0, 0, 0)')) { bg = c; break; } bgEl = bgEl.parentElement; }
        return { color: cs.color, bg, text: h.textContent, cls: h.className };
      });
      console.log('SOBRE', theme, JSON.stringify(res));
    }
  });

  test('banner vs skills (mobile)', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.addInitScript(() => localStorage.setItem('mc-theme', 'dark'));
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);
    const res = await page.evaluate(async () => {
      const banner = document.querySelector('[aria-label*="cookie" i], [aria-label*="Fechar banner" i]');
      let bannerEl: Element | null = banner;
      if (!bannerEl) {
        const all = Array.from(document.querySelectorAll('div[class*="fixed"]'));
        bannerEl = all.find((e) => getComputedStyle(e).position === 'fixed' && e.className.includes('bottom-0')) || null;
      }
      const out: any = { banner: null };
      if (bannerEl) {
        const r = bannerEl.getBoundingClientRect();
        out.banner = { top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height), label: bannerEl.getAttribute('aria-label') };
      }
      // procura cards de habilidade
      const cands = Array.from(document.querySelectorAll('#profile *, main *')).filter((e) => {
        const r = e.getBoundingClientRect();
        return r.height > 20 && r.width > 40 && r.top < window.innerHeight && r.bottom > 0;
      });
      out.total = cands.length;
      // texto de nível
      const lvl = Array.from(document.querySelectorAll('span,div,p')).filter((e) => /intermedi|avanç|iniciante|expert|junior|pleno|sênior|senior/i.test(e.textContent || ''));
      out.levelEls = lvl.slice(0, 10).map((e) => ({ t: (e.textContent || '').trim().slice(0, 40), top: Math.round(e.getBoundingClientRect().top) }));
      return out;
    });
    console.log('BANNER:', JSON.stringify(res, null, 1));
    await page.screenshot({ path: '/tmp/opencode/diag-banner-mobile.png', fullPage: false });
  });
});