import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "../HeroSection";

describe("HeroSection", () => {
  it("renders main title", () => {
    render(<HeroSection />);
    // Title is split across elements: "Samuel " + <span>Medeiros</span>
    // Use role selector for the heading
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders CTAs", () => {
    render(<HeroSection />);
    expect(screen.getByText("Ver Projetos")).toBeTruthy();
  });
});
