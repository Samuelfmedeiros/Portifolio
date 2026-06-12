import { describe, it, expect } from 'vitest'

describe('supabase', () => {
  it('exports null when env vars are missing', async () => {
    // The module reads env vars at import time, so we need to check the behavior
    // In test environment without env vars, supabase should be null
    const { supabase } = await import('./supabase')
    expect(supabase).toBeNull()
  })
})
