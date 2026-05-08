import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AboutTimeline } from "./AboutTimeline";

describe("AboutTimeline", () => {
  it("renders trajectory section", () => {
    render(<AboutTimeline />);
    expect(screen.getByText("▸ TRAJETÓRIA")).toBeDefined();
  });

  it("renders all experience cards", () => {
    render(<AboutTimeline />);
    expect(screen.getByText("Analista de Dados & Produto")).toBeDefined();
    expect(screen.getByText("Formação em Tecnologia")).toBeDefined();
    expect(screen.getByText("Certificações & Especializações")).toBeDefined();
  });
});