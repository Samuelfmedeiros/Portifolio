import { render, screen, fireEvent } from "@testing-library/react";
import { Navbar } from "../Navbar";

describe("Navbar", () => {
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

  it("contains logo text", () => {
    render(<Navbar />);
    const logo = screen.getByText(/SamuelMed/);
    expect(logo).toBeInTheDocument();
  });

  it("contains navigation links", () => {
    render(<Navbar />);
    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Sobre")).toBeInTheDocument();
    expect(screen.getByText("Projetos")).toBeInTheDocument();
  });

  it("theme toggle is present", () => {
    render(<Navbar />);
    expect(screen.getByRole("button", { name: /modo claro/i })).toBeInTheDocument();
  });

  it("GitHub link is present", () => {
    render(<Navbar />);
    const githubLink = screen.getByLabelText("GitHub");
    expect(githubLink).toHaveAttribute("href", "https://github.com/Samuelfmedeiros");
  });
});
