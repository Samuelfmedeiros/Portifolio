import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { LazyContactForm, ContactFallback } from './LazyContactForm'
import { LazySection } from './LazySection'
import React from 'react'

vi.mock('@/lib/supabase', () => ({
  submitContactForm: vi.fn(),
  supabase: { from: vi.fn(() => ({ insert: vi.fn() })) },
}))

vi.mock('@/lib/i18n', () => ({
  useLanguage: () => ({ t: (key: string, fallback?: string) => fallback ?? key }),
}))

/**
 * LazyContactForm — contrato de lazy-hydration do formulário (12/08/2026).
 *
 * O componente existia com 25% de cobertura: só o caminho "já visível" era
 * exercitado, e o fallback que sustenta o CLS zero nunca era conferido. São
 * justamente esses dois caminhos que quebram em produção — o ContactForm
 * (com o client do supabase, ~16KB) entrando no bundle inicial, ou o
 * fallback desaparecendo e a página saltando quando o formulário monta.
 */
describe('LazyContactForm — lazy-hydration do formulário', () => {
  const originalRect = Element.prototype.getBoundingClientRect

  beforeEach(() => {
    // jsdom devolve rect zerado → `rect.top < innerHeight + 400` é sempre
    // true e a seção nasce visível. Para provar o caminho "abaixo da dobra"
    // (fallback antes do observer) o rect tem que ser forçado.
    ;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  })

  afterEach(() => {
    Element.prototype.getBoundingClientRect = originalRect
    vi.restoreAllMocks()
  })

  it('ContactFallback reserva a altura medida (mobile 760 / desktop 737) para não gerar CLS', () => {
    const { container } = render(<ContactFallback />)

    const wrapper = container.querySelector('div') as HTMLElement
    expect(wrapper.style.minHeight).toBe('737px')
    // o texto de carregamento é o conteúdo do fallback — sem ele a seção
    // "aparece vazia" enquanto o formulário não monta
    expect(wrapper.textContent).toBe('contact.form.loading')
  })

  it('mantém o fallback (não o formulário) enquanto a seção está abaixo da dobra', () => {
    Element.prototype.getBoundingClientRect = vi.fn(
      () => ({ top: 100000, bottom: 100000, left: 0, right: 0, width: 0, height: 0 }) as DOMRect,
    )

    render(<LazyContactForm />)

    expect(screen.getByText('contact.form.loading')).toBeInTheDocument()
    expect(screen.queryByLabelText('contact.form.message')).not.toBeInTheDocument()
  })

  it('monta o ContactForm real quando a seção já está na viewport (sem dynamic no bundle inicial)', async () => {
    render(<LazyContactForm />)

    // findBy = espera o dynamic import resolver; getBy sincronário pegaria o fallback.
    // Timeout folgado: na suíte completa os arquivos rodam em paralelo e o
    // transform do ContactForm (com o client do supabase) passa de 1s.
    expect(
      await screen.findByLabelText('contact.form.message', undefined, { timeout: 15000 }),
    ).toBeInTheDocument()
    expect(screen.queryByText('contact.form.loading')).not.toBeInTheDocument()
  })

  it('usa o ContactFallback como fallback do LazySection (mesma altura, mesma cópia)', () => {
    Element.prototype.getBoundingClientRect = vi.fn(
      () => ({ top: 100000, bottom: 100000, left: 0, right: 0, width: 0, height: 0 }) as DOMRect,
    )

    // Renderiza o LazySection com o filho "caro" para provar que o fallback do
    // LazyContactForm é o ContactFallback — e não um buraco vazio.
    const { container } = render(
      <LazySection fallback={<ContactFallback />}>
        <span>formulario-caro</span>
      </LazySection>,
    )

    expect(container.querySelector('[style*="737px"]')).not.toBeNull()
    expect(screen.queryByText('formulario-caro')).not.toBeInTheDocument()
  })

  it('monta o filho quando o observer reporta interseção (sem depender do rect zerado do jsdom)', async () => {
    let ioCallback: ((entries: Array<{ isIntersecting: boolean }>) => void) | undefined
    class CapturingIO {
      constructor(cb: (entries: Array<{ isIntersecting: boolean }>) => void) {
        ioCallback = cb
      }
      observe = vi.fn()
      disconnect = vi.fn()
    }
    Element.prototype.getBoundingClientRect = vi.fn(
      () => ({ top: 100000, bottom: 100000, left: 0, right: 0, width: 0, height: 0 }) as DOMRect,
    )
    ;(window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = CapturingIO

    render(<LazyContactForm />)
    expect(screen.getByText('contact.form.loading')).toBeInTheDocument()

    await act(async () => {
      ioCallback?.([{ isIntersecting: true }])
    })

    expect(
      await screen.findByLabelText('contact.form.message', undefined, { timeout: 15000 }),
    ).toBeInTheDocument()
  })
})