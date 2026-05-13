import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Navbar } from "../Navbar";
import { ThemeProvider } from "../ThemeProvider";

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollY = 0;
    Object.defineProperty(window, "scrollY", { writable: true, value: 0 });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders navigation element", () => {
    render(<Navbar />);
    const nav = screen.getByRole("navigation");
    expect(nav).toBeTruthy();
  });

  it("has proper aria-label", () => {
    render(<Navbar />);
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("aria-label", "Navegação principal");
  });

  it("renders nav items", () => {
    render(<Navbar />);
    expect(screen.getByText("Sobre")).toBeTruthy();
    expect(screen.getByText("Projetos")).toBeTruthy();
    expect(screen.getByText("Terminal")).toBeTruthy();
    expect(screen.getByText("Contato")).toBeTruthy();
  });

  it("renders logo with name", () => {
    render(<Navbar />);
    expect(screen.getByText("SamuelMed")).toBeTruthy();
  });

  it("has social links", () => {
    render(<Navbar />);
    expect(screen.getByLabelText("GitHub")).toBeTruthy();
    expect(screen.getByLabelText("LinkedIn")).toBeTruthy();
    expect(screen.getByLabelText("Email")).toBeTruthy();
  });

  it("renders theme toggle button", () => {
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    );
    const themeToggle = screen.getByRole("button");
    expect(themeToggle).toBeTruthy();
  });

  it("has nav links with correct hrefs", () => {
    render(<Navbar />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);

    const hrefs = links.map((link) => link.getAttribute("href"));
    expect(hrefs).toContain("#ferramentas");
    expect(hrefs).toContain("#projects");
    expect(hrefs).toContain("#terminal");
    expect(hrefs).toContain("#contact");
  });

  it("GitHub link has correct href", () => {
    render(<Navbar />);
    const githubLink = screen.getByLabelText("GitHub");
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/Samuelfmedeiros"
    );
  });

  it("LinkedIn link has correct href", () => {
    render(<Navbar />);
    const linkedinLink = screen.getByLabelText("LinkedIn");
    expect(linkedinLink).toHaveAttribute(
      "href",
      "https://linkedin.com/in/samuelfmedeiros"
    );
  });

  it("Email link has correct href", () => {
    render(<Navbar />);
    const emailLink = screen.getByLabelText("Email");
    expect(emailLink).toHaveAttribute("href", "mailto:samuelandrademedeiros@gmail.com");
  });

  it("has scroll listener on mount", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    render(<Navbar />);
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      expect.objectContaining({ passive: true })
    );
  });

  it("removes scroll listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<Navbar />);
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
  });

  it("renders mobile navigation items", () => {
    render(<Navbar />);
    // Mobile nav uses aria-label for accessibility
    const aboutMobile = screen.getAllByLabelText("Sobre");
    expect(aboutMobile.length).toBeGreaterThan(0);
  });

  it("has smooth scroll class on nav", () => {
    render(<Navbar />);
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("scroll-smooth");
  });

  it("has fixed positioning", () => {
    render(<Navbar />);
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("fixed");
    expect(nav).toHaveClass("top-0");
    expect(nav).toHaveClass("left-0");
    expect(nav).toHaveClass("right-0");
    expect(nav).toHaveClass("z-50");
  });

  it("has glass effect class", () => {
    render(<Navbar />);
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("glass");
  });

  it("scroll state changes background", async () => {
    render(<Navbar />);

    // Simulate scroll
    Object.defineProperty(window, "scrollY", { writable: true, value: 50 });
    await fireEvent(window, new Event("scroll"));

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("bg-white/90");
  });

  it("logo is a link to home", () => {
    render(<Navbar />);
    const logo = screen.getByText("SamuelMed");
    const parentLink = logo.closest("a");
    expect(parentLink).toHaveAttribute("href", "/");
  });
});
