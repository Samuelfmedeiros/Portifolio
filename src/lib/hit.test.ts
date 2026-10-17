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

  it("manda caminho, referrer e site=portfolio pro caixa da loja", async () => {
    expect(enviarHit("/projetos", "https://x.com/SAFM_Tatuzin/")).toBe(true);
    expect(beacon).toHaveBeenCalledTimes(1);
    const [url, blob] = beacon.mock.calls[0];
    expect(url).toBe("https://skills.seu.pet/api/hit");
    expect(blob.type).toBe("text/plain"); // text/plain evita preflight de CORS
    expect(JSON.parse(await blob.text())).toEqual({
      site: "portfolio",
      path: "/projetos",
      ref: "https://x.com/SAFM_Tatuzin/",
    });
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
    expect(fetchFalso.mock.calls[0][0]).toBe("https://skills.seu.pet/api/hit");
  });
});
