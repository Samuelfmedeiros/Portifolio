import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroSection } from './HeroSection'

describe('HeroSection', () => {
  it('renders without crashing', () => {
    const { container } = render(<HeroSection />)
    expect(container).toBeTruthy()
  })

  it('renders as a section element', () => {
    const { container } = render(<HeroSection />)
    const section = container.querySelector('section')
    expect(section).toBeTruthy()
  })

  it('contains content', () => {
    const { container } = render(<HeroSection />)
    expect(container.textContent?.length).toBeGreaterThan(0)
  })
})
