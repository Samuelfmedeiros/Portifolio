import { render, screen, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { AppWrapper } from './AppWrapper'

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, { get: (_, p) => ({ children, ...rest }: any) => <div {...rest}>{children}</div> }),
  AnimatePresence: ({ children }: any) => children,
  useInView: () => true,
}))

vi.mock('./SplashScreen', () => ({
  SplashScreen: ({ onComplete }: { onComplete: () => void }) => (
    <div data-testid="splash-screen">
      <button onClick={onComplete}>Complete</button>
    </div>
  ),
}))

describe('AppWrapper', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders children', () => {
    render(
      <AppWrapper>
        <div data-testid="child-content">Hello World</div>
      </AppWrapper>
    )
    expect(screen.getByTestId('child-content')).toBeInTheDocument()
  })

  it('shows SplashScreen on first visit (no sessionStorage)', () => {
    render(
      <AppWrapper>
        <div data-testid="child-content">Content</div>
      </AppWrapper>
    )
    expect(screen.getByTestId('splash-screen')).toBeInTheDocument()
  })

  it('does not show SplashScreen when already visited', () => {
    sessionStorage.setItem('visited', 'true')
    render(
      <AppWrapper>
        <div data-testid="child-content">Content</div>
      </AppWrapper>
    )
    expect(screen.queryByTestId('splash-screen')).not.toBeInTheDocument()
  })

  it('hides SplashScreen after onComplete is called', async () => {
    vi.useRealTimers()
    render(
      <AppWrapper>
        <div data-testid="child-content">Content</div>
      </AppWrapper>
    )

    expect(screen.getByTestId('splash-screen')).toBeInTheDocument()

    act(() => {
      screen.getByText('Complete').click()
    })

    // waitForContentImages resolves via microtask; waitFor polls with real timers
    await waitFor(() => {
      expect(screen.queryByTestId('splash-screen')).not.toBeInTheDocument()
    })
  })

  it('persists visited state across renders', async () => {
    vi.useRealTimers()
    const { unmount } = render(
      <AppWrapper>
        <div data-testid="child-content">Content</div>
      </AppWrapper>
    )

    act(() => {
      screen.getByText('Complete').click()
    })

    await waitFor(() => {
      expect(screen.queryByTestId('splash-screen')).not.toBeInTheDocument()
    })
    unmount()

    // Re-render — should not show splash again
    render(
      <AppWrapper>
        <div data-testid="child-content">Content again</div>
      </AppWrapper>
    )

    expect(screen.queryByTestId('splash-screen')).not.toBeInTheDocument()
  })

  it('handles sessionStorage correctly on first visit', async () => {
    vi.useRealTimers()
    render(
      <AppWrapper>
        <div data-testid="child-content">Content</div>
      </AppWrapper>
    )

    expect(sessionStorage.getItem('visited')).toBeNull()

    act(() => {
      screen.getByText('Complete').click()
    })

    await waitFor(() => {
      expect(sessionStorage.getItem('visited')).toBe('true')
    })
  })
})
