import { render, act } from '@testing-library/react'
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
  // jsdom não tem requestIdleCallback — o hook cai no fallback setTimeout(500).
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('CockpitBackground', () => {
  it('renders a fixed container without crashing', () => {
    const { container } = render(<CockpitBackground />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('mounts placeholder (no canvas) while idle hydration pending', () => {
    const { container } = render(<CockpitBackground />)
    // Perf 01/09/2026: as 6 camadas de fundo só hidratam após o browser idle.
    expect(container.querySelector('canvas')).not.toBeInTheDocument()
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders canvas from ParallaxBackground after idle fires', () => {
    const { container } = render(<CockpitBackground />)
    expect(container.querySelector('canvas')).not.toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(600)
    })
    expect(container.querySelector('canvas')).toBeInTheDocument()
  })
})
