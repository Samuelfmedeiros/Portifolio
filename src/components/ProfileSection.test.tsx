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

  it("renders timeline items (first 4 via P2 collapse)", () => {
    render(<ProfileSection />);
    expect(screen.getByText("Analista de Dados — ANA")).toBeInTheDocument();
    expect(screen.getByText(/Agência Nacional de Águas/)).toBeInTheDocument();
    expect(screen.getByText(/Pós-graduação em Banco de Dados/)).toBeInTheDocument();
    expect(screen.getByText(/Desenvolvedor Full Stack Autônomo/)).toBeInTheDocument();
  });

  it("expands timeline to show all items on click", () => {
    render(<ProfileSection />);
    expect(screen.getByText(/Ver jornada completa/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Ver jornada completa/));
    expect(screen.getByText(/Análise e Desenvolvimento de Sistemas/)).toBeInTheDocument();
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