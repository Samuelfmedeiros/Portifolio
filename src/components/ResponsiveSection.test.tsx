import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ResponsiveSection, AnimatedHeading, ResponsiveCard, ResponsiveGrid, ResponsiveText, ScrollIndicator } from './ResponsiveSection'

describe('ResponsiveSection', () => {
  it('renders children', () => {
    render(
      <ResponsiveSection>
        <div data-testid="content">Content</div>
      </ResponsiveSection>
    )
    expect(screen.getByTestId('content')).toBeInTheDocument()
  })

  it('renders as a section element', () => {
    const { container } = render(
      <ResponsiveSection>
        <span>Test</span>
      </ResponsiveSection>
    )
    expect(container.querySelector('section')).toBeInTheDocument()
  })

  it('applies custom id', () => {
    const { container } = render(
      <ResponsiveSection id="my-section">
        <span>Test</span>
      </ResponsiveSection>
    )
    expect(container.querySelector('section#my-section')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <ResponsiveSection className="custom-class">
        <span>Test</span>
      </ResponsiveSection>
    )
    expect(container.querySelector('section')).toHaveClass('custom-class')
  })

  it('applies min-h-screen when fullHeight is true', () => {
    const { container } = render(
      <ResponsiveSection fullHeight>
        <span>Test</span>
      </ResponsiveSection>
    )
    expect(container.querySelector('section')).toHaveClass('min-h-screen')
  })

  it('does not apply min-h-screen by default', () => {
    const { container } = render(
      <ResponsiveSection>
        <span>Test</span>
      </ResponsiveSection>
    )
    expect(container.querySelector('section')).not.toHaveClass('min-h-screen')
  })
})

describe('AnimatedHeading', () => {
  it('renders children', () => {
    render(
      <AnimatedHeading>Heading Text</AnimatedHeading>
    )
    expect(screen.getByText('Heading Text')).toBeInTheDocument()
  })

  it('renders as h2 by default', () => {
    const { container } = render(
      <AnimatedHeading>Title</AnimatedHeading>
    )
    expect(container.querySelector('h2')).toBeInTheDocument()
  })

  it('renders as specified tag', () => {
    const { container } = render(
      <AnimatedHeading as="h1">Title</AnimatedHeading>
    )
    expect(container.querySelector('h1')).toBeInTheDocument()
  })

  it('renders accent text when provided', () => {
    render(
      <AnimatedHeading accent="SUBTITLE">Title</AnimatedHeading>
    )
    expect(screen.getByText('SUBTITLE')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <AnimatedHeading className="heading-custom">Title</AnimatedHeading>
    )
    expect(container.firstChild).toHaveClass('heading-custom')
  })
})

describe('ResponsiveCard', () => {
  it('renders children', () => {
    render(
      <ResponsiveCard>Card Content</ResponsiveCard>
    )
    expect(screen.getByText('Card Content')).toBeInTheDocument()
  })

  it('has glass styling', () => {
    const { container } = render(
      <ResponsiveCard>Content</ResponsiveCard>
    )
    expect(container.firstChild).toHaveClass('glass')
    expect(container.firstChild).toHaveClass('rounded-xl')
  })

  it('applies custom className', () => {
    const { container } = render(
      <ResponsiveCard className="card-custom">Content</ResponsiveCard>
    )
    expect(container.firstChild).toHaveClass('card-custom')
  })
})

describe('ResponsiveGrid', () => {
  it('renders children', () => {
    render(
      <ResponsiveGrid>
        <div>Item 1</div>
        <div>Item 2</div>
      </ResponsiveGrid>
    )
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('renders as a grid', () => {
    const { container } = render(
      <ResponsiveGrid>
        <div>Item</div>
      </ResponsiveGrid>
    )
    expect(container.firstChild).toHaveClass('grid')
  })

  it('applies custom className', () => {
    const { container } = render(
      <ResponsiveGrid className="grid-custom">
        <div>Item</div>
      </ResponsiveGrid>
    )
    expect(container.firstChild).toHaveClass('grid-custom')
  })
})

describe('ResponsiveText', () => {
  it('renders children', () => {
    render(<ResponsiveText>Text</ResponsiveText>)
    expect(screen.getByText('Text')).toBeInTheDocument()
  })

  it('applies accent color', () => {
    const { container } = render(<ResponsiveText color="accent">Accent</ResponsiveText>)
    expect(container.firstChild).toHaveClass('text-[var(--accent)]')
  })

  it('applies secondary color', () => {
    const { container } = render(<ResponsiveText color="secondary">Secondary</ResponsiveText>)
    expect(container.firstChild).toHaveClass('text-[var(--text-secondary)]')
  })

  it('applies size classes', () => {
    const { container } = render(<ResponsiveText size="lg">Large</ResponsiveText>)
    expect(container.firstChild).toHaveClass('text-base')
    expect(container.firstChild).toHaveClass('sm:text-lg')
  })

  it('applies custom className', () => {
    const { container } = render(<ResponsiveText className="text-custom">Custom</ResponsiveText>)
    expect(container.firstChild).toHaveClass('text-custom')
  })
})

describe('ScrollIndicator', () => {
  it('renders without crashing', () => {
    render(<ScrollIndicator />)
    expect(screen.getByText('SCROLL')).toBeInTheDocument()
  })

  it('renders scroll indicator text', () => {
    render(<ScrollIndicator />)
    const scrollText = screen.getByText('SCROLL')
    expect(scrollText).toHaveClass('font-mono')
  })
})
