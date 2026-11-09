'use client'

import { PrivacyContent } from '@/components/Footer'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'
import { useState } from 'react'

/**
 * /privacidade — pagina real, nao modal.
 *
 * Antes (ate 08/11/2026) esta rota montava <PrivacyModal open={true} />, cujo
 * backdrop `fixed inset-0 z-[9998]` + painel `z-[9999]` cobriam a navbar
 * (z-50): o visitante abria /privacidade e nao conseguia mais navegar nem
 * voltar — o sintoma relatado como "a navbar nao acompanha ao rolar".
 * Agora o texto legal renderiza INLINE no fluxo da pagina e a navbar
 * permanece visivel e clicavel.
 */
export default function PrivacidadePage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy')

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
          {t("legal.page.privacy.title")}
        </h1>
        <div className="glass mt-6 rounded-xl border border-[var(--border)]/50 p-6 md:p-8">
          <PrivacyContent activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
    </div>
  )
}
