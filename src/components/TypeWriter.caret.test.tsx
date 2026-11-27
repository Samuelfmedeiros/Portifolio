import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { TypeWriter } from "./TypeWriter";

/**
 * Contrato do CURSOR do subtítulo — achado da ronda visual 26/11/2026:
 *
 * "Texto 'Desenvolvedor Full |' — Um cursor de texto está visível ao final do
 *  subtítulo, sugerindo erro de edição ou placeholder não removido."
 *
 * O `|` é o cursor de efeito de digitação, não lixo de texto. Mas enquanto ele
 * NÃO era `aria-hidden`, o pipe entrava na cadeia acessível: o leitor de tela
 * anunciava "Desenvolvedor Full Stack & Analista de Dados |" e qualquer
 * ferramenta de extração de texto (ou VLM de auditoria) lia a barra como
 * caractere do conteúdo. A decoração tem de estar fora do nome acessível.
 */

const FRASE_PT = "Desenvolvedor Full Stack & Analista de Dados — Brasília/DF";

function caret(container: HTMLElement): HTMLElement {
  const el = container.querySelector('[data-testid="typewriter-caret"]') as HTMLElement | null;
  expect(el, "cursor de digitação não encontrado").toBeTruthy();
  return el!;
}

describe("TypeWriter — cursor decorativo", () => {
  it("o cursor está marcado aria-hidden (o pipe não entra no nome acessível)", () => {
    const { container } = render(<TypeWriter phrases={[FRASE_PT]} />);
    expect(caret(container).getAttribute("aria-hidden")).toBe("true");
  });

  it("o texto visível NUNCA contém o pipe do cursor", () => {
    const { container } = render(<TypeWriter phrases={[FRASE_PT]} />);
    // span[role=text] é o nó que o leitor de tela lê; o cursor é filho dele
    const span = container.querySelector('[role="text"]') as HTMLElement;
    expect(span).toBeTruthy();
    expect(span.textContent).not.toContain("|");
  });

  it("o cursor é filho do nó role=text (mesma linha, não bloco solto)", () => {
    const { container } = render(<TypeWriter phrases={[FRASE_PT]} />);
    const span = container.querySelector('[role="text"]') as HTMLElement;
    expect(caret(container).parentElement).toBe(span);
  });

  it("o cursor mantém as dimensões de traço (2px x 1em) — não vira caractere largo", () => {
    const { container } = render(<TypeWriter phrases={[FRASE_PT]} />);
    expect(caret(container).className).toContain("w-[2px]");
    expect(caret(container).className).toContain("h-[1em]");
  });

  it("o nome acessível continua sendo a frase COMPLETA desde o 1º quadro", () => {
    const { container } = render(<TypeWriter phrases={[FRASE_PT]} speed={1000} />);
    const span = container.querySelector('[role="text"]') as HTMLElement;
    // mesmo com 0 caracteres digitados, quem usa leitor de tela recebe a frase inteira
    expect(span.getAttribute("aria-label")).toBe(FRASE_PT);
  });
});