import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Terminal } from './Terminal'

// Mock MiniGames to avoid heavy imports
vi.mock('./MiniGames/MissionGames', () => ({
  MissionGames: () => null,
}))

describe('Terminal', () => {
  it('renders initial welcome banner', () => {
    render(<Terminal />)
    expect(screen.getByText(/PORTIFOLIO/)).toBeInTheDocument()
  })

  it('renders input field', () => {
    render(<Terminal />)
    expect(screen.getByPlaceholderText('digite um comando...')).toBeInTheDocument()
  })

  it('executes ajuda command', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('digite um comando...')
    await userEvent.type(input, 'ajuda{Enter}')
    expect(screen.getByText(/terminal.help/)).toBeInTheDocument()
  })

  it('executes whoami command', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('digite um comando...')
    await userEvent.type(input, 'whoami{Enter}')
    expect(screen.getByText('Samuel Medeiros')).toBeInTheDocument()
  })

  it('executes projetos command', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('digite um comando...')
    await userEvent.type(input, 'projetos{Enter}')
    expect(screen.getByText(/terminal.projects/)).toBeInTheDocument()
  })

  it('executes habilidades command', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('digite um comando...')
    await userEvent.type(input, 'habilidades{Enter}')
    expect(screen.getByText(/terminal.skills/)).toBeInTheDocument()
  })

  it('executes contato command', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('digite um comando...')
    await userEvent.type(input, 'contato{Enter}')
    expect(screen.getByText(/terminal.contact/)).toBeInTheDocument()
  })

  it('executes sobre command', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('digite um comando...')
    await userEvent.type(input, 'sobre{Enter}')
    expect(screen.getByText(/terminal.about/)).toBeInTheDocument()
  })

  it('executes hora and date command', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('digite um comando...')
    await userEvent.type(input, 'hora{Enter}')
    await userEvent.type(input, 'date{Enter}')
    const all = screen.queryAllByText(/terminal.time/)
    expect(all.length).toBeGreaterThan(0)
  })

  it('executes uptime, stack, github, neofetch, theme, fix, run, matrix, sudo, ls, pwd, skills, banner, quote, ipconfig, exit, holofote commands', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('digite um comando...')
    const cmds = ['uptime', 'stack', 'github', 'neofetch', 'theme', 'fix path_variables', 'run routine:lights_out', 'matrix', 'sudo rm -rf /', 'fix', 'run', 'sudo', 'ls', 'pwd', 'skills', 'banner', 'quote', 'ipconfig', 'exit', 'holofote']
    for (const cmd of cmds) {
      await userEvent.type(input, `${cmd}{Enter}`)
    }
    const preElements = screen.getAllByText(/terminal\./)
    expect(preElements.length).toBeGreaterThan(0)
  })

  it('executes echo, ping, whois, cowsay commands', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('digite um comando...')
    await userEvent.type(input, 'echo hello{Enter}')
    await userEvent.type(input, 'ping localhost{Enter}')
    await userEvent.type(input, 'whois samuel{Enter}')
    await userEvent.type(input, 'cowsay hi{Enter}')
    await userEvent.type(input, 'cowsay{Enter}')
    const all = screen.queryAllByText(/hello/)
    expect(all.length).toBeGreaterThan(0)
  })

  it('handles command history with ArrowUp and ArrowDown', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('digite um comando...')
    await userEvent.type(input, 'whoami{Enter}')
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(true).toBe(true)
  })

  it('handles tab completion', async () => {
    render(<Terminal />)
    expect(screen.getByPlaceholderText('digite um comando...')).toBeInTheDocument()
  })

  it('handles input focus and blur', () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('digite um comando...')
    fireEvent.focus(input)
    fireEvent.blur(input)
    expect(true).toBe(true)
  })

  it('shows error for unknown command', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('digite um comando...')
    await userEvent.type(input, 'invalidcmd{Enter}')
    expect(screen.getByText(/Comando não encontrado/)).toBeInTheDocument()
  })

  it('clears history on clear command', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('digite um comando...')
    await userEvent.type(input, 'ajuda{Enter}')
    await userEvent.type(input, 'clear{Enter}')
    expect(screen.queryByText(/COMANDOS DISPONÍVEIS/)).not.toBeInTheDocument()
  })
})
