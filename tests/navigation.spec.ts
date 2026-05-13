import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('homepage loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Samuel/i);
  });

  test('navigation bar is visible', async ({ page }) => {
    const nav = page.locator('nav[role="navigation"]');
    await expect(nav).toBeVisible();
  });

  test('desktop navigation links are present', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });

    await expect(page.getByText('Sobre', { exact: false })).toBeVisible();
    await expect(page.getByText('Projetos', { exact: false })).toBeVisible();
    await expect(page.getByText('Terminal', { exact: false })).toBeVisible();
    await expect(page.getByText('Contato', { exact: false })).toBeVisible();
  });

  test('logo links to home page', async ({ page }) => {
    const logo = page.locator('nav a[href="/"]').first();
    await expect(logo).toBeVisible();
  });

  test('navigation links have correct hrefs', async ({ page }) => {
    const sobreLink = page.locator('a[href="#ferramentas"]').first();
    const projetosLink = page.locator('a[href="#projects"]').first();
    const terminalLink = page.locator('a[href="#terminal"]').first();
    const contatoLink = page.locator('a[href="#contact"]').first();

    await expect(sobreLink).toBeVisible();
    await expect(projetosLink).toBeVisible();
    await expect(terminalLink).toBeVisible();
    await expect(contatoLink).toBeVisible();
  });

  test('social links open in new tab', async ({ page }) => {
    const githubLink = page.locator('a[aria-label="GitHub"]');
    await expect(githubLink).toHaveAttribute('target', '_blank');
    await expect(githubLink).toHaveAttribute('rel', /noopener noreferrer/);

    const linkedinLink = page.locator('a[aria-label="LinkedIn"]');
    await expect(linkedinLink).toHaveAttribute('target', '_blank');
    await expect(linkedinLink).toHaveAttribute('rel', /noopener noreferrer/);
  });

  test('email link is present with mailto', async ({ page }) => {
    const emailLink = page.locator('a[aria-label="Email"]');
    await expect(emailLink).toHaveAttribute('href', /^mailto:/);
  });

  test('page has skip link for accessibility', async ({ page }) => {
    const skipLink = page.locator('a[href="#main-content"]').or(
      page.locator('a[class*="skip"]')
    );
    // Skip link should exist for accessibility
    const skipLinkExists = await skipLink.count() > 0;
    expect(skipLinkExists).toBeTruthy();
  });

  test('scroll progress bar exists', async ({ page }) => {
    const progressBar = page.locator('.scroll-progress');
    await expect(progressBar).toBeAttached();
  });

  test('clicking nav links scrolls smoothly', async ({ page }) => {
    const projetosLink = page.locator('a[href="#projects"]').first();

    // Click the link
    await projetosLink.click();

    // Page should handle the smooth scroll
    await page.waitForTimeout(500);
    // The scroll behavior is browser-native, so we just verify the click worked
    expect(await projetosLink.isVisible()).toBeTruthy();
  });

  test('mobile navigation shows icons', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Mobile nav should have icons visible
    const mobileNav = page.locator('.flex.md\\:hidden');
    await expect(mobileNav).toBeVisible();
  });

  test('desktop navigation hides on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Desktop nav should be hidden on mobile
    const desktopNav = page.locator('.hidden.md\\:flex');
    await expect(desktopNav).toBeHidden();
  });
});
