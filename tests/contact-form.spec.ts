import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Scroll to contact section
    await page.locator('#contact').scrollIntoViewIfNeeded();
  });

  test('displays contact form with all fields', async ({ page }) => {
    await expect(page.locator('h2#contact-heading')).toContainText('CONTATO');
    await expect(page.locator('#contact-name')).toBeVisible();
    await expect(page.locator('#contact-email')).toBeVisible();
    await expect(page.locator('#contact-message')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('validates required fields', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Form should not submit without required fields
    await expect(page.locator('#contact-name')).toBeFocused();
  });

  test('validates email format', async ({ page }) => {
    await page.locator('#contact-name').fill('Test User');
    await page.locator('#contact-email').fill('invalid-email');
    await page.locator('#contact-message').fill('Test message');
    
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Should show error for invalid email
    await expect(page.locator('#contact-email')).toBeFocused();
  });

  test('shows success message after submission', async ({ page }) => {
    await page.locator('#contact-name').fill('Test User');
    await page.locator('#contact-email').fill('test@example.com');
    await page.locator('#contact-message').fill('Test message');
    
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Wait for submission to complete
    await page.waitForTimeout(1000);
    
    // Should show success state or sending state
    const successElement = page.locator('[aria-label="Mensagem enviada com sucesso"]');
    const sendingButton = page.locator('button[type="submit"][aria-busy="true"]');
    
    await expect(
      successElement.or(sendingButton)
    ).toBeVisible();
  });

  test('displays WhatsApp CTA button', async ({ page }) => {
    const whatsappLink = page.locator('a[href*="wa.me"]');
    await expect(whatsappLink).toBeVisible();
    await expect(whatsappLink).toContainText('WhatsApp');
  });

  test('displays social media links', async ({ page }) => {
    await expect(page.locator('a[href*="linkedin.com"]')).toBeVisible();
    await expect(page.locator('a[href*="github.com"]')).toBeVisible();
  });

  test('copy email button works', async ({ page }) => {
    const copyButton = page.locator('button').filter({ hasText: /samuelandrademedeiros@gmail.com/ });
    await expect(copyButton).toBeVisible();
    
    // Grant clipboard permissions
    const context = page.context();
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    await copyButton.click();
    
    // Should show "Copiado!" feedback
    await expect(page.locator('text=Copiado!')).toBeVisible();
  });

  test('form has proper accessibility attributes', async ({ page }) => {
    const form = page.locator('form[aria-label="Formulário de contato"]');
    await expect(form).toBeVisible();
    
    // Check labels are associated with inputs
    await expect(page.locator('label[for="contact-name"]')).toBeVisible();
    await expect(page.locator('label[for="contact-email"]')).toBeVisible();
    await expect(page.locator('label[for="contact-message"]')).toBeVisible();
  });

  test('shows rate limit error when submitting too fast', async ({ page }) => {
    // Fill form
    await page.locator('#contact-name').fill('Test User');
    await page.locator('#contact-email').fill('test@example.com');
    await page.locator('#contact-message').fill('Test message');
    
    // Submit twice quickly
    await page.locator('button[type="submit"]').first().click();
    await page.waitForTimeout(500);
    await page.locator('button[type="submit"]').first().click();
    
    // Should show rate limit error
    const errorMessage = page.locator('text=Aguarde 30 segundos');
    await expect(errorMessage).toBeVisible();
  });
});
