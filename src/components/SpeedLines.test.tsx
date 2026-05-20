import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { SpeedLines } from './SpeedLines'

describe('SpeedLines', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Mock scrollY
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
    })
    // Mock requestAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      return setTimeout(cb, 16) as unknown as number
    })
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders without crashing', () => {
    // Should render but return null since intensity starts at 0
    const { container } = render(<SpeedLines />)
    // Initially returns null because intensity < 0.02
    expect(container).toBeTruthy()
  })

  it('returns null when intensity is low', () => {
    const { container } = render(<SpeedLines />)
    // No children since intensity starts at 0
    expect(container.firstChild).toBeNull()
  })
})
