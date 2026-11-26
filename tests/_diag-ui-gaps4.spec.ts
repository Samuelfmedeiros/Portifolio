import { test } from '@playwright/test';

test('o que está na borda direita', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.addInitScript(() => localStorage.setItem('mc-analytics-consent', 'accepted'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  const info = await page.evaluate(() => {
    const vw = window.innerWidth;
    const rows: any[] = [];
    for (let y = 5; y < window.innerHeight; y += 20) {
      const el = document.elementFromPoint(vw - 1, y);
      if (!el) { rows.push({ y, hit: null }); continue; }
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      rows.push({
        y,
        tag: el.tagName,
        cls: (el.className || '').toString().slice(0, 70),
        text: (el.textContent || '').trim().slice(0, 30),
        rect: `${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)}`,
        bg: cs.backgroundColor, bgi: (cs.backgroundImage || '').slice(0, 40),
        borderRight: `${cs.borderRightWidth} ${cs.borderRightColor}`,
      });
    }
    return rows;
  });
  console.log(JSON.stringify(info));
});