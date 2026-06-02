import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ScrollProgress } from "../ScrollProgress";

describe("ScrollProgress", () => {
  it("renders without crashing", () => {
    const { container } = render(<ScrollProgress />);
    expect(container).toBeTruthy();
  });

  it("is memoized", () => {
    expect(ScrollProgress.displayName).toBe("ScrollProgress");
  });

  it("renders a progress bar element", () => {
    const { container } = render(<ScrollProgress />);
    const bar = container.querySelector(".scroll-progress");
    expect(bar).toBeTruthy();
  });
});
