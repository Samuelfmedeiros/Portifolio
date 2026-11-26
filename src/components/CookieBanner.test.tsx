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

// Mock do OpenPanel script loader
vi.mock("@/lib/openpanel", () => ({
  loadOpenpanelScript: vi.fn(),
  openpanelTrack: vi.fn(),
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

/**
 * 26/11/2026 — comportamento do fix do gap de UI da rodada 2: a barra fixa
 * nascia POR CIMA dos cards de skills (medido em .audit-shots: barra em
 * y≈690-800 cobrindo a linha "NÍVEL" em y≈655-790). O contrato verificável é
 * que a barra não exista no DOM no topo da página e só entre depois do scroll.
 */
describe("CookieBannerProvider — barra não sobrepõe conteúdo (rodada 2)", () => {
  const BANNER = '[data-testid="cookie-banner"]';

  /** jsdom tem scrollHeight 0 / innerHeight 768: força página rolável. */
  function paginaRolavel(h = 3000) {
    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: h,
    });
  }

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 0,
    });
    paginaRolavel();
  });

  afterEach(() => {
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 0,
    });
  });

  it("mostra showBanner=true no mount mas NÃO renderiza a barra sobre o topo da página", async () => {
    render(
      <CookieBannerProvider>
        <Probe />
      </CookieBannerProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("show-banner").textContent).toBe("true");
    });
    expect(document.querySelector(BANNER)).toBeNull();
  });

  it("revela a barra depois do primeiro scroll do usuário", async () => {
    render(
      <CookieBannerProvider>
        <Probe />
      </CookieBannerProvider>,
    );
    await waitFor(() => {
      expect(screen.queryByTestId("show-banner")).toBeInTheDocument();
    });
    expect(document.querySelector(BANNER)).toBeNull();

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 240,
    });
    window.dispatchEvent(new Event("scroll"));

    await waitFor(() => {
      expect(document.querySelector(BANNER)).not.toBeNull();
    });
  });

  it("revela a barra imediatamente quando a página não tem scroll (nada a cobrir)", async () => {
    paginaRolavel(400); // 400 < innerHeight + 8
    render(
      <CookieBannerProvider>
        <Probe />
      </CookieBannerProvider>,
    );
    await waitFor(() => {
      expect(document.querySelector(BANNER)).not.toBeNull();
    });
  });

  it("não reserva altura no documento enquanto a barra está oculta no topo", async () => {
    render(
      <CookieBannerProvider>
        <Probe />
      </CookieBannerProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("show-banner").textContent).toBe("true");
    });
    expect(
      document.documentElement.style.getPropertyValue("--cookie-banner-h"),
    ).toBe("");
  });

  it("reserva a altura real da barra em --cookie-banner-h e limpa ao aceitar", async () => {
    // jsdom devolve offsetHeight 0: mede com um valor concreto para provar o
    // contrato (a altura vem de getComputedStyle/ResizeObserver, não constante).
    const alturaSpy = vi
      .spyOn(HTMLElement.prototype, "offsetHeight", "get")
      .mockReturnValue(110);

    render(
      <CookieBannerProvider>
        <Probe />
      </CookieBannerProvider>,
    );
    // revela via scroll para exercitar o caminho real da home
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 240,
    });
    window.dispatchEvent(new Event("scroll"));

    await waitFor(() => {
      expect(
        document.documentElement.style.getPropertyValue("--cookie-banner-h"),
      ).toBe("110px");
    });

    fireEvent.click(screen.getByText("Aceitar"));

    await waitFor(() => {
      expect(
        document.documentElement.style.getPropertyValue("--cookie-banner-h"),
      ).toBe("");
    });

    alturaSpy.mockRestore();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 26/11/2026 — gap da rodada 2 do test-loop: a barra `fixed bottom-0` nascia
// POR CIMA do conteúdo. Medido em .audit-shots no desktop 1280x800: cards de
// skills ocupam y≈655-790 e a barra cobria y≈690-800 — a linha "NÍVEL" dos
// cards ficava escondida por um overlay. Contrato preservado (`showBanner`
// continua true no mount); o que mudou é QUANDO a barra entra no DOM.
// ═══════════════════════════════════════════════════════════════════════════
describe("CookieBanner — barra não nasce sobre o conteúdo", () => {
  const BANNER_VAR = "--cookie-banner-h";
  const doc = document.documentElement;

  /** jsdom tem scrollHeight 0 / innerHeight 768: força página "rolável" */
  function forcarPaginaRolavel(height = 5000) {
    Object.defineProperty(doc, "scrollHeight", {
      configurable: true,
      value: height,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 768,
    });
  }

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    forcarPaginaRolavel();
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  });

  afterEach(() => {
    doc.style.removeProperty(BANNER_VAR);
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 768,
    });
    Object.defineProperty(doc, "scrollHeight", { configurable: true, value: 0 });
  });

  it("em página rolável, a barra NÃO está no DOM antes do primeiro scroll", async () => {
    render(
      <CookieBannerProvider>
        <Probe />
      </CookieBannerProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("show-banner").textContent).toBe("true");
    });
    // contrato do provider intacto: consentimento ainda não decidido...
    expect(screen.getByTestId("consent").textContent).toBe("null");
    // ...mas nada é renderizado por cima do conteúdo na primeira viewport.
    expect(screen.queryByTestId("cookie-banner")).toBeNull();
  });

  it("a barra entra no DOM depois que o usuário rola", async () => {
    render(
      <CookieBannerProvider>
        <Probe />
      </CookieBannerProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("show-banner").textContent).toBe("true");
    });
    expect(screen.queryByTestId("cookie-banner")).toBeNull();

    Object.defineProperty(window, "scrollY", { configurable: true, value: 120 });
    window.dispatchEvent(new Event("scroll"));

    await waitFor(() => {
      expect(screen.getByTestId("cookie-banner")).toBeInTheDocument();
    });
  });

  it("em página sem scroll, a barra aparece imediato (não há conteúdo a cobrir)", async () => {
    forcarPaginaRolavel(400); // 400 < innerHeight + 8
    render(
      <CookieBannerProvider>
        <Probe />
      </CookieBannerProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("cookie-banner")).toBeInTheDocument();
    });
  });

  it("reserva a altura da barra no documento e limpa ao recusar", async () => {
    forcarPaginaRolavel(400);
    // jsdom devolve offsetHeight 0: mede 110px como no desktop auditado.
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
      configurable: true,
      get: () => 110,
    });

    const user = userEvent.setup();
    render(
      <CookieBannerProvider>
        <Probe />
      </CookieBannerProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cookie-banner")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(doc.style.getPropertyValue(BANNER_VAR)).toBe("110px");
    });

    await user.click(screen.getByText("Recusar"));
    await waitFor(() => {
      expect(doc.style.getPropertyValue(BANNER_VAR)).toBe("");
    });
  });
});
