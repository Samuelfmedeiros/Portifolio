import { test } from '@playwright/test';

test('scroll até o fim: o que fica escondido atrás do banner', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => localStorage.setItem('mc-theme', 'dark'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  const res = await page.evaluate(async () => {
    const total = document.documentElement.scrollHeight;
    window.scrollTo(0, total);
    await new Promise((r) => setTimeout(r, 400));
    const banner = Array.from(document.querySelectorAll('div')).find((e) => {
      const cs = getComputedStyle(e);
      return cs.position === 'fixed' && e.className.includes('bottom-0') && e.getBoundingClientRect().height > 20;
    });
    const br = banner ? banner.getBoundingClientRect() : null;
    // conteúdo dentro da faixa do banner
    const hidden: any[] = [];
    document.querySelectorAll('a, button, span, p, h2, h3').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      if (r.top < br!.top || r.top > br!.bottom) return;
      const cx = Math.min(Math.max(r.left + r.width / 2, 2), window.innerWidth - 2);
      const cy = Math.min(Math.max(r.top + r.height / 2, br!.top + 2), br!.bottom - 2);
      const hit = document.elementFromPoint(cx, cy);
      if (hit && !el.contains(hit) && hit !== el && !banner!.contains(el)) {
        hidden.push({ tag: el.tagName, text: (el.textContent || '').trim().slice(0, 45), cy: Math.round(cy), hit: (hit.className || '').toString().slice(0, 45) });
      }
    });
    return { total, banner: br ? { top: Math.round(br.top), bottom: Math.round(br.bottom), h: Math.round(br.height) } : null, hiddenCount: hidden.length, hidden: hidden.slice(0, 12), scrollMax: total - window.innerHeight, scrollY: Math.round(window.scrollY) };
  });
  console.log(JSON.stringify(res, null, 1));
});