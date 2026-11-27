import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProfileSection } from "./ProfileSection";

vi.mock("@/lib/i18n", () => ({
  useLanguage: () => ({ t: (key: string, fallback?: string) => fallback ?? key }),
}));

/**
 * Contrato do accordion SOBRE — achado da ronda visual 26/11/2026:
 *
 * "Botão SOBRE — O elemento 'SOBRE' utiliza seta para baixo indicando expansão,
 *  mas não exibe conteúdo expandido nem estado atual, gerando ambiguidade de
 *  interação."
 *
 * Fatos medidos (não assumidos):
 *  1. o clique REAL inverte aria-expanded false → true → false;
 *  2. O `AnimatePresence` REMONTA o nó do gatilho a cada toggle (provado em
 *     27/11: `before.isSameNode(after)` = false) — daí o re-query pelo ID.
 *     Guardar a referência antiga congela o aria-expanded em "false" e gera
 *     falso negativo enquanto a UI está correta.
 *  3. o conteúdo da bio está no DOM desde o início (height:0 + overflow-hidden),
 *     e NÃO é recriado na expansão.
 *
 * Melhorias aplicadas no componente:
 *  - aria-controls liga o gatilho à região (antes o leitor dizia "expandido"
 *    sem dizer O QUÊ);
 *  - nome acessível contém o rótulo visível "SOBRE" (WCAG 2.5.3 — mesma classe
 *    do LanguageToggle corrigido em 23/11).
 */

const gatilho = () => document.getElementById("profile-about-trigger") as HTMLElement;
const regiao = () => document.getElementById("profile-about-region") as HTMLElement;

describe("ProfileSection — accordion SOBRE (gatilho → região)", () => {
  it("o gatilho expõe aria-controls apontando para a região da bio", () => {
    render(<ProfileSection />);
    const controls = gatilho().getAttribute("aria-controls");
    expect(controls, "aria-controls ausente no gatilho").toBeTruthy();
    expect(controls).toBe("profile-about-region");
    expect(regiao(), "região apontada por aria-controls não existe").toBeTruthy();
    expect(regiao().getAttribute("role")).toBe("region");
  });

  it("gatilho e região têm o MESMO nome acessível, contendo o texto visível SOBRE", () => {
    render(<ProfileSection />);
    // WCAG 2.5.3: o nome acessível precisa CONTER "SOBRE" — está na tela
    expect(gatilho().getAttribute("aria-label")).toContain("SOBRE");
    expect(regiao().getAttribute("aria-label")).toBe(gatilho().getAttribute("aria-label"));
  });

  it("clicar alterna aria-expanded false → true → false (estado atual é anunciado)", () => {
    render(<ProfileSection />);
    expect(gatilho().getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(gatilho());
    expect(gatilho().getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(gatilho());
    expect(gatilho().getAttribute("aria-expanded")).toBe("false");
  });

  it("o conteúdo da bio está no DOM e não desaparece ao expandir", () => {
    render(<ProfileSection />);
    const antes = regiao().querySelectorAll("p").length;
    expect(antes).toBeGreaterThan(0);

    fireEvent.click(gatilho());
    expect(gatilho().getAttribute("aria-expanded")).toBe("true");
    // expandir REVELA (height 0 → auto), não remonta os parágrafos
    expect(regiao().querySelectorAll("p").length).toBe(antes);
  });

  it("o texto da bio é conteúdo real — sem pipe/placeholder de edição", () => {
    render(<ProfileSection />);
    const texto = regiao().textContent ?? "";
    expect(texto).toContain("Samuel Medeiros");
    expect(texto).toContain("Desenvolvedor Full Stack");
    expect(texto).not.toContain("|");
  });

  it("o chevron e o rótulo SOBRE continuam no gatilho após expandir", () => {
    render(<ProfileSection />);
    expect(gatilho().querySelector("svg")).toBeTruthy();
    fireEvent.click(gatilho());
    expect(gatilho().querySelector("svg")).toBeTruthy();
    expect(screen.getByText("SOBRE")).toBeTruthy();
  });
});