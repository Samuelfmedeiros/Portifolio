
import { test } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Performance Audit', () => {
  test('page performance metrics', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const metrics = await page.evaluate(() => {
      const perf = performance;
      const nav = perf.getEntriesByType('navigation')[0] as any;
      const paint = perf.getEntriesByType('paint');

      return {
        domContentLoaded: nav?.domContentLoadedEventEnd || 0,
        domInteractive: nav?.domInteractive || 0,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        loadEventEnd: nav?.loadEventEnd || 0,
        domComplete: nav?.domComplete || 0,
        transferSize: nav?.transferSize || 0,
        encodedBodySize: nav?.encodedBodySize || 0,
        decodedBodySize: nav?.decodedBodySize || 0,
        duration: nav?.duration || 0,
      };
    });

    console.log('\n=== Performance Metrics ===');
    console.log(`DOM Content Loaded: ${metrics.domContentLoaded.toFixed(0)}ms`);
    console.log(`DOM Interactive: ${metrics.domInteractive.toFixed(0)}ms`);
    console.log(`First Paint: ${metrics.firstPaint.toFixed(0)}ms`);
    console.log(`First Contentful Paint: ${metrics.firstContentfulPaint.toFixed(0)}ms`);
    console.log(`Load Event: ${metrics.loadEventEnd.toFixed(0)}ms`);
    console.log(`DOM Complete: ${metrics.domComplete.toFixed(0)}ms`);
    console.log(`Total Duration: ${metrics.duration.toFixed(0)}ms`);
    console.log(`HTML Transfer Size: ${(metrics.transferSize / 1024).toFixed(1)}KB`);
    console.log(`HTML Encoded Size: ${(metrics.encodedBodySize / 1024).toFixed(1)}KB`);
    console.log(`HTML Decoded Size: ${(metrics.decodedBodySize / 1024).toFixed(1)}KB`);
  });

  test('image loading attributes', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    const imgInfo = await page.evaluate(() => {
      const imgs = document.querySelectorAll('img');
      return Array.from(imgs).map(img => ({
        src: img.getAttribute('src')?.slice(0, 60) || '',
        alt: img.getAttribute('alt')?.slice(0, 30) || '',
        loading: img.getAttribute('loading') || '(not set)',
        width: img.getAttribute('width') || '(not set)',
        height: img.getAttribute('height') || '(not set)',
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        hasLazy: img.getAttribute('loading') === 'lazy',
      }));
    });

    console.log('\n=== Image Loading Attributes ===');
    const lazyImgs = imgInfo.filter(i => i.hasLazy);
    const eagerImgs = imgInfo.filter(i => !i.hasLazy);
    console.log(`Total images: ${imgInfo.length}`);
    console.log(`Lazy loaded: ${lazyImgs.length}`);
    console.log(`Eager loaded (above-fold): ${eagerImgs.length}`);
    
    for (const img of imgInfo) {
      const dims = img.naturalWidth && img.naturalHeight ? `${img.naturalWidth}x${img.naturalHeight}` : 'unknown';
      console.log(`  [${img.loading}] ${img.src.slice(0, 50)} dims=${dims}`);
    }

    // Check WebP support
    const hasWebp = await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      return canvas.toDataURL('image/webp').indexOf('image/webp') === 0;
    });
    console.log(`\nWebP support: ${hasWebp}`);
  });

  test('layout shift (CLS) and font loading', async ({ page }) => {
    // Use a fresh page for CLS measurement
    await page.goto(BASE_URL, { waitUntil: 'commit' });

    // Track layout shifts
    const cls = 0;
    await page.evaluate(() => {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`CLS: ${(entry as any).value}`);
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const fontInfo = await page.evaluate(() => {
      // Check font-display
      const sheets = document.styleSheets;
      const fontFaces: any[] = [];
      try {
        for (const sheet of sheets) {
          const rules = (sheet as CSSStyleSheet).cssRules;
          if (!rules) continue;
          for (const rule of rules) {
            if (rule instanceof CSSFontFaceRule) {
              fontFaces.push({
                fontFamily: rule.style.fontFamily,
                fontWeight: rule.style.fontWeight,
                fontDisplay: rule.style.fontDisplay,
                src: rule.style.src?.slice(0, 80),
              });
            }
          }
        }
      } catch(e) { /* CORS restrictions */ }

      // Check if fonts are loaded
      const fonts = document.fonts;
      return {
        fontFaces,
        fontCount: fonts.size,
        loadedFonts: Array.from(fonts.values()).map(f => ({
          family: f.family,
          status: f.status,
        })),
      };
    });

    console.log('\n=== Font Loading ===');
    console.log(`Font faces defined: ${fontInfo.fontFaces.length}`);
    for (const ff of fontInfo.fontFaces) {
      console.log(`  ${ff.fontFamily} display=${ff.fontDisplay} weight=${ff.fontWeight}`);
    }
    console.log(`Fonts loaded: ${fontInfo.loadedFonts.length}`);
    for (const f of fontInfo.loadedFonts) {
      console.log(`  ${f.family} status=${f.status}`);
    }

    console.log(`\nCLS captured via PerformanceObserver (check console above)`);
  });

  test('bundle size analysis', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    const resources = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource');
      const jsResources = entries.filter(e => e.name.match(/\.(js|jsx|tsx)(\?|$)/) || e.initiatorType === 'script');
      const cssResources = entries.filter(e => e.name.match(/\.(css|scss)(\?|$)/) || e.initiatorType === 'link' && (e.name.includes('.css')));
      const imgResources = entries.filter(e => e.initiatorType === 'img');

      return {
        totalResources: entries.length,
        totalTransferSize: entries.reduce((sum, e: any) => sum + (e.transferSize || 0), 0),
        totalEncodedSize: entries.reduce((sum, e: any) => sum + (e.encodedBodySize || 0), 0),
        jsBundles: jsResources.slice(0, 10).map((e: any) => ({
          name: e.name.split('/').pop()?.split('?')[0] || e.name.slice(-40),
          size: `${(e.transferSize / 1024).toFixed(1)}KB`,
          duration: `${e.duration.toFixed(0)}ms`,
        })),
        cssBundles: cssResources.slice(0, 10).map((e: any) => ({
          name: e.name.split('/').pop()?.split('?')[0] || e.name.slice(-40),
          size: `${(e.transferSize / 1024).toFixed(1)}KB`,
        })),
        images: imgResources.slice(0, 10).map((e: any) => ({
          name: e.name.split('/').pop() || e.name.slice(-40),
          size: `${(e.transferSize / 1024).toFixed(1)}KB`,
          encodedSize: `${(e.encodedBodySize / 1024).toFixed(1)}KB`,
        })),
      };
    });

    console.log('\n=== Resource Bundle Analysis ===');
    console.log(`Total resources: ${resources.totalResources}`);
    console.log(`Total transfer size: ${(resources.totalTransferSize / 1024).toFixed(1)}KB`);
    console.log(`Total encoded size: ${(resources.totalEncodedSize / 1024).toFixed(1)}KB`);

    console.log('\n--- JS Bundles (top 10) ---');
    for (const js of resources.jsBundles) {
      console.log(`  ${js.size} ${js.name} (${js.duration})`);
    }

    console.log('\n--- CSS (top 10) ---');
    for (const css of resources.cssBundles) {
      console.log(`  ${css.size} ${css.name}`);
    }

    console.log('\n--- Images ---');
    for (const img of resources.images) {
      console.log(`  ${img.size} ${img.name}`);
    }
  });
});
