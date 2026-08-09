const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();

  // ── DESKTOP ──
  const ctxD = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    locale: 'pt-BR',
    recordVideo: { dir: '/tmp/portfolio-video-blog', size: { width: 1280, height: 900 } },
  });
  const page = await ctxD.newPage();
  await page.goto('http://127.0.0.1:3220', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);
  const recusar = page.getByRole('button', { name: 'Recusar' });
  if (await recusar.count()) { await recusar.click({ force: true }); await page.waitForTimeout(500); }
  await page.evaluate(() => document.getElementById('blog')?.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/portfolio-video-blog/01-blog-desktop.png' });
  await ctxD.close();

  // ── MOBILE ──
  const ctxM = await browser.newContext({
    viewport: { width: 390, height: 844 },
    locale: 'pt-BR',
    isMobile: true,
    hasTouch: true,
    recordVideo: { dir: '/tmp/portfolio-video-blog-m', size: { width: 390, height: 844 } },
  });
  const pageM = await ctxM.newPage();
  await pageM.goto('http://127.0.0.1:3220', { waitUntil: 'domcontentloaded' });
  await pageM.waitForTimeout(4000);
  const recusarM = pageM.getByRole('button', { name: 'Recusar' });
  if (await recusarM.count()) { await recusarM.click({ force: true }); await pageM.waitForTimeout(500); }
  await pageM.evaluate(() => document.getElementById('blog')?.scrollIntoView({ block: 'start' }));
  await pageM.waitForTimeout(2000);
  await pageM.screenshot({ path: '/tmp/portfolio-video-blog/02-blog-mobile.png' });
  await ctxM.close();

  await browser.close();
  console.log('DONE BLOG');
})();
