import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Footer } from './Footer'
import { useLanguage } from '@/lib/i18n'
import { useAnalytics } from '@/hooks/useAnalytics'

vi.mock('@/lib/i18n', () => ({
  useLanguage: () => ({
    t: (key: string) => key,
    locale: 'pt-BR'
  })
}))

vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    track: vi.fn()
  })
}))

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
    const emailLink = screen.getByLabelText('aria.email')
    expect(emailLink).toBeInTheDocument()
    expect(emailLink.getAttribute('href')).toContain('mailto:')
  })
  
  it('renders current year in copyright', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear().toString()
    const footer = screen.getByText(new RegExp(`© ${currentYear}`))
    expect(footer).toBeInTheDocument()
  })

  it('opens privacy modal when clicking link', () => {
    render(<Footer />)
    const privacyBtn = screen.getByText('footer.lgpd.link')
    fireEvent.click(privacyBtn)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('modal.privacy.title')).toBeInTheDocument()
  })

  it('toggles between privacy and terms tabs in modal', () => {
    render(<Footer />)
    const privacyBtn = screen.getByText('footer.lgpd.link')
    fireEvent.click(privacyBtn)
    
    const termsTab = screen.getByText('modal.tab.terms')
    fireEvent.click(termsTab)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'modal.terms.title')
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('modal.terms.title')
    
    const privacyTab = screen.getByText('modal.tab.privacy')
    fireEvent.click(privacyTab)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'modal.privacy.title')
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('modal.privacy.title')
  })

  it('closes privacy modal', () => {
    render(<Footer />)
    const privacyBtn = screen.getByText('footer.lgpd.link')
    fireEvent.click(privacyBtn)
    
    const closeBtn = screen.getByLabelText('modal.close')
    fireEvent.click(closeBtn)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('handles email copy action', () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockReturnValue(Promise.resolve()),
      },
      configurable: true
    })
    
    render(<Footer />)
    const copyBtn = screen.getByLabelText('footer.copy.email')
    fireEvent.click(copyBtn)
    
    expect(screen.getAllByText('footer.copied')[0]).toBeInTheDocument()
  })
})
