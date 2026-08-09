const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const ctxM = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'pt-BR', isMobile: true, hasTouch: true });
  const page = await ctxM.newPage();
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
      const dateEls = Array.from(c.querySelectorAll('span')).map(s => s.textContent?.trim()).filter(Boolean);
      const img = c.querySelector('img');
      const rect = img ? img.getBoundingClientRect() : null;
      const cs = img ? getComputedStyle(img) : null;
      return {
        title: title ? title.slice(0, 50) : null,
        dateSpans: dateEls.slice(0, 4),
        imgLoaded: img ? (img.complete && img.naturalWidth > 0) : false,
        imgW: rect ? Math.round(rect.width) : 0,
        imgH: rect ? Math.round(rect.height) : 0,
        imgDisplay: cs ? cs.display : null,
      };
    });
  });
  console.log('MOBILE BLOG:', JSON.stringify(info, null, 2));
  console.log('FAILED:', JSON.stringify(failed));
  await page.screenshot({ path: '/tmp/portfolio-blog-mobile.png', fullPage: false });
  await ctxM.close();
  await browser.close();
})();
