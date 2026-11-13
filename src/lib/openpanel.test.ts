import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

/**
 * `loadOpenpanelScript` carrega o SDK e inicializa. Ele NÃO emite `page_view`:
 * o portfólio mede visita pelo beacon (`HitBeacon` → `/api/hit`), que tem IP e
 * UTM — coisas que o JS não tem. Um segundo `page_view` daqui fazia todo load
 * entrar 2x no OpenPanel (medido 13/11/2026).
 *
 * Este teste existe para travar essa decisão: se alguém reintroduzir o
 * `op("track", "page_view")` aqui, o número de visitas volta a dobrar em
 * silêncio.
 */
describe("openpanel — carrega o SDK sem duplicar page_view", () => {
  const chamadas: unknown[][] = [];

  beforeEach(() => {
    chamadas.length = 0;
    // Stub de `op` que registra as chamadas, no formato do SDK real.
    const op = (...args: unknown[]) => {
      chamadas.push(args);
    };
    (window as unknown as { op?: unknown }).op = op;
    delete (window as unknown as { __opIniciado?: boolean }).__opIniciado;
    document.head
      .querySelectorAll('script[data-op-analytics]')
      .forEach((s) => s.remove());
  });

  afterEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("inicializa uma única vez, mesmo com várias chamadas concorrentes", async () => {
    const { loadOpenpanelScript } = await import("@/lib/openpanel");
    // 5 call sites reais: CookieBanner x3, ConditionalAnalytics, ContactForm,
    // DownloadModal. Como o `<script>` só é anexado no fim, sem a flag todas
    // passavam e cada uma refazia o init.
    loadOpenpanelScript();
    loadOpenpanelScript();
    loadOpenpanelScript();
    loadOpenpanelScript();
    loadOpenpanelScript();

    const inits = chamadas.filter((c) => c[0] === "init");
    expect(inits).toHaveLength(1);
    expect(document.querySelectorAll("script[data-op-analytics]")).toHaveLength(1);
  });

  it("não emite page_view (a medição de visita é do beacon)", async () => {
    const { loadOpenpanelScript } = await import("@/lib/openpanel");
    loadOpenpanelScript();
    const pageViews = chamadas.filter(
      (c) => c[0] === "track" && c[1] === "page_view",
    );
    expect(pageViews).toEqual([]);
  });

  it("desliga trackScreenViews (evento sem path e sem site)", async () => {
    const { loadOpenpanelScript } = await import("@/lib/openpanel");
    loadOpenpanelScript();
    const init = chamadas.find((c) => c[0] === "init");
    expect(init).toBeDefined();
    const opcoes = init![1] as { trackScreenViews?: boolean };
    expect(opcoes.trackScreenViews).toBe(false);
  });
});
