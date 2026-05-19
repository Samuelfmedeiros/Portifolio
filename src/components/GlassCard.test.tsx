import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GlassCard } from './GlassCard'

describe('GlassCard', () => {
  it('renders children correctly', () => {
    render(<GlassCard><p>Test content</p></GlassCard>)
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies default glass class', () => {
    render(<GlassCard><p>Test</p></GlassCard>)
    const card = screen.getByText('Test').parentElement
    expect(card).toHaveClass('glass')
  })

  it('merges custom className with default', () => {
    render(<GlassCard className="custom-class"><p>Test</p></GlassCard>)
    const card = screen.getByText('Test').parentElement
    expect(card).toHaveClass('glass')
    expect(card).toHaveClass('custom-class')
  })

  it('forwards ref to the div element', () => {
    const ref = vi.fn()
    render(<GlassCard ref={ref}><p>Test</p></GlassCard>)
    expect(ref).toHaveBeenCalled()
  })
})
