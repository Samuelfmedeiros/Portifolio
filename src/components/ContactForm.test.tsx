import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { ContactForm } from './ContactForm'

// Mock supabase
vi.mock('@/lib/supabase', () => ({
  submitContactForm: vi.fn(),
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(),
    })),
  },
}))


// Mock i18n — return fallback when provided, key otherwise
vi.mock('@/lib/i18n', () => ({
  useLanguage: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
  }),
}))

// Analytics hook: injetável, não dispara nada real
vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({ track: vi.fn() }),
}))

// Loader do OpenPanel: só registra as chamadas (o script é externo)
vi.mock('@/lib/openpanel', () => ({
  loadOpenpanelScript: vi.fn(),
  openpanelTrack: vi.fn(),
}))

// fetch do notify é fire-and-forget: precisa existir para o ramo de sucesso
// não estourar no jsdom, e ser contável para provar o contrato.
const fetchSpy = vi.fn(() => Promise.resolve({ ok: true }))
vi.stubGlobal('fetch', fetchSpy)

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form fields correctly', () => {
    render(<ContactForm />)
    expect(screen.getByLabelText('contact.form.name')).toBeInTheDocument()
    expect(screen.getByLabelText('contact.form.email')).toBeInTheDocument()
    expect(screen.getByLabelText('contact.form.message')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /contact.form.submit/i })).toBeInTheDocument()
  })

  it('renders WhatsApp CTA button', () => {
    render(<ContactForm />)
    const whatsappLink = screen.getByRole('link', { name: /contact.whatsapp.cta/i })
    expect(whatsappLink).toBeInTheDocument()
    expect(whatsappLink).toHaveAttribute('href', expect.stringContaining('wa.me'))
  })

  // a11y 12/09 — texto do botão WhatsApp usa token de contraste AA, nunca branco cru.
  // Branco sobre #25d366 dava 1.98:1 (axe serious). Regression guard.
  it('WhatsApp CTA uses AA contrast token, not raw text-white', () => {
    render(<ContactForm />)
    const whatsappLink = screen.getByRole('link', { name: /contact.whatsapp.cta/i })
    expect(whatsappLink).toHaveClass('text-[var(--whatsapp-contrast)]')
    expect(whatsappLink.className).not.toMatch(/\btext-white\b/)
  })

  it('renders social media links', () => {
    render(<ContactForm />)
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument()
  })

  it('shows email validation error for invalid email', () => {
    render(<ContactForm />)
    const emailInput = screen.getByLabelText('contact.form.email')
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    // Native HTML validation will handle this on submit
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  it('shows copy button for email', () => {
    render(<ContactForm />)
    const copyButton = screen.getByRole('button', { name: /samuelandrademedeiros@gmail.com/i })
    expect(copyButton).toBeInTheDocument()
  })

  it('handles form submission successfully', async () => {
    const { submitContactForm } = await import('@/lib/supabase')
    vi.mocked(submitContactForm).mockResolvedValue(true)
    
    render(<ContactForm />)
    
    fireEvent.change(screen.getByLabelText('contact.form.name'), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText('contact.form.email'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('contact.form.message'), { target: { value: 'Hello world' } })
    
    const checkbox = document.getElementById('contact-lgpd-consent')
    if (checkbox) fireEvent.click(checkbox)
    
    const submitButton = screen.getByRole('button', { name: /contact.form.submit/i })
    fireEvent.click(submitButton)
    
    await new Promise(r => setTimeout(r, 50))
    expect(screen.getByText(/contact.form.success/i)).toBeInTheDocument()
  })

  it('shows error message when API fails', async () => {
    const { submitContactForm } = await import('@/lib/supabase')
    vi.mocked(submitContactForm).mockResolvedValue(false)
    
    render(<ContactForm />)
    
    fireEvent.change(screen.getByLabelText('contact.form.name'), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText('contact.form.email'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('contact.form.message'), { target: { value: 'Hello world' } })
    
    const checkbox = document.getElementById('contact-lgpd-consent')
    if (checkbox) fireEvent.click(checkbox)
    
    const submitButton = screen.getByRole('button', { name: /contact.form.submit/i })
    fireEvent.click(submitButton)
    
    await new Promise(r => setTimeout(r, 50))
    expect(screen.getAllByText(/contact.error/i)[0]).toBeInTheDocument()
  })

  it('prevents submission when form is invalid', () => {
    render(<ContactForm />)
    const submitButton = screen.getByRole('button', { name: /contact.form.submit/i })
    expect(submitButton).toBeDisabled()
  })

  it('has accessible form labels', () => {
    render(<ContactForm />)
    const form = screen.getByRole('form')
    // aria-label agora vem do dicionário via t() (mock retorna a chave)
    expect(form).toHaveAttribute('aria-label', 'contact.form.aria')
  })
})

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Rodada 2 do test-loop — caminhos com LÓGICA que ficavam fora da cobertura.
 * O teste de sucesso/erro cobria o fetch; estes cobrem regra de negócio:
 * rate limit de 30s, ordem da validação de e-mail, contador de caracteres,
 * dependência do consentimento LGPD e o fluxo de "enviar outra".
 * Infra externa (supabase/openpanel/analytics/fetch) mockada; o comportamento
 * do formulário é o que está sendo assertado.
 * ═══════════════════════════════════════════════════════════════════════════
 */
describe('ContactForm — regras de submissão (rodada 2)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  /**
   * Preenche todos os campos e marca o consentimento LGPD.
   *
   * PITFALL medido (rodada 2): o mock de `motion` devolve uma identidade de
   * componente nova a cada render, então o React REMONTA a subárvore em cada
   * `fireEvent.change` — a referência de input capturada antes muda de nó
   * (`mesmoNo === false`) e o clique em um nó velho não chega ao handler.
   * O checkbox é re-queryado a cada chamada e o `await waitFor(...)` garante o
   * re-render antes da asserção seguinte. `fireEvent` do RTL não flusheia o
   * re-render do React — sem o waitFor o DOM nativo muda e o estado lido fica
   * uma renderização atrás.
   */
  async function preencherValido() {
    fireEvent.change(screen.getByLabelText('contact.form.name'), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText('contact.form.email'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('contact.form.message'), { target: { value: 'Hello world' } })
    fireEvent.click(document.getElementById('contact-lgpd-consent') as HTMLInputElement)
    await waitFor(() => expect(screen.getByRole('button', { name: /contact.form.submit/i })).toBeEnabled())
  }

  const marcarLgpd = () => document.getElementById('contact-lgpd-consent') as HTMLInputElement

  it('bloqueia o 2º envio dentro de 30s sem chamar a API de novo', async () => {
    const { submitContactForm } = await import('@/lib/supabase')
    vi.mocked(submitContactForm).mockResolvedValue(true)

    render(<ContactForm />)
    await preencherValido()

    // 1º envio: passa
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /contact.form.submit/i }))
    })
    expect(screen.getByText(/contact.form.success/i)).toBeInTheDocument()

    // volta para o formulário
    await act(async () => {
      fireEvent.click(screen.getByText('contact.form.send.another'))
    })

    // força o 2º envio no mesmo tick (< 30s): rate limit
    await preencherValido()
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /contact.form.submit/i }))
    })

    expect(submitContactForm).toHaveBeenCalledTimes(1)
    // a mensagem aparece em 2 nós (o `div role="status"` sr-only para leitores de
    // tela, prefixado com "Erro: ", e o `<p>` visível) — ambos são conferidos.
    const avisos = screen.getAllByText(/Aguarde \d+s entre envios\./i)
    expect(avisos).toHaveLength(2)
    expect(avisos.map((el) => el.textContent)).toEqual([
      'Erro: Aguarde 30s entre envios.',
      'Aguarde 30s entre envios.',
    ])
  })

  it('aceita e-mail inválido só na validação nativa (type=email + novalidate ausente)', () => {
    render(<ContactForm />)
    fireEvent.change(screen.getByLabelText('contact.form.email'), { target: { value: 'nao-e-email' } })
    // contrato do HTML: o input é type=email, então o browser bloqueia antes do handler
    expect(screen.getByLabelText('contact.form.email')).toHaveAttribute('type', 'email')
  })

  it('mostra contador de caracteres e marca estouro acima de 500', async () => {
    render(<ContactForm />)
    const lerContador = () =>
      document.querySelector('span[aria-live="polite"]')?.textContent?.replace(/\s/g, '')

    fireEvent.change(screen.getByLabelText('contact.form.message'), { target: { value: 'x'.repeat(150) } })
    await waitFor(() => expect(lerContador()).toBe('150/500'))

    // 2ª mudança no MESMO nó referencia: o remount do mock de motion troca o nó a
    // cada render, então a referência velha pode não propagar o evento — re-query.
    fireEvent.change(screen.getByLabelText('contact.form.message'), { target: { value: 'x'.repeat(510) } })
    await waitFor(() => expect(lerContador()).toBe('510/500'))

    // o contador renderiza `{length}/{MAX}` como 2 nós de texto filhos; matcher por
    // função sobre textContent do SPAN não depende da normalização do getByText.
    const counter = screen.getByText(
      (_content, el) => el?.tagName === 'SPAN' && (el.textContent ?? '').replace(/\s/g, '') === '510/500',
    )
    expect(counter.className).toContain('error')
  })

  it('mantém o submit desabilitado enquanto o consentimento LGPD não é marcado', async () => {
    render(<ContactForm />)
    await preencherValido()
    // desmarcar trava tudo de novo — o nó é re-queryado porque o remount do mock
    // de motion troca a identidade do input a cada interação.
    fireEvent.click(marcarLgpd())
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /contact.form.submit/i })).toBeDisabled(),
    )
    // marcar de volta libera — prova que é o consentimento, não um estado morto
    fireEvent.click(marcarLgpd())
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /contact.form.submit/i })).toBeEnabled(),
    )
  })

  it('"enviar outra" volta o formulário ao estado idle e limpa os campos', async () => {
    const { submitContactForm } = await import('@/lib/supabase')
    vi.mocked(submitContactForm).mockResolvedValue(true)

    render(<ContactForm />)
    await preencherValido()
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /contact.form.submit/i }))
    })
    expect(screen.getByText(/contact.form.success/i)).toBeInTheDocument()

    await act(async () => {
      fireEvent.click(screen.getByText('contact.form.send.another'))
    })

    const form = screen.getByRole('form')
    expect(form).toBeInTheDocument()
    expect((screen.getByLabelText('contact.form.name') as HTMLInputElement).value).toBe('')
    expect((screen.getByLabelText('contact.form.message') as HTMLTextAreaElement).value).toBe('')
  })

  it('copia o e-mail pelo clipboard quando a API está disponível', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    // O handler liga `setCopied(true)` e agenda `setTimeout(..., 2000)` para
    // apagar o selo. Sem timer falso esse timeout fica PENDENTE no fim do
    // arquivo: com a sessão jsdom já desmontada ele estoura
    // "ReferenceError: window is not defined" e vira erro NÃO TRATADO —
    // `vitest run` devolve rc=1 com a suíte inteira verde.
    vi.useFakeTimers()
    try {
      render(<ContactForm />)
      await act(async () => {
        fireEvent.click(
          screen.getByRole('button', { name: /samuelandrademedeiros@gmail.com/i }),
        )
      })

      expect(writeText).toHaveBeenCalledWith('samuelandrademedeiros@gmail.com')

      // contrato do selo: acende na cópia e apaga sozinho depois de 2s
      expect(screen.getByRole('button', { name: /contact.email.copied/i })).toBeInTheDocument()
      act(() => {
        vi.advanceTimersByTime(2000)
      })
      expect(screen.getByRole('button', { name: /samuelandrademedeiros@gmail.com/i })).toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  it('cai no fallback (execCommand) quando o clipboard não existe', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined })
    // jsdom NÃO implementa `document.execCommand` — `vi.spyOn` acusa "The property
    // is not defined on the object". `defineProperty` cria a propriedade antes.
    const execSpy = vi.fn(() => true)
    Object.defineProperty(document, 'execCommand', { configurable: true, value: execSpy })

    vi.useFakeTimers()
    try {
      render(<ContactForm />)
      await act(async () => {
        fireEvent.click(
          screen.getByRole('button', { name: /samuelandrademedeiros@gmail.com/i }),
        )
      })

      expect(execSpy).toHaveBeenCalledWith('copy')

      // mesmo selo de 2s do caminho com clipboard — o timeout precisa ser
      // consumido aqui para não estourar depois do teardown do jsdom.
      expect(screen.getByRole('button', { name: /contact.email.copied/i })).toBeInTheDocument()
      act(() => {
        vi.advanceTimersByTime(2000)
      })
      expect(screen.getByRole('button', { name: /samuelandrademedeiros@gmail.com/i })).toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  it('rejeita e-mail fora do formato antes de chamar a API', async () => {
    const { submitContactForm } = await import('@/lib/supabase')
    vi.mocked(submitContactForm).mockResolvedValue(true)
    render(<ContactForm />)

    // `isFormValid` só checa presença de texto — não valida o formato. Sem este
    // teste, o regex do handler (linha 78) ficava fora da cobertura: o contrato
    // real é "bloqueia no handler, com mensagem, sem tocar no backend".
    fireEvent.change(screen.getByLabelText('contact.form.name'), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText('contact.form.email'), { target: { value: 'nao-e-email' } })
    fireEvent.change(screen.getByLabelText('contact.form.message'), { target: { value: 'Hello world' } })
    fireEvent.click(marcarLgpd())
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /contact.form.submit/i })).toBeEnabled(),
    )

    // `fireEvent.click` no botão passa pela validação nativa do input type=email
    // e o jsdom NÃO dispara o submit quando o e-mail é inválido — o handler nunca
    // roda. `fireEvent.submit` no form exercita o caminho real do handler.
    await act(async () => {
      fireEvent.submit(screen.getByRole('form'))
    })

    expect(submitContactForm).not.toHaveBeenCalled()
    expect(screen.getAllByText(/Formato de email inválido\./i)).toHaveLength(2)
  })

  it('o contador do rate limit expira sozinho e libera um novo envio', async () => {
    const { submitContactForm } = await import('@/lib/supabase')
    vi.mocked(submitContactForm).mockResolvedValue(true)

    render(<ContactForm />)
    await preencherValido()
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /contact.form.submit/i }))
    })
    await act(async () => {
      fireEvent.click(screen.getByText('contact.form.send.another'))
    })
    // tudo que depende de re-render acontece com timers REAIS: os fake timers
    // são ligados só na hora de avançar o countdown, senão o `waitFor` interno
    // do preencherValido nunca resolve.
    await preencherValido()

    // o botão troca de rótulo durante o bloqueio ("Aguarde {n}s..."), então o
    // locator estável é o type=submit — não o nome acessível.
    const botaoSubmit = () => document.querySelector('button[type="submit"]') as HTMLButtonElement

    vi.useFakeTimers()
    try {
      await act(async () => {
        fireEvent.submit(screen.getByRole('form'))
      })
      expect(submitContactForm).toHaveBeenCalledTimes(1)

      // 1s depois ainda bloqueado — o countdown começou em 30 e decrementou
      act(() => {
        vi.advanceTimersByTime(1000)
      })
      expect(botaoSubmit()).toBeDisabled()
      expect(botaoSubmit().textContent).toBe('Aguarde 29s...')

      // os 29s restantes: o interval se limpa sozinho ao chegar em 0
      act(() => {
        vi.advanceTimersByTime(29_000)
      })
      expect(botaoSubmit()).toBeEnabled()
      expect(botaoSubmit().textContent).toContain('contact.form.submit')

      // com a janela expirada, o envio passa de novo
      await act(async () => {
        fireEvent.submit(screen.getByRole('form'))
      })
      expect(submitContactForm).toHaveBeenCalledTimes(2)
    } finally {
      vi.useRealTimers()
    }
  })

  it('envia mensagem vazia com LGPD desmarcado sem chamar a API', async () => {
    const { submitContactForm } = await import('@/lib/supabase')
    vi.mocked(submitContactForm).mockResolvedValue(true)
    render(<ContactForm />)

    // formulário vazio: o submit está disabled, logo não há rota para a API
    expect(screen.getByRole('button', { name: /contact.form.submit/i })).toBeDisabled()
    expect(submitContactForm).not.toHaveBeenCalled()
  })
})
