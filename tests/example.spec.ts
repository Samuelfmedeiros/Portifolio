// tests/example.spec.ts
import { test, expect } from '@playwright/test';

test('home page loads and shows title', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1, h2, [class*="title"], [class*="heading"]').filter({ hasText: /Samuel.*Medeiros|Medeiros.*Samuel/i }).first()).toBeVisible();
});
