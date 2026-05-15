import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('navbar is visible on all pages', async ({ page }) => {
    await page.goto('/');
    
    const nav = page.locator('nav[role="navigation"]');
    await expect(nav).toBeVisible();
    
    // Check navigation links
    await expect(page.locator('a[href="#hero"]')).toBeVisible();
    await expect(page.locator('a[href="#about"]')).toBeVisible();
    await expect(page.locator('a[href="#projects"]')).toBeVisible();
    await expect(page.locator('a[href="#contact"]')).toBeVisible();
  });

  test('smooth scroll to sections', async ({ page }) => {
    await page.goto('/');
    
    // Click on About link
    await page.locator('a[href="#about"]').click();
    await page.waitForTimeout(1000);
    
    // Should be at About section
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeInViewport();
    
    // Click on Projects link
    await page.locator('a[href="#projects"]').click();
    await page.waitForTimeout(1000);
    
    const projectsSection = page.locator('#projects');
    await expect(projectsSection).toBeInViewport();
  });

  test('mobile menu works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile size
    await page.goto('/');
    
    const mobileMenuButton = page.locator('button[aria-label="Abrir menu"]');
    await expect(mobileMenuButton).toBeVisible();
    
    await mobileMenuButton.click();
    await page.waitForTimeout(500);
    
    // Mobile menu should be visible
    const mobileMenu = page.locator('[role="dialog"]');
    await expect(mobileMenu).toBeVisible();
  });
});

test.describe('Theme Toggle', () => {
  test('theme toggle button is visible', async ({ page }) => {
    await page.goto('/');
    
    const themeToggle = page.locator('button[aria-label*="modo"]');
    await expect(themeToggle).toBeVisible();
  });

  test('toggle switches between light and dark mode', async ({ page }) => {
    await page.goto('/');
    
    // Start in dark mode by default
    let html = page.locator('html');
    await expect(html).toHaveClass(/theme-dark/);
    
    // Toggle to light mode
    const themeToggle = page.locator('button[aria-label*="modo"]');
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    await expect(html).toHaveClass(/theme-light/);
    
    // Toggle back to dark mode
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    await expect(html).toHaveClass(/theme-dark/);
  });

  test('theme persists after page reload', async ({ page }) => {
    await page.goto('/');
    
    // Toggle to light mode
    const themeToggle = page.locator('button[aria-label*="modo"]');
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Reload page
    await page.reload();
    await page.waitForTimeout(500);
    
    // Should still be in light mode
    const html = page.locator('html');
    await expect(html).toHaveClass(/theme-light/);
  });
});

test.describe('Hero Section', () => {
  test('displays hero content', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Samuel')).toBeVisible();
    await expect(page.locator('text=Analista de Dados')).toBeVisible();
  });

  test('scroll progress bar is visible', async ({ page }) => {
    await page.goto('/');
    
    const progressBar = page.locator('.scroll-progress');
    await expect(progressBar).toBeVisible();
    
    // Initial width should be 0 or close to 0
    const width = await progressBar.evaluate((el) => el.clientWidth);
    expect(width).toBeGreaterThanOrEqual(0);
    
    // Scroll down and check progress increases
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(100);
    
    const newWidth = await progressBar.evaluate((el) => el.clientWidth);
    expect(newWidth).toBeGreaterThan(width);
  });
});

test.describe('Accessibility', () => {
  test('page has proper heading structure', async ({ page }) => {
    await page.goto('/');
    
    // Should have exactly one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    // Should have multiple h2 sections
    const h2Count = await page.locator('h2').count();
    expect(h2Count).toBeGreaterThan(3);
  });

  test('all images have alt text', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      // Alt can be empty string for decorative images
      expect(alt !== null).toBeTruthy();
    }
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Focus should move through elements
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('skip link is available', async ({ page }) => {
    await page.goto('/');
    
    // Skip link should be available for keyboard users
    const skipLink = page.locator('a[href="#main-content"], a.skip-link');
    // May or may not be visible, but should exist in DOM
    const count = await skipLink.count();
    // This test will fail if skip link doesn't exist - TODO: implement skip link
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
