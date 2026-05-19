import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AboutTimeline } from './AboutTimeline'

describe('AboutTimeline', () => {
  it('renders section heading', () => {
    render(<AboutTimeline />)
    expect(screen.getByText(/trajetória/i)).toBeInTheDocument()
  })

  it('renders timeline items', () => {
    render(<AboutTimeline />)
    // Check that timeline has content
    const timeline = screen.getByRole('list')
    expect(timeline).toBeInTheDocument()
  })

  it('renders all career milestones', () => {
    render(<AboutTimeline />)
    expect(screen.getByText(/analista de dados/i)).toBeInTheDocument()
    expect(screen.getByText(/machine learning/i)).toBeInTheDocument()
  })

  it('has accessible structure', () => {
    render(<AboutTimeline />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toBeInTheDocument()
  })
})
