import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Terminal } from './Terminal'

// Mock MiniGames to avoid heavy imports
vi.mock('./MiniGames/MissionGames', () => ({
  MissionGames: () => null,
}))

describe('Terminal', () => {
  it('renders initial welcome banner', () => {
    render(<Terminal />)
    expect(screen.getByText(/MISSION CONTROL/)).toBeInTheDocument()
  })

  it('renders input field', () => {
    render(<Terminal />)
    expect(screen.getByPlaceholderText('digite um comando...')).toBeInTheDocument()
  })

  it('executes ajuda command', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('digite um comando...')
    await userEvent.type(input, 'ajuda{Enter}')
    expect(screen.getByText(/COMANDOS DISPONÍVEIS/)).toBeInTheDocument()
  })

  it('executes whoami command', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('digite um comando...')
    await userEvent.type(input, 'whoami{Enter}')
    expect(screen.getByText(/Samuel/)).toBeInTheDocument()
  })

  it('executes projetos command', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('digite um comando...')
    await userEvent.type(input, 'projetos{Enter}')
    expect(screen.getByText(/DogWalk/)).toBeInTheDocument()
  })

  it('executes habilidades command', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('digite um comando...')
    await userEvent.type(input, 'habilidades{Enter}')
    expect(screen.getByText(/Python/)).toBeInTheDocument()
    expect(screen.getByText(/SQL/)).toBeInTheDocument()
  })

  it('executes contato command', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('digite um comando...')
    await userEvent.type(input, 'contato{Enter}')
    expect(screen.getByText(/samuelandrademedeiros@gmail.com/)).toBeInTheDocument()
  })

  it('shows error for unknown command', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('digite um comando...')
    await userEvent.type(input, 'invalidcmd{Enter}')
    expect(screen.getByText(/COMMAND NOT FOUND/)).toBeInTheDocument()
  })

  it('clears history on clear command', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('digite um comando...')
    await userEvent.type(input, 'ajuda{Enter}')
    await userEvent.type(input, 'clear{Enter}')
    expect(screen.queryByText(/COMANDOS DISPONÍVEIS/)).not.toBeInTheDocument()
  })
})
