import { test } from '@playwright/test';

test('desktop: conteúdo preso no fundo', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.addInitScript(() => localStorage.setItem('mc-theme', 'dark'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  const res = await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto';
    const total = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, total);
    await new Promise((r) => setTimeout(r, 400));
    const banner = Array.from(document.querySelectorAll('div')).find((e) => getComputedStyle(e).position === 'fixed' && e.className.includes('bottom-0') && e.getBoundingClientRect().height > 20)!;
    const br = banner.getBoundingClientRect();
    const texts = Array.from(document.querySelectorAll('main p, main span, main h1, main h2, main h3, main a, footer a, footer p, footer span'))
      .map((e) => ({ e, r: e.getBoundingClientRect() }))
      .filter(({ r }) => r.height > 0 && r.width > 0 && r.bottom > br.top - 1 && r.top < window.innerHeight)
      .map(({ e, r }) => {
        const cx = Math.min(Math.max(r.left + r.width / 2, 1), window.innerWidth - 2);
        const cy = Math.min(Math.max(r.top + r.height / 2, 1), window.innerHeight - 2);
        const hit = document.elementFromPoint(cx, cy);
        return { t: (e.textContent || '').trim().slice(0, 30), top: Math.round(r.top), bottom: Math.round(r.bottom), covered: !!(hit && !e.contains(hit) && hit !== e) };
      });
    return { bannerTop: Math.round(br.top), bannerH: Math.round(br.height), count: texts.length, texts };
  });
  console.log(JSON.stringify(res));
});