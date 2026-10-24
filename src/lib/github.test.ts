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

  it('returns raw repos — curadoria é responsabilidade de isCuratedRepo', async () => {
    const mockRepos = [
      { id: 1, name: 'my-project', html_url: 'https://github.com/user/my-project' },
      { id: 2, name: 'my-test-repo', html_url: 'https://github.com/user/my-test-repo' },
    ]

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRepos),
    })

    // getRepos não filtra mais por nome: quem decide o que vira card é a
    // curadoria (src/lib/projectCuration.ts). Antes o filtro de "test" aqui
    // criava duas regras concorrentes e deixava passar repos sem capa.
    const repos = await getRepos()
    expect(repos).toHaveLength(2)
  })

  it('pede 100 por página (featured nunca cai por paginação) e não ordena por updated', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    })
    globalThis.fetch = fetchMock

    await getRepos()

    const url = String(fetchMock.mock.calls[0][0])
    expect(url).toContain('per_page=100')
    expect(url).not.toContain('sort=updated')
  })

  it('returns empty array when API returns non-ok response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    })

    const repos = await getRepos()
    expect(repos).toEqual([])
  })
})
