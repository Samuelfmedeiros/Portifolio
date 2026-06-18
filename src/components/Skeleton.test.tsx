import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Skeleton, GlassSkeleton } from './Skeleton'

describe('Skeleton', () => {
  it('renders a div element', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('has aria-hidden for accessibility', () => {
    const { container } = render(<Skeleton />)
    const div = container.firstChild as HTMLElement
    expect(div).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="h-4 w-full" />)
    const div = container.firstChild as HTMLElement
    expect(div).toHaveClass('h-4')
    expect(div).toHaveClass('w-full')
  })
})

describe('GlassSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<GlassSkeleton />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<GlassSkeleton className="custom" />)
    const div = container.firstChild as HTMLElement
    expect(div).toHaveClass('custom')
  })
})
