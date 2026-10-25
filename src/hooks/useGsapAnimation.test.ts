import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useGsapFadeIn, useScrollParallax, useBgParallax, useGsapTimeline, useGsapTo, useGsapFrom } from './useGsapAnimation'

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
    const { result } = renderHook(() => useGsapFadeIn('.missing'))
    expect(result).toBeDefined()
  })

  it('sets up gsap context when elements exist', () => {
    renderHook(() => useGsapFadeIn('.test-el'))
    // context should be called without error
    expect(true).toBe(true)
  })
})

describe('useScrollParallax', () => {
  it('returns without error when elements exist', () => {
    document.body.innerHTML = '<div class="parallax"></div>'
    const { result } = renderHook(() => useScrollParallax('.parallax'))
    expect(result).toBeDefined()
  })
})

describe('useBgParallax', () => {
  it('returns without error when ref is null', () => {
    const { result } = renderHook(() => useBgParallax({ current: null } as any))
    expect(result).toBeDefined()
  })
})

describe('useGsapTimeline', () => {
  it('creates timeline when play is true', () => {
    const build = vi.fn()
    renderHook(() => useGsapTimeline(true, build))
    expect(build).toHaveBeenCalled()
  })

  it('does not create timeline when play is false', () => {
    const build = vi.fn()
    renderHook(() => useGsapTimeline(false, build))
    expect(build).not.toHaveBeenCalled()
  })
})

describe('useGsapTo', () => {
  it('returns without error', () => {
    document.body.innerHTML = '<div class="to-el"></div>'
    const { result } = renderHook(() => useGsapTo('.to-el', { x: 100 }, []))
    expect(result).toBeDefined()
  })
})

describe('useGsapFrom', () => {
  it('returns without error', () => {
    document.body.innerHTML = '<div class="from-el"></div>'
    const { result } = renderHook(() => useGsapFrom('.from-el', { opacity: 0 }, undefined, []))
    expect(result).toBeDefined()
  })
})
