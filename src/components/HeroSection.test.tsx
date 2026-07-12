import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { HeroSection } from "./HeroSection";
import { LanguageContext } from "@/lib/i18n";
import type { ReactNode } from "react";
import React from "react";

// Mock DownloadModal since it uses createPortal
vi.mock("./DownloadModal", () => ({
  DownloadModal: vi.fn(({ open, onClose }: { open: boolean; onClose: () => void }) => {
    if (!open) return null;
    return React.createElement(
      "div",
      { "data-testid": "download-modal", onClick: onClose },
      "Download Currículo"
    );
  }),
}));

// Wrapper with i18n mock translations
function I18nWrapper({ children }: { children: ReactNode }) {
  const t = (key: string, fallback?: string) =>
    ({
      "hero.tagline":
        "Next.js, React, Python, SQL e Machine Learning — transformando dados em decisões estratégicas.",
      "hero.typewriter.1": "Desenvolvedor Full Stack & Analista de Dados — Brasília/DF",
      "hero.typewriter.2": "Transformando dados em decisões estratégicas 📊",
      "hero.typewriter.3": "Python • SQL • Power BI • Machine Learning",
      "hero.typewriter.4": "Next.js • React • TypeScript • Node.js",
      "hero.typewriter.5": "4+ anos transformando negócios com dados 🚀",
      "hero.btn.projects": "Ver Projetos",
      "hero.btn.cv": "Baixar Currículo",
      "hero.btn.cv.pdf": "PDF",
      "hero.scroll": "Scroll",
    })[key] ?? fallback ?? key;

  return React.createElement(
    LanguageContext.Provider,
    { value: { locale: "pt" as const, setLocale: () => {}, toggle: () => {}, t } },
    children
  );
}

const renderWithI18n = (ui: ReactNode) => render(<I18nWrapper>{ui}</I18nWrapper>);

describe("HeroSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the hero section with correct id", () => {
    const { container } = renderWithI18n(<HeroSection />);
    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
    expect(section?.className).toContain("min-h-[70vh]");
  });

  it("renders Samuel and Medeiros names", () => {
    renderWithI18n(<HeroSection />);
    expect(screen.getByText("Samuel")).toBeInTheDocument();
    expect(screen.getByText("Medeiros")).toBeInTheDocument();
  });

  it("renders a decorative accent line between name and tagline", () => {
    const { container } = renderWithI18n(<HeroSection />);
    const divider = container.querySelector(".h-px");
    expect(divider).toBeInTheDocument();
    expect(divider?.className).toContain("bg-[var(--accent)]");
  });

  it("renders TypeWriter phrases", () => {
    renderWithI18n(<HeroSection />);
    expect(
      screen.getByText(
        "Next.js, React, Python, SQL e Machine Learning — transformando dados em decisões estratégicas."
      )
    ).toBeInTheDocument();
  });

  it("renders all 6 skill tags", () => {
    renderWithI18n(<HeroSection />);
    const skills = ["Power BI", "SQL", "Python", "Machine Learning", "ETL", "Azure"];
    skills.forEach((skill) => {
      expect(screen.getByText(skill)).toBeInTheDocument();
    });
  });

  it("renders skill tags with glass styling classes", () => {
    renderWithI18n(<HeroSection />);
    const skillTag = screen.getByText("Power BI");
    expect(skillTag.className).toContain("glass");
    expect(skillTag.className).toContain("rounded-full");
  });

  it("renders project CTA link pointing to #projects", () => {
    renderWithI18n(<HeroSection />);
    const link = screen.getByText("Ver Projetos");
    expect(link.closest("a")).toHaveAttribute("href", "#projects");
  });

  it("renders CV download button with PDF label", () => {
    renderWithI18n(<HeroSection />);
    const cvBtn = screen.getByText("Baixar Currículo");
    expect(cvBtn).toBeInTheDocument();
    expect(cvBtn.closest("button")).toBeTruthy();
  });

  it("shows PDF suffix next to CV button", () => {
    renderWithI18n(<HeroSection />);
    // Text rendered as "— PDF", use a text matcher
    expect(screen.getByText(/PDF/)).toBeInTheDocument();
  });

  it("CV button has a download SVG icon", () => {
    const { container } = renderWithI18n(<HeroSection />);
    const cvBtn = screen.getByText("Baixar Currículo").closest("button");
    expect(cvBtn).toBeTruthy();
    const svg = cvBtn?.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg?.querySelector("polyline")?.getAttribute("points")).toBe("7 10 12 15 17 10");
  });

  it("has scroll indicator with animated mouse icon", () => {
    renderWithI18n(<HeroSection />);
    expect(screen.getByText("Scroll")).toBeInTheDocument();
  });

  it("renders cockpit SVG with aria-hidden", () => {
    const { container } = renderWithI18n(<HeroSection />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("opens download modal when CV button is clicked", async () => {
    renderWithI18n(<HeroSection />);

    expect(screen.queryByTestId("download-modal")).not.toBeInTheDocument();

    const cvBtn = screen.getByText("Baixar Currículo").closest("button");
    expect(cvBtn).toBeTruthy();

    if (cvBtn) {
      fireEvent.click(cvBtn);
    }

    await waitFor(() => {
      expect(screen.getByTestId("download-modal")).toBeInTheDocument();
    });
  });

  it("closes download modal when the backdrop is clicked", async () => {
    renderWithI18n(<HeroSection />);

    const cvBtn = screen.getByText("Baixar Currículo").closest("button");
    if (cvBtn) {
      fireEvent.click(cvBtn);
    }

    await waitFor(() => {
      expect(screen.getByTestId("download-modal")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("download-modal"));

    await waitFor(() => {
      expect(screen.queryByTestId("download-modal")).not.toBeInTheDocument();
    });
  });

  it("renders glass card with proper classes", () => {
    const { container } = renderWithI18n(<HeroSection />);
    const glassWrappers = container.querySelectorAll(".glass");
    expect(glassWrappers.length).toBeGreaterThanOrEqual(1);
  });

  it("renders projects link with hover effects via class", () => {
    renderWithI18n(<HeroSection />);
    const projectsLink = screen.getByText("Ver Projetos");
    const anchor = projectsLink.closest("a");
    expect(anchor?.className).toContain("hover:scale-[1.04]");
    expect(anchor?.className).toContain("transition-all");
  });

  it("renders CV button with gradient background", () => {
    renderWithI18n(<HeroSection />);
    const cvBtn = screen.getByText("Baixar Currículo").closest("button");
    expect(cvBtn?.className).toContain("bg-gradient-to-br");
  });
});
