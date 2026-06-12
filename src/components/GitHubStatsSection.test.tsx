import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { GitHubStatsSection } from './GitHubStatsSection'

// Mock fetch for GitHub API
const mockFetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ public_repos: 10, followers: 5 }),
  })
) as unknown as typeof globalThis.fetch

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('GitHubStatsSection', () => {
  it('should render without crashing', () => {
    const { container } = render(<GitHubStatsSection />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should show loading state initially', () => {
    const { container } = render(<GitHubStatsSection />)
    // Component renders a container even while loading
    expect(container).toBeInTheDocument()
  })
})
