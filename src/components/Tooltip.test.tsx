import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  it("renders children without showing tooltip initially", () => {
    render(
      <Tooltip content="Tooltip content">
        <span data-testid="trigger">Hover me</span>
      </Tooltip>
    );
    expect(screen.getByTestId("trigger")).toBeInTheDocument();
  });

  it("does not show tooltip content before hover", () => {
    render(
      <Tooltip content="Tooltip content">
        <span>Trigger</span>
      </Tooltip>
    );
    // Tooltip uses AnimatePresence with 200ms delay — won't be visible immediately
    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
  });
});
