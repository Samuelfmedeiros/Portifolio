import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "./ThemeToggle";
import { ThemeProvider, useTheme } from "./ThemeProvider";
import React from "react";

// Test component to access theme context
function TestToggleWrapper() {
  const { theme } = useTheme();
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <ThemeToggle />
    </div>
  );
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders toggle button", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toBeTruthy();
  });

  it("shows correct aria-label in dark mode", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute(
      "aria-label",
      "Ativar modo claro"
    );
  });

  it("shows correct aria-label in light mode", () => {
    // Set initial theme to light via localStorage
    localStorage.setItem("mc-theme", "light");

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute(
      "aria-label",
      "Ativar modo escuro"
    );
  });

  it("toggles theme when clicked", () => {
    localStorage.setItem("mc-theme", "dark");

    render(
      <ThemeProvider>
        <TestToggleWrapper />
      </ThemeProvider>
    );

    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
  });

  it("saves theme to localStorage", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(localStorage.getItem("mc-theme")).toBeTruthy();
  });

  it("has glass and rounded classes", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("glass");
    expect(button).toHaveClass("rounded-full");
  });

  it("contains an icon (Sun or Moon)", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole("button");
    // Button should contain an SVG element (the icon)
    expect(button.querySelector("svg")).toBeTruthy();
  });

  it("toggles from light to dark", () => {
    localStorage.setItem("mc-theme", "light");

    render(
      <ThemeProvider>
        <TestToggleWrapper />
      </ThemeProvider>
    );

    expect(screen.getByTestId("current-theme")).toHaveTextContent("light");

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
  });
});
