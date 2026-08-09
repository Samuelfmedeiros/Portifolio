const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'pt-BR' });
  const page = await context.newPage();
  const failed = [];
  page.on('requestfailed', (req) => failed.push(req.url().split('/').pop() + ' -> ' + (req.failure()?.errorText || '?')));

  await page.goto('https://samuelmedeiros.vercel.app', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);
  const recusar = page.getByRole('button', { name: 'Recusar' });
  if (await recusar.count()) { await recusar.click({ force: true }); await page.waitForTimeout(600); }
  await page.evaluate(() => document.getElementById('blog')?.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(3000);

  const info = await page.evaluate(() => {
    const section = document.getElementById('blog');
    if (!section) return 'NO #blog';
    const cards = Array.from(section.querySelectorAll('article'));
    return cards.map((c) => {
      const title = c.querySelector('h3')?.textContent?.trim();
      const dateEl = c.querySelector('[class*="text-\\[var(--text-secondary)\\]\\/70"]');
      const img = c.querySelector('img');
      return {
        title: title ? title.slice(0, 60) : null,
        date: dateEl ? dateEl.textContent?.trim() : null,
        hasImg: !!img,
        imgLoaded: img ? (img.complete && img.naturalWidth > 0) : false,
        imgSrc: img ? (img.getAttribute('src') || '').split('/').pop() : null,
      };
    });
  });
  console.log('BLOG CARDS:', JSON.stringify(info, null, 2));
  console.log('FAILED:', JSON.stringify(failed));
  await page.screenshot({ path: '/tmp/portfolio-blog-prod.png' });
  await browser.close();
})();
