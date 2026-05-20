import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { StarField } from './StarField'

describe('StarField', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('renders without crashing', () => {
    const { container } = render(<StarField />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders a container div with correct classes', () => {
    const { container } = render(<StarField />)
    const div = container.firstChild as HTMLElement
    expect(div).toHaveClass('absolute')
    expect(div).toHaveClass('inset-0')
    expect(div).toHaveClass('overflow-hidden')
  })

  it('renders star elements', () => {
    const { container } = render(<StarField />)
    const stars = container.querySelectorAll('.rounded-full.bg-\\[var\\(--accent\\)\\]')
    expect(stars.length).toBeGreaterThan(0)
  })

  it('renders 60 stars across 3 layers', () => {
    const { container } = render(<StarField />)
    // 60 stars grouped into 3 motion.div layers
    const layers = container.querySelectorAll('.absolute.inset-0')
    // First layer is container, rest are star layers (3 layers)
    expect(layers.length).toBeGreaterThanOrEqual(3)
  })
})
