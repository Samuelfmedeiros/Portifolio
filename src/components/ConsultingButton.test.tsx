import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ConsultingButton } from './ConsultingButton'

// Mock i18n — retorna traduções PT
vi.mock('@/lib/i18n', () => ({
  useLanguage: () => ({ t: (k: string) => ({
    'consulting.title': 'Consultoria Técnica',
    'consulting.stripe.label': 'Cartão (Internacional)',
    'consulting.mp.label': 'Pix, Boleto, Cartão',
  })[k] ?? k }),
}))

// Mock configs (ambos habilitados para testar o modo dual)
vi.mock('@/lib/stripe-consulting', () => ({
  STRIPE_CONSULTING_CONFIG: { enabled: true, paymentLink: 'https://buy.stripe.com/test' },
}))
vi.mock('@/lib/mercadopago-consulting', () => ({
  MP_CONSULTING_CONFIG: { enabled: true, paymentLink: 'https://mpago.li/test' },
}))

describe('ConsultingButton', () => {
  it('renders both gateways with i18n labels when both enabled', () => {
    render(<ConsultingButton />)
    // Modo dual: botão Stripe + botão MP (sem título central)
    expect(screen.getByText('Cartão (Internacional)')).toBeInTheDocument()
    expect(screen.getByText('Pix, Boleto, Cartão')).toBeInTheDocument()
  })

  it('does not render hardcoded PT strings in labels (regressão i18n)', () => {
    render(<ConsultingButton />)
    const text = document.body.textContent ?? ''
    // O componente NUNCA deve expor strings PT cruas fora do dicionário
    expect(text).not.toContain('Me contrate')
    expect(text).not.toContain('Solicitar orçamento')
  })
})
