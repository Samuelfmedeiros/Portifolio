import { test, expect } from '@playwright/test';

test.describe('Theme', () => {
  test('page has theme wrapper', async ({ page }) => {
    await page.goto('/');
    const themeWrapper = page.locator('.theme-dark, .theme-light');
    await expect(themeWrapper).toBeAttached();
  });
});
