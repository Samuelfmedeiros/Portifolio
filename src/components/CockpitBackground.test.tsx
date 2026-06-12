import { render } from '@testing-library/react'
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
  })) as unknown as CanvasRenderingContext2D
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('CockpitBackground', () => {
  it('renders without crashing', () => {
    const { container } = render(<CockpitBackground />)
    // The component renders a fixed container div
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders canvas from ParallaxBackground', () => {
    const { container } = render(<CockpitBackground />)
    expect(container.querySelector('canvas')).toBeInTheDocument()
  })

  it('renders child visual layers', () => {
    const { container } = render(<CockpitBackground />)
    // Should have multiple child components rendered
    expect(container.firstChild?.children.length).toBeGreaterThanOrEqual(4)
  })
})
