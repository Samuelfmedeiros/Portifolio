import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { SplashScreen } from './SplashScreen'

describe('SplashScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders without crashing', () => {
    const onComplete = vi.fn()
    const { container } = render(<SplashScreen onComplete={onComplete} />)
    expect(container.querySelector('.fixed.inset-0')).toBeInTheDocument()
  })

  it('shows welcome text during transit phase', () => {
    const onComplete = vi.fn()
    render(<SplashScreen onComplete={onComplete} />)
    vi.advanceTimersByTime(4500)
    const welcomeElements = screen.getAllByText('SEJA BEM-VINDO')
    expect(welcomeElements.length).toBeGreaterThan(0)
  })

  it('has cinematic overlays', () => {
    const { container } = render(<SplashScreen onComplete={vi.fn()} />)
    const vignette = container.querySelector('[class*="radial"]')
    const scanline = container.querySelector('[class*="repeating"]')
    expect(vignette || scanline).toBeTruthy()
  })

  it('calls onComplete after animation sequence', () => {
    const onComplete = vi.fn()
    render(<SplashScreen onComplete={onComplete} />)
    vi.advanceTimersByTime(7500)
    expect(onComplete).toHaveBeenCalled()
  })

  it('does not call onComplete before animation ends', () => {
    const onComplete = vi.fn()
    render(<SplashScreen onComplete={onComplete} />)
    vi.advanceTimersByTime(3000)
    expect(onComplete).not.toHaveBeenCalled()
  })

  it('has dark background', () => {
    const onComplete = vi.fn()
    const { container } = render(<SplashScreen onComplete={onComplete} />)
    const root = container.querySelector('.fixed.inset-0') as HTMLElement
    expect(root?.className).toContain('bg-[')
  })

  it('renders progress bar at bottom', () => {
    const onComplete = vi.fn()
    const { container } = render(<SplashScreen onComplete={onComplete} />)
    const progressBars = container.querySelectorAll('.rounded-full')
    expect(progressBars.length).toBeGreaterThan(0)
  })

  it('has spaceship SVG', () => {
    const onComplete = vi.fn()
    const { container } = render(<SplashScreen onComplete={onComplete} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('has letterbox bars', () => {
    const onComplete = vi.fn()
    const { container } = render(<SplashScreen onComplete={onComplete} />)
    const bars = container.querySelectorAll('.h-\\[12\\%\\]')
    expect(bars.length).toBe(2)
  })

  it('injects CSS keyframes for star animation', () => {
    const onComplete = vi.fn()
    const { container } = render(<SplashScreen onComplete={onComplete} />)
    const styleTag = container.querySelector('style')
    expect(styleTag?.innerHTML).toContain('@keyframes')
  })

  it('renders perspective container for warp effect', () => {
    const onComplete = vi.fn()
    const { container } = render(<SplashScreen onComplete={onComplete} />)
    const perspectiveEl = container.querySelector('[style*="perspective"]')
    expect(perspectiveEl).toBeInTheDocument()
  })
})
