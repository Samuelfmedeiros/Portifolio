import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ServicoButton } from './ServicoButton'

vi.mock('@/lib/i18n', () => ({
  useLanguage: () => ({ t: (k: string, fallback?: string) => ({ 'monetization.servico': 'Serviço' }[k] ?? fallback ?? k) }),
}))

vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({ track: vi.fn() }),
}))

describe('ServicoButton', () => {
  it('aponta para a página /servico', () => {
    render(<ServicoButton />)
    const link = screen.getByTestId('servico-button')
    expect(link).toBeInTheDocument()
    expect(link.getAttribute('href')).toBe('/servico')
  })

  it('usa o rótulo do dicionário (i18n), não string crua', () => {
    render(<ServicoButton />)
    expect(screen.getByText('Serviço')).toBeInTheDocument()
  })
})
