import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'

describe('Footer', () => {
  it('renders the author name', () => {
    render(<Footer />)
    expect(screen.getByText('Samuel Medeiros')).toBeInTheDocument()
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

  it('renders current year in copyright', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear().toString()
    const footer = screen.getByText(new RegExp(`© ${currentYear}`))
    expect(footer).toBeInTheDocument()
  })
})
