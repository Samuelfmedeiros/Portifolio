import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, useTheme } from './ThemeProvider'

function TestConsumer() {
  const { theme, toggle, palette, setPalette } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="palette">{palette}</span>
      <button onClick={toggle}>Toggle</button>
      <button onClick={() => setPalette('violet')}>SetViolet</button>
    </div>
  )
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('theme-dark', 'theme-light')
    document.documentElement.style.removeProperty('--accent')
    document.documentElement.style.removeProperty('--accent-alt')
  })

  it('renders with default dark theme', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    )
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(document.documentElement.classList.contains('theme-dark')).toBeTruthy()
  })

  it('renders with default cyan palette', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    )
    expect(screen.getByTestId('palette')).toHaveTextContent('cyan')
  })

  it('toggles from dark to light', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    )
    fireEvent.click(screen.getByText('Toggle'))
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
    expect(localStorage.getItem('mc-theme')).toBe('light')
    expect(document.documentElement.classList.contains('theme-light')).toBeTruthy()
  })

  it('toggles from light back to dark', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    )
    const btn = screen.getByText('Toggle')
    fireEvent.click(btn)
    fireEvent.click(btn)
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(localStorage.getItem('mc-theme')).toBe('dark')
  })

  it('changes palette and persists to localStorage', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    )
    fireEvent.click(screen.getByText('SetViolet'))
    expect(screen.getByTestId('palette')).toHaveTextContent('violet')
    expect(localStorage.getItem('mc-palette')).toBe('violet')
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
