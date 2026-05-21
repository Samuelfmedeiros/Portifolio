import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('toggle button exists in navbar', async ({ page }) => {
    const nav = page.locator('nav[role="navigation"]');
    const themeToggle = nav.locator('button[aria-label*="modo"]');
    await expect(themeToggle).toBeVisible();
  });

  test('initial theme is dark', async ({ page }) => {
    await expect(page.locator('.theme-dark')).toBeVisible();
  });

  test('toggle switches to light mode', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="modo"]');
    await expect(themeToggle).toHaveAttribute('aria-label', 'Ativar modo claro');
    await themeToggle.click();
    await expect(page.locator('.theme-light')).toBeVisible();
  });

  test('toggle switches back to dark mode', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="modo"]');
    await themeToggle.click();
    await expect(page.locator('.theme-light')).toBeVisible();
    await themeToggle.click();
    await expect(page.locator('.theme-dark')).toBeVisible();
  });

  test('theme preference saved in localStorage', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="modo"]');
    await themeToggle.click();
    const stored = await page.evaluate(() => localStorage.getItem('mc-theme'));
    expect(stored).toBe('light');
  });
});
