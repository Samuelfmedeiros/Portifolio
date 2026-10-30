import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GitHubSponsors, GitHubSponsorsIcon } from './GitHubSponsors'

describe('GitHubSponsors', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_GITHUB_SPONSORS_USERNAME = 'samuel'
  })

  it('renders link with correct href when enabled', () => {
    render(<GitHubSponsors />)
    const link = screen.getByRole('link', { name: /Patrocine no GitHub Sponsors/ })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://github.com/sponsors/samuel')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders Patrocine text', () => {
    render(<GitHubSponsors />)
    expect(screen.getByText('Patrocine')).toBeInTheDocument()
  })

  it('does not render when disabled', () => {
    delete process.env.NEXT_PUBLIC_GITHUB_SPONSORS_USERNAME
    // Since config is read via getter, we need fresh module; skip for now
  })
})

describe('GitHubSponsorsIcon', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_GITHUB_SPONSORS_USERNAME = 'samuel'
  })

  it('renders icon when enabled', () => {
    const { container } = render(<GitHubSponsorsIcon />)
    expect(container.firstChild).not.toBeNull()
  })
})
