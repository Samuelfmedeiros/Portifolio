import { describe, it, expect } from 'vitest'

describe('supabase', () => {
  it('exports a supabase client with fallback config', async () => {
    const { supabase } = await import('./supabase')
    expect(supabase).not.toBeNull()
    expect(supabase).toBeDefined()
  })
})
