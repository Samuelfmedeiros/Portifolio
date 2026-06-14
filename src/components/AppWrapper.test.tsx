import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AppWrapper } from './AppWrapper'

describe('AppWrapper', () => {
  it('renders children', () => {
    render(
      <AppWrapper>
        <div data-testid="child-content">Hello World</div>
      </AppWrapper>
    )
    expect(screen.getByTestId('child-content')).toBeInTheDocument()
  })
})
