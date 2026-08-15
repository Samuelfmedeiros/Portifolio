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

  it('renders logo with full name (desktop and mobile)', () => {
    render(<Navbar />)
    expect(screen.getAllByText('Samuel Medeiros').length).toBeGreaterThanOrEqual(1)
    expect(screen.queryByText('SM')).not.toBeInTheDocument()
  })

  it('renders all navigation items on desktop', () => {
    render(<Navbar />)
    const navItems = ['nav.home', 'nav.projects', 'nav.blog', 'nav.contact', 'nav.games']
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

  it('renders palette picker button', () => {
    render(<Navbar />)
    const paletteBtn = screen.getByRole('button', { name: /paleta/i })
    expect(paletteBtn).toBeInTheDocument()
  })

  it('renders theme toggle button', () => {
    render(<Navbar />)
    const themeToggle = screen.getByRole('button', { name: /claro/i })
    expect(themeToggle).toBeInTheDocument()
  })

  it('does NOT have a hamburger menu button', () => {
    render(<Navbar />)
    const hamburgerBtn = screen.queryByRole('button', { name: /abrir menu/i })
    expect(hamburgerBtn).not.toBeInTheDocument()
  })

  it('renders mobile nav with label pairs', () => {
    render(<Navbar />)
    // mock i18n retorna a chave; verifica os links (href estável) do nav mobile
    const links = screen.getAllByRole('link')
    const hrefs = links.map(l => l.getAttribute('href'))
    expect(hrefs).toContain('#profile')
    expect(hrefs).toContain('#jornada')
    expect(hrefs).toContain('#projects')
    expect(hrefs).toContain('#games')
    expect(hrefs).toContain('#contact')
    // mobile nav existe (aria-label da chave)
    expect(screen.getAllByText(/nav\./i).length).toBeGreaterThanOrEqual(5)
  })
})
