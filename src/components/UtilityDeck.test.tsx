import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { UtilityDeck } from './UtilityDeck'

// Mock child components
vi.mock('./MissionClock', () => ({
  MissionClock: () => <div data-testid="mission-clock">Mission Clock</div>,
}))

vi.mock('./DataCalculator', () => ({
  DataCalculator: () => <div data-testid="data-calculator">Data Calculator</div>,
}))

vi.mock('./MiniGames/MiniGame', () => ({
  MiniGame: () => <div data-testid="mini-game">Mini Game</div>,
}))

// Mock i18n — return key when no fallback, fallback when provided
vi.mock('@/lib/i18n', () => ({
  useLanguage: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
  }),
}))

describe('UtilityDeck', () => {
  it('renders without crashing', () => {
    render(<UtilityDeck />)
    expect(screen.getByText('▸ Utilitários')).toBeInTheDocument()
  })

  it('renders three widget buttons using i18n keys', () => {
    render(<UtilityDeck />)
    expect(screen.getByText('utility.clock')).toBeInTheDocument()
    expect(screen.getByText('utility.calculator')).toBeInTheDocument()
    expect(screen.getByText('games.label.terminal')).toBeInTheDocument()
  })

  it('has correct aria-label on group', () => {
    render(<UtilityDeck />)
    expect(screen.getByLabelText('Utilitários')).toBeInTheDocument()
  })

  it('shows widget when button is clicked', () => {
    render(<UtilityDeck />)
    const clockButton = screen.getByText('utility.clock').closest('button')
    fireEvent.click(clockButton!)
    expect(screen.getByTestId('mission-clock')).toBeInTheDocument()
  })

  it('hides widget when same button is clicked again', () => {
    render(<UtilityDeck />)
    const clockButton = screen.getByText('utility.clock').closest('button')
    fireEvent.click(clockButton!)
    expect(screen.getByTestId('mission-clock')).toBeInTheDocument()
    fireEvent.click(clockButton!)
    expect(screen.queryByTestId('mission-clock')).not.toBeInTheDocument()
  })

  it('switches between widgets', () => {
    render(<UtilityDeck />)
    // Click clock
    fireEvent.click(screen.getByText('utility.clock').closest('button')!)
    expect(screen.getByTestId('mission-clock')).toBeInTheDocument()

    // Click mini-game
    fireEvent.click(screen.getByText('games.label.terminal').closest('button')!)
    expect(screen.getByTestId('mini-game')).toBeInTheDocument()
    expect(screen.queryByTestId('mission-clock')).not.toBeInTheDocument()
  })

  it('closes widget when close button is clicked', () => {
    render(<UtilityDeck />)
    fireEvent.click(screen.getByText('utility.clock').closest('button')!)
    expect(screen.getByTestId('mission-clock')).toBeInTheDocument()

    const closeButton = screen.getByLabelText('Fechar widget')
    fireEvent.click(closeButton)
    expect(screen.queryByTestId('mission-clock')).not.toBeInTheDocument()
  })

  it('sets aria-expanded correctly', () => {
    render(<UtilityDeck />)
    const clockButton = screen.getByText('utility.clock').closest('button')
    expect(clockButton).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(clockButton!)
    expect(clockButton).toHaveAttribute('aria-expanded', 'true')
  })
})
