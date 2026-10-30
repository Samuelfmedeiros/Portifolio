import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useGsapFadeIn, useScrollParallax, useBgParallax, useGsapTimeline, useGsapTo, useGsapFrom } from './useGsapAnimation'
import gsap from 'gsap'

vi.mock('gsap', () => {
  const mockGsap = {
    registerPlugin: vi.fn(),
    context: vi.fn((cb) => {
      cb()
      return { revert: vi.fn() }
    }),
    from: vi.fn(),
    to: vi.fn(),
    timeline: vi.fn(() => ({
      kill: vi.fn(),
    })),
    fromTo: vi.fn(),
  }
  return {
    default: mockGsap,
    gsap: mockGsap,
  }
})

vi.mock('gsap/ScrollTrigger', () => ({
  __esModule: true,
  ScrollTrigger: {},
  default: {}
}))

describe('useGsapFadeIn', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div class="test-el"></div>'
    vi.clearAllMocks()
  })

  it('does nothing when no elements found', () => {
    document.body.innerHTML = ''
    renderHook(() => useGsapFadeIn('.missing'))
    expect(gsap.context).not.toHaveBeenCalled()
  })

  it('sets up gsap context and calls gsap.from when elements exist', () => {
    renderHook(() => useGsapFadeIn('.test-el'))
    expect(gsap.context).toHaveBeenCalledTimes(1)
    expect(gsap.from).toHaveBeenCalled()
  })

  it('reverts context on unmount', () => {
    const { unmount } = renderHook(() => useGsapFadeIn('.test-el'))
    const revert = vi.mocked(gsap.context).mock.results[0]?.value.revert
    unmount()
    expect(revert).toHaveBeenCalled()
  })
})

describe('useScrollParallax', () => {
  it('creates gsap context and calls gsap.to when elements exist', () => {
    document.body.innerHTML = '<div class="parallax"></div>'
    renderHook(() => useScrollParallax('.parallax'))
    expect(gsap.context).toHaveBeenCalledTimes(1)
    expect(gsap.to).toHaveBeenCalled()
  })

  it('does nothing when no elements found', () => {
    document.body.innerHTML = ''
    renderHook(() => useScrollParallax('.missing'))
    expect(gsap.context).not.toHaveBeenCalled()
  })
})

describe('useBgParallax', () => {
  it('does nothing when ref is null', () => {
    renderHook(() => useBgParallax({ current: null } as any))
    expect(gsap.context).not.toHaveBeenCalled()
  })

  it('sets up gsap context when ref exists', () => {
    const container = document.createElement('div')
    container.innerHTML = '<div data-parallax-layer data-speed="0.5"></div>'
    document.body.appendChild(container)
    renderHook(() => useBgParallax({ current: container } as any))
    expect(gsap.context).toHaveBeenCalledTimes(1)
    expect(gsap.to).toHaveBeenCalled()
    document.body.removeChild(container)
  })
})

describe('useGsapTimeline', () => {
  it('creates timeline and calls build when play is true', () => {
    const build = vi.fn()
    renderHook(() => useGsapTimeline(true, build))
    expect(gsap.timeline).toHaveBeenCalledTimes(1)
    expect(build).toHaveBeenCalledTimes(1)
  })

  it('does not create timeline when play is false', () => {
    const build = vi.fn()
    renderHook(() => useGsapTimeline(false, build))
    expect(gsap.timeline).not.toHaveBeenCalled()
    expect(build).not.toHaveBeenCalled()
  })
})

describe('useGsapTo', () => {
  it('calls gsap.to with vars when elements exist', () => {
    document.body.innerHTML = '<div class="to-el"></div>'
    renderHook(() => useGsapTo('.to-el', { x: 100 }, []))
    expect(gsap.context).toHaveBeenCalledTimes(1)
    expect(gsap.to).toHaveBeenCalled()
    const firstCall = vi.mocked(gsap.to).mock.calls[0]
    expect(firstCall[1]).toEqual({ x: 100 })
  })

  it('does nothing when elements missing', () => {
    document.body.innerHTML = ''
    renderHook(() => useGsapTo('.missing', { x: 100 }, []))
    expect(gsap.context).not.toHaveBeenCalled()
  })
})

describe('useGsapFrom', () => {
  it('calls gsap.from when toVars undefined', () => {
    document.body.innerHTML = '<div class="from-el"></div>'
    renderHook(() => useGsapFrom('.from-el', { opacity: 0 }, undefined, []))
    expect(gsap.context).toHaveBeenCalledTimes(1)
    expect(gsap.from).toHaveBeenCalled()
  })

  it('calls gsap.fromTo when toVars provided', () => {
    document.body.innerHTML = '<div class="from-el"></div>'
    renderHook(() => useGsapFrom('.from-el', { opacity: 0 }, { opacity: 1 }, []))
    expect(gsap.context).toHaveBeenCalledTimes(1)
    expect(gsap.fromTo).toHaveBeenCalled()
  })
})
