import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getRepos } from './github'

describe('getRepos', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches and returns repos from GitHub API', async () => {
    const mockRepos = [
      { id: 1, name: 'repo-one', html_url: 'https://github.com/user/repo-one' },
      { id: 2, name: 'repo-two', html_url: 'https://github.com/user/repo-two' },
    ]

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRepos),
    })

    const repos = await getRepos()
    expect(repos).toHaveLength(2)
    expect(repos[0].name).toBe('repo-one')
  })

  it('filters out repos with "test" in the name', async () => {
    const mockRepos = [
      { id: 1, name: 'my-project', html_url: 'https://github.com/user/my-project' },
      { id: 2, name: 'my-test-repo', html_url: 'https://github.com/user/my-test-repo' },
    ]

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRepos),
    })

    const repos = await getRepos()
    expect(repos).toHaveLength(1)
    expect(repos[0].name).toBe('my-project')
  })

  it('throws error when API returns non-ok response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    })

    await expect(getRepos()).rejects.toThrow('GitHub API error: 404 Not Found')
  })
})
