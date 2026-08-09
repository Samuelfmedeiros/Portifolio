const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'pt-BR' });
  const page = await context.newPage();
  await page.goto('https://samuelmedeiros.vercel.app', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);
  const recusar = page.getByRole('button', { name: 'Recusar' });
  if (await recusar.count()) { await recusar.click({ force: true }); await page.waitForTimeout(600); }
  await page.evaluate(() => document.getElementById('blog')?.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(2500);

  const info = await page.evaluate(() => {
    const section = document.getElementById('blog');
    if (!section) return 'NO #blog';
    const cards = Array.from(section.querySelectorAll('article'));
    return cards.map((c, i) => {
      const badge = c.querySelector('[class*="badge"], [class*="project"]');
      const title = c.querySelector('h3')?.textContent?.trim();
      const allSpans = Array.from(c.querySelectorAll('span, time, small')).map(s => s.textContent?.trim()).filter(Boolean);
      const img = c.querySelector('img');
      const href = c.querySelector('a')?.getAttribute('href');
      return {
        idx: i + 1,
        badgeText: badge?.textContent?.trim(),
        title: title ? title.slice(0, 55) : null,
        spans: allSpans.slice(0, 6),
        img: img ? (img.getAttribute('src') || '').split('/').pop() : null,
        link: href,
      };
    });
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
