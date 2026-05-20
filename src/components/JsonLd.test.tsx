import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { JsonLd } from './JsonLd'

describe('JsonLd', () => {
  it('renders a script tag with application/ld+json type', () => {
    const { container } = render(<JsonLd />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).toBeInTheDocument()
  })

  it('contains valid JSON-LD schema', () => {
    const { container } = render(<JsonLd />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()
    const content = script?.textContent
    expect(() => JSON.parse(content || '')).not.toThrow()
  })

  it('has correct @context', () => {
    const { container } = render(<JsonLd />)
    const script = container.querySelector('script[type="application/ld+json"]')
    const schema = JSON.parse(script?.textContent || '{}')
    expect(schema['@context']).toBe('https://schema.org')
  })

  it('has @type Person', () => {
    const { container } = render(<JsonLd />)
    const script = container.querySelector('script[type="application/ld+json"]')
    const schema = JSON.parse(script?.textContent || '{}')
    expect(schema['@type']).toBe('Person')
  })

  it('includes name Samuel Medeiros', () => {
    const { container } = render(<JsonLd />)
    const script = container.querySelector('script[type="application/ld+json"]')
    const schema = JSON.parse(script?.textContent || '{}')
    expect(schema.name).toBe('Samuel Medeiros')
  })

  it('includes knowsAbout skills array', () => {
    const { container } = render(<JsonLd />)
    const script = container.querySelector('script[type="application/ld+json"]')
    const schema = JSON.parse(script?.textContent || '{}')
    expect(Array.isArray(schema.knowsAbout)).toBe(true)
    expect(schema.knowsAbout).toContain('React')
    expect(schema.knowsAbout).toContain('Next.js')
    expect(schema.knowsAbout).toContain('TypeScript')
  })

  it('includes sameAs social links', () => {
    const { container } = render(<JsonLd />)
    const script = container.querySelector('script[type="application/ld+json"]')
    const schema = JSON.parse(script?.textContent || '{}')
    expect(Array.isArray(schema.sameAs)).toBe(true)
    expect(schema.sameAs.some((url: string) => url.includes('github'))).toBe(true)
    expect(schema.sameAs.some((url: string) => url.includes('linkedin'))).toBe(true)
  })
})
