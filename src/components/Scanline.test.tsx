import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Scanline } from './Scanline'

describe('Scanline', () => {
  it('renders without crashing', () => {
    const { container } = render(<Scanline />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders as a motion div', () => {
    const { container } = render(<Scanline />)
    // The framer-motion mock renders as motion.div
    const div = container.firstChild as HTMLElement
    expect(div).toHaveClass('absolute')
    expect(div).toHaveClass('pointer-events-none')
  })

  it('has correct z-index', () => {
    const { container } = render(<Scanline />)
    const div = container.firstChild as HTMLElement
    expect(div).toHaveClass('z-2')
  })

  it('has 1px height', () => {
    const { container } = render(<Scanline />)
    const div = container.firstChild as HTMLElement
    expect(div).toHaveStyle({ height: '1px' })
  })
})
