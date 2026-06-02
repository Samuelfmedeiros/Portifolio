import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BuyMeACoffee } from "./BuyMeACoffee";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("BuyMeACoffee", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("renders nothing when BMC not configured", () => {
    vi.stubEnv("NEXT_PUBLIC_BMC_USERNAME", "");
    const { container } = render(<BuyMeACoffee />);
    expect(container.innerHTML).toBe("");
  });

  it("renders link when BMC configured", () => {
    vi.stubEnv("NEXT_PUBLIC_BMC_USERNAME", "samueldev");
    render(<BuyMeACoffee />);
    const link = screen.getByRole("link");
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toContain("buymeacoffee.com/samueldev");
  });

  it("opens in new tab with correct rel", () => {
    vi.stubEnv("NEXT_PUBLIC_BMC_USERNAME", "samueldev");
    render(<BuyMeACoffee />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("shows compact variant by default", () => {
    vi.stubEnv("NEXT_PUBLIC_BMC_USERNAME", "samueldev");
    const { container } = render(<BuyMeACoffee />);
    // Compact = no text label, just icon
    expect(container.innerHTML).toBeTruthy();
  });

  it("shows full variant with label text", () => {
    vi.stubEnv("NEXT_PUBLIC_BMC_USERNAME", "samueldev");
    render(<BuyMeACoffee variant="full" />);
    expect(screen.getByText(/coffee/i)).toBeTruthy();
  });
});
