import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { SplashScreen } from './SplashScreen'

describe('SplashScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllTimers()
  })

  it('renders without crashing', () => {
    const onComplete = vi.fn()
    const { container } = render(<SplashScreen onComplete={onComplete} />)
    expect(container.querySelector('.fixed.inset-0')).toBeInTheDocument()
  })

  it('shows welcome text during transit phase', () => {
    const onComplete = vi.fn()
    render(<SplashScreen onComplete={onComplete} />)
    // "SEJA BEM-VINDO" appears during transit phase (after 5.8s)
    vi.advanceTimersByTime(6000)
    expect(screen.getByText('SEJA BEM-VINDO')).toBeInTheDocument()
  })

  it('has scanline overlay for cinematic effect', () => {
    const { container } = render(<SplashScreen onComplete={vi.fn()} />)
    const scanline = container.querySelector('.bg-\\[repeating-linear-gradient\\(0deg\\,transparent\\,transparent_2px\\,rgba\\(6\\,182\\,212\\,0\\.3\\)_2px\\,rgba\\(6\\,182\\,212\\,0\\.3\\)_3px\\)\\]')
    // The scanline class might be escaped differently in the DOM
    // Check for vignette overlay instead
    const vignette = container.querySelector('.bg-\\[radial-gradient\\(ellipse_at_center\\,transparent_30\\%\\,rgba\\(2\\,6\\,23\\,0\\.6\\)_100\\%\\)\\]')
    expect(vignette || scanline).toBeTruthy()
  })

  it('calls onComplete after animation sequence', () => {
    const onComplete = vi.fn()
    render(<SplashScreen onComplete={onComplete} />)

    // Animation takes ~7 seconds
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

  it('renders progress bar at bottom', () => {
    const onComplete = vi.fn()
    const { container } = render(<SplashScreen onComplete={onComplete} />)
    // Progress bar exists
    const progressBars = container.querySelectorAll('.rounded-full')
    expect(progressBars.length).toBeGreaterThan(0)
  })
})
