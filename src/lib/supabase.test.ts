import { describe, it, expect, vi, afterEach } from 'vitest'
import { submitContactForm, submitCVDownload, submitMonitoringEvent } from './supabase'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('submitContactForm', () => {
  it('envia dados corretos e retorna JSON', async () => {
    const mockJson = { id: 1, ok: true }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockJson,
    }))
    const result = await submitContactForm({ name: 'Ana', email: 'a@b.com', message: 'Oi' })
    expect(result).toEqual(mockJson)
    expect(fetch).toHaveBeenCalledWith('/api/pf/portifolio/public/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Ana', email: 'a@b.com', content: 'Oi' }),
    })
  })

  it('retorna null quando resposta não ok', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
    const result = await submitContactForm({ name: 'X', email: 'x@x.com', message: 'msg' })
    expect(result).toBeNull()
    expect(consoleSpy).toHaveBeenCalled()
  })

  it('retorna null em erro de rede', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')))
    const result = await submitContactForm({ name: 'X', email: 'x@x.com', message: 'msg' })
    expect(result).toBeNull()
    expect(consoleSpy).toHaveBeenCalled()
  })
})

describe('submitCVDownload', () => {
  it('envia POST com dados fornecidos', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
    await submitCVDownload({ name: 'Bob', email: 'b@c.com', consent: true })
    expect(fetch).toHaveBeenCalledWith('/api/pf/portifolio/public/cv-downloads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Bob', email: 'b@c.com', consent: true }),
    })
  })

  it('não lança em erro de rede', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('boom')))
    await expect(submitCVDownload({ consent: false })).resolves.toBeUndefined()
    expect(consoleSpy).toHaveBeenCalled()
  })
})

describe('submitMonitoringEvent', () => {
  it('envia evento com payload padrão', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
    await submitMonitoringEvent('page_view')
    expect(fetch).toHaveBeenCalledWith('/api/pf/portifolio/public/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: 'page_view', payload: {} }),
    })
  })

  it('envia evento com payload customizado', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
    await submitMonitoringEvent('click', { button: 'cta' })
    expect(fetch).toHaveBeenCalledWith('/api/pf/portifolio/public/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: 'click', payload: { button: 'cta' } }),
    })
  })

  it('silencioso em erro de rede', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('down')))
    await expect(submitMonitoringEvent('error')).resolves.toBeUndefined()
    // não deve lançar
  })
})
