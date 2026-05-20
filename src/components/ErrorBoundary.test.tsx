import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'

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

  it('renders fallback UI when child throws', () => {
    // Suppress console.error for expected error
    vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <Thrower />
      </ErrorBoundary>
    )

    expect(screen.getByText('⚠ SISTEMA INSTÁVEL')).toBeInTheDocument()
    expect(screen.getByText(/Uma falha crítica foi detectada/)).toBeInTheDocument()
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })

  it('shows reset button in error state', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <Thrower />
      </ErrorBoundary>
    )

    const resetButton = screen.getByText('REINICIAR SISTEMA')
    expect(resetButton).toBeInTheDocument()
  })

  it('can recover from error when reset button is clicked', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    let shouldThrow = true
    const ConditionalThrower = () => {
      if (shouldThrow) throw new Error('Test error')
      return <div data-testid="recovered">Recovered</div>
    }

    render(
      <ErrorBoundary>
        <ConditionalThrower />
      </ErrorBoundary>
    )

    expect(screen.getByText('⚠ SISTEMA INSTÁVEL')).toBeInTheDocument()

    // Reset and change component behavior
    shouldThrow = false
    fireEvent.click(screen.getByText('REINICIAR SISTEMA'))

    expect(screen.getByTestId('recovered')).toBeInTheDocument()
  })

  it('displays error message in pre element', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <Thrower />
      </ErrorBoundary>
    )

    const pre = screen.getByText('Test error').closest('pre')
    expect(pre).toBeInTheDocument()
  })
})
