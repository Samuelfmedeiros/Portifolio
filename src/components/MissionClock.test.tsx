import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MissionClock } from './MissionClock'

// Mock i18n — traduções PT por padrão (componente agora usa t())
vi.mock('@/lib/i18n', () => ({
  useLanguage: () => ({ t: (k: string) => PT[k] ?? k, locale: 'pt' }),
}))

const PT: Record<string, string> = {
  'mission.clock.title': 'RELÓGIO DE MISSÃO',
  'mission.clock.mission': 'TEMPO DE MISSÃO',
}

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
  })
})
