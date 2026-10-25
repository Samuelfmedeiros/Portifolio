import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react";
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

  it("shows tooltip content after mouse enter delay", () => {
    render(
      <Tooltip content="Tooltip content">
        <span data-testid="trigger">Hover</span>
      </Tooltip>
    );
    const trigger = screen.getByTestId("trigger").parentElement!;
    fireEvent.mouseEnter(trigger);
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.getByText("Tooltip content")).toBeInTheDocument();
  });

  it("hides tooltip on mouse leave before delay completes", () => {
    render(
      <Tooltip content="Tooltip content">
        <span data-testid="trigger">Hover</span>
      </Tooltip>
    );
    const trigger = screen.getByTestId("trigger").parentElement!;
    fireEvent.mouseEnter(trigger);
    fireEvent.mouseLeave(trigger);
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
  });

  it("toggles tooltip on touch start", () => {
    render(
      <Tooltip content="Touch content">
        <span data-testid="trigger">Touch</span>
      </Tooltip>
    );
    const trigger = screen.getByTestId("trigger").parentElement!;
    fireEvent.touchStart(trigger, { preventDefault: () => {} });
    expect(screen.getByText("Touch content")).toBeInTheDocument();
    fireEvent.touchStart(trigger, { preventDefault: () => {} });
    expect(screen.queryByText("Touch content")).not.toBeInTheDocument();
  });

  it("hides tooltip on touch outside", () => {
    render(
      <Tooltip content="Content">
        <span data-testid="trigger">Hover</span>
      </Tooltip>
    );
    const trigger = screen.getByTestId("trigger").parentElement!;
    fireEvent.mouseEnter(trigger);
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.getByText("Content")).toBeInTheDocument();
    const overlay = document.querySelector(".fixed.inset-0");
    expect(overlay).toBeInTheDocument();
    act(() => {
      fireEvent.touchStart(overlay!, { preventDefault: () => {} });
    });
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });
});
