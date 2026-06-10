import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { SplashScreen } from './SplashScreen'

describe('SplashScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers()

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

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders without crashing', () => {
    const onComplete = vi.fn()
    const { container } = render(<SplashScreen onComplete={onComplete} />)
    expect(container.querySelector('.fixed.inset-0')).toBeInTheDocument()
  })

  it('shows status line text', () => {
    const onComplete = vi.fn()
    render(<SplashScreen onComplete={onComplete} />)
    const statusElements = screen.getAllByText('TATU PROCURE v1.0')
    expect(statusElements.length).toBeGreaterThan(0)
  })

  it('shows CARREGANDO during initial phase', () => {
    const onComplete = vi.fn()
    render(<SplashScreen onComplete={onComplete} />)
    vi.advanceTimersByTime(1200)
    const initElements = screen.getAllByText('CARREGANDO')
    expect(initElements.length).toBeGreaterThan(0)
  })

  it('has cinematic overlays (vignette)', () => {
    const { container } = render(<SplashScreen onComplete={vi.fn()} />)
    const vignette = container.querySelector('[class*="radial"]')
    expect(vignette).toBeTruthy()
  })

  it('calls onComplete after animation sequence', () => {
    const onComplete = vi.fn()
    render(<SplashScreen onComplete={onComplete} />)
    vi.advanceTimersByTime(12000)
    expect(onComplete).toHaveBeenCalled()
  })

  it('does not call onComplete before animation ends', () => {
    const onComplete = vi.fn()
    render(<SplashScreen onComplete={onComplete} />)
    vi.advanceTimersByTime(2000)
    expect(onComplete).not.toHaveBeenCalled()
  })

  it('renders progress bar at bottom', () => {
    const onComplete = vi.fn()
    const { container } = render(<SplashScreen onComplete={onComplete} />)
    const progressBars = container.querySelectorAll('.rounded-full')
    expect(progressBars.length).toBeGreaterThan(0)
  })

  it('has Tatu SVG', () => {
    const onComplete = vi.fn()
    const { container } = render(<SplashScreen onComplete={onComplete} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('shows TATU themed boot message', () => {
    const onComplete = vi.fn()
    render(<SplashScreen onComplete={onComplete} />)
    vi.advanceTimersByTime(1200)
    const bootMsg = screen.queryByText(/TATU PROCURE SYSTEM/)
    expect(bootMsg).toBeTruthy()
  })

  it('has letterbox bars', () => {
    const onComplete = vi.fn()
    const { container } = render(<SplashScreen onComplete={onComplete} />)
    const letterboxBars = container.querySelectorAll('.h-\\[12\\%\\]')
    expect(letterboxBars.length).toBe(2)
  })

  it('injects CSS keyframes for animations', () => {
    const onComplete = vi.fn()
    const { container } = render(<SplashScreen onComplete={onComplete} />)
    const styleTag = container.querySelector('style')
    expect(styleTag?.innerHTML).toContain('@keyframes')
  })

  it('has skip button for accessibility', () => {
    const onComplete = vi.fn()
    render(<SplashScreen onComplete={onComplete} />)
    const skipBtn = screen.getByLabelText('Pular animação de abertura')
    expect(skipBtn).toBeInTheDocument()
  })
})
