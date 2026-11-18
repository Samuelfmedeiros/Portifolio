import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

/**
 * Testa a rota REAL (`src/app/api/download-cv/route.ts`), que é **POST**.
 *
 * A versão anterior importava `{ GET }` e mockava `@/lib/rate-limit`,
 * `@/lib/cv-download-log` e `@/lib/capivara-api` — nada disso é usado pela rota,
 * que tem rate limiter próprio e chama `fetch` direto. Todos os 8 testes
 * falhavam com `GET is not a function` antes de tocar em validação ou no PDF.
 */
const mocks = vi.hoisted(() => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
}))

vi.mock('fs', () => ({
  default: { existsSync: mocks.existsSync, readFileSync: mocks.readFileSync },
  existsSync: mocks.existsSync,
  readFileSync: mocks.readFileSync,
}))

import { POST } from '@/app/api/download-cv/route'

const chamar = (body: unknown, ip = '10.10.0.1', ua = 'Mozilla/5.0 Test') =>
  POST(
    new NextRequest(
      new Request('http://localhost/api/download-cv', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-forwarded-for': ip, 'user-agent': ua },
        body: JSON.stringify(body),
      }),
    ),
  )

const respostaOk = () =>
  new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })

describe('/api/download-cv (POST)', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    mocks.existsSync.mockReset().mockReturnValue(true)
    mocks.readFileSync.mockReset().mockReturnValue(Buffer.from('%PDF-1.7 fake'))
    fetchMock.mockReset()
    fetchMock.mockImplementation(async () => respostaOk())
    vi.stubGlobal('fetch', fetchMock)
    vi.stubEnv('TELEGRAM_BOT_TOKEN', '')
    vi.stubEnv('RESEND_API_KEY', '')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('returns 400 when consent is missing', async () => {
    const res = await chamar({ locale: 'pt' }, '10.10.0.2')
    expect(res.status).toBe(400)
    expect(await res.json()).toMatchObject({ error: 'Consentimento é obrigatório' })
  })

  it('returns 429 when rate limit exceeded', async () => {
    const ip = '10.10.0.3'
    const payload = { locale: 'pt', consent: true }
    for (let i = 0; i < 5; i++) {
      expect((await chamar(payload, ip)).status).toBe(200)
    }
    expect((await chamar(payload, ip)).status).toBe(429)
  })

  it('returns 404 when o PDF não existe no disco', async () => {
    mocks.existsSync.mockReturnValue(false)
    const res = await chamar({ locale: 'pt', consent: true }, '10.10.0.4')
    expect(res.status).toBe(404)
    expect(await res.json()).toMatchObject({ error: 'Currículo não encontrado' })
  })

  it('entrega PDF e filename da versão Dados & BI (pt)', async () => {
    const res = await chamar({ locale: 'pt', consent: true }, '10.10.0.5')
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('application/pdf')
    expect(res.headers.get('content-disposition')).toContain('Samuel_Andrade_Dados_2026.pdf')
  })

  it('entrega a versão Full Stack em inglês quando variant=fullstack', async () => {
    const res = await chamar(
      { locale: 'en', consent: true, variant: 'fullstack' },
      '10.10.0.6',
    )
    expect(res.status).toBe(200)
    expect(res.headers.get('content-disposition')).toContain(
      'Samuel_Andrade_Resume_FullStack_2026.pdf',
    )
  })

  it('registra o download no Capivara com o user agent recebido', async () => {
    await chamar({ locale: 'pt', consent: true, name: 'Ana' }, '10.10.0.7', 'UA-do-teste')
    const capivara = fetchMock.mock.calls.find(([url]) =>
      String(url).includes('cv-downloads'),
    )
    expect(capivara, 'o POST para /cv-downloads precisa acontecer').toBeTruthy()
    const init = (capivara as unknown[])[1] as { body: string }
    const corpo = JSON.parse(init.body)
    expect(corpo.user_agent).toBe('UA-do-teste')
    expect(corpo.name).toBe('Ana')
  })
})
