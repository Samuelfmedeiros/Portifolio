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
})
