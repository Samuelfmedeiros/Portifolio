import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "../HeroSection";

describe("HeroSection", () => {
  it("renders main title", () => {
    render(<HeroSection />);
    expect(screen.getByText(/Samuel Medeiros/)).toBeTruthy();
  });

  it("renders CTAs", () => {
    render(<HeroSection />);
    expect(screen.getByText("Ver Projetos")).toBeTruthy();
  });
});