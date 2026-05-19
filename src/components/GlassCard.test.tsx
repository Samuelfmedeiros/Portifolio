import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GlassCard } from "../GlassCard";

describe("GlassCard", () => {
  it("renders children", () => {
    render(<GlassCard>Hello</GlassCard>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("forwards ref to the motion.div", () => {
    const ref = { current: null };
    render(<GlassCard ref={ref}>Content</GlassCard>);
    expect(ref.current).toBeTruthy();
  });

  it("has display name for debugging", () => {
    expect(GlassCard.displayName).toBe("GlassCard");
  });

  it("applies className correctly", () => {
    const { container } = render(<GlassCard className="custom-class">Test</GlassCard>);
    const div = container.firstChild;
    expect(div).toHaveClass("custom-class");
  });
});
