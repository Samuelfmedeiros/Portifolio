import { describe, it, expect } from 'vitest'
import { hashName, monogram, fallbackGeometry } from './coverFallback'

describe('coverFallback', () => {
  describe('hashName', () => {
    it('is deterministic for the same input', () => {
      expect(hashName('roger-mlops')).toBe(hashName('roger-mlops'))
    })

    it('differs across project names', () => {
      expect(hashName('roger-mlops')).not.toBe(hashName('roger-loop'))
    })

    it('returns an unsigned 32-bit integer', () => {
      for (const n of ['a', 'roger-mlops', 'seu.pet', 'uma-string-bem-longa-de-teste']) {
        const h = hashName(n)
        expect(Number.isInteger(h)).toBe(true)
        expect(h).toBeGreaterThanOrEqual(0)
        expect(h).toBeLessThanOrEqual(0xffffffff)
      }
    })
  })

  describe('monogram', () => {
    it('takes the first letter of two segments', () => {
      expect(monogram('roger-mlops')).toBe('RM')
      expect(monogram('roger-loop')).toBe('RL')
      expect(monogram('seu.pet')).toBe('SP')
      expect(monogram('memory_matrix')).toBe('MM')
    })

    it('uses the first two characters for a single word', () => {
      expect(monogram('storydesk')).toBe('ST')
      expect(monogram('Arachne')).toBe('AR')
    })

    it('is always two uppercase characters', () => {
      for (const n of ['roger-mlops', 'storydesk', 'seu.pet', 'x', 'projeto-novo-2026']) {
        expect(monogram(n)).toMatch(/^[A-Z0-9]{1,2}$/)
      }
    })

    it('never returns an empty string', () => {
      expect(monogram('')).toBe('??')
      expect(monogram('---')).toBe('??')
    })
  })

  describe('fallbackGeometry', () => {
    it('is stable for the same name (no flicker between renders)', () => {
      const a = fallbackGeometry('roger-mlops')
      const b = fallbackGeometry('roger-mlops')
      expect(a).toEqual(b)
    })

    it('produces different geometry for different names', () => {
      const a = fallbackGeometry('roger-mlops')
      const b = fallbackGeometry('roger-loop')
      expect(a.ringRotation).not.toBe(b.ringRotation)
    })

    it('keeps radii ordered outer > middle > inner', () => {
      for (const n of ['roger-mlops', 'storydesk', 'seu.pet', 'lifelog']) {
        const [r1, r2, r3] = fallbackGeometry(n).radii
        expect(r1).toBeGreaterThan(r2)
        expect(r2).toBeGreaterThan(r3)
        expect(r3).toBeGreaterThan(0)
      }
    })

    it('keeps the ring rotation inside 0-359 degrees', () => {
      for (const n of ['roger-mlops', 'storydesk', 'seu.pet', 'lifelog']) {
        const r = fallbackGeometry(n).ringRotation
        expect(r).toBeGreaterThanOrEqual(0)
        expect(r).toBeLessThan(360)
      }
    })

    it('places nodes inside the 100x100 viewBox', () => {
      for (const n of ['roger-mlops', 'storydesk', 'seu.pet']) {
        for (const node of fallbackGeometry(n).nodes) {
          expect(node.x).toBeGreaterThanOrEqual(0)
          expect(node.x).toBeLessThanOrEqual(100)
          expect(node.y).toBeGreaterThanOrEqual(0)
          expect(node.y).toBeLessThanOrEqual(100)
          expect(node.r).toBeGreaterThan(0)
        }
      }
    })
  })
})
