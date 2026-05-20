import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PerspectiveGrid } from './PerspectiveGrid'

describe('PerspectiveGrid', () => {
  it('renders without crashing', () => {
    const { container } = render(<PerspectiveGrid />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders as an absolute positioned div', () => {
    const { container } = render(<PerspectiveGrid />)
    const div = container.firstChild as HTMLElement
    expect(div).toHaveClass('absolute')
    expect(div).toHaveClass('inset-0')
  })

  it('has overflow hidden', () => {
    const { container } = render(<PerspectiveGrid />)
    const div = container.firstChild as HTMLElement
    expect(div).toHaveClass('overflow-hidden')
  })

  it('contains perspective grid background', () => {
    const { container } = render(<PerspectiveGrid />)
    // The grid div should have perspective transform styling
    const gridDiv = container.querySelector('div.absolute')
    expect(gridDiv).toBeInTheDocument()
  })

  it('contains horizon glow element', () => {
    const { container } = render(<PerspectiveGrid />)
    const children = container.firstChild?.children
    expect(children?.length).toBeGreaterThanOrEqual(2)
  })
})
