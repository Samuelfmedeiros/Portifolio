import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { GitHubSponsors } from "./GitHubSponsors";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("GitHubSponsors", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("renders nothing when GitHub Sponsors not configured", () => {
    vi.stubEnv("NEXT_PUBLIC_GITHUB_SPONSORS_USERNAME", "");
    const { container } = render(<GitHubSponsors />);
    expect(container.innerHTML).toBe("");
  });

  it("renders link when configured", () => {
    vi.stubEnv("NEXT_PUBLIC_GITHUB_SPONSORS_USERNAME", "samueldev");
    render(<GitHubSponsors />);
    const link = screen.getByRole("link");
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toContain("github.com/sponsors/samueldev");
  });

  it("opens in new tab with correct rel", () => {
    vi.stubEnv("NEXT_PUBLIC_GITHUB_SPONSORS_USERNAME", "samueldev");
    render(<GitHubSponsors />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("renders compact variant", () => {
    vi.stubEnv("NEXT_PUBLIC_GITHUB_SPONSORS_USERNAME", "samueldev");
    const { container } = render(<GitHubSponsors />);
    expect(container.innerHTML).toBeTruthy();
  });

  it("renders full variant with label", () => {
    vi.stubEnv("NEXT_PUBLIC_GITHUB_SPONSORS_USERNAME", "samueldev");
    render(<GitHubSponsors variant="full" />);
    expect(screen.getByText(/patrocin/i)).toBeTruthy();
  });
});
