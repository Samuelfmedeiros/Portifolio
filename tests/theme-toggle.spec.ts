import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for loading screen to disappear
    await page.waitForSelector('.fixed.inset-0.z-\\[9999\\]', { state: 'hidden', timeout: 15000 });
  });

  test('toggle button exists in navbar', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="modo"]');
    await expect(themeToggle).toBeVisible();
  });

  test('can toggle theme', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="modo"]');
    // Click once
    await themeToggle.click();
    await page.waitForTimeout(300);
    // Verify button still exists and is visible
    await expect(themeToggle).toBeVisible();
  });

  test('theme preference saved in localStorage', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="modo"]');
    await themeToggle.click();
    await page.waitForTimeout(300);
    const stored = await page.evaluate(() => localStorage.getItem('mc-theme'));
    expect(stored).toBeTruthy();
  });
});
