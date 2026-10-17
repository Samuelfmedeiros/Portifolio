import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * Contrato do módulo (Opção A — 09/10/2026):
 *  1. só a PRIMEIRA interação gera pageview (idempotente por página)
 *  2. se o Umami ainda não existe, enfileira e NÃO perde a pageview
 *  3. recusar também conta (ação consciente sobre o aviso)
 *  4. nunca quebra se sessionStorage/umami não existirem
 *
 * A trava do módulo é uma flag de MÓDULO (uma pageview por carregamento de
 * página), então cada teste importa o módulo de novo via vi.resetModules() —
 * sem isso o estado vaza de um caso para o outro (medido 17/10/2026: 5 falhas).
 */

declare global {
  interface Window {
    umami?: { track: (name: string, props?: Record<string, unknown>) => void };
  }
}

type Mod = typeof import("./first-pageview");

describe("first-pageview", () => {
  let track: ReturnType<typeof vi.fn>;
  let mod: Mod;

  beforeEach(async () => {
    vi.resetModules();
    mod = await import("./first-pageview");
    track = vi.fn();
    try {
      window.sessionStorage.clear();
    } catch {
      /* ambiente sem sessionStorage */
    }
    window.umami = { track };
  });

  afterEach(() => {
    delete window.umami;
    vi.restoreAllMocks();
  });

  it("envia a pageview quando o Umami já está disponível", () => {
    mod.markFirstPageview();
    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith("pageview", { url: window.location.pathname });
  });

  it("é idempotente: só a primeira interação conta", () => {
    mod.markFirstPageview();
    mod.markFirstPageview();
    mod.markFirstPageview();
    expect(track).toHaveBeenCalledTimes(1);
  });

  it("enfileira quando o Umami ainda não carregou e envia no umami:ready", () => {
    delete window.umami;
    mod.markFirstPageview();

    expect(track).not.toHaveBeenCalled();

    // script carrega depois
    window.umami = { track };
    window.dispatchEvent(new Event("umami:ready"));

    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith("pageview", { url: window.location.pathname });
  });

  it("o listener umami:ready é descartado após o primeiro disparo", () => {
    delete window.umami;
    mod.markFirstPageview();
    window.umami = { track };

    window.dispatchEvent(new Event("umami:ready"));
    window.dispatchEvent(new Event("umami:ready"));

    expect(track).toHaveBeenCalledTimes(1);
  });

  it("não quebra quando sessionStorage não existe", () => {
    const descriptor = Object.getOwnPropertyDescriptor(window, "sessionStorage");
    Object.defineProperty(window, "sessionStorage", {
      configurable: true,
      value: undefined,
    });

    try {
      expect(() => mod.markFirstPageview()).not.toThrow();
      expect(track).toHaveBeenCalledTimes(1);
    } finally {
      if (descriptor) Object.defineProperty(window, "sessionStorage", descriptor);
    }
  });

  it("flushPendingPageview também conta (consentimento aceito em visita anterior)", () => {
    mod.flushPendingPageview();
    expect(track).toHaveBeenCalledTimes(1);
  });
});
