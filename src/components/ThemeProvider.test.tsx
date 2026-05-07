import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ThemeProvider, useTheme } from './ThemeProvider'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

function TestConsumer() {
  const { theme, toggle } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggle}>Toggle</button>
    </div>
  )
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('renders with default dark theme', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    )
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
  })

  it('toggles from dark to light', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    )
    fireEvent.click(screen.getByText('Toggle'))
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('mc-theme', 'light')
  })

  it('toggles from light back to dark', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    )
    const btn = screen.getByText('Toggle')
    fireEvent.click(btn) // dark → light
    fireEvent.click(btn) // light → dark
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('mc-theme', 'dark')
  })

  it('applies theme-dark class when dark', () => {
    const { container } = render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    )
    expect(container.querySelector('.theme-dark')).toBeTruthy()
  })

  it('applies theme-light class after toggle', () => {
    const { container } = render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    )
    fireEvent.click(screen.getByText('Toggle'))
    expect(container.querySelector('.theme-light')).toBeTruthy()
  })
})
