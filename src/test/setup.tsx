import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'
import React from 'react'

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false, // dark mode
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock localStorage com suporte a getItem retornando null por padrao
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock IntersectionObserver
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: class IntersectionObserver {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
    root = null
    rootMargin = ''
    thresholds = []
    takeRecords = vi.fn(() => [])
  },
})

// Mock scrollTo
Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
  writable: true,
  value: vi.fn(),
})

// Mock window.scrollY
Object.defineProperty(window, 'scrollY', { writable: true, value: 0 })

// Mock ResizeObserver
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: class ResizeObserver {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  },
})

// Mock Framer Motion to render children without animations (no JSX in factory)
vi.mock('framer-motion', async () => {
  const React = await import('react')
  const MockMotionComponent = (props: any) => {
    const { children, initial, animate, whileInView, whileHover, whileTap, transition, viewport, layoutId, exit, ...rest } = props
    return React.createElement('div', rest, children)
  }

  return {
    useInView: () => true,
    useScroll: () => ({ scrollYProgress: { get: () => 0, onChange: () => {}, on: () => {}, off: () => {}, stop: () => {} } }),
    useTransform: (input: any) => ({ get: () => 0, onChange: () => {}, on: () => {}, off: () => {}, stop: () => {} }),
    useAnimation: () => ({ start: () => {}, stop: () => {}, set: () => {} }),
    AnimatePresence: ({ children }: any) => children,
    motion: new Proxy({}, {
      get: (_, prop) => {
        const Comp = MockMotionComponent
        Comp.displayName = `motion.${String(prop)}`
        return Comp
      },
    }),
  }
})
