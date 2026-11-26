import { test } from '@playwright/test';

const DESKTOP = { width: 1280, height: 720 };
const MOBILE = { width: 390, height: 844 };

test.describe('diag2', () => {
  test('SOBRE contraste v2', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.addInitScript(() => localStorage.setItem('mc-analytics-consent', 'accepted'));
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);
    for (const theme of ['dark', 'light']) {
      await page.evaluate((t) => localStorage.setItem('mc-theme', t), theme);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      const res = await page.evaluate(() => {
        const heads = Array.from(document.querySelectorAll('h1,h2,h3,p,span'));
        const h = heads.find((e) => /^(SOBRE|ABOUT)$/i.test((e.textContent || '').trim()));
        if (!h) {
          return { found: false, sample: heads.slice(0, 5).map((e) => (e.textContent || '').trim().slice(0, 25)) };
        }
        const cs = getComputedStyle(h);
        let bgEl: Element | null = h; let bg = 'rgba(0, 0, 0, 0)'; let bgCls = '';
        while (bgEl) { const c = getComputedStyle(bgEl).backgroundColor; if (c && !c.includes('rgba(0, 0, 0, 0)')) { bg = c; bgCls = (bgEl.className || '').toString().slice(0, 80); break; } bgEl = bgEl.parentElement; }
        return { found: true, tag: h.tagName, cls: (h.className || '').toString(), color: cs.color, bg, bgCls, fontSize: cs.fontSize };
      });
      console.log('SOBRE', theme, JSON.stringify(res));
    }
  });

  test('banner vs skills v2', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.addInitScript(() => localStorage.setItem('mc-theme', 'dark'));
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);
    const res = await page.evaluate(() => {
      const fixed = Array.from(document.querySelectorAll('div')).filter((e) => {
        const cs = getComputedStyle(e);
        return cs.position === 'fixed' && e.getBoundingClientRect().bottom >= window.innerHeight - 5 && e.getBoundingClientRect().height > 20;
      });
      const desc = fixed.map((e) => {
        const r = e.getBoundingClientRect();
        return { cls: (e.className || '').toString().slice(0, 90), top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height), z: getComputedStyle(e).zIndex };
      });
      // textos de nível
      const lvl = Array.from(document.querySelectorAll('span,div,p')).filter((e) => /^(Level|N[ií]vel)$/i.test((e.textContent || '').trim()));
      const lvlDesc = lvl.slice(0, 6).map((e) => {
        const r = e.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const hit = document.elementFromPoint(cx, cy);
        return { t: (e.textContent || '').trim(), top: Math.round(r.top), bottom: Math.round(r.bottom), hitTag: hit?.tagName, hitCls: (hit?.className || '').toString().slice(0, 70), covered: !!(hit && !e.contains(hit) && hit !== e) };
      });
      return { fixed: desc, levels: lvlDesc, vh: window.innerHeight };
    });
    console.log('BANNER2:', JSON.stringify(res, null, 1));
  });
});