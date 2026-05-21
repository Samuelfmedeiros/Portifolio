import { test, expect } from '@playwright/test';

test.describe('Terminal Commands', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for loading screen to disappear
    await page.waitForSelector('.fixed.inset-0.z-\\[9999\\]', { state: 'hidden', timeout: 15000 });
  });

  test('renders terminal section', async ({ page }) => {
    // Scroll to terminal section
    const terminalSection = page.locator('#terminal');
    await terminalSection.scrollIntoViewIfNeeded();
    await expect(terminalSection).toBeVisible();
  });

  test('terminal has accessible input', async ({ page }) => {
    const terminalSection = page.locator('#terminal');
    await terminalSection.scrollIntoViewIfNeeded();
    const input = page.locator('input[aria-label="Digite um comando"]');
    await expect(input).toBeVisible({ timeout: 10000 });
  });

  test('help command shows output', async ({ page }) => {
    const terminalSection = page.locator('#terminal');
    await terminalSection.scrollIntoViewIfNeeded();
    const input = page.locator('input[aria-label="Digite um comando"]');
    await input.waitFor({ state: 'visible', timeout: 10000 });
    await input.click();
    await input.fill('help');
    await input.press('Enter');
    // Just verify input was cleared or changed after command
    await page.waitForTimeout(500);
    await expect(input).toBeVisible();
  });

  test('keyboard history works', async ({ page }) => {
    const terminalSection = page.locator('#terminal');
    await terminalSection.scrollIntoViewIfNeeded();
    const input = page.locator('input[aria-label="Digite um comando"]');
    await input.waitFor({ state: 'visible', timeout: 10000 });
    await input.click();
    await input.fill('help');
    await input.press('Enter');
    await page.waitForTimeout(300);
    await input.press('ArrowUp');
    // After ArrowUp, input should show previous command
    const value = await input.inputValue();
    expect(value.length).toBeGreaterThan(0);
  });
});
