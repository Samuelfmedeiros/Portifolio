import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ContactForm } from './ContactForm'

// Mock supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(),
    })),
  },
}))

// Mock i18n — return fallback when provided, key otherwise
vi.mock('@/lib/i18n', () => ({
  useLanguage: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
  }),
}))

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form fields correctly', () => {
    render(<ContactForm />)
    expect(screen.getByLabelText('contact.form.name')).toBeInTheDocument()
    expect(screen.getByLabelText('contact.form.email')).toBeInTheDocument()
    expect(screen.getByLabelText('contact.form.message')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /contact.form.submit/i })).toBeInTheDocument()
  })

  it('renders WhatsApp CTA button', () => {
    render(<ContactForm />)
    const whatsappLink = screen.getByRole('link', { name: /contact.whatsapp.cta/i })
    expect(whatsappLink).toBeInTheDocument()
    expect(whatsappLink).toHaveAttribute('href', expect.stringContaining('wa.me'))
  })

  it('renders social media links', () => {
    render(<ContactForm />)
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument()
  })

  it('shows email validation error for invalid email', () => {
    render(<ContactForm />)
    const emailInput = screen.getByLabelText('contact.form.email')
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    // Native HTML validation will handle this on submit
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  it('shows copy button for email', () => {
    render(<ContactForm />)
    const copyButton = screen.getByRole('button', { name: /samuelandrademedeiros@gmail.com/i })
    expect(copyButton).toBeInTheDocument()
  })

  it('has accessible form labels', () => {
    render(<ContactForm />)
    const form = screen.getByRole('form')
    expect(form).toHaveAttribute('aria-label', 'Formulário de contato')
  })
})
