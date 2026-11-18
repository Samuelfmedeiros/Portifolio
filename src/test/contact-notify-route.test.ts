import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/contact-notify/route'

/**
 * Testa a rota REAL (`src/app/api/contact-notify/route.ts`).
 *
 * A versão anterior mockava `next/server` SEM exportar `NextRequest` e mockava
 * `@/lib/rate-limit` / `@/lib/capivara-api` — módulos que esta rota não usa (ela
 * tem rate limiter próprio e chama `fetch` direto). Resultado: 7 testes falhavam
 * com `No "NextRequest" export is defined on the "next/server" mock`, antes de
 * exercitar validação, escaping ou rate limit.
 * Aqui o `fetch` global é o mock e o rate limit real roda.
 */
const chamar = (body: unknown, ip = '10.0.0.1') =>
  POST(
    new NextRequest(
      new Request('http://localhost/api/contact-notify', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
        body: JSON.stringify(body),
      }),
    ),
  )

const respostaOk = () =>
  new Response(JSON.stringify({ id: 'msg_1' }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })

describe('/api/contact-notify (POST)', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    fetchMock.mockImplementation(async () => respostaOk())
    vi.stubGlobal('fetch', fetchMock)
    vi.stubEnv('RESEND_API_KEY', '')
    vi.stubEnv('TELEGRAM_BOT_TOKEN', '')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('returns 400 when required fields are missing', async () => {
    const res = await chamar({ name: 'Ana' }, '10.0.0.2')
    expect(res.status).toBe(400)
    expect(await res.json()).toMatchObject({ error: 'Missing fields' })
  })

  it('aceita payload completo e devolve success', async () => {
    const res = await chamar(
      { name: 'Ana', email: 'ana@example.com', content: 'Oi, tudo bem?' },
      '10.0.0.3',
    )
    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({ success: true })
    expect(fetchMock).toHaveBeenCalled()
  })

  it('returns 429 when rate limit is exceeded', async () => {
    const ip = '10.0.0.4'
    const payload = { name: 'Ana', email: 'ana@example.com', content: 'spam' }
    for (let i = 0; i < 5; i++) {
      const res = await chamar(payload, ip)
      expect(res.status).toBe(200)
    }
    const bloqueado = await chamar(payload, ip)
    expect(bloqueado.status).toBe(429)
  })

  it('escapes HTML nos campos antes de montar o e-mail', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test_123')
    const res = await chamar(
      {
        name: '<script>alert(1)</script>',
        email: 'x@example.com',
        content: '<img src=x onerror=alert(1)>',
      },
      '10.0.0.5',
    )
    expect(res.status).toBe(200)

    const resend = fetchMock.mock.calls.find(([url]) => String(url).includes('api.resend.com'))
    expect(resend, 'o e-mail do Resend precisa ter sido disparado').toBeTruthy()
    const init = (resend as unknown[])[1] as { body: string }
    const corpo = JSON.parse(init.body)
    expect(corpo.html).toContain('&lt;script&gt;')
    expect(corpo.html).not.toContain('<script>alert(1)</script>')
    expect(corpo.html).toContain('&lt;img src=x onerror=alert(1)&gt;')
  })
})
