import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MiniGame } from "./MiniGame";

describe("MiniGame", () => {
  it("shows start button initially", () => {
    render(<MiniGame />);
    expect(screen.getByText("🚀 INICIAR")).toBeDefined();
  });

  it("shows game grid after starting", () => {
    render(<MiniGame />);
    fireEvent.click(screen.getByText("🚀 INICIAR"));
    // Should show number buttons
    expect(screen.getByText("1")).toBeDefined();
    expect(screen.getByText("2")).toBeDefined();
    expect(screen.getByText("3")).toBeDefined();
    expect(screen.getByText("4")).toBeDefined();
  });

  it("buttons are disabled during sequence playback", () => {
    render(<MiniGame />);
    fireEvent.click(screen.getByText("🚀 INICIAR"));
    const btn = screen.getByText("1");
    expect(btn.hasAttribute("disabled")).toBe(true);
  });
});
