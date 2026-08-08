import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProjectHangar } from './ProjectHangar'
import { LanguageContext } from '@/lib/i18n'
import type { Repo } from '@/lib/types'
import type { ReactNode } from 'react'
import React from 'react'

// Mock monetization to avoid import issues
vi.mock('@/lib/monetization', () => ({
  getProjectAffiliates: () => [],
}))

// Mock next/image (renders a plain img in jsdom)
vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

// Wrapper with i18n mock translations
function I18nWrapper({ children }: { children: ReactNode }) {
  const t = (key: string, fallback?: string) =>
    ({
      "projects.section.title": "▸ PROJETOS",
      "projects.count": "{count} projetos",
      "projects.featured": "★ DESTAQUE",
      "projects.access": "▶ ACESSAR",
      "projects.powered_by": "powered by",
      "projects.filter.all": "Todos",
      "projects.filter.web": "Web",
      "projects.filter.data": "Dados",
      "projects.filter.ai": "IA",
      "projects.filter.devops": "DevOps",
      "projects.filter.tools": "Ferramentas",
      "projects.view.github": "GitHub →",
      "projects.view.live": "Site →",
      "projects.view.code": "Código →",
      "projects.empty": "Nenhum projeto encontrado",
      "modal.close": "Fechar",
    })[key] ?? fallback ?? key;

  return React.createElement(
    LanguageContext.Provider,
    { value: { locale: "pt" as const, setLocale: () => {}, toggle: () => {}, t } },
    children
  );
}

function renderWithI18n(ui: React.ReactElement) {
  return render(React.createElement(I18nWrapper, null, ui));
}

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

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    renderWithI18n(<ProjectHangar repos={mockRepos} />)
    expect(screen.getByText(/PROJETOS/)).toBeInTheDocument()
  })

  it('renders a section container', () => {
    const { container } = renderWithI18n(<ProjectHangar repos={mockRepos} />)
    expect(container.querySelector('section')).toBeInTheDocument()
  })

  it('renders all repo names', () => {
    renderWithI18n(<ProjectHangar repos={mockRepos} />)
    expect(screen.getByText('test-project')).toBeInTheDocument()
    expect(screen.getByText('portifolio')).toBeInTheDocument()
  })

  it('shows language indicator', () => {
    renderWithI18n(<ProjectHangar repos={mockRepos} />)
    // TypeScript appears twice (both repos), use getAllByText
    expect(screen.getAllByText('TypeScript').length).toBeGreaterThanOrEqual(1)
  })

  it('shows empty state when no repos', () => {
    renderWithI18n(<ProjectHangar repos={[]} />)
    expect(screen.getByText(/Nenhum projeto encontrado/)).toBeInTheDocument()
  })

  it('shows empty state when repos is null', () => {
    renderWithI18n(<ProjectHangar repos={null as unknown as Repo[]} />)
    expect(screen.getByText(/Nenhum projeto encontrado/)).toBeInTheDocument()
  })

  describe('filter bar', () => {
    const aiRepo: Repo = {
      id: 3,
      name: 'ai-engine',
      description: 'AI engine with rag and machine learning',
      html_url: 'https://github.com/test/ai-engine',
      homepage: null,
      stargazers_count: 5,
      forks_count: 1,
      language: 'Python',
      topics: ['featured', 'ai', 'rag'],
      pushed_at: '2024-01-01',
      created_at: '2024-01-01',
    }

    const dataRepo: Repo = {
      id: 4,
      name: 'data-dash',
      description: 'SQL analytics dashboard',
      html_url: 'https://github.com/test/data-dash',
      homepage: null,
      stargazers_count: 2,
      forks_count: 0,
      language: 'TypeScript',
      topics: ['data', 'sql'],
      pushed_at: '2024-01-01',
      created_at: '2024-01-01',
    }

    const all = [...mockRepos, aiRepo, dataRepo]

    it('renders filter buttons for available categories', () => {
      renderWithI18n(<ProjectHangar repos={all} />)
      expect(screen.getByRole('button', { name: 'Todos' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'IA' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Dados' })).toBeInTheDocument()
    })

    it('filters repos by AI category when clicked', async () => {
      renderWithI18n(<ProjectHangar repos={all} />)
      fireEvent.click(screen.getByRole('button', { name: 'IA' }))
      await waitFor(() => {
        expect(screen.getByText('ai-engine')).toBeInTheDocument()
        expect(screen.queryByText('test-project')).not.toBeInTheDocument()
        expect(screen.queryByText('portifolio')).not.toBeInTheDocument()
      })
    })

    it('filters repos by Dados category when clicked', async () => {
      renderWithI18n(<ProjectHangar repos={all} />)
      fireEvent.click(screen.getByRole('button', { name: 'Dados' }))
      await waitFor(() => {
        expect(screen.getByText('data-dash')).toBeInTheDocument()
        expect(screen.queryByText('test-project')).not.toBeInTheDocument()
      })
    })

    it('shows all repos when Todos filter is active', async () => {
      renderWithI18n(<ProjectHangar repos={all} />)
      fireEvent.click(screen.getByRole('button', { name: 'IA' }))
      await waitFor(() => {
        expect(screen.getByText('ai-engine')).toBeInTheDocument()
      })
      fireEvent.click(screen.getByRole('button', { name: 'Todos' }))
      await waitFor(() => {
        expect(screen.getByText('test-project')).toBeInTheDocument()
        expect(screen.getByText('ai-engine')).toBeInTheDocument()
        expect(screen.getByText('data-dash')).toBeInTheDocument()
      })
    })

    it('updates the count when filtered', async () => {
      renderWithI18n(<ProjectHangar repos={all} />)
      fireEvent.click(screen.getByRole('button', { name: 'IA' }))
      await waitFor(() => {
        expect(screen.getByText('1 projetos')).toBeInTheDocument()
      })
    })

    it('hides filter buttons with no matching projects', () => {
      renderWithI18n(<ProjectHangar repos={mockRepos} />)
      // mockRepos have no ai/data topics — DevOps/Tools also absent
      expect(screen.queryByRole('button', { name: 'IA' })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Ferramentas' })).not.toBeInTheDocument()
    })
  })
})
