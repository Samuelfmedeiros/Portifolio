import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, useTheme } from './ThemeProvider'

// Mock Framer Motion before any imports
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useInView: vi.fn(() => true),
  }
})

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
    document.documentElement.classList.remove('theme-dark', 'theme-light')
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
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    )
    expect(document.documentElement.classList.contains('theme-dark')).toBeTruthy()
  })

  it('applies theme-light class after toggle', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    )
    fireEvent.click(screen.getByText('Toggle'))
    expect(document.documentElement.classList.contains('theme-light')).toBeTruthy()
  })
})
