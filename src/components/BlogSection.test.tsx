import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BlogSection } from './BlogSection'
import { LanguageContext } from '@/lib/i18n'
import type { ReactNode } from 'react'
import React from 'react'

function I18nWrapper({ children, locale = "pt" }: { children: ReactNode; locale?: "pt" | "en" }) {
  const t = (key: string, fallback?: string) =>
    ({
      "blog.section.title": "▸ DO BLOG",
      "blog.latest": "ÚLTIMO POST",
      "blog.read": "Ler no LifeLog →",
    })[key] ?? fallback ?? key;

  return React.createElement(
    LanguageContext.Provider,
    { value: { locale, setLocale: () => {}, toggle: () => {}, t } },
    children
  );
}

function renderWithI18n(ui: React.ReactElement, locale?: "pt" | "en") {
  return render(React.createElement(I18nWrapper, { locale }, ui));
}

const posts = [
  {
    title: 'O dashboard que encolheu 74%',
    url: 'https://lifelog-sepia.vercel.app/post/capivara-dashboard/',
    date: 'Sat, 08 Aug 2026 19:00:00 GMT',
    excerpt: 'O Dashboard do Capivara tinha 994 linhas.',
    cover: 'https://lifelog-sepia.vercel.app/covers/capivara.webp',
    project: 'capivara',
    accent: '#f59e0b',
  },
  {
    title: 'O pool de conexões',
    url: 'https://lifelog-sepia.vercel.app/post/arachne-pool/',
    date: 'Sat, 08 Aug 2026 15:00:00 GMT',
    excerpt: 'O Arachne respondia 200.',
    cover: 'https://lifelog-sepia.vercel.app/covers/arachne-pool.webp',
    project: 'arachne',
    accent: '#7c3aed',
  },
  {
    title: 'Post EN',
    url: 'https://lifelog-sepia.vercel.app/post/en/capivara-dashboard/',
    date: 'Sat, 08 Aug 2026 19:00:00 GMT',
    excerpt: 'The Capivara Dashboard.',
    cover: 'https://lifelog-sepia.vercel.app/covers/capivara.webp',
    project: 'capivara',
    accent: '#f59e0b',
  },
]

describe('BlogSection', () => {
  it('renders nothing when posts is empty (fallback)', () => {
    const { container } = renderWithI18n(<BlogSection posts={[]} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders section title', () => {
    renderWithI18n(<BlogSection posts={posts} />)
    expect(screen.getByText(/DO BLOG/)).toBeInTheDocument()
  })

  it('renders post titles in PT locale (filtra /en/)', () => {
    renderWithI18n(<BlogSection posts={posts} />)
    expect(screen.getByText('O dashboard que encolheu 74%')).toBeInTheDocument()
    expect(screen.getByText('O pool de conexões')).toBeInTheDocument()
    expect(screen.queryByText('Post EN')).not.toBeInTheDocument()
  })

  it('renders EN posts when locale is en', () => {
    renderWithI18n(<BlogSection posts={posts} />, "en")
    expect(screen.getByText('Post EN')).toBeInTheDocument()
    expect(screen.queryByText('O dashboard que encolheu 74%')).not.toBeInTheDocument()
  })

  it('shows project badge with label', () => {
    renderWithI18n(<BlogSection posts={posts} />)
    expect(screen.getAllByText(/Capivara/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Arachne/).length).toBeGreaterThanOrEqual(1)
  })

  it('shows the cover image', () => {
    renderWithI18n(<BlogSection posts={posts} />)
    const img = document.querySelector('img[alt="O dashboard que encolheu 74%"]')
    expect(img).toBeInTheDocument()
    expect(img?.getAttribute('src')).toBe('https://lifelog-sepia.vercel.app/covers/capivara.webp')
  })

  it('shows excerpt and date', () => {
    renderWithI18n(<BlogSection posts={posts} />)
    expect(screen.getByText('O Dashboard do Capivara tinha 994 linhas.')).toBeInTheDocument()
    expect(screen.getAllByText(/ago/).length).toBeGreaterThanOrEqual(1)
  })

  it('links to the post with safe rel', () => {
    renderWithI18n(<BlogSection posts={posts} />)
    const link = screen.getByRole('link', { name: /O dashboard que encolheu 74%/ })
    expect(link).toHaveAttribute('href', posts[0].url)
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
