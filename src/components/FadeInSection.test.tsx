import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FadeInSection, StaggerContainer, StaggerItem } from './FadeInSection'

describe('FadeInSection', () => {
  it('renders children', () => {
    render(
      <FadeInSection>
        <div data-testid="content">Test content</div>
      </FadeInSection>
    )
    expect(screen.getByTestId('content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <FadeInSection className="custom-class">
        <span>Content</span>
      </FadeInSection>
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('renders with default props', () => {
    render(
      <FadeInSection>
        <p>Hello</p>
      </FadeInSection>
    )
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})

describe('StaggerContainer', () => {
  it('renders children', () => {
    render(
      <StaggerContainer>
        <div data-testid="child1">One</div>
        <div data-testid="child2">Two</div>
      </StaggerContainer>
    )
    expect(screen.getByTestId('child1')).toBeInTheDocument()
    expect(screen.getByTestId('child2')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <StaggerContainer className="stagger-custom">
        <span>Item</span>
      </StaggerContainer>
    )
    expect(container.firstChild).toHaveClass('stagger-custom')
  })
})

describe('StaggerItem', () => {
  it('renders children', () => {
    render(
      <StaggerItem>
        <div data-testid="stagger-content">Staggered</div>
      </StaggerItem>
    )
    expect(screen.getByTestId('stagger-content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <StaggerItem className="item-class">
        <span>Item</span>
      </StaggerItem>
    )
    expect(container.firstChild).toHaveClass('item-class')
  })
})
