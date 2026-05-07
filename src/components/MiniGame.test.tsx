import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MiniGame } from './MiniGame'

describe('MiniGame', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // target = 51 (0.5 * 100 + 1)
  })

  it('renders initial state', () => {
    render(<MiniGame />)
    expect(screen.getByText('🎮 LÓGICA: ADIVINHE')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('1-100')).toBeInTheDocument()
  })

  it('shows too low message', async () => {
    render(<MiniGame />)
    const input = screen.getByPlaceholderText('1-100')
    await userEvent.type(input, '25{Enter}')
    expect(screen.getByText(/BAIXO/)).toBeInTheDocument()
  })

  it('shows too high message', async () => {
    render(<MiniGame />)
    const input = screen.getByPlaceholderText('1-100')
    await userEvent.type(input, '75{Enter}')
    expect(screen.getByText(/ALTO/)).toBeInTheDocument()
  })

  it('shows invalid input message', async () => {
    render(<MiniGame />)
    const input = screen.getByPlaceholderText('1-100')
    await userEvent.type(input, '999{Enter}')
    expect(screen.getByText(/inválida/)).toBeInTheDocument()
  })

  it('wins when correct number guessed (51 with Math.random=0.5)', async () => {
    render(<MiniGame />)
    const input = screen.getByPlaceholderText('1-100')
    await userEvent.type(input, '51{Enter}')
    expect(screen.getByText(/ACERTOU/)).toBeInTheDocument()
  })

  it('shows NOVO button after winning', async () => {
    render(<MiniGame />)
    const input = screen.getByPlaceholderText('1-100')
    await userEvent.type(input, '51{Enter}')
    expect(screen.getByText('NOVO')).toBeInTheDocument()
  })
})
