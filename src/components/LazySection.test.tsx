import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { LazySection } from './LazySection'

/**
 * LazySection — contrato de lazy-hydration abaixo da dobra (12/08/2026).
 *
 * O componente tinha 5% de cobertura: só o caminho "já visível" era exercitado
 * (jsdom devolve getBoundingClientRect zerado, então `rect.top < innerHeight +
 * 400` é sempre true). Os outros caminhos são justamente os que quebram em
 * produção: o fallback ocupando altura, o observer montando o filho tardiamente
 * e o cleanup desconectando o observer (vazamento de observer = callbacks
 * rodando depois do unmount).
 */

type IOCallback = (entries: IntersectionObserverEntry[], obs: IntersectionObserver) => void

interface IOStub {
  callback: IOCallback
  options?: IntersectionObserverInit
  observe: ReturnType<typeof vi.fn>
  disconnect: ReturnType<typeof vi.fn>
}

function makeRect(top: number) {
  return { top, bottom: 0, left: 0, right: 0, width: 0, height: 0 } as unknown as DOMRect
}

describe('LazySection', () => {
  let io: IOStub

  /** Captura o observer para disparar o callback e contar o disconnect. */
  class CapturingIntersectionObserver {
    callback: IOCallback
    options?: IntersectionObserverInit
    root = null
    rootMargin = ''
    thresholds: number[] = []
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
    constructor(callback: IOCallback, options?: IntersectionObserverInit) {
      this.callback = callback
      this.options = options
      io = this
    }
  }

  beforeEach(() => {
    // `mockImplementation` precisa receber uma função NEWABLE — o componente faz
    // `new IntersectionObserver(...)` e uma arrow function não pode ser `new`'d
    // ("is not a constructor"). Função regular pode, e o `return` de um objeto
    // dentro dela faz o `new` devolver exatamente esse objeto.
    vi.spyOn(window, 'IntersectionObserver').mockImplementation(
      function () {
        return new CapturingIntersectionObserver()
      } as unknown as typeof IntersectionObserver,
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('monta os filhos imediatamente quando a seção já está na viewport', () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(makeRect(0))
    render(
      <LazySection fallback={<div>carregando</div>}>
        <div>conteudo-hidratado</div>
      </LazySection>,
    )
    expect(screen.getByText('conteudo-hidratado')).toBeInTheDocument()
    expect(screen.queryByText('carregando')).not.toBeInTheDocument()
  })

  it('mostra o fallback (não os filhos) quando a seção está abaixo da dobra', () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(makeRect(5000))
    render(
      <LazySection fallback={<div>carregando</div>}>
        <div>conteudo-hidratado</div>
      </LazySection>,
    )
    expect(screen.getByText('carregando')).toBeInTheDocument()
    expect(screen.queryByText('conteudo-hidratado')).not.toBeInTheDocument()
  })

  it('observa o elemento com IntersectionObserver e monta quando ele intersecta', () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(makeRect(5000))
    render(
      <LazySection fallback={<div>carregando</div>}>
        <div>conteudo-hidratado</div>
      </LazySection>,
    )

    expect(io.observe).toHaveBeenCalledTimes(1)
    expect(io.options).toEqual({ rootMargin: '400px', threshold: 0.01 })

    act(() => {
      io.callback([{ isIntersecting: true } as IntersectionObserverEntry], io as unknown as IntersectionObserver)
    })

    expect(screen.getByText('conteudo-hidratado')).toBeInTheDocument()
    // depois de montar, o observer é descartado (não fica observando à toa)
    expect(io.disconnect).toHaveBeenCalledTimes(1)
  })

  it('continua no fallback quando o observer reporta que não intersecta', () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(makeRect(5000))
    render(
      <LazySection fallback={<div>carregando</div>}>
        <div>conteudo-hidratado</div>
      </LazySection>,
    )

    act(() => {
      io.callback([{ isIntersecting: false } as IntersectionObserverEntry], io as unknown as IntersectionObserver)
    })

    expect(screen.getByText('carregando')).toBeInTheDocument()
    expect(screen.queryByText('conteudo-hidratado')).not.toBeInTheDocument()
    expect(io.disconnect).not.toHaveBeenCalled()
  })

  it('respeita rootMargin customizado', () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(makeRect(5000))
    render(
      <LazySection rootMargin="200px" fallback={<div>carregando</div>}>
        <div>conteudo-hidratado</div>
      </LazySection>,
    )
    expect(io.options?.rootMargin).toBe('200px')
  })

  it('desconecta o observer no unmount (sem vazamento)', () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(makeRect(5000))
    const { unmount } = render(
      <LazySection fallback={<div>carregando</div>}>
        <div>conteudo-hidratado</div>
      </LazySection>,
    )

    unmount()
    expect(io.disconnect).toHaveBeenCalled()
  })

  it('aplica className no wrapper', () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(makeRect(0))
    const { container } = render(
      <LazySection className="min-h-[737px]">
        <div>conteudo-hidratado</div>
      </LazySection>,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.className).toBe('min-h-[737px]')
  })
})