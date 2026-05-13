import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Clear localStorage before each test
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('theme toggle button exists', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="modo"]');
    await expect(themeToggle).toBeVisible();
  });

  test('initial theme is dark', async ({ page }) => {
    // Check that the page has dark theme class
    const darkWrapper = page.locator('.theme-dark');
    await expect(darkWrapper).toBeVisible();
  });

  test('clicking toggle switches to light mode', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="modo"]');
    
    // Initial should show "Ativar modo claro" (since we're in dark mode)
    await expect(themeToggle).toHaveAttribute('aria-label', 'Ativar modo claro');
    
    // Click to toggle
    await themeToggle.click();
    
    // After click, should show light mode
    await expect(page.locator('.theme-light')).toBeVisible();
  });

  test('clicking toggle again switches back to dark mode', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="modo"]');
    
    // First click - to light
    await themeToggle.click();
    await expect(page.locator('.theme-light')).toBeVisible();
    
    // Second click - back to dark
    await themeToggle.click();
    await expect(page.locator('.theme-dark')).toBeVisible();
  });

  test('theme preference is saved in localStorage', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="modo"]');
    
    // Click to toggle theme
    await themeToggle.click();
    
    // Check localStorage
    const storedTheme = await page.evaluate(() => localStorage.getItem('mc-theme'));
    expect(storedTheme).toBe('light');
  });

  test('theme persists after page reload', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="modo"]');
    
    // Toggle to light theme
    await themeToggle.click();
    await expect(page.locator('.theme-light')).toBeVisible();
    
    // Reload page
    await page.reload();
    
    // Theme should still be light
    await expect(page.locator('.theme-light')).toBeVisible();
  });

  test('toggle button shows correct icon (sun in dark mode)', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="modo"]');
    
    // In dark mode, should show sun icon (to switch to light)
    await expect(themeToggle).toHaveAttribute('aria-label', 'Ativar modo claro');
    
    // Check that button contains an SVG
    const svg = themeToggle.locator('svg');
    await expect(svg).toBeVisible();
  });

  test('toggle button shows correct icon (moon in light mode)', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="modo"]');
    
    // First toggle to light mode
    await themeToggle.click();
    
    // Now should show moon icon (to switch to dark)
    await expect(themeToggle).toHaveAttribute('aria-label', 'Ativar modo escuro');
  });

  test('toggle button has glass styling', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="modo"]');
    await expect(themeToggle).toHaveClass(/glass/);
  });

  test('toggle button is interactive', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="modo"]');
    
    // Button should be clickable
    await expect(themeToggle).toBeEnabled();
    
    // Click should work without errors
    await expect(themeToggle).toBeVisible();
    await themeToggle.click();
    
    // Verify click worked
    await expect(page.locator('.theme-light')).toBeVisible();
  });

  test('theme toggle is in navbar', async ({ page }) => {
    const nav = page.locator('nav[role="navigation"]');
    const themeToggle = nav.locator('button[aria-label*="modo"]');
    await expect(themeToggle).toBeVisible();
  });
});
