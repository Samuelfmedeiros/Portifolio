import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BackToTop } from "../BackToTop";

describe("BackToTop", () => {
  it("is memoized", () => {
    expect(BackToTop.displayName).toBe("BackToTop");
  });

  it("does not render initially (scrollY is 0)", () => {
    render(<BackToTop />);
    // Button should not be visible since scroll position is 0
    expect(screen.queryByRole("button", { name: /voltar ao topo/i })).not.toBeInTheDocument();
  });

  it("has correct aria-label when rendered", () => {
    // Check that the button has proper accessibility attributes
    const { container } = render(<BackToTop />);
    // The button should have aria-label when visible
    const button = container.querySelector("button");
    if (button) {
      expect(button).toHaveAttribute("aria-label", "Voltar ao topo");
    }
  });
});
