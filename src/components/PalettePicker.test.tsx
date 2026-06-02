import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PalettePicker } from "./PalettePicker";
import { ThemeProvider, useTheme } from "./ThemeProvider";
import React from "react";

function TestWrapper() {
  const { palette } = useTheme();
  return (
    <div>
      <span data-testid="current-palette">{palette}</span>
      <PalettePicker />
    </div>
  );
}

describe("PalettePicker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    document.documentElement.style.removeProperty("--accent");
    document.documentElement.style.removeProperty("--accent-alt");
  });

  it("renders palette button", () => {
    render(
      <ThemeProvider>
        <PalettePicker />
      </ThemeProvider>
    );
    const button = screen.getByRole("button", { name: /paleta/i });
    expect(button).toBeTruthy();
  });

  it("opens palette options on click", () => {
    render(
      <ThemeProvider>
        <PalettePicker />
      </ThemeProvider>
    );
    const button = screen.getByRole("button", { name: /paleta/i });
    fireEvent.click(button);

    // After click, the PALETA label should be visible
    expect(screen.getByText("PALETA")).toBeInTheDocument();
  });

  it("changes palette when clicking a color", () => {
    localStorage.setItem("mc-palette", "cyan");

    render(
      <ThemeProvider>
        <TestWrapper />
      </ThemeProvider>
    );

    expect(screen.getByTestId("current-palette")).toHaveTextContent("cyan");

    const button = screen.getByRole("button", { name: /paleta/i });
    fireEvent.click(button);

    const emeraldBtn = screen.getByRole("button", { name: "Esmeralda" });
    fireEvent.click(emeraldBtn);

    expect(screen.getByTestId("current-palette")).toHaveTextContent("emerald");
    expect(localStorage.getItem("mc-palette")).toBe("emerald");
  });

  it("persists palette to localStorage", () => {
    render(
      <ThemeProvider>
        <TestWrapper />
      </ThemeProvider>
    );

    const button = screen.getByRole("button", { name: /paleta/i });
    fireEvent.click(button);

    const violetBtn = screen.getByRole("button", { name: "Violeta" });
    fireEvent.click(violetBtn);

    expect(localStorage.getItem("mc-palette")).toBe("violet");
  });

  it("closes popover after selecting a palette", () => {
    render(
      <ThemeProvider>
        <PalettePicker />
      </ThemeProvider>
    );

    const button = screen.getByRole("button", { name: /paleta/i });
    fireEvent.click(button);

    expect(screen.getByText("PALETA")).toBeInTheDocument();

    const blueBtn = screen.getByRole("button", { name: "Azul" });
    fireEvent.click(blueBtn);

    expect(screen.queryByText("PALETA")).not.toBeInTheDocument();
  });
});
