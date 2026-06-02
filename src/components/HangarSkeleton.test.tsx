import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HangarSkeleton } from './HangarSkeleton'

describe('HangarSkeleton', () => {
  it('renders without crashing', () => {
    render(<HangarSkeleton />)
    expect(screen.getByText('▸ Carregando...')).toBeInTheDocument()
  })

  it('renders a section with id projects', () => {
    const { container } = render(<HangarSkeleton />)
    const section = container.querySelector('section#projects')
    expect(section).toBeInTheDocument()
  })

  it('renders 6 skeleton cards', () => {
    const { container } = render(<HangarSkeleton />)
    // Each GlassSkeleton contains a glass div
    const skeletons = container.querySelectorAll('.glass.border-\\[var\\(--border\\)\\]')
    expect(skeletons.length).toBe(6)
  })

  it('renders in a grid layout', () => {
    const { container } = render(<HangarSkeleton />)
    const grid = container.querySelector('.grid')
    expect(grid).toBeInTheDocument()
    expect(grid!.className).toContain('grid-cols-1')
    expect(grid!.className).toContain('md:grid-cols-2')
    expect(grid!.className).toContain('lg:grid-cols-3')
  })
})
