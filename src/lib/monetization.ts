// === Mission Control — Monetization Configuration ===
// Centralized config for all monetization methods.
// All IDs are loaded from env vars for security — no hardcoded secrets.

/** AdSense configuration — requires analytics/ads consent */
export const ADSENSE_CONFIG = {
  /** Google AdSense client ID (ca-pub-XXXX). Set via NEXT_PUBLIC_ADSENSE_CLIENT_ID */
  get clientId(): string {
    const value = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
    return value ?? "";
  },
  /** Ad slot ID for the footer banner. Set via NEXT_PUBLIC_ADSENSE_SLOT_FOOTER */
  footerSlot: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER || "",
  /** Ad slot ID for sidebar. Set via NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR */
  sidebarSlot: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || "",
  /** Whether AdSense is enabled (requires client ID) */
  get enabled(): boolean {
    const value = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
    return !!value;
  },
};

/** Buy Me a Coffee configuration */
export const BMC_CONFIG = {
  /** BMC username. Set via NEXT_PUBLIC_BMC_USERNAME */
  get username(): string {
    const value = process.env.NEXT_PUBLIC_BMC_USERNAME;
    if (value === undefined || value === null) return "samuelmedeiros";
    return value;
  },
  /** Full BMC URL */
  get url(): string {
    return `https://buymeacoffee.com/${this.username}`;
  },
  /** Whether BMC is enabled */
  get enabled(): boolean {
    return !!this.username;
  },
};

/** GitHub Sponsors configuration */
export const GITHUB_SPONSORS_CONFIG = {
  /** GitHub username for sponsors */
  get username(): string {
    const value = process.env.NEXT_PUBLIC_GITHUB_SPONSORS_USERNAME;
    if (value === undefined || value === null) return "Samuelfmedeiros";
    return value;
  },
  /** Full sponsors URL */
  get url(): string {
    return `https://github.com/sponsors/${this.username}`;
  },
  /** Whether GitHub Sponsors is enabled */
  get enabled(): boolean {
    return !!this.username;
  },
};

/** Affiliate link definitions — tools/services actually used in projects */
export interface AffiliateLink {
  /** Unique key for the affiliate */
  key: string;
  /** Display name */
  name: string;
  /** Affiliate URL (with tracking param) */
  url: string;
  /** Optional icon name (lucide-react) */
  icon?: string;
  /** Category for grouping */
  category: "hosting" | "database" | "tools" | "learning";
  /** Whether this affiliate is active */
  active: boolean;
}

export const AFFILIATE_LINKS: AffiliateLink[] = [
  {
    key: "vercel",
    name: "Vercel",
    url: "https://vercel.com/?utm_source=samuelmedeiros&utm_campaign=portfolio",
    category: "hosting",
    active: true,
  },
  {
    key: "supabase",
    name: "Supabase",
    url: "https://supabase.com/?ref=samuelmedeiros",
    category: "database",
    active: true,
  },
  {
    key: "cloudflare",
    name: "Cloudflare",
    url: "https://www.cloudflare.com/?utm_source=samuelmedeiros",
    category: "hosting",
    active: true,
  },
];

/** Get active affiliates filtered by category */
export function getActiveAffiliates(category?: AffiliateLink["category"]): AffiliateLink[] {
  return AFFILIATE_LINKS.filter(
    (a) => a.active && (!category || a.category === category)
  );
}

/** Map project names to relevant affiliate links */
export const PROJECT_AFFILIATES: Record<string, string[]> = {
  "seu.pet": [],
  "mission-control": ["vercel"],
  DogWalk: ["supabase", "cloudflare"],
};

/** Get affiliate keys for a project name */
export function getProjectAffiliates(projectName: string): AffiliateLink[] {
  const keys = PROJECT_AFFILIATES[projectName] || [];
  return AFFILIATE_LINKS.filter((a) => keys.includes(a.key) && a.active);
}

/** Monetization consent types — extends analytics consent */
export type MonetizationConsent = {
  /** User accepted analytics (base consent) */
  analytics: boolean;
  /** User accepted personalized ads (requires analytics) */
  ads: boolean;
  /** User accepted non-personalized ads (does NOT require analytics) */
  nonPersonalizedAds: boolean;
};

/** LocalStorage key for monetization consent */
export const MONETIZATION_CONSENT_KEY = "mc-monetization-consent";

/** Parse stored monetization consent */
export function parseMonetizationConsent(raw: string | null): MonetizationConsent | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "analytics" in parsed &&
      "ads" in parsed &&
      "nonPersonalizedAds" in parsed
    ) {
      return {
        analytics: Boolean(parsed.analytics),
        ads: Boolean(parsed.ads),
        nonPersonalizedAds: Boolean(parsed.nonPersonalizedAds),
      };
    }
  } catch {
    // invalid JSON
  }
  return null;
}

/** Default monetization consent (all denied) */
export const DEFAULT_MONETIZATION_CONSENT: MonetizationConsent = {
  analytics: false,
  ads: false,
  nonPersonalizedAds: false,
};

/** Whether any ad can be shown (non-personalized OR personalized with consent) */
export function canShowAds(consent: MonetizationConsent | null): boolean {
  if (!consent) return false;
  return consent.nonPersonalizedAds || (consent.analytics && consent.ads);
}

/** Whether personalized ads can be shown */
export function canShowPersonalizedAds(consent: MonetizationConsent | null): boolean {
  if (!consent) return false;
  return consent.analytics && consent.ads;
}
