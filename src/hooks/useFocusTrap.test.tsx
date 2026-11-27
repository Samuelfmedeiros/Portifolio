import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, act, cleanup, waitFor, fireEvent } from '@testing-library/react'
import { useRef, useState } from 'react'
import { useFocusTrap } from './useFocusTrap'

/**
 * useFocusTrap — contrato de foco de modal (52% de cobertura antes desta suíte).
 *
 * O hook tinha só o "ramo feliz" coberto: foco no primeiro elemento. Os ramos
 * que quebram a acessibilidade na prática — ciclo Tab/Shift+Tab, Escape
 * chamando o onClose e a DEVOLUÇÃO do foco ao gatilho no fechamento — estavam
 * sem nenhuma asserção. Note que o ciclo usa `document.activeElement`, então
 * um stub que não Move o foco de verdade (só um espião) passaria em silêncio:
 * aqui o foco é real, via `.focus()` do ambiente.
 */
function Modal({
  active,
  onClose,
}: {
  active: boolean
  onClose: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  useFocusTrap(containerRef, active, onClose)
  return (
    <div>
      <button type="button">gatilho</button>
      <div ref={containerRef}>
        <button type="button">primeiro</button>
        <button type="button">segundo</button>
        <button type="button">ultimo</button>
      </div>
    </div>
  )
}

describe('useFocusTrap', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('foca o primeiro elemento focável do container ao ativar', async () => {
    render(<Modal active onClose={vi.fn()} />)

    await waitFor(() => expect(screen.getByRole('button', { name: 'primeiro' })).toHaveFocus())
  })

  it('não rouba o foco enquanto inativo', async () => {
    const gatilho = document.createElement('button')
    document.body.appendChild(gatilho)
    gatilho.focus()

    render(<Modal active={false} onClose={vi.fn()} />)

    await new Promise((r) => setTimeout(r, 30))
    expect(gatilho).toHaveFocus()
    expect(screen.getByRole('button', { name: 'primeiro' })).not.toHaveFocus()
    gatilho.remove()
  })

  it('Escape chama o onClose (e consume o evento)', async () => {
    const onClose = vi.fn()
    render(<Modal active onClose={onClose} />)
    await waitFor(() => expect(screen.getByRole('button', { name: 'primeiro' })).toHaveFocus())

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    // dispatchEvent devolve false quando o listener chamou preventDefault —
    // é assim que se prova que o Escape foi consumido e não vaza para a página.
    const naoConsumido = fireEvent(document, event)

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(naoConsumido).toBe(false)
  })

  it('Tab no último elemento volta para o primeiro (ciclo fechado)', async () => {
    render(<Modal active onClose={vi.fn()} />)
    const primeiro = screen.getByRole('button', { name: 'primeiro' })
    const ultimo = screen.getByRole('button', { name: 'ultimo' })

    await waitFor(() => expect(primeiro).toHaveFocus())
    ultimo.focus()
    expect(ultimo).toHaveFocus()

    fireEvent.keyDown(document, { key: 'Tab' })
    expect(primeiro).toHaveFocus()
  })

  it('Shift+Tab no primeiro elemento pula para o último', async () => {
    render(<Modal active onClose={vi.fn()} />)
    const primeiro = screen.getByRole('button', { name: 'primeiro' })
    const ultimo = screen.getByRole('button', { name: 'ultimo' })

    await waitFor(() => expect(primeiro).toHaveFocus())
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(ultimo).toHaveFocus()
  })

  it('teclas que não são Tab/Escape não travam a navegação', async () => {
    render(<Modal active onClose={vi.fn()} />)
    const segundo = screen.getByRole('button', { name: 'segundo' })
    await waitFor(() => expect(screen.getByRole('button', { name: 'primeiro' })).toHaveFocus())

    segundo.focus()
    fireEvent.keyDown(document, { key: 'a' })

    expect(segundo).toHaveFocus()
  })

  it('devolve o foco ao gatilho quando o modal é fechado (gatilho FORA da árvore removida)', async () => {
    // No uso real (ProjectModal/DownloadModal) o gatilho é o botão que ABRIU o
    // modal e continua montado depois. A árvore removida é só a do modal.
    function Host() {
      const [open, setOpen] = useState(false)
      return (
        <div>
          <button type="button" onClick={() => setOpen(true)}>
            abrir
          </button>
          {open && <Modal active onClose={() => setOpen(false)} />}
        </div>
      )
    }

    render(<Host />)
    const abrir = screen.getByRole('button', { name: 'abrir' })

    await act(async () => {
      abrir.focus()
      abrir.click()
    })
    await waitFor(() => expect(screen.getByRole('button', { name: 'primeiro' })).toHaveFocus())

    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('button', { name: 'primeiro' })).not.toBeInTheDocument())

    expect(abrir).toHaveFocus()
  })

  it('solta a navegação ao desativar (Escape não deixa o Tab ciclando)', async () => {
    function Toggle() {
      const [active, setActive] = useState(false)
      return (
        <div>
          <button type="button" onClick={() => setActive((v) => !v)}>
            alternar
          </button>
          <Modal active={active} onClose={() => setActive(false)} />
        </div>
      )
    }

    render(<Toggle />)
    const primeiro = screen.getByRole('button', { name: 'primeiro' })
    const ultimo = screen.getByRole('button', { name: 'ultimo' })

    // ativa a trap pelo caminho real (clique no gatilho dele)
    await act(async () => {
      screen.getByRole('button', { name: 'alternar' }).click()
    })
    await waitFor(() => expect(primeiro).toHaveFocus())

    // com a trap ativa o Tab cicula
    ultimo.focus()
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(primeiro).toHaveFocus()

    // Escape desativa a trap — o foco não é movido, mas o listener sai
    fireEvent.keyDown(document, { key: 'Escape' })

    // com a trap inativa o Tab NÃO cicula mais — navegação devolvida à página
    ultimo.focus()
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(ultimo).toHaveFocus()
  })
})