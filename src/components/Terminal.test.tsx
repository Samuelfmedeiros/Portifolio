import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Terminal } from './Terminal'

describe('Terminal', () => {
  it('renders initial welcome message', () => {
    render(<Terminal />)
    expect(screen.getByText(/CONTROL TERMINAL/)).toBeInTheDocument()
  })

  it('renders input field', () => {
    render(<Terminal />)
    expect(screen.getByPlaceholderText('type a command...')).toBeInTheDocument()
  })

  it('executes help command', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('type a command...')
    await userEvent.type(input, 'help{Enter}')
    expect(screen.getByText(/AVAILABLE COMMANDS/)).toBeInTheDocument()
  })

  it('executes whoami command', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('type a command...')
    await userEvent.type(input, 'whoami{Enter}')
    expect(screen.getByText(/OPERATOR: Samuel Andrade/)).toBeInTheDocument()
  })

  it('executes ls projects command', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('type a command...')
    await userEvent.type(input, 'ls projects{Enter}')
    expect(screen.getByText(/DogWalk/)).toBeInTheDocument()
  })

  it('executes skills command', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('type a command...')
    await userEvent.type(input, 'skills{Enter}')
    expect(screen.getByText(/Python/)).toBeInTheDocument()
    expect(screen.getByText(/SQL/)).toBeInTheDocument()
  })

  it('executes contact command', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('type a command...')
    await userEvent.type(input, 'contact{Enter}')
    expect(screen.getByText(/samuelandrademedeiros@gmail.com/)).toBeInTheDocument()
  })

  it('executes date command', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('type a command...')
    await userEvent.type(input, 'date{Enter}')
    expect(screen.getByText(/MISSION TIME/)).toBeInTheDocument()
  })

  it('shows error for unknown command', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('type a command...')
    await userEvent.type(input, 'invalidcmd{Enter}')
    expect(screen.getByText(/COMMAND NOT FOUND/)).toBeInTheDocument()
  })

  it('clears history on clear command', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('type a command...')
    await userEvent.type(input, 'help{Enter}')
    await userEvent.type(input, 'clear{Enter}')
    // After clear, history is empty — banner and commands are gone
    expect(screen.queryByText(/AVAILABLE COMMANDS/)).not.toBeInTheDocument()
    expect(screen.queryByText(/CONTROL TERMINAL/)).not.toBeInTheDocument()
  })

  it('executes neofetch command', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('type a command...')
    await userEvent.type(input, 'neofetch{Enter}')
    expect(screen.getByText(/Next\.js 16/)).toBeInTheDocument()
    expect(screen.getByText(/RTX 3060/)).toBeInTheDocument()
  })

  it('executes matrix command', async () => {
    render(<Terminal />)
    const input = screen.getByPlaceholderText('type a command...')
    await userEvent.type(input, 'matrix{Enter}')
    // matrix generates random chars — check for multiple lines of output
    const matrixOutput = screen.getByText(/[ｦｧｨｩｪｫｬｭｮｯｱｲｳｵｶｷ]/)
    expect(matrixOutput).toBeInTheDocument()
  })
})
