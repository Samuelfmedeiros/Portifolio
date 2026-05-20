import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { AnalyticsTracker } from '../AnalyticsTracker'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    rpc: vi.fn().mockResolvedValue({ error: null }),
  },
}))

describe('AnalyticsTracker', () => {
  it('renders null (no visible output)', () => {
    const { container } = render(<AnalyticsTracker />)
    expect(container.firstChild).toBeNull()
  })
})
