'use client'

import { PrivacyModal } from '@/components/Footer'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/i18n'

export default function PrivacidadePage() {
  const router = useRouter()
  const { t } = useLanguage()
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="mb-4 text-2xl font-bold">{t("legal.page.privacy.title")}</h1>
      <PrivacyModal open={true} onClose={() => router.push('/')} activeTab="privacy" />
    </div>
  )
}