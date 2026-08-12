import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CookieBannerProvider, useAnalyticsConsent } from "./CookieBanner";

// Mock de i18n (padrão do projeto): t(key, fallback) => fallback ?? key
vi.mock("@/lib/i18n", () => ({
  useLanguage: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
    lang: "pt",
  }),
}));

// Mock do Umami script loader
vi.mock("@/lib/umami", () => ({
  loadUmamiScript: vi.fn(),
}));

const CONSENT_KEY = "mc-analytics-consent";

function Probe() {
  const { consent, showBanner, accept, decline } = useAnalyticsConsent();
  return (
    <div>
      <span data-testid="consent">{String(consent)}</span>
      <span data-testid="show-banner">{String(showBanner)}</span>
      <button onClick={accept}>Aceitar</button>
      <button onClick={decline}>Recusar</button>
    </div>
  );
}

describe("CookieBannerProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("mostra o banner após o mount quando não há consentimento salvo", async () => {
    render(
      <CookieBannerProvider>
        <Probe />
      </CookieBannerProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("show-banner").textContent).toBe("true");
    });
    expect(screen.getByTestId("consent").textContent).toBe("null");
  });

  it("não mostra o banner quando consentimento já foi aceito", async () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    render(
      <CookieBannerProvider>
        <Probe />
      </CookieBannerProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("consent").textContent).toBe("accepted");
    });
    expect(screen.getByTestId("show-banner").textContent).toBe("false");
  });

  it("accept() salva consentimento e esconde o banner", async () => {
    const user = userEvent.setup();
    render(
      <CookieBannerProvider>
        <Probe />
      </CookieBannerProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("show-banner").textContent).toBe("true");
    });
    await user.click(screen.getByText("Aceitar"));
    await waitFor(() => {
      expect(localStorage.getItem(CONSENT_KEY)).toBe("accepted");
      expect(screen.getByTestId("show-banner").textContent).toBe("false");
      expect(screen.getByTestId("consent").textContent).toBe("accepted");
    });
  });

  it("decline() salva recusa e esconde o banner", async () => {
    const user = userEvent.setup();
    render(
      <CookieBannerProvider>
        <Probe />
      </CookieBannerProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("show-banner").textContent).toBe("true");
    });
    await user.click(screen.getByText("Recusar"));
    await waitFor(() => {
      expect(localStorage.getItem(CONSENT_KEY)).toBe("declined");
      expect(screen.getByTestId("show-banner").textContent).toBe("false");
      expect(screen.getByTestId("consent").textContent).toBe("declined");
    });
  });
});
