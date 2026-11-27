import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { TypeWriter } from "./TypeWriter";

/**
 * Contrato do efeito de digitação do hero.
 *
 * Achado 26/11/2026 (ronda visual): o texto sob o nome aparecia incompleto com um
 * cursor de edição visível ("De|"), o que sugeria conteúdo truncado. A frase real
 * é "Desenvolvedor Full Stack & Analista de Dados — Brasília/DF": o disparo capturou
 * o quadro NO MEIO da digitação (2 caracteres + cursor piscante de 2px).
 *
 * Estes testes travam os dois fatos que o achado confundiu:
 *  1. o cursor é parte do efeito (não é lixo de texto);
 *  2. a frase COMPLETA fica acessível a leitores de tela via aria-label desde o
 *     primeiro quadro — o usuário real nunca "perde" o texto, só vê a animação.
 */
/**
 * Um tick por ciclo act: o setTimeout reescalona o proximo tick dentro do efeito,
 * e o efeito so reexecuta depois que o React flusha o setState — ou seja, cada
 * `act(() => advanceTimersByTime(speed))` digita exatamente 1 caractere.
 */
function digitar(caracteres: number, speed: number) {
  for (let i = 0; i < caracteres; i++) {
    act(() => {
      vi.advanceTimersByTime(speed);
    });
  }
}

describe("TypeWriter", () => {
  it("acessa a frase completa pelo aria-label desde o primeiro quadro (nunca truncada)", () => {
    const phrase = "Desenvolvedor Full Stack & Analista de Dados — Brasília/DF";
    const { container } = render(
      <TypeWriter phrases={[phrase]} speed={1000} deleteSpeed={1000} pauseDuration={1000} />
    );

    // aria-label = frase atual inteira, mesmo com currentText ainda em "De"
    const span = container.querySelector('[role="text"]') as HTMLElement | null;
    expect(span).toBeTruthy();
    expect(span!.getAttribute("aria-label")).toBe(phrase);
  });

  it("mostra apenas um cursor binkando (2px) — não é texto incompleto", () => {
    const { container } = render(<TypeWriter phrases={["De"]} speed={1000} deleteSpeed={1000} pauseDuration={1000} />);

    // o bloco de cursor tem dimensao propria e classe de animação
    const cursor = container.querySelector(".inline-block.w-\\[2px\\]") as HTMLElement | null;
    expect(cursor).toBeTruthy();
    expect(cursor!.className).toContain("w-[2px]");
    expect(cursor!.className).toContain("bg-[var(--accent)]");

    // aria-label aponta a frase inteira, independente do texto visível parcial
    expect(screen.getByRole("text").getAttribute("aria-label")).toBe("De");
  });

  it("digita a frase caractere a caractere ate completar (texto nao fica travado)", () => {
    vi.useFakeTimers();
    try {
      render(<TypeWriter phrases={["AB"]} speed={10} deleteSpeed={10} pauseDuration={10} />);
      // ainda vazio no primeiro quadro (animação não iniciou)
      expect(screen.getByRole("text").textContent).not.toContain("AB");

      digitar(2, 10); // "A" depois "B"

      expect(screen.getByRole("text").textContent).toContain("AB");
    } finally {
      vi.useRealTimers();
    }
  });

  it("aceita qualquer frase e nao depende de hero.typewriter para digitar", () => {
    vi.useFakeTimers();
    try {
      render(<TypeWriter phrases={["Python • SQL • Power BI"]} speed={10} deleteSpeed={10} pauseDuration={10} />);
      digitar(6, 10); // digita os 6 primeiros chars = "Python"
      expect(screen.getByRole("text").textContent).toContain("Python");
    } finally {
      vi.useRealTimers();
    }
  });
});