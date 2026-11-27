import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { ProfileSection } from "./ProfileSection";

// Mock i18n — return fallback when provided, key otherwise
vi.mock("@/lib/i18n", () => ({
  useLanguage: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
  }),
}));

/**
 * Auditoria visual 27/11/2026 (rodada do loop, worker ui):
 * "Linha azul na borda direita inferior da tela" — o 4o path do CircuitLines
 * (canto inferior direito) era o UNICO sem `opacity` e sem `strokeDasharray`,
 * entao um traco solido em --accent ficava visivel na borda direita inferior.
 *
 * Contrato: todo path/line da camada de circuito e decorativo de baixa opacidade
 * e tracejado. Paths tem `opacity` <= 0.1 e `strokeDasharray` nao vazio.
 */
describe("ProfileSection — CircuitLines (camada decorativa)", () => {
  function renderCircuitSvg() {
    const { container } = render(<ProfileSection />);
    const svg = container.querySelector('svg[preserveAspectRatio="xMidYMid meet"]');
    expect(svg, "svg do CircuitLines deveria existir").not.toBeNull();
    return svg as SVGElement;
  }

  it("tem 4 paths de circuito (um por canto)", () => {
    const svg = renderCircuitSvg();
    const paths = svg.querySelectorAll("path");
    expect(paths.length).toBe(4);
  });

  it("nenhum path de circuito passa de opacidade 0.1 (sem traco solido)", () => {
    const svg = renderCircuitSvg();
    const paths = Array.from(svg.querySelectorAll("path"));
    for (const [i, path] of paths.entries()) {
      const raw = path.getAttribute("opacity");
      const opacity = raw === null ? 1 : Number(raw);
      expect(
        opacity,
        `path ${i} (d="${path.getAttribute("d")}") com opacity=${opacity}`,
      ).toBeLessThanOrEqual(0.1);
    }
  });

  it("todo path de circuito e tracejado (strokeDasharray)", () => {
    const svg = renderCircuitSvg();
    const paths = Array.from(svg.querySelectorAll("path"));
    for (const [i, path] of paths.entries()) {
      expect(
        path.getAttribute("stroke-dasharray") ?? path.getAttribute("strokeDasharray"),
        `path ${i} sem strokeDasharray — traco continuo apareceria na tela`,
      ).toBeTruthy();
    }
  });
});