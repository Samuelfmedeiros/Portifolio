import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Samuel/);
  });

  test('page has content', async ({ page }) => {
    await page.goto('/');
    // Wait for main content to be visible
    await expect(page.locator('#main-content')).toBeVisible();
  });
});
