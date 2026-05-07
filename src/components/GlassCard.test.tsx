import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GlassCard } from './GlassCard'

describe('GlassCard', () => {
  it('renders children', () => {
    render(<GlassCard>Hello World</GlassCard>)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<GlassCard className="test-class">Content</GlassCard>)
    expect(container.firstChild).toHaveClass('test-class')
    expect(container.firstChild).toHaveClass('glass')
  })

  it('renders with delay prop', () => {
    const { container } = render(<GlassCard delay={0.5}>Delayed</GlassCard>)
    expect(container.firstChild).toBeTruthy()
  })
})
