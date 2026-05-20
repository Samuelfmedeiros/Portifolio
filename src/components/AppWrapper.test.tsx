import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
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
})
