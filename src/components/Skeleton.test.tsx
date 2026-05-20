import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Skeleton, GlassSkeleton } from './Skeleton'

describe('Skeleton', () => {
  it('renders a div element', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('has animate-pulse class', () => {
    const { container } = render(<Skeleton />)
    const div = container.firstChild as HTMLElement
    expect(div).toHaveClass('animate-pulse')
  })

  it('has rounded corners', () => {
    const { container } = render(<Skeleton />)
    const div = container.firstChild as HTMLElement
    expect(div).toHaveClass('rounded')
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

  it('has glass card styling', () => {
    const { container } = render(<GlassSkeleton />)
    const div = container.firstChild as HTMLElement
    expect(div).toHaveClass('glass')
    expect(div).toHaveClass('rounded-xl')
    expect(div).toHaveClass('p-6')
  })

  it('contains three skeleton lines', () => {
    const { container } = render(<GlassSkeleton />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBe(3)
  })

  it('first skeleton line is wider', () => {
    const { container } = render(<GlassSkeleton />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons[0]).toHaveClass('w-3/4')
  })

  it('applies custom className', () => {
    const { container } = render(<GlassSkeleton className="custom" />)
    const div = container.firstChild as HTMLElement
    expect(div).toHaveClass('custom')
  })
})
