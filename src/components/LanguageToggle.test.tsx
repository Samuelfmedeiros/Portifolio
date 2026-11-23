import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

// Mock mínimo do i18n: só o que o LanguageToggle consome (locale, toggle, t).
// t() devolve o fallback quando existe e a chave quando não — mesmo contrato do
// mock do Navbar.test, para o teste não depender do dicionário real.
let localeAtual: 'pt' | 'en' = 'pt'
const toggleMock = vi.fn()

vi.mock('@/lib/i18n', () => ({
  useLanguage: () => ({
    locale: localeAtual,
    toggle: toggleMock,
    t: (key: string, fallback?: string) => fallback ?? key,
  }),
}))

import { LanguageToggle } from './LanguageToggle'

describe('LanguageToggle — WCAG 2.5.3 (label in name)', () => {
  beforeEach(() => {
    localeAtual = 'pt'
    toggleMock.mockClear()
  })

  it('mostra o idioma de destino e o nome acessível contém esse texto (pt -> EN)', () => {
    render(<LanguageToggle />)
    const botao = screen.getByRole('button')
    const rotulo = botao.getAttribute('aria-label') ?? ''
    // texto visível
    expect(botao.textContent).toContain('EN')
    // nome acessível precisa CONTER o texto visível, senão axe acusa
    // label-content-name-mismatch (medido em produção, 4 rotas x 4 cenários)
    expect(rotulo).toContain('EN')
    expect(rotulo.length).toBeGreaterThan('EN'.length)
  })

  it('no modo EN mostra PT e o nome acessível contém PT', () => {
    localeAtual = 'en'
    render(<LanguageToggle />)
    const botao = screen.getByRole('button')
    expect(botao.textContent).toContain('PT')
    expect(botao.getAttribute('aria-label') ?? '').toContain('PT')
  })

  it('clicar alterna o idioma', () => {
    render(<LanguageToggle />)
    screen.getByRole('button').click()
    expect(toggleMock).toHaveBeenCalledTimes(1)
  })
})
