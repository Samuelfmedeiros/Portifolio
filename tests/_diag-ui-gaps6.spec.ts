import { test } from '@playwright/test';

test('elementos de 1px nas bordas', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.addInitScript(() => localStorage.setItem('mc-analytics-consent', 'accepted'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  const info = await page.evaluate(() => {
    const out: any[] = [];
    document.querySelectorAll('*').forEach((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (r.width <= 2 && r.width > 0 && (r.left >= 1278 || r.right <= 2)) {
        out.push({
          tag: el.tagName, cls: (el.className || '').toString().slice(0, 80),
          l: Math.round(r.left), t: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height),
          bg: cs.backgroundColor, bgi: (cs.backgroundImage || '').slice(0, 50), op: cs.opacity,
          pe: cs.pointerEvents,
        });
      }
    });
    return out;
  });
  console.log(JSON.stringify(info, null, 1));
});