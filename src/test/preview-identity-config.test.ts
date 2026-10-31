import { describe, it, expect } from 'vitest'
import config from '../../playwright.config'

// 25/10 (r6-r8): o dono do preview e o tests/global-setup.ts (limpa porta,
// sobe next start, valida identidade HTTP, teardown). O webServer plugin foi
// REMOVIDO: com reuseExistingServer:false, o health-check dele abortava
// ("is already used") ANTES do command rodar quando um orfao segurava a
// porta — e rodava ANTES do globalSetup, quebrando qualquer cura la dentro.
describe('playwright preview identity config', () => {
  it('pluga o globalSetup como unico dono do preview', () => {
    const cfg = config as any
    expect(cfg.globalSetup).toBe('./tests/global-setup.ts')
  })

  it('nao tem webServer (dois donos = abort do health-check antes do command)', () => {
    const cfg = config as any
    expect(cfg.webServer).toBeUndefined()
  })
})
