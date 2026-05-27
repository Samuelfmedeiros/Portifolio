'use client'

import { PrivacyModal } from '@/components/Footer'
import { useRouter } from 'next/navigation'

export default function PrivacidadePage() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="mb-4 text-2xl font-bold">Política de Privacidade</h1>
      <PrivacyModal open={true} onClose={() => router.push('/')} activeTab="privacy" />
    </div>
  )
}