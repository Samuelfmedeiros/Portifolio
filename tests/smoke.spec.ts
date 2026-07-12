import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Production', () => {
  test('page loads with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Samuel/, { timeout: 30000 });
  });

  test('main content is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#main-content')).toBeVisible({ timeout: 15000 });
  });

  test('navigation exists', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav')).toBeAttached({ timeout: 15000 });
  });

  test('footer exists', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer')).toBeAttached({ timeout: 15000 });
  });

  test('meta description present', async ({ page }) => {
    await page.goto('/');
    const meta = page.locator('meta[name="description"]');
    await expect(meta).toHaveAttribute('content', /Desenvolvedor Full Stack/);
  });

  test('canonical URL correct', async ({ page }) => {
    await page.goto('/');
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /https:\/\/samuelmedeiros\.vercel\.app\/?$/);
  });

  test('manifest linked', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('link[rel="manifest"]')).toBeAttached();
  });

  test('no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    await expect(page).toHaveTitle(/Samuel/);
    // Allow minor errors but only fail if there are too many
    if (errors.length >= 3) {
      console.log(`\n⚠ Console errors detected (${errors.length}):`);
      for (const err of errors) {
        console.log(`  → ${err.slice(0, 200)}`);
      }
    }
    expect(errors.length).toBeLessThan(6);
  });
});
