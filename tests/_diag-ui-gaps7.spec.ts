import { test } from '@playwright/test';

test('linha vertical na borda', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.addInitScript(() => localStorage.setItem('mc-analytics-consent', 'accepted'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  const buf = await page.screenshot({ type: 'png' });
  const res = await page.evaluate(async (data) => {
    const img = new Image();
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = 'data:image/png;base64,' + data; });
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    const ctx = c.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    const at = (x: number, y: number) => { const i = (y * c.width + x) * 4; return [d[i], d[i + 1], d[i + 2]] as const; };
    const frac = (x: number) => {
      let n = 0, tot = 0;
      for (let y = 0; y < c.height; y++) {
        const a = at(x, y), l = at(x - 1, y);
        const dd = Math.abs(a[0] - l[0]) + Math.abs(a[1] - l[1]) + Math.abs(a[2] - l[2]);
        tot++; if (dd > 10) n++;
      }
      return n / tot;
    };
    const out: any = { right: [], left: [] };
    for (let x = 1255; x < c.width; x++) out.right.push({ x, f: +frac(x).toFixed(3) });
    for (let x = 1; x <= 8; x++) out.left.push({ x, f: +frac(x).toFixed(3) });
    return out;
  }, buf.toString('base64'));
  console.log(JSON.stringify(res));
});