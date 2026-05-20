import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SplashScreen } from './SplashScreen'

describe('SplashScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('renders without crashing', () => {
    const onComplete = vi.fn()
    render(<SplashScreen onComplete={onComplete} />)
    expect(screen.getByText('SamuelMed')).toBeInTheDocument()
  })

  it('displays the logo', () => {
    const onComplete = vi.fn()
    render(<SplashScreen onComplete={onComplete} />)
    expect(screen.getByText('Mission Control v2.0')).toBeInTheDocument()
  })

  it('shows system boot indicator', () => {
    const onComplete = vi.fn()
    render(<SplashScreen onComplete={onComplete} />)
    expect(screen.getByText('SYSTEM BOOT')).toBeInTheDocument()
  })

  it('displays loading progress', () => {
    const onComplete = vi.fn()
    render(<SplashScreen onComplete={onComplete} />)
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('calls onComplete when progress reaches 100', () => {
    const onComplete = vi.fn()
    render(<SplashScreen onComplete={onComplete} />)

    // Progress increases by 2 every 50ms, so 50 steps to reach 100
    vi.advanceTimersByTime(50 * 50)

    // onComplete should be called after 500ms delay
    vi.advanceTimersByTime(500)
    expect(onComplete).toHaveBeenCalled()
  })

  it('shows boot messages during loading', () => {
    const onComplete = vi.fn()
    render(<SplashScreen onComplete={onComplete} />)

    // First message should be visible
    expect(screen.getByText(/Inicializando sistemas|Carregando módulos|Conectando à base|Sincronizando credenciais|Mission Control pronto/i)).toBeInTheDocument()
  })

  it('has a progress percentage display', () => {
    const onComplete = vi.fn()
    render(<SplashScreen onComplete={onComplete} />)
    // Should show "0%" initially
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('displays decorative dots', () => {
    const { container } = render(<SplashScreen onComplete={vi.fn()} />)
    // Three decorative dots at the bottom
    const dots = container.querySelectorAll('.rounded-full.bg-slate-600')
    expect(dots.length).toBe(3)
  })
})
