import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HUDOverlay } from './HUDOverlay'

describe('HUDOverlay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('renders without crashing', () => {
    render(<HUDOverlay />)
    const overlay = document.querySelector('.absolute.inset-0.z-1.pointer-events-none')
    expect(overlay).toBeInTheDocument()
  })

  it('displays altitude information', () => {
    render(<HUDOverlay />)
    // Should show ALT with a number
    const elements = document.querySelectorAll('div')
    const altText = Array.from(elements).find(el => el.textContent?.startsWith('ALT'))
    expect(altText).toBeInTheDocument()
  })

  it('displays velocity information', () => {
    render(<HUDOverlay />)
    const elements = document.querySelectorAll('div')
    const velText = Array.from(elements).find(el => el.textContent?.startsWith('VEL'))
    expect(velText).toBeInTheDocument()
  })

  it('displays system status', () => {
    render(<HUDOverlay />)
    expect(screen.getByText('STATUS: NOMINAL')).toBeInTheDocument()
  })

  it('displays orbit information', () => {
    render(<HUDOverlay />)
    expect(screen.getByText('ORBIT: LEO-7')).toBeInTheDocument()
  })

  it('displays mission control label', () => {
    render(<HUDOverlay />)
    expect(screen.getByText('MISSION CONTROL')).toBeInTheDocument()
  })

  it('displays shield power nav stats', () => {
    render(<HUDOverlay />)
    expect(screen.getByText(/\[SHLD\]/)).toBeInTheDocument()
    expect(screen.getByText(/\[PWR\]/)).toBeInTheDocument()
    expect(screen.getByText(/\[NAV\]/)).toBeInTheDocument()
  })

  it('displays Brasilia location', () => {
    render(<HUDOverlay />)
    expect(screen.getByText('BRASÍLIA-DF')).toBeInTheDocument()
  })
})
