import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Keyboard Navigation & Focus', () => {
  test('tab order — Home page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Tab through page and collect focused elements
    const focusOrder = [];
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return null;
        return {
          tag: el.tagName,
          text: (el.textContent || '').trim().slice(0, 60),
          id: el.id || '',
          className: (el.className || '').slice(0, 60),
        };
      });
      if (focused) focusOrder.push(focused);
    }

    console.log('\n=== Tab Order (primeiros 15) ===');
    for (const [i, f] of focusOrder.entries()) {
      console.log(`  ${i+1}. <${f.tag}> id="${f.id}" text="${f.text}"`);
    }
  });

  test('focus indicators visible', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const focusInfo = await page.evaluate(() => {
      // Check :focus-visible on interactive elements
      const interactive = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const hasOutline = Array.from(interactive).filter(el => {
        const s = getComputedStyle(el);
        return s.outlineStyle !== 'none' && s.outlineWidth !== '0px';
      });

      return {
        interactiveCount: interactive.length,
        elementsWithOutline: hasOutline.length,
      };
    });

    console.log('\n=== Focus Indicators ===');
    console.log(`  Elementos interativos: ${focusInfo.interactiveCount}`);
    console.log(`  Elementos com outline visível: ${focusInfo.elementsWithOutline}`);
  });

  test('nav aria-current detection', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const nav = await page.evaluate(() => {
      const links = document.querySelectorAll('nav a');
      return Array.from(links).map(a => ({
        href: a.getAttribute('href'),
        text: a.textContent?.trim(),
        ariaCurrent: a.getAttribute('aria-current'),
      }));
    });

    console.log('\n=== Nav Links ===');
    for (const n of nav) {
      console.log(`  href="${n.href}" text="${n.text}" aria-current="${n.ariaCurrent || '(none)'}"`);
    }
  });
});
