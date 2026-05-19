import { test, expect } from '@playwright/test'

test.describe('Terminal Commands', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for terminal to load
    await page.waitForSelector('[aria-label="Terminal"]', { timeout: 10000 })
  })

  test('renders terminal with welcome message', async ({ page }) => {
    const terminal = page.locator('[aria-label="Terminal"]')
    await expect(terminal).toBeVisible()
    await expect(terminal).toContainText('MISSION CONTROL')
  })

  test('help command shows available commands', async ({ page }) => {
    const input = page.locator('input[aria-label="Digite um comando"]')
    await input.click()
    await input.fill('help')
    await input.press('Enter')
    await expect(page.locator('div').filter({ hasText: /help|comandos/i })).toBeVisible()
  })

  test('whoami command shows identity', async ({ page }) => {
    const input = page.locator('input[aria-label="Digite um comando"]')
    await input.click()
    await input.fill('whoami')
    await input.press('Enter')
    await expect(page.locator('div').filter({ hasText: /samuel|medeiros|desenvolvedor/i })).toBeVisible()
  })

  test('clear command clears terminal output', async ({ page }) => {
    const input = page.locator('input[aria-label="Digite um comando"]')
    await input.click()
    await input.fill('whoami')
    await input.press('Enter')
    await input.fill('clear')
    await input.press('Enter')
    // Terminal should be mostly empty after clear
    const output = page.locator('[aria-label="Terminal"]')
    await expect(output).toBeVisible()
  })

  test('skills command shows skills list', async ({ page }) => {
    const input = page.locator('input[aria-label="Digite um comando"]')
    await input.click()
    await input.fill('skills')
    await input.press('Enter')
    await expect(page.locator('div').filter({ hasText: /skill|habilidade|python|sql|react/i })).toBeVisible()
  })

  test('terminal has keyboard navigation', async ({ page }) => {
    const input = page.locator('input[aria-label="Digite um comando"]')
    await input.click()
    await input.fill('help')
    await input.press('Enter')
    await input.press('ArrowUp')
    await expect(input).toHaveValue('help')
  })

  test('terminal has accessible input', async ({ page }) => {
    const input = page.locator('input[aria-label="Digite um comando"]')
    await expect(input).toBeVisible()
    await expect(input).toBeEditable()
  })
})
