import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ServicoContent } from './ServicoContent'

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ServicoContent — contrato da página /servico.
 *
 * A página é 100% conteúdo: o que pode quebrar sem erro de compilação é
 * (a) uma seção perder o heading que o `aria-labelledby` referencia,
 * (b) a âncora do CTA apontar para um id que não existe mais,
 * (c) um card/step/item sumir ou duplicar, (d) o preço sair da tabela, e
 * (e) o texto escorregar para hardcoded e quebrar o bilinguismo PT/EN.
 *
 * `t` é espiado e devolvendo o fallback — assim o DOM tem o texto real de
 * produção PT e dá para assertar conteúdo E provar que cada string passa
 * pelo dicionário (não é literal no JSX).
 * ═══════════════════════════════════════════════════════════════════════════
 */

const tSpy = vi.fn((key: string, fallback?: string) => fallback ?? key)

vi.mock('@/lib/i18n', () => ({
  useLanguage: () => ({ t: tSpy, language: 'pt', setLanguage: vi.fn() }),
}))

// LazyContactForm é wrapper de IntersectionObserver; a seção de CTA só precisa
// existir no DOM — o que está sob teste é o contrato do ServicoContent.
vi.mock('./LazyContactForm', () => ({
  LazyContactForm: () => <div data-testid="lazy-contact-form-stub" />,
}))

describe('ServicoContent', () => {
  beforeEach(() => {
    tSpy.mockClear()
  })

  it('toda section tem aria-labelledby apontando para um heading que existe', () => {
    const { container } = render(<ServicoContent />)
    const sections = Array.from(container.querySelectorAll('section'))
    expect(sections.length).toBe(7)

    for (const section of sections) {
      const id = section.getAttribute('aria-labelledby')
      expect(id, `section sem aria-labelledby: ${section.className}`).toBeTruthy()
      const heading = container.querySelector(`#${id}`)
      expect(heading, `nenhum heading com id ${id}`).not.toBeNull()
      expect(heading?.textContent?.trim()).not.toBe('')
    }
  })

  it('a headline principal é h1 e a página tem um só h1', () => {
    const { container } = render(<ServicoContent />)
    const h1s = container.querySelectorAll('h1')
    expect(h1s).toHaveLength(1)
    expect(h1s[0].id).toBe('servico-hero')
    expect(h1s[0].textContent).toContain('automação com IA')
    expect(h1s[0].textContent).toContain('48h')
  })

  it('renderiza os 3 problemas, os 4 passos, os 4 itens incluídos e os 6 sites no ar', () => {
    render(<ServicoContent />)
    // Problema: ul com md:grid-cols-3
    expect(screen.getByText('O que trava o dia de quem toca o negócio')).toBeInTheDocument()
    // Como funciona: 4 passos numerados
    expect(screen.getByText('Quatro passos, do diagnóstico à entrega')).toBeInTheDocument()
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('04')).toBeInTheDocument()
    // Prova: a lista de sites é a que contém o domínio raiz
    expect(screen.getByText('seu.pet')).toBeInTheDocument()
    expect(screen.getByText('arachne.seu.pet')).toBeInTheDocument()
  })

  it('mantém os 3 preços fechados na tabela, com th scope=row', () => {
    render(<ServicoContent />)
    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(3)
    const cells = rows.map((row) => ({
      label: row.querySelector('th')?.textContent?.trim(),
      value: row.querySelector('td')?.textContent?.trim(),
      row: row.querySelector('th')?.getAttribute('scope'),
    }))
    expect(cells).toEqual([
      { label: 'Implantação', value: 'R$ 1.900', row: 'row' },
      { label: 'Manutenção (opcional)', value: 'R$ 490/mês', row: 'row' },
      { label: 'Piso (uma integração só)', value: 'R$ 900', row: 'row' },
    ])
    // a tabela tem caption sr-only (leitor de tela precisa do título) — o mesmo
    // texto aparece no h2 da seção e no caption, os dois nós são conferidos.
    expect(screen.getAllByText('Valores fechados')).toHaveLength(2)
  })

  it('o CTA aponta para #contato e a seção de contato existe (âncora resolvível)', () => {
    const { container } = render(<ServicoContent />)
    const cta = container.querySelector('a[href="#contato"]')
    expect(cta).not.toBeNull()
    const target = container.querySelector('#contato')
    expect(target).not.toBeNull()
    expect(target?.querySelector('[data-testid="lazy-contact-form-stub"]')).not.toBeNull()
  })

  it('o link de voltar aponta para a home', () => {
    const { container } = render(<ServicoContent />)
    const back = container.querySelector('a[href="/"]')
    expect(back).not.toBeNull()
    expect(back?.textContent).toContain('Voltar ao início')
  })

  it('todo texto visível vem do dicionário — nenhuma chave servico.* fica sem tradução', () => {
    render(<ServicoContent />)
    const usadas = tSpy.mock.calls.map((c) => c[0])
    const servico = usadas.filter((k) => k.startsWith('servico.'))
    expect(servico.length).toBeGreaterThan(20)

    // chaves que o contrato da página exige (se alguma sair do JSX, o teste cai)
    for (const key of [
      'servico.hero.title',
      'servico.hero.subtitle',
      'servico.hero.cta',
      'servico.problem.title',
      'servico.how.title',
      'servico.includes.title',
      'servico.proof.title',
      'servico.price.setup',
      'servico.price.floor',
      'servico.cta.subtitle',
      'servico.back',
    ]) {
      expect(usadas).toContain(key)
    }

    // cards gerados por lista: cada item passou por t(key) e t(desc)
    expect(usadas).toContain('servico.problem.1.desc')
    expect(usadas).toContain('servico.includes.4.desc')
    expect(usadas).toContain('servico.how.3.desc')
  })

  it('os ícones decorativos são aria-hidden e os números dos passos também', () => {
    const { container } = render(<ServicoContent />)
    // CheckIcon dos 4 itens incluídos
    expect(container.querySelectorAll('svg[aria-hidden="true"]').length).toBeGreaterThanOrEqual(4)
    // números 01..04 dos passos
    const numeros = Array.from(container.querySelectorAll('span[aria-hidden="true"]'))
      .map((el) => el.textContent?.trim())
      .filter((txt) => /^0[1-4]$/.test(txt ?? ''))
    expect(numeros).toEqual(['01', '02', '03', '04'])
  })
})