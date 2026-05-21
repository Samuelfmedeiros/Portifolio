import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Production', () => {
  test('page loads with correct title', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.fixed.inset-0.z-\\[9999\\]', { state: 'hidden', timeout: 30000 });
    await expect(page).toHaveTitle(/Samuel/);
  });

  test('main content is visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.fixed.inset-0.z-\\[9999\\]', { state: 'hidden', timeout: 30000 });
    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('navigation exists', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.fixed.inset-0.z-\\[9999\\]', { state: 'hidden', timeout: 30000 });
    await expect(page.locator('nav')).toBeAttached();
  });
});
