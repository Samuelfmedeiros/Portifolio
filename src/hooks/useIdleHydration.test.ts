import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIdleHydration } from "./useIdleHydration";

/**
 * useIdleHydration — testes (v2 01/09/2026, root cause fix):
 * Comportamento correto = montar quando o browser FICAR idle (rIC de verdade),
 * nunca pelo readyState. Em testes (sem rIC) cai no fallback setTimeout.
 *  1. com rIC disponível: NÃO fica ready de imediato; só dispara quando o rIC
 *     chama o callback (browser idle)
 *  2. com rIC mas nunca idle: cai no timeout de garantia (maxTimeout)
 *  3. sem rIC (jsdom/browsers antigos): cai no fallback rápido (~500ms)
 *  4. limpa/cancela no unmount
 */
describe("useIdleHydration", () => {
  type RicCb = (idle: { didTimeout: boolean }) => void;
  let ricCbRef: RicCb | null = null;
  let ricHandle = 0;

  const installRic = () => {
    Object.defineProperty(window, "requestIdleCallback", {
      configurable: true,
      // Simula o nativo: registra o callback e, se um timeout foi pedido,
      // agenda-o via setTimeout (comportamento real do rIC: timeout garante
      // execução mesmo se o browser nunca ficar idle).
      value: vi.fn((cb: RicCb, opts?: { timeout?: number }) => {
        ricCbRef = cb;
        if (opts?.timeout) setTimeout(() => cb({ didTimeout: true }), opts.timeout);
        return ++ricHandle;
      }),
    });
    Object.defineProperty(window, "cancelIdleCallback", {
      configurable: true,
      value: vi.fn(),
    });
  };

  beforeEach(() => {
    vi.useFakeTimers();
    ricCbRef = null;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("não dispara de imediato via readyState (root cause fix); aguarda rIC", () => {
    // readyState 'complete' NÃO deve mais disparar — só o idle.
    Object.defineProperty(document, "readyState", {
      configurable: true,
      get: () => "complete",
    });
    installRic();
    const { result } = renderHook(() => useIdleHydration());
    expect(result.current).toBe(false);

    // dispara o rIC callback simulando o browser em idle
    act(() => ricCbRef?.({ didTimeout: false }));
    expect(result.current).toBe(true);
  });

  it("cai no timeout de garantia (maxTimeout) se o browser nunca ficar idle", () => {
    installRic();
    const { result } = renderHook(() => useIdleHydration(3000));
    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current).toBe(true);
  });

  it("sem rIC (jsdom/antigos): cai no fallback rápido", () => {
    // rIC undefined (padrão jsdom neste teste)
    Object.defineProperty(window, "requestIdleCallback", {
      configurable: true,
      value: undefined,
    });
    const { result } = renderHook(() => useIdleHydration());
    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(result.current).toBe(true);
  });

  it("cancela o rIC no unmount", () => {
    installRic();
    const cancelSpy = vi.spyOn(window, "cancelIdleCallback");
    const { unmount } = renderHook(() => useIdleHydration());
    unmount();
    expect(cancelSpy).toHaveBeenCalled();
  });
});