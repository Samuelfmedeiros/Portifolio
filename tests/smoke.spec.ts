import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('page loads with correct title', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.fixed.inset-0.z-\\[9999\\]', { state: 'hidden', timeout: 30000 });
    await expect(page).toHaveTitle(/Samuel/);
  });

  test('navigation bar is visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.fixed.inset-0.z-\\[9999\\]', { state: 'hidden', timeout: 30000 });
    const nav = page.locator('nav[role="navigation"]');
    await expect(nav).toBeVisible();
  });

  test('main sections exist', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.fixed.inset-0.z-\\[9999\\]', { state: 'hidden', timeout: 30000 });
    await expect(page.locator('#hero')).toBeAttached();
    await expect(page.locator('#about')).toBeAttached();
    await expect(page.locator('#skills')).toBeAttached();
    await expect(page.locator('#projects')).toBeAttached();
    await expect(page.locator('#terminal')).toBeAttached();
    await expect(page.locator('#contact')).toBeAttached();
  });

  test('social links present', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.fixed.inset-0.z-\\[9999\\]', { state: 'hidden', timeout: 30000 });
    await expect(page.locator('a[aria-label="GitHub"]')).toBeAttached();
    await expect(page.locator('a[aria-label="LinkedIn"]')).toBeAttached();
  });

  test('scroll progress bar exists', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.fixed.inset-0.z-\\[9999\\]', { state: 'hidden', timeout: 30000 });
    await expect(page.locator('.scroll-progress')).toBeAttached();
  });

  test('skip link for accessibility', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.fixed.inset-0.z-\\[9999\\]', { state: 'hidden', timeout: 30000 });
    await expect(page.locator('a[href="#main-content"]')).toBeAttached();
  });

  test('theme toggle button exists', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.fixed.inset-0.z-\\[9999\\]', { state: 'hidden', timeout: 30000 });
    await expect(page.locator('button[aria-label*="modo"]')).toBeVisible();
  });

  test('footer exists', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.fixed.inset-0.z-\\[9999\\]', { state: 'hidden', timeout: 30000 });
    await page.locator('footer').scrollIntoViewIfNeeded();
    await expect(page.locator('footer')).toBeAttached();
  });
});
