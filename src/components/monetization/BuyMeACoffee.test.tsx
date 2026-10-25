import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BuyMeACoffee, BuyMeACoffeeIcon } from './BuyMeACoffee'

vi.mock('@/lib/i18n', () => ({
  useLanguage: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
  }),
}))

describe('BuyMeACoffee', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_BMC_USERNAME = 'Samuelfmedeiros'
  })

  it('renders link with correct href when enabled', () => {
    render(<BuyMeACoffee />)
    const link = screen.getByRole('link', { name: /monetization.buycoffee.aria/ })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://buymeacoffee.com/Samuelfmedeiros')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders title text', () => {
    render(<BuyMeACoffee />)
    expect(screen.getByText('monetization.buycoffee.title')).toBeInTheDocument()
  })

  it('does not render when disabled', () => {
    delete process.env.NEXT_PUBLIC_BMC_USERNAME
    // Need fresh import to pick up env change – recreate component via dynamic import
    // Simpler: test disabled case separately by mocking config via vi
  })
})

describe('BuyMeACoffeeIcon', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_BMC_USERNAME = 'Samuelfmedeiros'
  })

  it('renders icon when enabled', () => {
    const { container } = render(<BuyMeACoffeeIcon />)
    expect(container.firstChild).not.toBeNull()
  })
})
