'use client'

import { PrivacyModal } from '@/components/Footer'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/i18n'
import { useState } from 'react'

export default function TermosPage() {
  const router = useRouter()
  const { t } = useLanguage()
  // A pagina e dona da aba ativa: sem estado local o modal abriria
  // sempre fixo e o clique na outra aba nao teria onde escrever
  // (TS2741 - onTabChange e prop obrigatoria do PrivacyModal).
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('terms')
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="mb-4 text-2xl font-bold">{t("legal.page.terms.title")}</h1>
      <PrivacyModal open={true} onClose={() => router.push('/')} activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}