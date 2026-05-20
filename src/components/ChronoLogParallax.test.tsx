import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ChronoLogParallax } from './ChronoLogParallax'

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, { get: (_, p) => ({ children, ...rest }: any) => <div {...rest}>{children}</div> }),
  AnimatePresence: ({ children }: any) => children,
  useInView: () => true,
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useTransform: (_: any, __: any, values: string[]) => ({ get: () => values[0] }),
}))

describe('ChronoLogParallax', () => {
  it('renders section with correct class', () => {
    const { container } = render(<ChronoLogParallax />)
    const section = container.querySelector('section')
    expect(section).toHaveClass('relative', 'h-[300vh]', 'w-full')
  })

  it('renders career log entries', () => {
    render(<ChronoLogParallax />)
    expect(screen.getByText('[ SYS.LOG: 2025_PRESENT ]')).toBeInTheDocument()
    expect(screen.getByText('[ SYS.LOG: 2021_2025 ]')).toBeInTheDocument()
    expect(screen.getByText('[ SYS.LOG: 2017_2020 ]')).toBeInTheDocument()
  })

  it('renders tech stack tags', () => {
    render(<ChronoLogParallax />)
    expect(screen.getByText('Power BI')).toBeInTheDocument()
    expect(screen.getByText('Azure')).toBeInTheDocument()
    expect(screen.getByText('Gestão Documental')).toBeInTheDocument()
  })
})
