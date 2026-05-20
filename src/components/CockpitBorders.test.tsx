import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { CockpitBorders } from './CockpitBorders'

describe('CockpitBorders', () => {
  it('renders without crashing', () => {
    const { container } = render(<CockpitBorders />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders in an absolute positioned container', () => {
    const { container } = render(<CockpitBorders />)
    const div = container.firstChild as HTMLElement
    expect(div).toHaveClass('absolute')
    expect(div).toHaveClass('pointer-events-none')
  })

  it('renders four corner elements', () => {
    const { container } = render(<CockpitBorders />)
    // There should be 4 motion.div corners + 4 accent divs = 8 children
    const children = container.firstChild?.children
    expect(children?.length).toBe(8)
  })

  it('renders side accent elements', () => {
    const { container } = render(<CockpitBorders />)
    // Check for gradient accent bars
    const accents = container.querySelectorAll('.bg-gradient-to-b')
    expect(accents.length).toBeGreaterThanOrEqual(2)
  })

  it('renders center top/bottom accents', () => {
    const { container } = render(<CockpitBorders />)
    const centerAccents = container.querySelectorAll('.bg-gradient-to-r')
    expect(centerAccents.length).toBeGreaterThanOrEqual(2)
  })
})
