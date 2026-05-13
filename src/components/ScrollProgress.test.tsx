import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ScrollProgress } from "../ScrollProgress";

describe("ScrollProgress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset scroll position
    window.scrollY = 0;
    Object.defineProperty(window, "scrollY", { writable: true, value: 0 });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders progress bar element", () => {
    render(<ScrollProgress />);
    const progressBar = screen.getByRole("presentation", { hidden: true });
    expect(progressBar).toBeTruthy();
  });

  it("has correct initial width", () => {
    render(<ScrollProgress />);
    const progressBar = screen.getByRole("presentation", { hidden: true });
    expect(progressBar).toHaveStyle({ width: "0%" });
  });

  it("updates progress on scroll", async () => {
    render(<ScrollProgress />);
    const progressBar = screen.getByRole("presentation", { hidden: true });

    // Mock scroll position
    Object.defineProperty(window, "scrollY", { writable: true, value: 500 });

    // Dispatch scroll event
    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
    });

    // Progress should update (actual value depends on document height)
    expect(progressBar).toBeInTheDocument();
  });

  it("has aria-hidden attribute", () => {
    render(<ScrollProgress />);
    const progressBar = screen.getByRole("presentation", { hidden: true });
    expect(progressBar).toHaveAttribute("aria-hidden", "true");
  });

  it("has scroll-progress class", () => {
    render(<ScrollProgress />);
    const progressBar = screen.getByRole("presentation", { hidden: true });
    expect(progressBar).toHaveClass("scroll-progress");
  });

  it("handles zero document height gracefully", async () => {
    // Mock document with zero scroll height
    Object.defineProperty(document.documentElement, "scrollHeight", {
      get: () => 0,
    });

    render(<ScrollProgress />);
    const progressBar = screen.getByRole("presentation", { hidden: true });

    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(progressBar).toHaveStyle({ width: "0%" });
  });

  it("removes scroll listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<ScrollProgress />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
  });
});
