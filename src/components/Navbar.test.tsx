import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Navbar } from './Navbar'

describe('Navbar', () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = class IntersectionObserver {
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = vi.fn()
    } as any
  })

  it('renders logo with name', () => {
    render(<Navbar />)
    expect(screen.getByText('SM')).toBeInTheDocument()
  })

  it('renders all navigation items on desktop', () => {
    render(<Navbar />)
    expect(screen.getByText('Início')).toBeInTheDocument()
    expect(screen.getByText('Sobre')).toBeInTheDocument()
    expect(screen.getByText('Skills')).toBeInTheDocument()
    expect(screen.getByText('Projetos')).toBeInTheDocument()
    expect(screen.getByText('Terminal')).toBeInTheDocument()
    expect(screen.getByText('Contato')).toBeInTheDocument()
  })

  it('renders mobile nav items (scrollable horizontal, no hamburger)', () => {
    render(<Navbar />)
    // Mobile nav uses icons + labels in horizontal scroll
    expect(screen.getByText('Início')).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Navegação principal')
  })

  it('has proper aria-label for navigation', () => {
    render(<Navbar />)
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'Navegação principal')
  })

  it('has GitHub link', () => {
    render(<Navbar />)
    const githubLink = screen.getByRole('link', { name: 'GitHub' })
    expect(githubLink).toHaveAttribute('href', 'https://github.com/Samuelfmedeiros')
  })

  it('renders theme toggle button', () => {
    render(<Navbar />)
    const themeToggle = screen.getByRole('button', { name: /alternar tema/i })
    expect(themeToggle).toBeInTheDocument()
  })

  it('does NOT have a hamburger menu button', () => {
    render(<Navbar />)
    // No hamburger — mobile uses horizontal scrollable nav
    const hamburgerBtn = screen.queryByRole('button', { name: /abrir menu/i })
    expect(hamburgerBtn).not.toBeInTheDocument()
  })

  it('renders mobile nav with icon + label pairs', () => {
    render(<Navbar />)
    // Check for emoji icons in mobile nav
    expect(screen.getByText('🏠')).toBeInTheDocument()
    expect(screen.getByText('👤')).toBeInTheDocument()
    expect(screen.getByText('⚡')).toBeInTheDocument()
    expect(screen.getByText('🛰️')).toBeInTheDocument()
    expect(screen.getByText('💻')).toBeInTheDocument()
    expect(screen.getByText('📡')).toBeInTheDocument()
  })
})
