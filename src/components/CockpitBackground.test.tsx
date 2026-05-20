import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { CockpitBackground } from './CockpitBackground'

// Mock canvas getContext for ParallaxBackground
beforeEach(() => {
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
    strokeRect: vi.fn(),
  })) as any
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('CockpitBackground', () => {
  it('renders without crashing', () => {
    render(<CockpitBackground />)
    // The component renders a fixed container div
    const container = document.querySelector('.fixed.inset-0.-z-10')
    expect(container).toBeInTheDocument()
  })

  it('renders all visual layers', () => {
    const { container } = render(<CockpitBackground />)
    // Should have canvas from ParallaxBackground
    expect(container.querySelector('canvas')).toBeInTheDocument()
    // Should have absolute container
    const layers = container.querySelectorAll('.absolute')
    expect(layers.length).toBeGreaterThan(0)
  })

  it('is positioned fixed with negative z-index', () => {
    render(<CockpitBackground />)
    const container = document.querySelector('.fixed.inset-0.-z-10')
    expect(container).toHaveClass('fixed')
    expect(container).toHaveClass('-z-10')
  })
})
