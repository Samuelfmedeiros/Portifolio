import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SkipLink } from './SkipLink'

describe('SkipLink', () => {
  it('renders without crashing', () => {
    render(<SkipLink />)
    const link = screen.getByText('Pular para conteúdo')
    expect(link).toBeInTheDocument()
  })

  it('renders as an anchor element', () => {
    const { container } = render(<SkipLink />)
    expect(container.querySelector('a')).toBeInTheDocument()
  })

  it('links to #main-content', () => {
    render(<SkipLink />)
    const link = screen.getByText('Pular para conteúdo')
    expect(link).toHaveAttribute('href', '#main-content')
  })

  it('is visually hidden by default', () => {
    const { container } = render(<SkipLink />)
    const link = container.querySelector('a')
    expect(link).toHaveClass('sr-only')
  })

  it('becomes visible when focused', () => {
    const { container } = render(<SkipLink />)
    const link = container.querySelector('a')
    expect(link).toHaveClass('focus:not-sr-only')
    expect(link).toHaveClass('focus:fixed')
    expect(link).toHaveClass('focus:top-4')
  })
})
