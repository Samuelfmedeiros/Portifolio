import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProjectModal } from './ProjectModal'
import { useLanguage } from '@/lib/i18n'
import { getProjectI18n } from '@/lib/profileData'

vi.mock('@/lib/i18n', () => ({
  useLanguage: vi.fn(() => ({
    t: (key: string) => key,
    locale: 'pt',
  })),
}))

vi.mock('@/lib/profileData', () => ({
  getProjectI18n: vi.fn(() => ({
    description: 'Localized Description',
    topics: ['React', 'TypeScript', 'Tailwind'],
  })),
}))

describe('ProjectModal', () => {
  const mockRepo = {
    name: 'Test Project',
    description: 'Default Description',
    language: 'TypeScript',
    topics: ['test-topic'],
    icon: null,
  }

  const mockOnClose = vi.fn()

  it('does not render when open is false', () => {
    render(<ProjectModal repo={mockRepo} open={false} onClose={mockOnClose} />)
    expect(screen.queryByText('Test Project')).not.toBeInTheDocument()
  })

  it('renders correctly when open is true', () => {
    render(<ProjectModal repo={mockRepo} open={true} onClose={mockOnClose} />)
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByText('Localized Description')).toBeInTheDocument()
    expect(screen.getAllByText('TypeScript')[0]).toBeInTheDocument()
  })

  it('calls onClose when clicking the close button', () => {
    render(<ProjectModal repo={mockRepo} open={true} onClose={mockOnClose} />)
    const closeBtn = screen.getByLabelText('modal.close')
    fireEvent.click(closeBtn)
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('calls onClose when clicking the backdrop', () => {
    render(<ProjectModal repo={mockRepo} open={true} onClose={mockOnClose} />)
    // The backdrop is the motion.div wrapper
    const backdrop = screen.getByRole('dialog')
    fireEvent.click(backdrop)
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('does not call onClose when clicking the modal content', () => {
    render(<ProjectModal repo={mockRepo} open={true} onClose={mockOnClose} />)
    const content = screen.getByText('Test Project').closest('div')
    if (content) fireEvent.click(content)
    // We need to check that it WAS called by the backdrop but maybe not by this click
    // Actually the backdrop click is handled by the wrapper. 
    // Let's just verify that stopPropagation is there (implicitly by checking it doesn't trigger onClose if we target the inner div)
    vi.clearAllMocks()
    const innerDiv = screen.getByText('Test Project').parentElement?.parentElement?.parentElement?.parentElement // navigate to the inner motion.div
    if (innerDiv) fireEvent.click(innerDiv)
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('renders fallback icon when repo.icon is missing', () => {
    render(<ProjectModal repo={mockRepo} open={true} onClose={mockOnClose} />)
    expect(screen.getByText('T')).toBeInTheDocument()
  })

  it('renders custom icon when repo.icon is provided', () => {
    const repoWithIcon = { ...mockRepo, icon: <span data-testid="custom-icon">Icon</span> }
    render(<ProjectModal repo={repoWithIcon} open={true} onClose={mockOnClose} />)
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('renders tech tags with correct styles', () => {
    const tags = ['React', 'Tailwind', 'Python', 'Docker', 'Node', 'BI', 'Unknown']
    // Mock getProjectI18n to return these tags so the component renders them
    vi.mocked(getProjectI18n).mockReturnValueOnce({
      description: 'Localized Description',
      topics: tags,
    })
    render(<ProjectModal repo={{ ...mockRepo, topics: tags }} open={true} onClose={mockOnClose} />)
    
    expect(screen.getByText('React')).toHaveClass('text-cyan-400')
    expect(screen.getByText('Tailwind')).toHaveClass('text-purple-400')
    expect(screen.getByText('Python')).toHaveClass('text-yellow-400')
    expect(screen.getByText('Docker')).toHaveClass('text-orange-400')
    expect(screen.getByText('Node')).toHaveClass('text-green-400')
    expect(screen.getByText('BI')).toHaveClass('text-blue-400')
    expect(screen.getByText('Unknown')).toHaveClass('text-[var(--text-secondary)]')
  })
})
