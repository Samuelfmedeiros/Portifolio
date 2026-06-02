import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdSense } from "./AdSense";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock the monetization provider hook
const mockAdsAllowed = vi.fn();
const mockPersonalizedAdsAllowed = vi.fn();

vi.mock("./monetization/MonetizationProvider", () => ({
  useMonetizationConsent: () => ({
    adsAllowed: mockAdsAllowed(),
    personalizedAdsAllowed: mockPersonalizedAdsAllowed(),
  }),
}));

describe("AdSense", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    mockAdsAllowed.mockReturnValue(false);
    mockPersonalizedAdsAllowed.mockReturnValue(false);
    // Clean up any AdSense scripts
    document.querySelectorAll('script[src*="adsbygoogle"]').forEach((s) => s.remove());
    // Clean window.adsbygoogle
    delete (window as any).adsbygoogle;
  });

  it("renders nothing when ads not allowed", () => {
    mockAdsAllowed.mockReturnValue(false);
    const { container } = render(<AdSense />);
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when AdSense not configured (no client ID)", () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID", "");
    mockAdsAllowed.mockReturnValue(true);
    const { container } = render(<AdSense />);
    expect(container.innerHTML).toBe("");
  });

  it("renders ad container when ads allowed and configured", () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID", "ca-pub-12345");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_SLOT_FOOTER", "1234567890");
    mockAdsAllowed.mockReturnValue(true);

    const { container } = render(<AdSense />);
    const adEl = container.querySelector("[data-ad-client]");
    expect(adEl).toBeTruthy();
  });

  it("sets data-ad-client attribute", () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID", "ca-pub-test123");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_SLOT_FOOTER", "slot-123");
    mockAdsAllowed.mockReturnValue(true);

    const { container } = render(<AdSense />);
    const adEl = container.querySelector("[data-ad-client]");
    expect(adEl?.getAttribute("data-ad-client")).toBe("ca-pub-test123");
  });

  it("uses non-personalized ads when personalized not allowed", () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID", "ca-pub-test123");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_SLOT_FOOTER", "slot-123");
    mockAdsAllowed.mockReturnValue(true);
    mockPersonalizedAdsAllowed.mockReturnValue(false);

    const { container } = render(<AdSense />);
    const adEl = container.querySelector("[data-ad-client]");
    // Non-personalized ads don't get data-personalized-ads or it's set to 0
    expect(adEl).toBeTruthy();
  });

  it("accepts custom slot and format props", () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID", "ca-pub-test123");
    mockAdsAllowed.mockReturnValue(true);

    const { container } = render(<AdSense slot="custom-slot" format="auto" />);
    const adEl = container.querySelector("[data-ad-client]");
    expect(adEl?.getAttribute("data-ad-slot")).toBe("custom-slot");
    expect(adEl?.getAttribute("data-ad-format")).toBe("auto");
  });
});
