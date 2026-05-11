import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navbar } from "../Navbar";

describe("Navbar", () => {
  it("renders nav items", () => {
    render(<Navbar />);
    expect(screen.getByText("Sobre")).toBeTruthy();
    expect(screen.getByText("Projetos")).toBeTruthy();
    expect(screen.getByText("Terminal")).toBeTruthy();
    expect(screen.getByText("Contato")).toBeTruthy();
  });

  it("renders logo", () => {
    render(<Navbar />);
    expect(screen.getByText("SamuelMed")).toBeTruthy();
  });

  it("has social links", () => {
    render(<Navbar />);
    expect(screen.getByLabelText("GitHub")).toBeTruthy();
    expect(screen.getByLabelText("LinkedIn")).toBeTruthy();
    expect(screen.getByLabelText("Email")).toBeTruthy();
  });
});