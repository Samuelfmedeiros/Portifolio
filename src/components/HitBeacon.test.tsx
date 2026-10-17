import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";

import HitBeacon from "@/components/HitBeacon";

/**
 * O efeito é o que faltava na 1ª versão: no layout raiz o `usePathname()` pode chegar `null`
 * e o guard antigo (`if (!pathname) return`) saía calado — medido em dev, nada era enviado.
 * Aqui se renderiza o componente de verdade e se olha o que sai no fio.
 */
const pathnameFalso = vi.hoisted(() => ({ valor: null as string | null }));

vi.mock("next/navigation", () => ({
  usePathname: () => pathnameFalso.valor,
}));

describe("HitBeacon", () => {
  const beacon = vi.fn<(url: string, dados: Blob) => boolean>();

  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_LOJA_HIT_URL", "https://skills.seu.pet/api/hit");
    pathnameFalso.valor = null;
    beacon.mockReset();
    beacon.mockReturnValue(true);
    Object.defineProperty(navigator, "sendBeacon", { value: beacon, configurable: true });
    Object.defineProperty(navigator, "doNotTrack", { value: "0", configurable: true });
    Object.defineProperty(window, "globalPrivacyControl", { value: false, configurable: true });
    window.history.replaceState({}, "", "/projetos");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("mede mesmo quando usePathname() vem null (usa location.pathname)", async () => {
    render(<HitBeacon />);
    await vi.waitFor(() => expect(beacon).toHaveBeenCalledTimes(1));
    const [url, blob] = beacon.mock.calls[0];
    expect(url).toBe("https://skills.seu.pet/api/hit");
    expect(JSON.parse(await blob.text())).toMatchObject({
      site: "portfolio",
      path: "/projetos",
    });
  });

  it("usa o pathname do roteador quando ele existe", async () => {
    pathnameFalso.valor = "/";
    render(<HitBeacon />);
    await vi.waitFor(() => expect(beacon).toHaveBeenCalledTimes(1));
    expect(JSON.parse(await beacon.mock.calls[0][1].text()).path).toBe("/");
  });

  it("não renderiza nada no DOM (não mexe no layout)", () => {
    const { container } = render(<HitBeacon />);
    expect(container.firstChild).toBeNull();
  });
});
