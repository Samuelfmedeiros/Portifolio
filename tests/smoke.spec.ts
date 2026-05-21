import { test, expect } from '@playwright/test';

test('page loads and has title', async ({ page }) => {
  await page.goto('/');
  // Wait for loading screen to disappear (z-[9999] overlay)
  await page.waitForSelector('.fixed.inset-0.z-\\[9999\\]', { state: 'hidden', timeout: 30000 });
  await expect(page).toHaveTitle(/Samuel/, { timeout: 15000 });
});
