import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { STATIC_PROJECTS, FEATURED_PROJECTS } from './staticProjects'
import { getProjectI18n } from './profileData'

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

  // Regressao 16/09/2026: roger-mlops e roger-loop entraram no site pela API do
  // GitHub (sem entrada no catalogo estatico) e cairam no fallback "gradiente +
  // nome" — card parecia SEM CAPA em producao. A capa mora em public/projects/.
  describe.each(['roger-mlops', 'roger-loop'])('%s (card com capa propria)', (name) => {
    const project = STATIC_PROJECTS.find((p) => p.name === name)

    it('existe no catalogo estatico com imageUrl', () => {
      expect(project, `${name} ausente do catalogo estatico`).toBeDefined()
      expect(project?.imageUrl, `${name} sem imageUrl (cairia no fallback)`).toBeTruthy()
    })

    it('a capa existe em public/ e e um WEBP real (nao placeholder vazio)', () => {
      const file = path.join(process.cwd(), 'public', String(project?.imageUrl))
      expect(fs.existsSync(file), `capa ausente: ${file}`).toBe(true)
      const buf = fs.readFileSync(file)
      expect(buf.subarray(0, 4).toString('ascii'), 'nao e RIFF').toBe('RIFF')
      expect(buf.subarray(8, 12).toString('ascii'), 'nao e WEBP').toBe('WEBP')
      expect(buf.length, 'capa suspeita de placeholder (<10KB)').toBeGreaterThan(10_000)
    })

    it('tem descricao i18n em PT e EN (card nao cai no texto da API)', () => {
      expect(getProjectI18n('pt', name)?.description).toBeTruthy()
      expect(getProjectI18n('en', name)?.description).toBeTruthy()
    })
  })
})
