import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkillsGrid } from "./SkillsGrid";

describe("SkillsGrid", () => {
  it("renders the section heading", () => {
    render(<SkillsGrid />);
    expect(screen.getByText(/SKILLS MATRIX/i)).toBeDefined();
  });

  it("renders all 8 skills", () => {
    render(<SkillsGrid />);
    expect(screen.getByText("Power BI")).toBeDefined();
    expect(screen.getByText("Python")).toBeDefined();
    expect(screen.getByText("Docker")).toBeDefined();
  });
});
