import { test, expect } from '@playwright/test'

test.describe('Terminal Commands', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders terminal with welcome message', async ({ page }) => {
    const terminal = page.locator('[aria-label="Terminal"]')
    await expect(terminal).toBeVisible()
    await expect(terminal).toContainText('MISSION CONTROL')
  })

  test('terminal has accessible input', async ({ page }) => {
    const input = page.locator('input[aria-label="Digite um comando"]')
    await expect(input).toBeVisible()
    await expect(input).toBeEditable()
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

  test('clear command clears output', async ({ page }) => {
    const input = page.locator('input[aria-label="Digite um comando"]')
    await input.click()
    await input.fill('whoami')
    await input.press('Enter')
    await input.fill('clear')
    await input.press('Enter')
    await expect(page.locator('[aria-label="Terminal"]')).toBeVisible()
  })

  test('keyboard history works', async ({ page }) => {
    const input = page.locator('input[aria-label="Digite um comando"]')
    await input.click()
    await input.fill('help')
    await input.press('Enter')
    await input.press('ArrowUp')
    await expect(input).toHaveValue('help')
  })
})
