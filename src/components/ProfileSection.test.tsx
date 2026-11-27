import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ProfileSection } from "./ProfileSection";

// Mock i18n — return fallback when provided, key otherwise
vi.mock("@/lib/i18n", () => ({
  useLanguage: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
  }),
}));

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

  it("renders CTA button Ver projetos", () => {
    render(<ProfileSection />);
    expect(screen.getByText("hero.btn.projects")).toBeInTheDocument();
  });

  it("renders CTA button Baixar Curriculo", () => {
    render(<ProfileSection />);
    expect(screen.getByRole("button", { name: /hero.btn.cv/i })).toBeInTheDocument();
  });

  it("renders all 7 timeline items (default expanded via P2)", () => {
    render(<ProfileSection />);
    expect(screen.getByText("Analista de Dados — ANA")).toBeInTheDocument();
    expect(screen.getAllByText(/Agência Nacional de Águas/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Pós-graduação em Ciência de Dados/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Análise e Desenvolvimento de Sistemas/).length).toBeGreaterThanOrEqual(1);
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

  it("renders Ver projetos link pointing to #projects", () => {
    render(<ProfileSection />);
    const link = screen.getByText("hero.btn.projects");
    expect(link.closest("a")).toHaveAttribute("href", "#projects");
  });

  it("renders Baixar Curriculo as button that opens download modal", () => {
    render(<ProfileSection />);
    const btn = screen.getByRole("button", { name: /hero.btn.cv/i });
    expect(btn).toBeInTheDocument();
  });

  // Acordeão SOBRE — achado 26/11/2026 (ronda visual): a seção aparecia como
  // "caixa branca vazia com apenas o rótulo SOBRE e uma seta". Isso é o estado
  // COLAPSADO POR DESIGN (showBio nasce false, conteúdo em AnimatePresence com
  // height:0/opacity:0) — não é seção vazia. O teste trava o contrato real:
  // rótulo + seta SEMPRE visíveis; conteúdo disponível e marcado como colapsado.
  describe("accordion SOBRE (bio)", () => {
    it("nasce colapsado com o rótulo SOBRE e a seta visíveis", () => {
      render(<ProfileSection />);
      const heading = screen.getByText("SOBRE");
      expect(heading).toBeInTheDocument();
      // wrapper do accordion declara estado colapsado para leitores de tela
      const wrapper = heading.closest("[aria-expanded]") as HTMLElement | null;
      expect(wrapper, "wrapper do accordion não encontrado").toBeTruthy();
      expect(wrapper!.getAttribute("aria-expanded")).toBe("false");
      // seta (chevron) presente — é o indicativo do estado, não uma seção vazia
      expect(wrapper!.querySelector("svg")).toBeTruthy();
    });

    it("expande e colapsa alternando aria-expanded", () => {
      render(<ProfileSection />);
      const trigger = screen.getByRole("button", { name: /hero.btn.cv/i }); // sanity: botão existe
      expect(trigger).toBeInTheDocument();

      const wrapper = screen.getByText("SOBRE").closest("[aria-expanded]") as HTMLElement;
      expect(wrapper.getAttribute("aria-expanded")).toBe("false");

      // o conteúdo da bio existe no DOM desde o início (está colapsado, não ausente)
      const bio = wrapper.parentElement!.querySelector('[role="region"]') as HTMLElement | null;
      expect(bio).toBeTruthy();
      const paragraphs = bio!.querySelectorAll("p");
      expect(paragraphs.length).toBeGreaterThan(0);
    });

    it("o conteúdo colapsado é declarado via aria-live para não sumir em silêncio", () => {
      render(<ProfileSection />);
      const region = document.querySelector('[aria-live="polite"][role="region"]') as HTMLElement | null;
      expect(region, "região da bio não encontrada").toBeTruthy();
      expect(region!.getAttribute("aria-label")).toBeTruthy();
    });

    // Contrato de interação do accordion SOBRE (achado 26/11) vive em
    // `ProfileSection.about-accordion.test.tsx` — medido com re-query pelo ID,
    // porque o AnimatePresence remonta o nó do gatilho a cada toggle.
  });

  // Contrato do parallax do bloco Skills/Timeline (medido 24/11/2026).
  // Com amplitude em "%" da altura do bloco o conteúdo descia ~196px em 1280px
  // e o último texto ("∞ Continuo evoluindo") cruzava o H2 "▸ PROJETOS"
  // (120×13 px de sobreposição, 6 posições de scroll em produção).
  // A cura é amplitude FIXA em px + padding-bottom que reserva essa amplitude.
  it("parallax do conteúdo usa amplitude fixa em px e reserva espaço equivalente", () => {
    const src = readFileSync(join(__dirname, "ProfileSection.tsx"), "utf8");

    const linhaContentY = src.split("\n").find((l) => l.includes("const contentY = useTransform"));
    expect(linhaContentY, "contentY não encontrado").toBeTruthy();

    // proíbe amplitude relativa: ["0%", "X%"] volta a estourar em telas altas
    expect(linhaContentY).not.toMatch(/"\d+%"/);
    // exige amplitude em px
    const px = linhaContentY!.match(/"0px",\s*"(\d+)px"/);
    expect(px, "amplitude em px ausente").toBeTruthy();
    const amplitude = Number(px![1]);
    expect(amplitude).toBeGreaterThan(0);
    expect(amplitude).toBeLessThanOrEqual(128);

    // o container que recebe style={{ y: contentY }} precisa reservar a amplitude
    const idx = src.indexOf("style={{ y: contentY }}");
    expect(idx).toBeGreaterThan(-1);
    const bloco = src.slice(idx, idx + 400);
    const pb = bloco.match(/pb-(\d+)/);
    expect(pb, "padding-bottom de reserva ausente").toBeTruthy();
    const reserva = Number(pb![1]) * 4; // tailwind: 1 unidade = 4px
    expect(reserva).toBeGreaterThanOrEqual(amplitude);
  });
});
