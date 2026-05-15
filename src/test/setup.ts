import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

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

// Mock Framer Motion's useInView to always return true (element in view)
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useInView: vi.fn(() => true),
  }
})
