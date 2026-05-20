import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { DogWalkBlueprint } from './DogWalkBlueprint'

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, { get: (_, p) => ({ children, ...rest }: any) => <div {...rest}>{children}</div> }),
  AnimatePresence: ({ children }: any) => children,
  useInView: () => true,
}))

describe('DogWalkBlueprint', () => {
  it('renders title text', () => {
    render(<DogWalkBlueprint />)
    expect(screen.getByText('[ DOGWALK SYSTEM ARCHITECTURE ]')).toBeInTheDocument()
  })

  it('renders all module nodes', () => {
    render(<DogWalkBlueprint />)
    expect(screen.getByText('Database Schema')).toBeInTheDocument()
    expect(screen.getByText('Authentication')).toBeInTheDocument()
    expect(screen.getByText('Payment Engine')).toBeInTheDocument()
    expect(screen.getByText('Real-time Sync')).toBeInTheDocument()
    expect(screen.getByText('Map System')).toBeInTheDocument()
    expect(screen.getByText('AI Assistant')).toBeInTheDocument()
  })

  it('renders the center hub emoji', () => {
    const { container } = render(<DogWalkBlueprint />)
    expect(container.textContent).toContain('🐕')
  })

  it('renders instruction subtitle', () => {
    render(<DogWalkBlueprint />)
    expect(screen.getByText('Clique em um módulo para ver detalhes')).toBeInTheDocument()
  })
})
