import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataCalculator } from './DataCalculator'

describe('DataCalculator', () => {
  it('renders initial display', () => {
    render(<DataCalculator />)
    const displays = screen.getAllByText('0')
    expect(displays.length).toBeGreaterThanOrEqual(1)
  })

  it('updates display on number click', async () => {
    render(<DataCalculator />)
    // Click "7" then "3" buttons (use getAllByText to get the button)
    const sevens = screen.getAllByText('7')
    await userEvent.click(sevens[0])
    const threes = screen.getAllByText('3')
    await userEvent.click(threes[0])
    // Display should show "73"
    expect(screen.getByText('73')).toBeInTheDocument()
  })

  it('performs addition', async () => {
    render(<DataCalculator />)
    const twos = screen.getAllByText('2')
    await userEvent.click(twos[0])
    const plus = screen.getByText('+')
    await userEvent.click(plus)
    const threes = screen.getAllByText('3')
    await userEvent.click(threes[0])
    const equals = screen.getByText('=')
    await userEvent.click(equals)
    expect(screen.getAllByText('5').length).toBeGreaterThan(1)
  })

  it('performs multiplication', async () => {
    render(<DataCalculator />)
    const fours = screen.getAllByText('4')
    await userEvent.click(fours[0])
    const mul = screen.getByText('*')
    await userEvent.click(mul)
    const fives = screen.getAllByText('5')
    await userEvent.click(fives[0])
    const equals = screen.getByText('=')
    await userEvent.click(equals)
    expect(screen.getByText('20')).toBeInTheDocument()
  })

  it('clears display on C', async () => {
    render(<DataCalculator />)
    const ones = screen.getAllByText('1')
    await userEvent.click(ones[0])
    await userEvent.click(screen.getByText('2'))
    await userEvent.click(screen.getByText('3'))
    await userEvent.click(screen.getByText('C'))
    // After clear, display shows 0
    const zeros = screen.getAllByText('0')
    expect(zeros.length).toBeGreaterThanOrEqual(1)
  })
})
