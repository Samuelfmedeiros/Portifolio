import { TermsModal } from '@/components/Footer'

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="mb-4 text-2xl font-bold">Termos de Uso</h1>
      <TermsModal open={true} onClose={() => {}} />
    </div>
  )
}