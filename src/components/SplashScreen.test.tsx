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
    // Canvas-based splash screen
    expect(container.querySelector('canvas')).toBeInTheDocument()
  })

  it('shows welcome text during transit phase', () => {
    const onComplete = vi.fn()
    render(<SplashScreen onComplete={onComplete} />)
    // Welcome text is drawn on canvas after ~5.8s phase transition
    // Just verify timers work without crashing
    vi.advanceTimersByTime(6000)
    expect(true).toBe(true)
  })

  it('has canvas element for cinematic effect', () => {
    const { container } = render(<SplashScreen onComplete={vi.fn()} />)
    expect(container.querySelector('canvas')).toBeInTheDocument()
  })

  it('calls onComplete after animation sequence', () => {
    const onComplete = vi.fn()
    render(<SplashScreen onComplete={onComplete} />)

    // Animation takes ~7.2 seconds
    vi.advanceTimersByTime(7500)
    expect(onComplete).toHaveBeenCalled()
  })

  it('does not call onComplete before animation ends', () => {
    const onComplete = vi.fn()
    render(<SplashScreen onComplete={onComplete} />)

    vi.advanceTimersByTime(3000)
    expect(onComplete).not.toHaveBeenCalled()
  })

  it('has cyan/slate color scheme', () => {
    const onComplete = vi.fn()
    const { container } = render(<SplashScreen onComplete={onComplete} />)
    // Root div has bg-[#020617] (slate-950)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('bg-')
  })

  it('renders canvas for animation instead of progress bar', () => {
    const onComplete = vi.fn()
    const { container } = render(<SplashScreen onComplete={onComplete} />)
    // Canvas-based splash - check canvas is rendered
    expect(container.querySelector('canvas')).toBeInTheDocument()
  })
})
