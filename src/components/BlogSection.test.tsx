import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BlogSection } from './BlogSection'
import { LanguageContext } from '@/lib/i18n'
import type { ReactNode } from 'react'
import React from 'react'

function I18nWrapper({ children }: { children: ReactNode }) {
  const t = (key: string, fallback?: string) =>
    ({
      "blog.section.title": "▸ DO BLOG",
      "blog.latest": "ÚLTIMO POST",
      "blog.read": "Ler no LifeLog →",
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

describe('BlogSection', () => {
  const post = {
    title: 'O dashboard que encolheu 74%',
    url: 'https://lifelog-sepia.vercel.app/post/capivara-dashboard/',
  }

  it('renders nothing when post is null (fallback)', () => {
    const { container } = renderWithI18n(<BlogSection post={null} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders section title', () => {
    renderWithI18n(<BlogSection post={post} />)
    expect(screen.getByText(/DO BLOG/)).toBeInTheDocument()
  })

  it('renders the post title', () => {
    renderWithI18n(<BlogSection post={post} />)
    expect(screen.getByText('O dashboard que encolheu 74%')).toBeInTheDocument()
  })

  it('links to the post with target blank and safe rel', () => {
    renderWithI18n(<BlogSection post={post} />)
    const link = screen.getByRole('link', { name: /O dashboard que encolheu 74%/ })
    expect(link).toHaveAttribute('href', post.url)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('shows latest badge and read label', () => {
    renderWithI18n(<BlogSection post={post} />)
    expect(screen.getByText(/ÚLTIMO POST/)).toBeInTheDocument()
    expect(screen.getByText(/Ler no LifeLog/)).toBeInTheDocument()
  })
})
