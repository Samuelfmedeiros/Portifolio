import { test } from '@playwright/test';
test('tema/modo padrao do headless + linha na borda direita', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => {
    const root = document.documentElement;
    const cls = root.className;
    const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // quem pinta em x >= 1277
    const hits: any[] = [];
    for (let y = 4; y < window.innerHeight; y += 4) {
      const el = document.elementFromPoint(window.innerWidth - 2, y);
      if (el) hits.push({ y, tag: el.tagName, cls: (el.className || '').toString().slice(0, 60) });
    }
    return { cls, prefersDark: prefers, scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth, hits: hits.filter((h, i) => i === 0 || JSON.stringify(hits[i-1]) !== JSON.stringify(h)).slice(0, 10) };
  });
  console.log(JSON.stringify(r, null, 1));
});
