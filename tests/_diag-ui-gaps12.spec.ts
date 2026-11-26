import { test } from '@playwright/test';

test('pixels: contraste REAL atras do SOBRE (light, cyan) + varredura do card', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('mc-theme', 'light');
    localStorage.setItem('mc-palette', 'cyan');
    localStorage.setItem('mc-analytics-consent', 'accepted');
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const box = await page.evaluate(() => {
    const h = Array.from(document.querySelectorAll('h2')).find((e) => /^(SOBRE|ABOUT)$/i.test((e.textContent || '').trim()));
    if (!h) return null;
    h.scrollIntoView({ block: 'center' });
    const r = h.getBoundingClientRect();
    return { x: Math.round(r.x - 30), y: Math.round(r.y + window.scrollY - 30), w: Math.round(r.width + 60), h: Math.round(r.height + 60) };
  });
  if (!box) { console.log('heading ausente'); return; }
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/opencode/sobre-light.png', clip: { x: box.x, y: box.y, width: box.w, height: box.h } });
  const res = await page.evaluate(() => {
    function parse(c: string) { const m = c.match(/[\d.]+/g)!.map(Number); return { r: m[0], g: m[1], b: m[2], a: m.length > 3 ? m[3] : 1 }; }
    function lum(c: any) { const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); }
    const card = Array.from(document.querySelectorAll('h2')).find((e) => /^(SOBRE|ABOUT)$/i.test((e.textContent || '').trim()))!.closest('.glass')!;
    const out: any[] = [];
    card.querySelectorAll('*').forEach((el) => {
      const txt = (el.textContent || '').trim();
      if (!txt || el.children.length > 0) return;
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) return;
      const cs = getComputedStyle(el);
      out.push({ tag: el.tagName, txt: txt.slice(0, 40), color: cs.color, fs: cs.fontSize, top: Math.round(r.top), bottom: Math.round(r.bottom) });
    });
    return out;
  });
  console.log(JSON.stringify(res, null, 1));
});