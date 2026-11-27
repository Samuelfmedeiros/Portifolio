import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { MotionValue } from 'framer-motion'
import { BlackHoleVortex } from './BlackHoleVortex'

function progressOf(value: number) {
  return { get: () => value } as unknown as MotionValue<number>
}

const ctxStub = {
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  setTransform: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  ellipse: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
}

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn(
    () => ctxStub
  ) as unknown as HTMLCanvasElement['getContext']
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('BlackHoleVortex', () => {
  it('renderiza a camada decorativa escondida de leitores de tela', () => {
    const { getByTestId } = render(<BlackHoleVortex progress={progressOf(0)} />)
    const wrapper = getByTestId('black-hole-vortex')
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveAttribute('aria-hidden', 'true')
    expect(wrapper.className).toContain('pointer-events-none')
    expect(wrapper.querySelector('canvas')).toBeInTheDocument()
  })

  it('não anima quando prefers-reduced-motion: reduce', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('reduce'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia

    const rafSpy = vi.spyOn(window, 'requestAnimationFrame')
    render(<BlackHoleVortex progress={progressOf(0)} />)
    expect(rafSpy).not.toHaveBeenCalled()
    // frame único: o disco é desenhado, não é um canvas vazio
    expect(ctxStub.stroke).toHaveBeenCalled()
  })

  it('sobrevive quando o canvas não tem contexto 2D', () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(
      () => null
    ) as unknown as HTMLCanvasElement['getContext']
    expect(() => render(<BlackHoleVortex progress={progressOf(0.5)} />)).not.toThrow()
  })

  it('reaproveita o mesmo canvas quando o progresso muda', () => {
    const { rerender, getByTestId } = render(<BlackHoleVortex progress={progressOf(0)} />)
    const first = getByTestId('black-hole-vortex').querySelector('canvas')
    rerender(<BlackHoleVortex progress={progressOf(1)} />)
    const second = getByTestId('black-hole-vortex').querySelector('canvas')
    expect(first).toBe(second)
  })
})
