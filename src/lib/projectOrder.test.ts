import { describe, it, expect } from 'vitest'
import { PROJECT_PRIORITY, orderProjects } from './projectOrder'

const p = (name: string) => ({ name })

describe('orderProjects', () => {
  it('coloca o TatuEngine em primeiro (Samuel 14/11/2026)', () => {
    const out = orderProjects([p('Arachne'), p('DogWalk'), p('TatuEngine'), p('Portifolio')])
    expect(out[0].name).toBe('TatuEngine')
  })

  it('DogWalk vem logo depois do TatuEngine', () => {
    const out = orderProjects([p('DogWalk'), p('TatuEngine'), p('Arachne')])
    expect(out.map((x) => x.name)).toEqual(['TatuEngine', 'DogWalk', 'Arachne'])
  })

  it('ordem do TatuEngine nao depende da ordem de entrada', () => {
    const a = orderProjects([p('TatuEngine'), p('DogWalk'), p('X')])
    const b = orderProjects([p('X'), p('DogWalk'), p('TatuEngine')])
    expect(a.map((x) => x.name)).toEqual(b.map((x) => x.name))
  })

  it('preserva a ordem original dos projetos fora da prioridade', () => {
    const out = orderProjects([p('zeta'), p('alfa'), p('meio')])
    expect(out.map((x) => x.name)).toEqual(['zeta', 'alfa', 'meio'])
  })

  it('nao muta o array de entrada', () => {
    const input = [p('DogWalk'), p('TatuEngine')]
    orderProjects(input)
    expect(input.map((x) => x.name)).toEqual(['DogWalk', 'TatuEngine'])
  })

  it('PROJECT_PRIORITY comeca com TatuEngine', () => {
    expect(PROJECT_PRIORITY[0]).toBe('TatuEngine')
  })
})
