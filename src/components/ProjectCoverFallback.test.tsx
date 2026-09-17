import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectCoverFallback } from './ProjectCoverFallback'

describe('ProjectCoverFallback', () => {
  it('renders the project monogram', () => {
    render(<ProjectCoverFallback name="roger-mlops" />)
    expect(screen.getByText('RM')).toBeInTheDocument()
  })

  it('exposes the cover name for identification', () => {
    render(<ProjectCoverFallback name="storydesk" />)
    const svg = screen.getByTestId('cover-fallback')
    expect(svg).toHaveAttribute('data-cover-name', 'storydesk')
  })

  it('is announced to screen readers as an image', () => {
    render(<ProjectCoverFallback name="seu.pet" />)
    expect(screen.getByRole('img', { name: /seu\.pet cover/ })).toBeInTheDocument()
  })

  it('uses the accent colour passed in', () => {
    render(<ProjectCoverFallback name="roger-loop" accent="#f59e0b" />)
    const svg = screen.getByTestId('cover-fallback')
    expect(svg.innerHTML).toContain('#f59e0b')
  })

  it('renders a real cover, not just the plain project name', () => {
    render(<ProjectCoverFallback name="roger-mlops" />)
    const svg = screen.getByTestId('cover-fallback')
    // rings + nodes + monogram => several circles, unlike the old bare text
    expect(svg.querySelectorAll('circle').length).toBeGreaterThanOrEqual(5)
  })
})
