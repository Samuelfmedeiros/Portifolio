import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#contact').scrollIntoViewIfNeeded();
  });

  test('displays contact section with heading', async ({ page }) => {
    await expect(page.locator('h2#contact-heading')).toContainText('CONTATO');
  });

  test('form fields are visible', async ({ page }) => {
    await expect(page.locator('#contact-name')).toBeVisible();
    await expect(page.locator('#contact-email')).toBeVisible();
    await expect(page.locator('#contact-message')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('WhatsApp CTA button is present', async ({ page }) => {
    const whatsappLink = page.locator('a[href*="wa.me"]');
    await expect(whatsappLink).toBeVisible();
    await expect(whatsappLink).toContainText('WhatsApp');
  });

  test('social media links are present', async ({ page }) => {
    await expect(page.locator('a[href*="linkedin.com"]')).toBeVisible();
    await expect(page.locator('a[href*="github.com"]')).toBeVisible();
  });

  test('form has accessibility labels', async ({ page }) => {
    const form = page.locator('form[aria-label="Formulário de contato"]');
    await expect(form).toBeVisible();

    await expect(page.locator('label[for="contact-name"]')).toBeVisible();
    await expect(page.locator('label[for="contact-email"]')).toBeVisible();
    await expect(page.locator('label[for="contact-message"]')).toBeVisible();
  });
});
