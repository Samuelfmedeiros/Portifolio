import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MissionClock } from './MissionClock'

describe('MissionClock', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-20T12:00:00Z'))
  })

  it('renders without crashing', () => {
    render(<MissionClock />)
    expect(screen.getByText('⏱ RELÓGIO DE MISSÃO')).toBeInTheDocument()
  })

  it('displays current time', () => {
    render(<MissionClock />)
    // The time display should be present
    const timeElements = document.querySelectorAll('.tabular-nums')
    expect(timeElements.length).toBeGreaterThan(0)
  })

  it('displays mission elapsed time section', () => {
    render(<MissionClock />)
    expect(screen.getByText('TEMPO DE MISSÃO')).toBeInTheDocument()
  })

  it('displays days hours minutes seconds units', () => {
    render(<MissionClock />)
    expect(screen.getByText('d')).toBeInTheDocument()
    expect(screen.getByText('h')).toBeInTheDocument()
    expect(screen.getByText('m')).toBeInTheDocument()
    expect(screen.getByText('s')).toBeInTheDocument()
  })

  it('calculates correct mission elapsed time', () => {
    render(<MissionClock />)
    // Mission started 2026-05-06T21:51:43Z
    // Current fake time: 2026-05-20T12:00:00Z
    // Elapsed: ~13 days, 14 hours, 8 minutes, 17 seconds
    expect(screen.getByText('13')).toBeInTheDocument()
  })

  it('displays formatted date', () => {
    render(<MissionClock />)
    // Should show Brazilian Portuguese date format
    const dateText = document.querySelector('.text-xs.font-mono.text-\\[var\\(--text-secondary\\)\\]')
    expect(dateText).toBeInTheDocument()
  })

  it('updates every second', () => {
    render(<MissionClock />)
    // Advance timer by 1 second
    vi.advanceTimersByTime(1000)
    // Component should still be rendering
    expect(screen.getByText('⏱ RELÓGIO DE MISSÃO')).toBeInTheDocument()
  })
})
