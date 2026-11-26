import { test } from '@playwright/test';

test('pixels da borda direita', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.addInitScript(() => localStorage.setItem('mc-analytics-consent', 'accepted'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  const buf = await page.screenshot({ type: 'png' });
  const b64 = buf.toString('base64');
  const res = await page.evaluate(async (data) => {
    const img = new Image();
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = 'data:image/png;base64,' + data; });
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    const ctx = c.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    const at = (x: number, y: number) => { const i = (y * c.width + x) * 4; return [d[i], d[i + 1], d[i + 2], d[i + 3]] as const; };
    const cols: any[] = [];
    for (let x = 1240; x < c.width; x++) {
      let diff = 0; const samples: any[] = [];
      for (let y = 0; y < c.height; y += 4) {
        const a = at(x, y); const l = at(0, y);
        const dd = Math.abs(a[0] - l[0]) + Math.abs(a[1] - l[1]) + Math.abs(a[2] - l[2]);
        if (dd > 12) { diff++; if (samples.length < 3) samples.push({ y, px: a.join(','), ref: l.join(',') }); }
      }
      if (diff > 0) cols.push({ x, diff, samples });
    }
    return { w: c.width, h: c.height, cols };
  }, b64);
  console.log(JSON.stringify(res));
});