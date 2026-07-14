import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { JsonLd } from './JsonLd'

describe('JsonLd', () => {
  it('renders 4 script tags with application/ld+json type', () => {
    const { container } = render(<JsonLd />)
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    expect(scripts).toHaveLength(4)
  })

  it('contains valid JSON-LD schema', () => {
    const { container } = render(<JsonLd />)
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    scripts.forEach((script) => {
      const content = script.textContent
      expect(() => JSON.parse(content || '')).not.toThrow()
    })
  })

  it('has correct @context on all schemas', () => {
    const { container } = render(<JsonLd />)
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    scripts.forEach((script) => {
      const schema = JSON.parse(script.textContent || '{}')
      expect(schema['@context']).toBe('https://schema.org')
    })
  })

  it('includes Person schema with name Samuel Medeiros', () => {
    const { container } = render(<JsonLd />)
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    const person = Array.from(scripts)
      .map((s) => JSON.parse(s.textContent || '{}'))
      .find((s: Record<string, unknown>) => s['@type'] === 'Person')
    expect(person).toBeDefined()
    expect((person as Record<string, unknown>).name).toBe('Samuel Medeiros')
  })

  it('includes WebSite schema with SearchAction', () => {
    const { container } = render(<JsonLd />)
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    const website = Array.from(scripts)
      .map((s) => JSON.parse(s.textContent || '{}'))
      .find((s: Record<string, unknown>) => s['@type'] === 'WebSite')
    expect(website).toBeDefined()
    const ws = website as Record<string, unknown>
    expect(ws.potentialAction).toBeDefined()
    expect((ws.potentialAction as Record<string, unknown>)['@type']).toBe('SearchAction')
  })

  it('includes ItemList schema with projects', () => {
    const { container } = render(<JsonLd />)
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    const itemList = Array.from(scripts)
      .map((s) => JSON.parse(s.textContent || '{}'))
      .find((s: Record<string, unknown>) => s['@type'] === 'ItemList')
    expect(itemList).toBeDefined()
    const il = itemList as Record<string, unknown>
    expect(Array.isArray(il.itemListElement)).toBe(true)
    expect((il.itemListElement as Array<unknown>).length).toBeGreaterThanOrEqual(3)
  })

  it('Person schema includes knowsAbout skills array', () => {
    const { container } = render(<JsonLd />)
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    const person = Array.from(scripts)
      .map((s) => JSON.parse(s.textContent || '{}'))
      .find((s: Record<string, unknown>) => s['@type'] === 'Person') as Record<string, unknown>
    expect(Array.isArray(person.knowsAbout)).toBe(true)
    expect((person.knowsAbout as string[])).toContain('React')
    expect((person.knowsAbout as string[])).toContain('Next.js')
    expect((person.knowsAbout as string[])).toContain('TypeScript')
  })

  it('Person schema includes sameAs social links', () => {
    const { container } = render(<JsonLd />)
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    const person = Array.from(scripts)
      .map((s) => JSON.parse(s.textContent || '{}'))
      .find((s: Record<string, unknown>) => s['@type'] === 'Person') as Record<string, unknown>
    expect(Array.isArray(person.sameAs)).toBe(true)
    expect((person.sameAs as string[]).some((url: string) => url.includes('github'))).toBe(true)
    expect((person.sameAs as string[]).some((url: string) => url.includes('linkedin'))).toBe(true)
  })

  it('Person schema includes address and nationality', () => {
    const { container } = render(<JsonLd />)
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    const person = Array.from(scripts)
      .map((s) => JSON.parse(s.textContent || '{}'))
      .find((s: Record<string, unknown>) => s['@type'] === 'Person') as Record<string, unknown>
    expect(person.address).toBeDefined()
    expect((person.address as Record<string, string>).addressLocality).toBe('Brasília')
    expect(person.nationality).toBeDefined()
    expect((person.nationality as Record<string, string>).name).toBe('Brazil')
  })
})
