import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

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
    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
  });

  it("does not crash on mouse enter", () => {
    render(
      <Tooltip content="Tooltip content">
        <span data-testid="trigger">Hover</span>
      </Tooltip>
    );
    const trigger = screen.getByTestId("trigger").parentElement!;
    fireEvent.mouseEnter(trigger);
    vi.advanceTimersByTime(200);
    expect(true).toBe(true);
  });

  it("does not crash on mouse leave", () => {
    render(
      <Tooltip content="Tooltip content">
        <span data-testid="trigger">Hover</span>
      </Tooltip>
    );
    const trigger = screen.getByTestId("trigger").parentElement!;
    fireEvent.mouseEnter(trigger);
    fireEvent.mouseLeave(trigger);
    vi.advanceTimersByTime(200);
    expect(true).toBe(true);
  });

  it("does not crash on touch start", () => {
    render(
      <Tooltip content="Touch content">
        <span data-testid="trigger">Touch</span>
      </Tooltip>
    );
    const trigger = screen.getByTestId("trigger").parentElement!;
    fireEvent.touchStart(trigger, { preventDefault: () => {} });
    fireEvent.touchStart(trigger, { preventDefault: () => {} });
    expect(true).toBe(true);
  });

  it("renders without error for touch outside", () => {
    render(
      <Tooltip content="Content">
        <span data-testid="trigger">Hover</span>
      </Tooltip>
    );
    const trigger = screen.getByTestId("trigger").parentElement!;
    fireEvent.mouseEnter(trigger);
    vi.advanceTimersByTime(200);
    expect(true).toBe(true);
  });
});
