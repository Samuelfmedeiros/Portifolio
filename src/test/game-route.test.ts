import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

/**
 * Mock de `fs` via factory hoisted.
 *
 * A versão anterior fazia `import * as fs from 'fs'` + `vi.mock('fs')` e depois
 * atribuía `mockFs.readFileSync = mockReadFileSync`. Em ESM o namespace do módulo
 * é read-only: o beforeEach estourava com
 * `TypeError: Cannot assign to property 'readFileSync' of [object Module]` e os
 * 13 testes falhavam antes de exercitar a rota. `vi.hoisted` + factory entrega
 * as mesmas funções sem escrever no namespace.
 *
 * `path` NÃO é mockado: o `path.join` real é determinístico e o teste controla o
 * resultado pela resposta de `existsSync`.
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

import { GET } from '@/app/api/game/[slug]/route'

const createRequest = (url: string) => new NextRequest(new Request(url))

const chamar = (slug: string, url = `http://localhost/api/game/${slug}`) =>
  GET(createRequest(url), { params: Promise.resolve({ slug }) })

describe('/api/game/[slug]', () => {
  beforeEach(() => {
    mocks.existsSync.mockReset()
    mocks.readFileSync.mockReset()
  })

  describe('path sanitization', () => {
    it('rejects directory traversal with ../', async () => {
      const res = await chamar('../etc/passwd')
      expect(res.status).toBe(400)
    })

    it('rejects directory traversal with ..\\', async () => {
      const res = await chamar('..\\windows\\system32')
      expect(res.status).toBe(400)
    })

    it('rejects absolute paths starting with /', async () => {
      const res = await chamar('/etc/passwd', 'http://localhost/api/game//etc/passwd')
      expect(res.status).toBe(400)
    })

    it('rejects absolute paths starting with \\', async () => {
      const res = await chamar('\\windows\\system32')
      expect(res.status).toBe(400)
    })

    it('accepts valid slug without traversal', async () => {
      mocks.existsSync.mockReturnValue(true)
      mocks.readFileSync.mockReturnValue('<html><body>Game</body></html>')

      const res = await chamar('valid-game')
      expect(res.status).toBe(200)
      expect(res.headers.get('content-type')).toContain('text/html')
    })

    it('returns 404 when game directory does not exist', async () => {
      mocks.existsSync.mockReturnValue(false)

      const res = await chamar('nonexistent')
      expect(res.status).toBe(404)
    })
  })

  describe('HTML validation guard', () => {
    const casos: Array<[string, string]> = [
      ['<', '<html><body>Valid Game</body></html>'],
      ['DOCTYPE', '<!DOCTYPE html><html><body>Game</body></html>'],
      ['leading whitespace', '   <html><body>Game</body></html>'],
      ['BOM', '\uFEFF<html><body>Game</body></html>'],
    ]

    for (const [nome, conteudo] of casos) {
      it(`accepts valid HTML with ${nome}`, async () => {
        mocks.existsSync.mockReturnValue(true)
        mocks.readFileSync.mockReturnValue(conteudo)

        const res = await chamar('valid')
        expect(res.status).toBe(200)
      })
    }

    const invalidos: Array<[string, string]> = [
      ['non-HTML content (plain text)', 'This is not HTML'],
      ['JSON content', '{"key": "value"}'],
      ['empty file', ''],
    ]

    for (const [nome, conteudo] of invalidos) {
      it(`rejects ${nome}`, async () => {
        mocks.existsSync.mockReturnValue(true)
        mocks.readFileSync.mockReturnValue(conteudo)

        const res = await chamar('invalid')
        expect(res.status).toBe(500)
      })
    }
  })
})
