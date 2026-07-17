import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Navbar } from './Navbar'
import React from 'react'

// Mock i18n — return fallback when provided, key otherwise
vi.mock('@/lib/i18n', () => ({
  useLanguage: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
  }),
}))

describe('Navbar', () => {
  beforeEach(() => {
    global.IntersectionObserver = class IntersectionObserver {
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = vi.fn()
    } as unknown as typeof IntersectionObserver
  })

  it('renders logo with name', () => {
    render(<Navbar />)
    expect(screen.getByText('SM')).toBeInTheDocument()
  })

  it('renders all navigation items on desktop', () => {
    render(<Navbar />)
    const navItems = ['nav.home', 'nav.projects', 'nav.games', 'nav.contact']
    for (const item of navItems) {
      expect(screen.getAllByText(item).length).toBeGreaterThanOrEqual(1)
    }
  })

  it('renders mobile nav items', () => {
    render(<Navbar />)
    expect(screen.getAllByText('nav.home').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'nav.aria.main')
  })

  it('has proper aria-label for navigation', () => {
    render(<Navbar />)
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'nav.aria.main')
  })

  it('has GitHub link', () => {
    render(<Navbar />)
    const githubLink = screen.getByRole('link', { name: 'GitHub' })
    expect(githubLink).toHaveAttribute('href', 'https://github.com/Samuelfmedeiros')
  })

  it('renders ControlBar with toolbar role', () => {
    render(<Navbar />)
    const toolbar = screen.getByRole('toolbar')
    expect(toolbar).toBeInTheDocument()
    expect(toolbar).toHaveAttribute('aria-label', 'controlbar.aria')
  })

  it('renders ControlBar palette radio group with 6 palettes', () => {
    render(<Navbar />)
    const paletteRadios = screen.getAllByRole('radio')
    expect(paletteRadios.length).toBe(6)
    // Check first palette has expected label from our mock (fallback = key)
    expect(paletteRadios[0]).toHaveAttribute('aria-label')
  })

  it('renders ControlBar theme toggle button', () => {
    render(<Navbar />)
    const themeToggle = screen.getByRole('button', { name: /light/i })
    expect(themeToggle).toBeInTheDocument()
  })

  it('renders ControlBar language toggle button', () => {
    render(<Navbar />)
    // The language toggle button — no aria-label matching since it uses "controlbar.*" keys
    // that our mock returns as fallback. Just check it's a button that says "PT" or "EN"
    const langBtn = screen.getByText(/^PT$|^EN$/)
    expect(langBtn).toBeInTheDocument()
  })

  it('does NOT have a hamburger menu button', () => {
    render(<Navbar />)
    const hamburgerBtn = screen.queryByRole('button', { name: /abrir menu/i })
    expect(hamburgerBtn).not.toBeInTheDocument()
  })

  it('renders mobile nav with icon + label pairs', () => {
    render(<Navbar />)
    expect(screen.getByText('\u{1F680}')).toBeInTheDocument()
    expect(screen.getByText('\u{1F4C2}')).toBeInTheDocument()
    expect(screen.getByText('\u{1F4EC}')).toBeInTheDocument()
  })
})
