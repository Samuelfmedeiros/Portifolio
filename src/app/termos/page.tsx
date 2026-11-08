'use client'

import { PrivacyContent } from '@/components/Footer'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'
import { useState } from 'react'

/**
 * /termos — pagina real, nao modal (mesma cura de /privacidade, 08/11/2026).
 * O PrivacyModal com open={true} cobria a navbar com backdrop z-[9998].
 */
export default function TermosPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('terms')

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
        >
          ← {t("legal.page.back", "Voltar ao início")}
        </Link>
        <h1 className="mb-2 text-2xl font-bold md:text-3xl">
          {t("legal.page.terms.title")}
        </h1>
        <div className="glass mt-6 rounded-xl border border-[var(--border)]/50 p-6 md:p-8">
          <PrivacyContent activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
    </div>
  )
}
