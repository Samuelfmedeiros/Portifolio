import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { SpeedLines } from './SpeedLines'

describe('SpeedLines', () => {
  beforeEach(() => {
    // Mock requestAnimationFrame / cancelAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      return setTimeout(cb, 16) as unknown as number
    })
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
      clearTimeout(id)
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders without crashing', () => {
    const { container } = render(<SpeedLines />)
    expect(container).toBeTruthy()
  })

  it('returns null when intensity is low (no scroll)', () => {
    const { container } = render(<SpeedLines />)
    // Initially returns null because intensity starts at 0
    expect(container.firstChild).toBeNull()
  })
})
