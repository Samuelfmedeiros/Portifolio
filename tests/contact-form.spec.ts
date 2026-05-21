import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for loading screen to disappear
    await page.waitForSelector('.fixed.inset-0.z-\\[9999\\]', { state: 'hidden', timeout: 15000 });
  });

  test('displays contact section with heading', async ({ page }) => {
    await expect(page.locator('h2#contact-heading')).toContainText('CONTATO');
  });

  test('form fields are visible', async ({ page }) => {
    // Scroll to contact section first
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(page.locator('#contact-name')).toBeVisible();
    await expect(page.locator('#contact-email')).toBeVisible();
    await expect(page.locator('#contact-message')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeAttached();
  });

  test('WhatsApp CTA button is present', async ({ page }) => {
    const whatsappLink = page.locator('a[href*="wa.me"]');
    await expect(whatsappLink).toBeAttached();
  });

  test('social media links are present', async ({ page }) => {
    await expect(page.locator('a[href*="linkedin.com"]')).toBeAttached();
    await expect(page.locator('a[href*="github.com"]')).toBeAttached();
  });

  test('form has accessibility labels', async ({ page }) => {
    const form = page.locator('form[aria-label="Formulário de contato"]');
    await expect(form).toBeAttached();
  });
});
