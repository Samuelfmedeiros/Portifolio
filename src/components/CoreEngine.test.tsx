import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CoreEngine } from './CoreEngine'

describe('CoreEngine', () => {
  it('renders the section heading', () => {
    render(<CoreEngine />)
    expect(screen.getByText(/CORE ENGINE/)).toBeInTheDocument()
  })

  it('renders the HARDWARE card', () => {
    render(<CoreEngine />)
    expect(screen.getByText('HARDWARE')).toBeInTheDocument()
    expect(screen.getByText(/RTX 3060/)).toBeInTheDocument()
    expect(screen.getByText(/Ryzen 5 5600/)).toBeInTheDocument()
    expect(screen.getByText(/SSD NVMe 1TB/)).toBeInTheDocument()
  })

  it('renders the IA & LLMs card', () => {
    render(<CoreEngine />)
    expect(screen.getByText('IA & LLMs')).toBeInTheDocument()
    expect(screen.getByText(/Ollama/)).toBeInTheDocument()
    expect(screen.getByText(/Scikit-learn/)).toBeInTheDocument()
    expect(screen.getByText(/Unsloth/)).toBeInTheDocument()
  })

  it('renders the TRAJETÓRIA card', () => {
    render(<CoreEngine />)
    expect(screen.getByText('TRAJETÓRIA')).toBeInTheDocument()
    expect(screen.getByText(/Análise de Dados/)).toBeInTheDocument()
    expect(screen.getByText(/Full Stack/)).toBeInTheDocument()
    expect(screen.getByText(/Machine Learning/)).toBeInTheDocument()
  })
})
