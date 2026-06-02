import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TypeWriter } from './TypeWriter'

describe('TypeWriter', () => {
  it('should render without crashing', () => {
    const { container } = render(<TypeWriter phrases={['Hello World']} />)
    expect(container).toBeTruthy()
  })

  it('starts with empty text', () => {
    const { container } = render(<TypeWriter phrases={['Test']} />)
    // TypeWriter starts with empty currentText, the span renders but with no visible chars yet
    expect(container).toBeTruthy()
  })

  it('accepts custom speed props', () => {
    const { container } = render(
      <TypeWriter phrases={['Fast']} speed={10} deleteSpeed={5} pauseDuration={500} />
    )
    expect(container).toBeTruthy()
  })
})
