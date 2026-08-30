import { describe, it, expect } from 'vitest'
import { dict } from './dictionary'

describe('i18n dictionary — paridade PT/EN', () => {
  const ptKeys = Object.keys(dict.pt)
  const enKeys = Object.keys(dict.en)

  it('todas as chaves PT existem em EN', () => {
    const missing = ptKeys.filter((k) => !enKeys.includes(k))
    expect(missing).toEqual([])
  })

  it('todas as chaves EN existem em PT', () => {
    const missing = enKeys.filter((k) => !ptKeys.includes(k))
    expect(missing).toEqual([])
  })

  it('nenhum par PT/EN é idêntico (tradução real, não cópia)', () => {
    const identical = ptKeys.filter((k) => dict.pt[k] === dict.en[k])
    // Exceções legítimas: nomes próprios, siglas, marcas, números, termos técnicos
    const allowlist = [
      'nav.blog', 'hero.typewriter.3', 'hero.typewriter.4',
      'hero.btn.cv.pdf', 'hero.scroll', 'hero.skills.1', 'hero.skills.2',
      'hero.skills.3', 'hero.skills.4', 'hero.skills.5', 'hero.skills.6',
      'cv.email', 'profile.title', 'profile.location', 'profile.education.grad.period',
      'profile.tags.hardware', 'profile.skill.expert', 'projects.powered_by',
      'projects.filter.web', 'projects.filter.devops', 'projects.view.github',
      'blog.section.title', 'games.label.asteroid', 'games.label.code',
      'games.label.memory', 'games.label.terminal', 'contact.form.email',
      'contact.email.label', 'footer.copyright', 'footer.version',
      'github.stars', 'github.forks', 'monetization.pix', 'monetization.coffee',
      'monetization.sponsor', 'aria.github', 'aria.linkedin', 'aria.whatsapp',
      'aria.email', 'terminal.uptime',
    ]
    const unexpected = identical.filter((k) => !allowlist.includes(k))
    expect(unexpected, `pares idênticos inesperados: ${unexpected.join(', ')}`).toEqual([])
  })

  it('chaves novas de consulting/mission/error/legal estão completas', () => {
    const novas = [
      'consulting.title',
      'consulting.stripe.label',
      'consulting.mp.label',
      'consulting.stripe.cta',
      'consulting.stripe.budget',
      'consulting.stripe.aria',
      'consulting.mp.aria',
      'consulting.mp.budget',
      'mission.clock.title',
      'mission.clock.mission',
      'error.boundary.title',
      'error.boundary.message',
      'error.boundary.unknown',
      'error.boundary.reset',
      'contact.form.email.format',
      'contact.form.aria',
      'contact.form.loading',
      'monetization.buycoffee.title',
      'monetization.buycoffee.aria',
      'legal.page.terms.title',
      'legal.page.privacy.title',
    ]
    for (const k of novas) {
      expect(dict.pt, `PT falta: ${k}`).toHaveProperty(k)
      expect(dict.en, `EN falta: ${k}`).toHaveProperty(k)
    }
  })
})
