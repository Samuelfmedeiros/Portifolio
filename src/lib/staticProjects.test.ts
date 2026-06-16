import { describe, it, expect } from 'vitest'
import { STATIC_PROJECTS, FEATURED_PROJECTS } from './staticProjects'

describe('staticProjects', () => {
  it('returns an array of projects', () => {
    expect(Array.isArray(STATIC_PROJECTS)).toBe(true)
    expect(STATIC_PROJECTS.length).toBeGreaterThan(0)
  })

  it('each project has required fields', () => {
    STATIC_PROJECTS.forEach((project) => {
      expect(project).toHaveProperty('id')
      expect(project).toHaveProperty('name')
      expect(project).toHaveProperty('description')
      expect(project).toHaveProperty('html_url')
    })
  })

  it('exports FEATURED_PROJECTS as an array', () => {
    expect(Array.isArray(FEATURED_PROJECTS)).toBe(true)
    expect(FEATURED_PROJECTS.length).toBeGreaterThan(0)
  })

  it('FEATURED_PROJECTS contains expected project names', () => {
    expect(FEATURED_PROJECTS).toContain('Portifolio')
    expect(FEATURED_PROJECTS).toContain('DogWalk')
    expect(FEATURED_PROJECTS).toContain('simon-game')
  })

  it('DogWalk has homepage and imageGradient', () => {
    const dogWalk = STATIC_PROJECTS.find(p => p.name === 'DogWalk')
    expect(dogWalk).toBeDefined()
    expect(dogWalk?.homepage).toBe('https://seu.pet')
    expect(dogWalk?.imageGradient).toBeDefined()
    expect(dogWalk?.hasDemo).toBe(true)
  })
})
