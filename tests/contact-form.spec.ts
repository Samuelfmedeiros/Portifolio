import { test, expect } from '@playwright/test';

test.describe('Contact', () => {
  test('contact section exists', async ({ page }) => {
    await page.goto('/');
    const contact = page.locator('#contact');
    await expect(contact).toBeAttached();
  });
});
