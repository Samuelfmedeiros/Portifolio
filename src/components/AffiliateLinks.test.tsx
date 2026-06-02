import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AffiliateBadge, ProjectAffiliates } from "./AffiliateLinks";
import { getProjectAffiliates, getActiveAffiliates } from "@/lib/monetization";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
}));

vi.mock("@/lib/monetization", () => ({
  getProjectAffiliates: vi.fn(),
  getActiveAffiliates: vi.fn(),
}));

const mockedGetProjectAffiliates = getProjectAffiliates as ReturnType<typeof vi.fn>;
const mockedGetActiveAffiliates = getActiveAffiliates as ReturnType<typeof vi.fn>;

describe("AffiliateBadge", () => {
  it("renders a link with rel=sponsored", () => {
    render(
      <AffiliateBadge
        name="Vercel"
        url="https://vercel.com/?ref=samuel"
        icon="▲"
      />
    );
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("https://vercel.com/?ref=samuel");
    expect(link.getAttribute("rel")).toContain("sponsored");
    expect(link.getAttribute("target")).toBe("_blank");
  });

  it("displays the icon and name", () => {
    render(<AffiliateBadge name="Vercel" url="https://vercel.com" icon="▲" />);
    expect(screen.getByText("▲")).toBeTruthy();
    expect(screen.getByText("Vercel")).toBeTruthy();
  });
});

describe("ProjectAffiliates", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when project has no affiliates", () => {
    mockedGetProjectAffiliates.mockReturnValue([]);
    const { container } = render(<ProjectAffiliates projectName="unknown" />);
    expect(container.innerHTML).toBe("");
  });

  it("renders affiliate badges when project has affiliates", () => {
    mockedGetProjectAffiliates.mockReturnValue([
      { key: "vercel", name: "Vercel", url: "https://vercel.com/?ref=samuel", icon: "▲" },
      { key: "supabase", name: "Supabase", url: "https://supabase.com/?ref=samuel", icon: "⚡" },
    ]);
    render(<ProjectAffiliates projectName="seu.pet" />);
    expect(screen.getByText("Vercel")).toBeTruthy();
    expect(screen.getByText("Supabase")).toBeTruthy();
  });

  it("all affiliate links have rel=sponsored for SEO compliance", () => {
    mockedGetProjectAffiliates.mockReturnValue([
      { key: "vercel", name: "Vercel", url: "https://vercel.com/?ref=samuel", icon: "▲" },
    ]);
    render(<ProjectAffiliates projectName="seu.pet" />);
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link.getAttribute("rel")).toContain("sponsored");
    });
  });
});
