import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ParallaxBackground } from './ParallaxBackground'

describe('ParallaxBackground', () => {
  beforeEach(() => {
    // Mock canvas getContext
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      fillText: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      closePath: vi.fn(),
      createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
      createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
      measureText: vi.fn(() => ({ width: 0 })),
      stroke: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
    })) as unknown as CanvasRenderingContext2D

    // Mock requestAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      setTimeout(cb, 0)
      return 0
    })
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders a canvas element', () => {
    const { container } = render(<ParallaxBackground />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('canvas has fixed positioning', () => {
    const { container } = render(<ParallaxBackground />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toHaveClass('fixed')
    expect(canvas).toHaveClass('inset-0')
  })

  it('canvas has pointer-events-none', () => {
    const { container } = render(<ParallaxBackground />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toHaveClass('pointer-events-none')
  })

  it('canvas has aria-hidden for accessibility', () => {
    const { container } = render(<ParallaxBackground />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toHaveAttribute('aria-hidden', 'true')
  })
})
