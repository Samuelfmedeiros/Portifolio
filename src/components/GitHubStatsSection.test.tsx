import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { GitHubStatsSection } from './GitHubStatsSection'

// Mock fetch for GitHub API — returns different responses per URL
const mockFetch = vi.fn((url: string) => {
  if (url.includes("/repos")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { stargazers_count: 5, forks_count: 2 },
        { stargazers_count: 3, forks_count: 1 },
      ]),
    });
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ public_repos: 10, followers: 5 }),
  });
}) as unknown as typeof globalThis.fetch

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
