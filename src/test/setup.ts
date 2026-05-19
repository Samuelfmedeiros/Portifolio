import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

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

// Mock Framer Motion to render children without animations
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal<typeof import('framer-motion')>()
  const mockComponent = (name: string) => {
    const Comp = ({ children, ...props }: any) => {
      // Forward children and essential props, skip animation props
      const { initial, animate, whileInView, whileHover, whileTap, transition, viewport, layoutId, exit, ...rest } = props
      return actual.motion ? <actual.motion.div {...rest}>{children}</actual.motion.div> : <div {...rest}>{children}</div>
    }
    Comp.displayName = `Mock${name}`
    return Comp
  }
  return {
    ...actual,
    useInView: vi.fn(() => true),
    AnimatePresence: ({ children }: any) => children,
    motion: new Proxy({}, {
      get: (_, prop) => mockComponent(String(prop)),
    }),
  }
})
