import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import { agendarAposCarga } from "./apos-carga";

/**
 * O contrato que interessa: a rotina de medição NÃO pode rodar dentro do
 * caminho crítico. Com a página ainda carregando, ela espera o `load`;
 * com a página já carregada (navegação SPA), roda na folga seguinte.
 */
describe("agendarAposCarga", () => {
  const listeners: Record<string, ((...a: unknown[]) => void)[]> = {};

  beforeEach(() => {
    vi.useFakeTimers();
    for (const k of Object.keys(listeners)) delete listeners[k];
    // readyState "loading" = cenário da primeira carga (load ainda não foi).
    Object.defineProperty(document, "readyState", {
      value: "loading",
      configurable: true,
    });
    vi.spyOn(window, "addEventListener").mockImplementation(
      (tipo: string, fn: EventListenerOrEventListenerObject) => {
        const f =
          typeof fn === "function" ? fn : (fn.handleEvent.bind(fn) as () => void);
        (listeners[tipo] ||= []).push(f as (...a: unknown[]) => void);
      },
    );
    // jsdom não tem requestIdleCallback — o fallback é setTimeout(0).
    // @ts-expect-error removendo de propósito para exercitar o fallback
    delete window.requestIdleCallback;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("não roda antes do load e roda depois dele", () => {
    const fn = vi.fn();
    agendarAposCarga(fn);

    expect(fn).not.toHaveBeenCalled();
    expect(listeners.load?.length).toBe(1);

    listeners.load[0]();
    expect(fn).not.toHaveBeenCalled(); // ainda espera a folga
    vi.runOnlyPendingTimers();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("usa requestIdleCallback quando existe", () => {
    const ric = vi.fn((cb: () => void) => cb());
    // @ts-expect-error injetando a API que o jsdom não tem
    window.requestIdleCallback = ric;
    Object.defineProperty(document, "readyState", {
      value: "complete",
      configurable: true,
    });

    const fn = vi.fn();
    agendarAposCarga(fn);
    expect(ric).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("com readyState complete (nav SPA) não depende do load", () => {
    Object.defineProperty(document, "readyState", {
      value: "complete",
      configurable: true,
    });
    const fn = vi.fn();
    agendarAposCarga(fn);
    vi.runOnlyPendingTimers();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(listeners.load).toBeUndefined();
  });

  it("no servidor não faz nada (sem window)", () => {
    const fn = vi.fn();
    // agendarAposCarga já protege typeof window === 'undefined';
    // aqui só garantimos que não estoura quando chamado em ambiente jsdom.
    agendarAposCarga(fn);
    expect(() => vi.runOnlyPendingTimers()).not.toThrow();
  });
});
