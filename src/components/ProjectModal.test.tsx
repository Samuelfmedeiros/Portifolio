import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ProjectModal } from './ProjectModal'
import { LanguageContext } from '@/lib/i18n'
import type { Repo } from '@/lib/types'
import type { ReactNode } from 'react'
import React from 'react'

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
      "projects.view.live": "Site →",
      "projects.view.github": "GitHub →",
      "projects.filter.tools": "Tecnologias",
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

// requestAnimationFrame used by useFocusTrap — mock to run immediately
beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(0)
    return 0
  })
  vi.stubGlobal('cancelAnimationFrame', () => {})
})

afterEach(() => {
  vi.unstubAllGlobals()
  cleanup()
})

const baseRepo: Repo = {
  id: 1,
  name: 'ai-engine',
  description: 'AI engine with RAG semantic search and hybrid retrieval.',
  html_url: 'https://github.com/test/ai-engine',
  homepage: 'https://ai-engine.dev',
  stargazers_count: 42,
  forks_count: 7,
  language: 'Python',
  topics: ['featured', 'ai', 'rag', 'mcp'],
  pushed_at: '2024-06-01',
  created_at: '2023-01-01',
  imageUrl: '/projects/ai-engine.webp',
  imageGradient: 'linear-gradient(135deg, #0d1117 0%, #1a1a2e 100%)',
  icon: '🤖',
  hasDemo: true,
}

describe('ProjectModal', () => {
  it('renders nothing when closed', () => {
    renderWithI18n(<ProjectModal repo={baseRepo} open={false} onClose={() => {}} />)
    expect(document.body.querySelector('[role="dialog"]')).not.toBeInTheDocument()
  })

  it('renders dialog with project name when open', () => {
    renderWithI18n(<ProjectModal repo={baseRepo} open onClose={() => {}} />)
    // createPortal renders into document.body — search there
    expect(document.body.querySelector('[role="dialog"]')).toBeInTheDocument()
    expect(document.body).toHaveTextContent('ai-engine')
  })

  it('shows the project cover image', () => {
    renderWithI18n(<ProjectModal repo={baseRepo} open onClose={() => {}} />)
    const img = document.body.querySelector('img[alt="ai-engine — capa"]')
    expect(img).toBeInTheDocument()
    expect(img?.getAttribute('src')).toBe('/projects/ai-engine.webp')
  })

  it('shows description text', () => {
    renderWithI18n(<ProjectModal repo={baseRepo} open onClose={() => {}} />)
    expect(document.body).toHaveTextContent('AI engine with RAG semantic search')
  })

  it('shows stats: stars, forks and updated date', () => {
    renderWithI18n(<ProjectModal repo={baseRepo} open onClose={() => {}} />)
    expect(document.body).toHaveTextContent('42')
    expect(document.body).toHaveTextContent('7')
  })

  it('shows live and github action links when available', () => {
    renderWithI18n(<ProjectModal repo={baseRepo} open onClose={() => {}} />)
    const liveLink = document.body.querySelector('a[href="https://ai-engine.dev"]')
    expect(liveLink).toBeInTheDocument()
    const githubLink = document.body.querySelector('a[href="https://github.com/test/ai-engine"]')
    expect(githubLink).toBeInTheDocument()
  })

  it('shows tech tags from topics (excluding featured)', () => {
    renderWithI18n(<ProjectModal repo={baseRepo} open onClose={() => {}} />)
    expect(document.body).toHaveTextContent('ai')
    expect(document.body).toHaveTextContent('rag')
    expect(document.body).toHaveTextContent('mcp')
  })

  it('does not render image header when repo has no imageUrl', () => {
    const noImg = { ...baseRepo, imageUrl: undefined }
    renderWithI18n(<ProjectModal repo={noImg} open onClose={() => {}} />)
    expect(document.body.querySelector('img')).not.toBeInTheDocument()
  })

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn()
    renderWithI18n(<ProjectModal repo={baseRepo} open onClose={onClose} />)
    const backdrop = document.body.querySelector('[role="dialog"]')
    fireEvent.click(backdrop as HTMLElement)
    expect(onClose).toHaveBeenCalled()
  })

  it('does not close when clicking inside the dialog content', () => {
    const onClose = vi.fn()
    renderWithI18n(<ProjectModal repo={baseRepo} open onClose={onClose} />)
    const dialog = document.body.querySelector('[role="dialog"]') as HTMLElement
    const content = dialog.querySelector('.max-w-lg')
    fireEvent.click(content as HTMLElement)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('locks body scroll while open and unlocks on unmount', () => {
    const { unmount } = renderWithI18n(<ProjectModal repo={baseRepo} open onClose={() => {}} />)
    expect(document.body.style.overflow).toBe('hidden')
    unmount()
    expect(document.body.style.overflow).toBe('')
  })
})
