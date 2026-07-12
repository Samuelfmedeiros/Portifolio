
import { test } from '@playwright/test';

test.describe('DOM Inspection', () => {
  test('navbar DOM structure', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const info = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      if (!nav) return { error: 'no nav' };
      
      const getElementInfo = (el, depth = 0) => {
        if (depth > 5 || !el) return null;
        const children = Array.from(el.children);
        return {
          tag: el.tagName,
          class: el.className?.slice(0, 80) || '',
          role: el.getAttribute('role') || '',
          ariaLabel: el.getAttribute('aria-label') || '',
          childCount: children.length,
          children: children.slice(0, 5).map(c => ({
            tag: c.tagName,
            role: c.getAttribute('role') || '',
            class: (c.className || '').slice(0, 60),
            childCount: c.children.length,
            children: Array.from(c.children).slice(0, 3).map(cc => ({
              tag: cc.tagName,
              class: (cc.className || '').slice(0, 60),
              role: cc.getAttribute('role') || '',
              ariaCurrent: cc.getAttribute('aria-current') || '',
            })),
          })),
        };
      };

      return getElementInfo(nav);
    });

    console.log('\n=== Navbar DOM ===');
    console.log(JSON.stringify(info, null, 2));
  });
});
