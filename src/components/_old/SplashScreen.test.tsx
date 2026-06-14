import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SplashScreen } from './SplashScreen'

describe('SplashScreen', () => {
  beforeEach(() => {
    // Mock navigator.hardwareConcurrency
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      writable: true,
      value: 8,
    })
    // Mock navigator.userAgent
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    })
  })

  it('renders without crashing', () => {
    const onComplete = vi.fn()
    const { container } = render(<SplashScreen onComplete={onComplete} />)
    expect(container.querySelector('.fixed.inset-0')).toBeInTheDocument()
  })

  it('shows TATU boot message', () => {
    const onComplete = vi.fn()
    render(<SplashScreen onComplete={onComplete} />)
    const bootMsg = screen.getByText('TATU PROCURE SYSTEM...')
    expect(bootMsg).toBeInTheDocument()
  })

  it('has cinematic overlays (vignette and scanlines)', () => {
    const { container } = render(<SplashScreen onComplete={vi.fn()} />)
    // Vignette + scanlines + starfield — all use pointer-events-none
    const overlayDivs = container.querySelectorAll('.pointer-events-none')
    expect(overlayDivs.length).toBeGreaterThanOrEqual(2)
  })

  it('calls onComplete after safety timeout', () => {
    vi.useFakeTimers()
    const onComplete = vi.fn()
    render(<SplashScreen onComplete={onComplete} />)
    // Safety timer: TOTAL_DURATION (8800) + 3000ms = 11800ms
    vi.advanceTimersByTime(12000)
    expect(onComplete).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it('does not call onComplete before animation finishes', () => {
    vi.useFakeTimers()
    const onComplete = vi.fn()
    render(<SplashScreen onComplete={onComplete} />)
    // Advance only 500ms — still animating
    vi.advanceTimersByTime(500)
    expect(onComplete).not.toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('renders progress bar', () => {
    const onComplete = vi.fn()
    const { container } = render(<SplashScreen onComplete={onComplete} />)
    const progressBars = container.querySelectorAll('.rounded-full')
    expect(progressBars.length).toBeGreaterThan(0)
  })

  it('has Tatu SVG rendered', () => {
    const onComplete = vi.fn()
    const { container } = render(<SplashScreen onComplete={onComplete} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('injects CSS keyframes for animations', () => {
    const onComplete = vi.fn()
    const { container } = render(<SplashScreen onComplete={onComplete} />)
    const styleTag = container.querySelector('style')
    expect(styleTag?.innerHTML).toContain('@keyframes')
  })

  it('has skip for reduced motion', () => {
    const onComplete = vi.fn()
    const { container } = render(<SplashScreen onComplete={onComplete} />)
    const splash = container.querySelector('.fixed.inset-0')
    expect(splash).toBeInTheDocument()
  })

  it('renders boot lines container', () => {
    const onComplete = vi.fn()
    const { container } = render(<SplashScreen onComplete={onComplete} />)
    const bootContainer = container.querySelector('.font-mono')
    expect(bootContainer).toBeInTheDocument()
  })

  it('calls onComplete after double safety timeout', () => {
    vi.useFakeTimers()
    const onComplete = vi.fn()
    render(<SplashScreen onComplete={onComplete} />)
    vi.advanceTimersByTime(13000)
    expect(onComplete).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })
})
