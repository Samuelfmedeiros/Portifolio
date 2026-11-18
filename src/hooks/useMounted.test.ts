import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { renderHook } from '@testing-library/react'
import { useMounted } from './useMounted'

/**
 * Contrato real do useMounted (src/hooks/useMounted.ts):
 * `useSyncExternalStore(subscribe, () => true, () => false)` — snapshot do
 * SERVIDOR = false, do CLIENTE = true.
 *
 * O teste anterior mockava `react` inteiro e trocava `useSyncExternalStore`
 * por uma versão que SEMPRE devolvia o snapshot de cliente, tornando o caso
 * SSR inalcançável (medido 18/11/2026: 1 de 3 vermelho — "expected true to be
 * false"). Medição de SSR de verdade exige `renderToString`, não mock.
 */
function Probe() {
  return createElement('span', null, useMounted() ? 'client' : 'ssr')
}

describe('useMounted', () => {
  it('SSR usa o serverSnapshot e devolve false', () => {
    expect(renderToString(createElement(Probe))).toContain('ssr')
  })

  it('no cliente devolve true', () => {
    const { result } = renderHook(() => useMounted())
    expect(result.current).toBe(true)
  })

  it('permanece true em re-renders', () => {
    const { result, rerender } = renderHook(() => useMounted())

    expect(result.current).toBe(true)

    rerender()
    expect(result.current).toBe(true)
  })
})
