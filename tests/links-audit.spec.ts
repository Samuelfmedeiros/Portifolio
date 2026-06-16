
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Dead Links & Rotas', () => {
  const routes = [
    { name: 'Home', path: '/' },
    { name: 'Privacidade', path: '/privacidade' },
    { name: 'Termos', path: '/termos' },
    { name: 'Robots', path: '/robots.txt' },
    { name: 'Sitemap', path: '/sitemap.xml' },
    { name: 'Manifest', path: '/manifest.webmanifest' },
    { name: 'Not Found', path: '/pagina-inexistente' },
  ];

  for (const route of routes) {
    test(`${route.name} (${route.path}) — HTTP status 200`, async ({ page }) => {
      const response = await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle' });
      expect(response?.status()).toBe(200);
      console.log(`  ${route.path} → ${response?.status()}`);
    });
  }

  test('Home — all internal links resolve', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    const links = await page.evaluate(() => {
      const allLinks = document.querySelectorAll('a[href]');
      const internal = Array.from(allLinks)
        .map(a => a.getAttribute('href'))
        .filter(h => h && !h.startsWith('http') && !h.startsWith('//') && !h.startsWith('mailto:') && !h.startsWith('tel:'))
        .filter(h => h !== '#')
        .map(h => h!.split('#')[0]); // Remove anchors, check path only
      return [...new Set(internal)]; // deduplicate
    });

    console.log(`\n=== Internal Links to Check (${links.length}) ===`);
    for (const link of links) {
      try {
        const resp = await page.request.get(`${BASE_URL}${link}`);
        const status = resp.status();
        const ok = status === 200 ? '✅' : '❌';
        console.log(`  ${ok} ${link} → ${status}`);
        expect(status).toBe(200);
      } catch (e) {
        console.log(`  ❌ ${link} → ERROR: ${e}`);
      }
    }
  });

  test('robots.txt — correct content', async ({ page }) => {
    const resp = await page.goto(`${BASE_URL}/robots.txt`, { waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
    const text = await page.locator('body').innerText();
    console.log('\n=== robots.txt ===');
    console.log(text);
    expect(text).toContain('User-agent');
    expect(text).toContain('Sitemap');
  });

  test('sitemap.xml — valid URLs', async ({ page }) => {
    const resp = await page.goto(`${BASE_URL}/sitemap.xml`, { waitUntil: 'networkidle' });
    expect(resp?.status()).toBe(200);
    const text = await page.locator('body').innerText();
    console.log('\n=== sitemap.xml ===');
    console.log(text.slice(0, 500));
    expect(text).toContain('samuelmedeiros.vercel.app');
  });
});
