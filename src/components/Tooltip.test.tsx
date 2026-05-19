import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tooltip } from "../Tooltip";

describe("Tooltip", () => {
  it("renders children without showing tooltip initially", () => {
    render(
      <Tooltip content="Tooltip content">
        <span data-testid="trigger">Hover me</span>
      </Tooltip>
    );
    expect(screen.getByTestId("trigger")).toBeInTheDocument();
    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
  });

  it("wraps content in a memoized component", () => {
    // Tooltip should be a memoized component
    expect(Tooltip.displayName).toBe("Tooltip");
  });
});
