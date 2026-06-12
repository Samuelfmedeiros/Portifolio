import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navbar } from "../Navbar";

describe("Navbar", () => {
  beforeEach(() => {
    global.IntersectionObserver = class IntersectionObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    } as unknown as typeof IntersectionObserver;
  });

  it("renders navigation", () => {
    render(<Navbar />);
    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
  });

  it("has fixed positioning", () => {
    render(<Navbar />);
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("fixed");
  });

  it("contains logo text (hidden on mobile, visible on desktop)", () => {
    render(<Navbar />);
    // "Samuel Medeiros" is still in DOM (hidden on small screens)
    const logo = screen.getByText(/Samuel Medeiros/);
    expect(logo).toBeInTheDocument();
    // "SM" is the mobile logo
    expect(screen.getByText("SM")).toBeInTheDocument();
  });

  it("contains navigation links", () => {
    render(<Navbar />);
    // Links appear in both desktop and mobile nav, so use getAllByText
    const inicioLinks = screen.getAllByText("Início");
    expect(inicioLinks.length).toBeGreaterThanOrEqual(1);
    // Projetos appears in both desktop and mobile
    expect(screen.getAllByText("Projetos").length).toBeGreaterThanOrEqual(1);
    // Terminal appears in both desktop and mobile
    expect(screen.getAllByText("Terminal").length).toBeGreaterThanOrEqual(1);
  });

  it("theme toggle is present", () => {
    render(<Navbar />);
    expect(
      screen.getByRole("button", { name: /modo claro|modo escuro|alternar tema/i })
    ).toBeInTheDocument();
  });

  it("GitHub link is present", () => {
    render(<Navbar />);
    const githubLink = screen.getByLabelText("GitHub");
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/Samuelfmedeiros"
    );
  });

  it("has no hamburger menu button", () => {
    render(<Navbar />);
    expect(
      screen.queryByRole("button", { name: /abrir menu/i })
    ).not.toBeInTheDocument();
  });
});
