import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Scanline } from './Scanline'

describe('Scanline', () => {
  it('renders without crashing', () => {
    const { container } = render(<Scanline />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
