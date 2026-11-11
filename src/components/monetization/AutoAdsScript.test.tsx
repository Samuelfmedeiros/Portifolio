import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { AutoAdsScript } from './AutoAdsScript'
import { MonetizationProvider } from './MonetizationProvider'
import { MONETIZATION_CONSENT_KEY } from '@/lib/monetization'

/**
 * Regressão medida em 11/11/2026: `<AutoAdsScript />` foi commiteado FORA do
 * `<MonetizationProvider>` (commit 8b71f8d, 09/11). Fora do provider,
 * `useMonetizationConsent()` devolve o default do `createContext`
 * (`consent` todo false) → `adsAllowed` false → o efeito sai cedo e o
 * `adsbygoogle.js` NUNCA é injetado, mesmo com o usuário aceitando anúncios.
 * Produção confirmou: consentimento aceito e `pagead2` = 0 (11/11/2026).
 *
 * Estes testes travam as duas pontas: o comportamento do componente e a
 * posição dele na árvore do layout.
 */
const SEL = 'script[src*="pagead2.googlesyndication.com"]'

function aceitarTudo() {
  localStorage.setItem(
    MONETIZATION_CONSENT_KEY,
    JSON.stringify({ analytics: true, ads: true, nonPersonalizedAds: true }),
  )
}

describe('AutoAdsScript', () => {
  beforeEach(() => {
    localStorage.clear()
    document.head.querySelectorAll(SEL).forEach((n) => n.remove())
  })

  afterEach(() => {
    cleanup()
    document.head.querySelectorAll(SEL).forEach((n) => n.remove())
  })

  it('injeta adsbygoogle.js quando há consentimento DENTRO do provider', () => {
    aceitarTudo()
    render(
      <MonetizationProvider>
        <AutoAdsScript />
      </MonetizationProvider>,
    )
    const script = document.head.querySelector(SEL) as HTMLScriptElement | null
    expect(script).not.toBeNull()
    expect(script?.src).toContain('ca-pub-')
    expect(script?.getAttribute('data-adsense-source')).toBe('auto-ads')
  })

  it('NÃO injeta nada sem consentimento', () => {
    render(
      <MonetizationProvider>
        <AutoAdsScript />
      </MonetizationProvider>,
    )
    expect(document.head.querySelector(SEL)).toBeNull()
  })

  it('NÃO injeta fora do provider — default do contexto é sem consentimento', () => {
    // É exatamente o bug de produção: o componente monta, mas o contexto
    // devolve o default e o script nunca entra.
    aceitarTudo()
    render(<AutoAdsScript />)
    expect(document.head.querySelector(SEL)).toBeNull()
  })

  it('layout mantém <AutoAdsScript /> DENTRO do <MonetizationProvider>', () => {
    const src = readFileSync(
      resolve(process.cwd(), 'src/app/layout.tsx'),
      'utf8',
    )
    const open = src.indexOf('<MonetizationProvider>')
    const close = src.indexOf('</MonetizationProvider>')
    const tag = src.indexOf('<AutoAdsScript />')

    expect(open).toBeGreaterThan(-1)
    expect(close).toBeGreaterThan(open)
    expect(tag).toBeGreaterThan(open)
    expect(tag).toBeLessThan(close)
  })
})
