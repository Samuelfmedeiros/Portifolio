import { test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const VIEWS = [
  { name: 'desktop', size: { width: 1280, height: 720 } },
  { name: 'mobile', size: { width: 390, height: 844 } },
];

for (const v of VIEWS) {
  for (const theme of ['dark', 'light']) {
    test(`axe sem consentimento ${v.name} ${theme}`, async ({ page }) => {
      test.setTimeout(180_000);
      await page.addInitScript((t) => { localStorage.setItem('mc-theme', t); }, theme);
      await page.setViewportSize(v.size);
      const baseHost = new URL(process.env.TEST_BASE_URL || 'http://localhost:3000').host;
      await page.route('**/*', (route) => {
        const url = route.request().url();
        if (url.startsWith('data:') || url.includes('localhost') || url.includes('127.0.0.1') || url.includes(baseHost)) return route.continue();
        return route.abort();
      });
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; }' });
      const r = await new AxeBuilder({ page })
        .withRules(['color-contrast', 'region', 'target-size'])
        .analyze();
      const summary = (r.violations || []).map((x) => ({
        id: x.id, impact: x.impact, nodes: x.nodes.slice(0, 6).map((n) => ({
          target: (n.target || []).slice(0, 2).join(' '),
          snippet: (n.html || '').slice(0, 110),
          msgs: (n.any || []).map((m: any) => m.message).slice(0, 2),
        })),
      }));
      console.log(`AXE ${v.name}/${theme}:`, JSON.stringify(summary, null, 1));
    });
  }
}