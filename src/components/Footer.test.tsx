import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'

describe('Footer', () => {
  it('renders the brand name', () => {
    render(<Footer />)
    expect(screen.getByText('MISSION CONTROL')).toBeInTheDocument()
  })

  it('renders the author description in brand section', () => {
    render(<Footer />)
    // "Samuel Andrade" appears in both the brand description and the copyright line.
    // Check that both occurrences exist.
    const matches = screen.getAllByText(/Samuel Andrade/)
    expect(matches).toHaveLength(2)
  })

  it('renders GitHub link with correct href', () => {
    render(<Footer />)
    const githubLink = screen.getByLabelText('GitHub')
    expect(githubLink).toBeInTheDocument()
    expect(githubLink.getAttribute('href')).toContain('github.com')
  })

  it('renders LinkedIn link', () => {
    render(<Footer />)
    const linkedinLink = screen.getByLabelText('LinkedIn')
    expect(linkedinLink).toBeInTheDocument()
    expect(linkedinLink.getAttribute('href')).toContain('linkedin.com')
  })

  it('renders Email link', () => {
    render(<Footer />)
    const emailLink = screen.getByLabelText('Email')
    expect(emailLink).toBeInTheDocument()
    expect(emailLink.getAttribute('href')).toContain('mailto:')
  })

  it('renders communication channels heading', () => {
    render(<Footer />)
    expect(screen.getByText(/CANAIS DE COMUNICAÇÃO/)).toBeInTheDocument()
  })

  it('renders system status with operational indicator', () => {
    render(<Footer />)
    expect(screen.getByText(/TODOS OS SISTEMAS OPERACIONAIS/)).toBeInTheDocument()
  })

  it('renders version info', () => {
    render(<Footer />)
    expect(screen.getByText(/Next\.js 16/)).toBeInTheDocument()
  })

  it('renders current year in copyright', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear().toString()
    // The copyright line contains "© 2026 Samuel Andrade" (or whatever year)
    const footer = screen.getByText(new RegExp(`© ${currentYear}`))
    expect(footer).toBeInTheDocument()
  })
})
