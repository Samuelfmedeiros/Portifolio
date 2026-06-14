import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ProjectHangar } from './ProjectHangar'
import type { Repo } from '@/lib/types'

// Mock monetization to avoid import issues
vi.mock('@/lib/monetization', () => ({
  getProjectAffiliates: () => [],
}))

describe('ProjectHangar', () => {
  const mockRepos: Repo[] = [
    {
      id: 1,
      name: 'test-project',
      description: 'A test project',
      html_url: 'https://github.com/test/test-project',
      homepage: 'https://test-project.com',
      stargazers_count: 10,
      forks_count: 3,
      language: 'TypeScript',
      topics: [],
      pushed_at: '2024-01-01',
      created_at: '2024-01-01',
    },
    {
      id: 2,
      name: 'portifolio',
      description: 'Portfolio site',
      html_url: 'https://github.com/test/portifolio',
      homepage: null,
      stargazers_count: 50,
      forks_count: 10,
      language: 'TypeScript',
      topics: ['featured'],
      pushed_at: '2024-01-01',
      created_at: '2024-01-01',
    },
  ]

  it('renders without crashing', () => {
    render(<ProjectHangar repos={mockRepos} />)
    expect(screen.getByText(/PROJETOS/)).toBeInTheDocument()
  })

  it('renders a section container', () => {
    const { container } = render(<ProjectHangar repos={mockRepos} />)
    expect(container.querySelector('section')).toBeInTheDocument()
  })

  it('renders all repo names', () => {
    render(<ProjectHangar repos={mockRepos} />)
    expect(screen.getByText('test-project')).toBeInTheDocument()
    expect(screen.getByText('portifolio')).toBeInTheDocument()
  })

  it('shows language indicator', () => {
    render(<ProjectHangar repos={mockRepos} />)
    // TypeScript appears twice (both repos), use getAllByText
    expect(screen.getAllByText('TypeScript').length).toBeGreaterThanOrEqual(1)
  })

  it('shows empty state when no repos', () => {
    render(<ProjectHangar repos={[]} />)
    expect(screen.getByText(/Nenhum projeto encontrado/)).toBeInTheDocument()
  })

  it('shows empty state when repos is null', () => {
    render(<ProjectHangar repos={null as unknown as Repo[]} />)
    expect(screen.getByText(/Nenhum projeto encontrado/)).toBeInTheDocument()
  })
})
