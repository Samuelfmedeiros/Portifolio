import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroSection } from './HeroSection'

describe('HeroSection', () => {
  it('renders the name SAMUEL ANDRADE', () => {
    render(<HeroSection />)
    expect(screen.getByText('SAMUEL')).toBeInTheDocument()
    expect(screen.getByText('ANDRADE')).toBeInTheDocument()
  })

  it('renders the role', () => {
    render(<HeroSection />)
    expect(screen.getByText(/ANALISTA DE DADOS/)).toBeInTheDocument()
  })

  it('renders skill pills', () => {
    render(<HeroSection />)
    expect(screen.getByText('BI & SQL')).toBeInTheDocument()
    expect(screen.getByText('Python')).toBeInTheDocument()
    expect(screen.getByText('Machine Learning')).toBeInTheDocument()
    expect(screen.getByText('Next.js')).toBeInTheDocument()
    expect(screen.getByText('LLMs Locais')).toBeInTheDocument()
  })

  it('renders the scroll prompt', () => {
    render(<HeroSection />)
    expect(screen.getByText(/SCROLL PARA INICIAR SCAN/)).toBeInTheDocument()
  })

  it('renders the telemetry bar with time', () => {
    render(<HeroSection />)
    // Time is dynamic, but should render something (UTC-3 label)
    expect(screen.getByText(/UTC-3/)).toBeInTheDocument()
  })

  it('renders the scroll percentage indicator', () => {
    render(<HeroSection />)
    // Should show 0% initially since scrollY is mocked to 0
    expect(screen.getByText('0%')).toBeInTheDocument()
  })
})
