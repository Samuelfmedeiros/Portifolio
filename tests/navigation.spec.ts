import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for loading screen to disappear
    await page.waitForSelector('.fixed.inset-0.z-\\[9999\\]', { state: 'hidden', timeout: 15000 });
  });

  test('homepage loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Samuel/i);
  });

  test('navigation bar is visible', async ({ page }) => {
    const nav = page.locator('nav[role="navigation"]');
    await expect(nav).toBeVisible();
  });

  test('navigation links are present', async ({ page }) => {
    await expect(page.getByText('Sobre')).toBeVisible();
    await expect(page.getByText('Projetos')).toBeVisible();
    await expect(page.getByText('Terminal')).toBeVisible();
    await expect(page.getByText('Contato')).toBeVisible();
  });

  test('social links open in new tab', async ({ page }) => {
    const githubLink = page.locator('a[aria-label="GitHub"]');
    await expect(githubLink).toHaveAttribute('target', '_blank');

    const linkedinLink = page.locator('a[aria-label="LinkedIn"]');
    await expect(linkedinLink).toHaveAttribute('target', '_blank');
  });

  test('scroll progress bar exists', async ({ page }) => {
    const progressBar = page.locator('.scroll-progress');
    await expect(progressBar).toBeAttached();
  });

  test('page has skip link for accessibility', async ({ page }) => {
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();
  });
});
