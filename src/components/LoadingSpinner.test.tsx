import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { LoadingSpinner } from './LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders an SVG element', () => {
    render(<LoadingSpinner />)
    const svg = screen.getByRole('status')
    expect(svg).toBeInTheDocument()
    expect(svg.tagName.toLowerCase()).toBe('svg')
  })

  it('has animate-spin class by default', () => {
    const { container } = render(<LoadingSpinner />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('animate-spin')
  })

  it('applies custom className', () => {
    const { container } = render(<LoadingSpinner className="w-8 h-8 text-blue-500" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('w-8')
    expect(svg).toHaveClass('h-8')
    expect(svg).toHaveClass('text-blue-500')
  })

  it('has aria-label for accessibility', () => {
    render(<LoadingSpinner />)
    expect(screen.getByLabelText('Carregando...')).toBeInTheDocument()
  })

  it('has role="status" for accessibility', () => {
    render(<LoadingSpinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders circle and path elements', () => {
    const { container } = render(<LoadingSpinner />)
    expect(container.querySelector('circle')).toBeInTheDocument()
    expect(container.querySelector('path')).toBeInTheDocument()
  })
})
