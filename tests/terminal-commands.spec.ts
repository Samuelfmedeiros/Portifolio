import { test, expect } from '@playwright/test';

test.describe('Terminal', () => {
  test('terminal section exists', async ({ page }) => {
    await page.goto('/');
    const terminal = page.locator('#terminal');
    await expect(terminal).toBeAttached();
  });
});
