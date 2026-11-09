import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  ADSENSE_CONFIG,
  BMC_CONFIG,
  GITHUB_SPONSORS_CONFIG,
  canShowAds,
  canShowPersonalizedAds,
  getProjectAffiliates,
  getActiveAffiliates,
  parseMonetizationConsent,
  DEFAULT_MONETIZATION_CONSENT,
  MONETIZATION_CONSENT_KEY,
  isValidAdSlot,
} from "./monetization";

describe("monetization", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  describe("ADSENSE_CONFIG", () => {
    // 🔴 09/11/2026: o client ID publico passou a ser fallback. `NEXT_PUBLIC_*`
    // e resolvido em tempo de BUILD — a Vercel nao tinha a var, entao o HTML de
    // producao saia com enabled=false e o script do AdSense nunca era injetado.
    // O client ID nao e segredo (esta em public/ads.txt e na URL do script).
    it("usa o client ID publico quando a env var nao existe", () => {
      vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID", "");
      expect(ADSENSE_CONFIG.clientId).toBe("ca-pub-5928931854509344");
    });

    it("env var tem precedencia sobre o client ID publico", () => {
      vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID", "ca-pub-12345");
      expect(ADSENSE_CONFIG.clientId).toBe("ca-pub-12345");
    });

    it("fica habilitado mesmo sem env var (fallback publico)", () => {
      vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID", "");
      expect(ADSENSE_CONFIG.enabled).toBe(true);
    });

    it("status.clientId reflete a env var, nao o fallback", () => {
      vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID", "");
      expect(ADSENSE_CONFIG.status.clientId).toBe(false);
      vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID", "ca-pub-999");
      expect(ADSENSE_CONFIG.status.clientId).toBe(true);
    });
  });

  // Regressao 08/11/2026: o .env trazia "footer"/"sidebar" como slot — texto,
  // nao ID numerico. O AdSense rejeita no push e o catch silencioso escondia.
  describe("isValidAdSlot", () => {
    it("aceita slot numerico de ~10 digitos", () => {
      expect(isValidAdSlot("1234567890")).toBe(true);
      expect(isValidAdSlot("123456")).toBe(true);
      expect(isValidAdSlot("  1234567890  ")).toBe(true);
    });

    it("rejeita os valores fantasma que estavam no .env", () => {
      expect(isValidAdSlot("footer")).toBe(false);
      expect(isValidAdSlot("sidebar")).toBe(false);
    });

    it("rejeita vazio, nulo e curto demais", () => {
      expect(isValidAdSlot("")).toBe(false);
      expect(isValidAdSlot(null)).toBe(false);
      expect(isValidAdSlot(undefined)).toBe(false);
      expect(isValidAdSlot("12345")).toBe(false);
    });

    it("rejeita texto com digitos misturados", () => {
      expect(isValidAdSlot("footer-123456")).toBe(false);
      expect(isValidAdSlot("123456-preview")).toBe(false);
    });
  });

  describe("BMC_CONFIG", () => {
    it("returns empty username when env var not set", () => {
      vi.stubEnv("NEXT_PUBLIC_BMC_USERNAME", "");
      expect(BMC_CONFIG.username).toBe("");
    });

    it("returns username from env var", () => {
      vi.stubEnv("NEXT_PUBLIC_BMC_USERNAME", "samueldev");
      expect(BMC_CONFIG.username).toBe("samueldev");
    });

    it("generates correct BMC URL", () => {
      vi.stubEnv("NEXT_PUBLIC_BMC_USERNAME", "samueldev");
      expect(BMC_CONFIG.url).toBe("https://buymeacoffee.com/samueldev");
    });

    it("is disabled when no username", () => {
      vi.stubEnv("NEXT_PUBLIC_BMC_USERNAME", "");
      expect(BMC_CONFIG.enabled).toBe(false);
    });
  });

  describe("GITHUB_SPONSORS_CONFIG", () => {
    it("returns empty username when env var not set", () => {
      vi.stubEnv("NEXT_PUBLIC_GITHUB_SPONSORS_USERNAME", "");
      expect(GITHUB_SPONSORS_CONFIG.username).toBe("");
    });

    it("returns username from env var", () => {
      vi.stubEnv("NEXT_PUBLIC_GITHUB_SPONSORS_USERNAME", "samueldev");
      expect(GITHUB_SPONSORS_CONFIG.username).toBe("samueldev");
    });

    it("generates correct sponsors URL", () => {
      vi.stubEnv("NEXT_PUBLIC_GITHUB_SPONSORS_USERNAME", "samueldev");
      expect(GITHUB_SPONSORS_CONFIG.url).toBe("https://github.com/sponsors/samueldev");
    });
  });

  describe("canShowAds", () => {
    it("returns false when no consent", () => {
      expect(canShowAds(DEFAULT_MONETIZATION_CONSENT)).toBe(false);
    });

    it("returns true when non-personalized ads consented", () => {
      expect(canShowAds({ analytics: true, ads: false, nonPersonalizedAds: true })).toBe(true);
    });

    it("returns true when personalized ads consented", () => {
      expect(canShowAds({ analytics: true, ads: true, nonPersonalizedAds: true })).toBe(true);
    });

    it("returns false when ads declined", () => {
      expect(canShowAds({ analytics: true, ads: false, nonPersonalizedAds: false })).toBe(false);
    });
  });

  describe("canShowPersonalizedAds", () => {
    it("returns false when no consent", () => {
      expect(canShowPersonalizedAds(DEFAULT_MONETIZATION_CONSENT)).toBe(false);
    });

    it("returns true only when ads AND analytics consented", () => {
      expect(canShowPersonalizedAds({ analytics: true, ads: true, nonPersonalizedAds: true })).toBe(true);
      expect(canShowPersonalizedAds({ analytics: false, ads: true, nonPersonalizedAds: true })).toBe(false);
      expect(canShowPersonalizedAds({ analytics: true, ads: false, nonPersonalizedAds: true })).toBe(false);
    });
  });

  describe("getProjectAffiliates", () => {
    it("returns empty array for unknown project", () => {
      expect(getProjectAffiliates("unknown-project")).toEqual([]);
    });

    it("returns affiliates for known project", () => {
      const result = getProjectAffiliates("seu.pet");
      // Depending on configured affiliates
      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty("key");
        expect(result[0]).toHaveProperty("name");
        expect(result[0]).toHaveProperty("url");
        expect(result[0]).toHaveProperty("icon");
      }
    });
  });

  describe("getActiveAffiliates", () => {
    it("returns array of active affiliates", () => {
      const result = getActiveAffiliates();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("parseMonetizationConsent", () => {
    it("returns null for null/undefined", () => {
      expect(parseMonetizationConsent(null)).toBeNull();
      expect(parseMonetizationConsent(undefined)).toBeNull();
    });

    it("returns null for invalid JSON", () => {
      expect(parseMonetizationConsent("not-json")).toBeNull();
    });

    it("returns null for JSON without required fields", () => {
      expect(parseMonetizationConsent('{"foo": true}')).toBeNull();
    });

    it("parses valid consent object", () => {
      const consent = { analytics: true, ads: false, nonPersonalizedAds: true };
      expect(parseMonetizationConsent(JSON.stringify(consent))).toEqual(consent);
    });

    it("coerces non-boolean values to booleans", () => {
      const raw = '{"analytics": 1, "ads": 0, "nonPersonalizedAds": "yes"}';
      const result = parseMonetizationConsent(raw);
      expect(result).not.toBeNull();
      expect(result?.analytics).toBe(true);
      expect(result?.ads).toBe(false);
      expect(result?.nonPersonalizedAds).toBe(true);
    });
  });

  describe("MONETIZATION_CONSENT_KEY", () => {
    it("is a non-empty string", () => {
      expect(typeof MONETIZATION_CONSENT_KEY).toBe("string");
      expect(MONETIZATION_CONSENT_KEY.length).toBeGreaterThan(0);
    });
  });

  describe("DEFAULT_MONETIZATION_CONSENT", () => {
    it("has all fields set to false", () => {
      expect(DEFAULT_MONETIZATION_CONSENT).toEqual({
        analytics: false,
        ads: false,
        nonPersonalizedAds: false,
      });
    });
  });
});
