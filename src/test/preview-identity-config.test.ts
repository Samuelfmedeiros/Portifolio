import { describe, it, expect } from 'vitest'
import config from '../../playwright.config'

describe('playwright preview identity config', () => {
  it('disables reuseExistingServer for local base', () => {
    const cfg = config as any
    const webServer = cfg.webServer
    // webServer is a function returning config; handle both forms
    const ws = typeof webServer === 'function' ? webServer({}) : webServer
    expect(ws).toBeDefined()
    expect(ws.reuseExistingServer).toBe(false)
  })
})
