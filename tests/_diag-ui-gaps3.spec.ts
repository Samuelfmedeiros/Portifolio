import { test } from '@playwright/test';

test('quem estoura a borda direita', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.addInitScript(() => localStorage.setItem('mc-analytics-consent', 'accepted'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  const info = await page.evaluate(() => {
    const vw = window.innerWidth;
    const out: any[] = [];
    document.querySelectorAll('*').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && r.right > vw + 1) {
        const chain: string[] = [];
        let p: Element | null = el.parentElement;
        let clipped = false;
        while (p) {
          const cs = getComputedStyle(p);
          chain.push(`${p.tagName}.${(p.className || '').toString().slice(0, 60)}|pos=${cs.position}|ox=${cs.overflowX}|clip=${cs.clipPath}`);
          if (cs.overflowX !== 'visible' || cs.overflow !== 'visible') clipped = true;
          p = p.parentElement;
        }
        const cs = getComputedStyle(el);
        out.push({
          tag: el.tagName,
          cls: (el.className || '').toString().slice(0, 80),
          left: Math.round(r.left), right: Math.round(r.right),
          stroke: `${cs.strokeWidth} ${cs.stroke}`, fill: cs.fill,
          clippedByAncestor: clipped,
          chain: chain.slice(0, 5),
        });
      }
    });
    return out;
  });
  console.log(JSON.stringify(info, null, 1));
});