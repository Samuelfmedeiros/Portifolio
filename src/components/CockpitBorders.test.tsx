import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { CockpitBorders } from './CockpitBorders'

describe('CockpitBorders', () => {
  it('renders without crashing', () => {
    const { container } = render(<CockpitBorders />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
