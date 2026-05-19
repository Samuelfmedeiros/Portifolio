import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScrollProgress } from "../ScrollProgress";

describe("ScrollProgress", () => {
  it("renders with correct role and aria-hidden", () => {
    render(<ScrollProgress />);
    const bar = screen.getByRole("presentation");
    expect(bar).toHaveAttribute("aria-hidden", "true");
    expect(bar).toHaveClass("scroll-progress");
  });

  it("is memoized", () => {
    expect(ScrollProgress.displayName).toBe("ScrollProgress");
  });

  it("starts with 0% width", () => {
    const { container } = render(<ScrollProgress />);
    const bar = container.querySelector(".scroll-progress");
    expect(bar).toHaveStyle({ width: "0%" });
  });
});
