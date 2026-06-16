import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProfileSection } from "./ProfileSection";

describe("ProfileSection", () => {
  it("renders the section with id profile", () => {
    const { container } = render(<ProfileSection />);
    const section = container.querySelector("#profile");
    expect(section).toBeInTheDocument();
  });

  it("renders the name Samuel", () => {
    render(<ProfileSection />);
    expect(screen.getByText("Samuel")).toBeInTheDocument();
  });

  it("renders the sobrenome Medeiros", () => {
    render(<ProfileSection />);
    expect(screen.getByText("Medeiros")).toBeInTheDocument();
  });

  it("renders the skills section heading", () => {
    render(<ProfileSection />);
    expect(screen.getByText("▸ HABILIDADES")).toBeInTheDocument();
  });

  it("renders the timeline section heading", () => {
    render(<ProfileSection />);
    expect(screen.getByText("▸ JORNADA")).toBeInTheDocument();
  });

  it("renderia skill cards with names", () => {
    render(<ProfileSection />);
    const skillNames = ["Power BI", "SQL", "Python", "Machine Learning"];
    for (const name of skillNames) {
      expect(screen.getAllByText(name).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("renders CTA button Ver Projetos", () => {
    render(<ProfileSection />);
    expect(screen.getByText("Ver Projetos")).toBeInTheDocument();
  });

  it("renders CTA button Baixar Curriculo", () => {
    render(<ProfileSection />);
    expect(screen.getByText("Baixar Curriculo")).toBeInTheDocument();
  });

  it("renders all 7 timeline items (default expanded via P2)", () => {
    render(<ProfileSection />);
    expect(screen.getByText("Analista de Dados — ANA")).toBeInTheDocument();
    expect(screen.getByText(/Agência Nacional de Águas/)).toBeInTheDocument();
    expect(screen.getByText(/Pós-graduação em Banco de Dados/)).toBeInTheDocument();
    expect(screen.getByText(/Análise e Desenvolvimento de Sistemas/)).toBeInTheDocument();
    expect(screen.getByText(/Desenvolvedor Full Stack Autônomo/)).toBeInTheDocument();
  });

  it("shows 'Mostrar menos' button when expanded (default P2)", () => {
    render(<ProfileSection />);
    expect(screen.getByText(/Mostrar menos/)).toBeInTheDocument();
    expect(screen.queryByText(/Ver jornada completa/)).toBeNull();
  });

  it("shows 'Ver jornada completa' after collapsing", () => {
    render(<ProfileSection />);
    fireEvent.click(screen.getByText(/Mostrar menos/));
    expect(screen.queryByText(/Mostrar menos/)).toBeNull();
    expect(screen.getAllByText(/Ver jornada completa/).length).toBeGreaterThanOrEqual(1);
  });

  it("toggles back and forth between collapsed and expanded", () => {
    render(<ProfileSection />);
    // Collapse
    fireEvent.click(screen.getByText(/Mostrar menos/));
    expect(screen.getAllByText(/Ver jornada completa/).length).toBeGreaterThanOrEqual(1);
    // Re-expand - click the first "Ver jornada completa"
    fireEvent.click(screen.getAllByText(/Ver jornada completa/)[0]);
    expect(screen.getByText(/Mostrar menos/)).toBeInTheDocument();
  });

  it("renders Ver Projetos link pointing to #projects", () => {
    render(<ProfileSection />);
    const link = screen.getByText("Ver Projetos");
    expect(link.closest("a")).toHaveAttribute("href", "#projects");
  });

  it("renders Baixar Curriculo link pointing to PDF", () => {
    render(<ProfileSection />);
    const link = screen.getByText("Baixar Curriculo");
    expect(link.closest("a")).toHaveAttribute("href", "/Samuel_Andrade_2026.pdf");
  });
});