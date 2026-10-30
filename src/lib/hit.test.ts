import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import { enviarHit } from "@/lib/hit";

/**
 * O beacon é o único número de chegada do portfólio — se ele parar de sair em silêncio, o
 * painel mostra "0 visita" e a conclusão errada é "ninguém veio". Por isso aqui se testa o
 * envio de verdade (payload e URL), não só o "não estourou".
 */
describe("beacon de visita do portfólio", () => {
  const beacon = vi.fn<(url: string, dados: Blob) => boolean>();

  beforeEach(() => {
    // NODE_ENV de teste só mede com override explícito (o dev local não pode poluir a conta)
    vi.stubEnv("NEXT_PUBLIC_LOJA_HIT_URL", "https://skills.seu.pet/api/hit");
    beacon.mockReset();
    beacon.mockReturnValue(true);
    Object.defineProperty(navigator, "sendBeacon", { value: beacon, configurable: true });
    Object.defineProperty(navigator, "doNotTrack", { value: "0", configurable: true });
    Object.defineProperty(navigator, "globalPrivacyControl", {
      value: false,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("manda caminho, referrer e site=portfolio, same-origin em /api/hit", async () => {
    expect(enviarHit("/projetos", "https://x.com/SAFM_Tatuzin/")).toBe(true);
    expect(beacon).toHaveBeenCalledTimes(1);
    const [url, blob] = beacon.mock.calls[0];
    // Relativo = same-origin. O rewrite do next.config.js repassa pro caixa da loja;
    // chamar skills.seu.pet direto fazia a resposta ser barrada por COEP.
    expect(url).toBe("/api/hit");
    expect(blob.type).toBe("text/plain"); // text/plain evita preflight de CORS
    expect(JSON.parse(await blob.text())).toEqual({
      site: "portfolio",
      path: "/projetos",
      ref: "https://x.com/SAFM_Tatuzin/",
      // sem utm na URL, o beacon se declara como portfólio (24/10/2026)
      utm_source: "portfolio",
    });
  });

  it("manda os utm da URL atual (atribuição de quem chegou de fora)", async () => {
    window.history.replaceState({}, "", "/?utm_source=lifelog&utm_medium=post&utm_campaign=guia");
    expect(enviarHit("/", "")).toBe(true);
    const [, blob] = beacon.mock.calls[0];
    expect(JSON.parse(await blob.text())).toMatchObject({
      utm_source: "lifelog",
      utm_medium: "post",
      utm_campaign: "guia",
    });
    window.history.replaceState({}, "", "/");
  });

  it("utm explícito (4º argumento) sobrescreve o da URL", async () => {
    window.history.replaceState({}, "", "/?utm_source=qualquer");
    expect(
      enviarHit("/projetos", "", undefined, {
        utm_source: "portfolio",
        utm_medium: "beacon",
        utm_campaign: "teste",
      }),
    ).toBe(true);
    const [, blob] = beacon.mock.calls[0];
    expect(JSON.parse(await blob.text())).toMatchObject({ utm_source: "portfolio" });
    window.history.replaceState({}, "", "/");
  });

  it("override explícito de URL continua valendo (3º argumento)", () => {
    expect(enviarHit("/", "", "https://skills.seu.pet/api/hit")).toBe(true);
    expect(beacon.mock.calls[0][0]).toBe("https://skills.seu.pet/api/hit");
  });

  it("respeita Do Not Track (não manda nada)", () => {
    Object.defineProperty(navigator, "doNotTrack", { value: "1", configurable: true });
    expect(enviarHit("/", "")).toBe(false);
    expect(beacon).not.toHaveBeenCalled();
  });

  it("respeita Global Privacy Control (não manda nada)", () => {
    Object.defineProperty(navigator, "globalPrivacyControl", {
      value: true,
      configurable: true,
    });
    expect(enviarHit("/", "")).toBe(false);
    expect(beacon).not.toHaveBeenCalled();
  });

  it("sem override e fora de produção não mede (dev não infla a conta)", () => {
    vi.stubEnv("NEXT_PUBLIC_LOJA_HIT_URL", "");
    expect(enviarHit("/", "")).toBe(false);
    expect(beacon).not.toHaveBeenCalled();
  });

  it("cai no fetch keepalive quando não há sendBeacon", async () => {
    Object.defineProperty(navigator, "sendBeacon", { value: undefined, configurable: true });
    const fetchFalso = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchFalso);
    expect(enviarHit("/contato", "")).toBe(true);
    expect(fetchFalso).toHaveBeenCalledTimes(1);
    expect(fetchFalso.mock.calls[0][0]).toBe("/api/hit");
  });
});
