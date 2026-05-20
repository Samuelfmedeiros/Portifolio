import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { KeyboardShortcuts } from './KeyboardShortcuts'

// Mock the useTheme hook
vi.mock('./ThemeProvider', () => ({
  useTheme: () => ({
    theme: 'dark' as const,
    toggle: vi.fn(),
  }),
}))

describe('KeyboardShortcuts', () => {
  beforeEach(() => {
    // Reset any timers
    vi.useFakeTimers()
  })

  it('renders the desktop hint element', () => {
    render(<KeyboardShortcuts />)
    // Desktop hint has "? = atalhos" text
    expect(screen.getByText('? = atalhos')).toBeInTheDocument()
  })

  it('renders the mobile shortcuts button', () => {
    render(<KeyboardShortcuts />)
    const button = screen.getByRole('button', { name: /Ver atalhos de teclado/i })
    expect(button).toBeInTheDocument()
  })

  it('shows shortcut overlay when button is clicked', () => {
    render(<KeyboardShortcuts />)
    const button = screen.getByRole('button', { name: /Ver atalhos de teclado/i })
    fireEvent.click(button)

    // The overlay should appear with dialog role
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByLabelText('Atalhos de teclado')).toBeInTheDocument()
  })

  it('displays all shortcut keys in overlay', () => {
    render(<KeyboardShortcuts />)
    const button = screen.getByRole('button', { name: /Ver atalhos de teclado/i })
    fireEvent.click(button)

    expect(screen.getByText('J / ↓')).toBeInTheDocument()
    expect(screen.getByText('K / ↑')).toBeInTheDocument()
    expect(screen.getByText('T')).toBeInTheDocument()
    expect(screen.getByText('?')).toBeInTheDocument()
    expect(screen.getByText('Esc')).toBeInTheDocument()
  })

  it('closes overlay when close button is clicked', () => {
    render(<KeyboardShortcuts />)
    const button = screen.getByRole('button', { name: /Ver atalhos de teclado/i })
    fireEvent.click(button)

    const closeButton = screen.getByRole('button', { name: /Fechar/i })
    fireEvent.click(closeButton)

    // Dialog should be gone
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes overlay when clicking outside', () => {
    render(<KeyboardShortcuts />)
    const button = screen.getByRole('button', { name: /Ver atalhos de teclado/i })
    fireEvent.click(button)

    // Click the overlay background (the dialog parent)
    const dialog = screen.getByRole('dialog')
    fireEvent.click(dialog)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders shortcut descriptions', () => {
    render(<KeyboardShortcuts />)
    const button = screen.getByRole('button', { name: /Ver atalhos de teclado/i })
    fireEvent.click(button)

    expect(screen.getByText('Próxima seção')).toBeInTheDocument()
    expect(screen.getByText('Seção anterior')).toBeInTheDocument()
    expect(screen.getByText('Alternar tema')).toBeInTheDocument()
  })
})
