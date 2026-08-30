import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundary'

// Mock i18n
vi.mock('@/lib/i18n', () => ({
  useLanguage: () => ({ t: (k: string) => ({
    'error.boundary.title': 'SISTEMA INSTÁVEL',
    'error.boundary.message': 'Uma falha crítica foi detectada:',
    'error.boundary.unknown': 'Erro desconhecido',
    'error.boundary.reset': 'REINICIAR SISTEMA',
  })[k] ?? k }),
}))

// Component that throws
const Thrower = () => {
  throw new Error('Test error')
}

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Hello World</div>
      </ErrorBoundary>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('renders i18n title when error occurs', () => {
    // Suppress console.error from React error boundary
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary title="SISTEMA INSTÁVEL" message="Uma falha crítica foi detectada:" resetLabel="REINICIAR SISTEMA">
        <Thrower />
      </ErrorBoundary>
    )
    expect(screen.getByText('SISTEMA INSTÁVEL')).toBeInTheDocument()
    expect(screen.getByText('REINICIAR SISTEMA')).toBeInTheDocument()
    vi.restoreAllMocks()
  })
})