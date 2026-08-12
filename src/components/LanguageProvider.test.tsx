import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { LanguageProvider } from "@/components/LanguageProvider";
import { useLanguage } from "@/lib/i18n";

function LocaleProbe() {
  const { locale, toggle } = useLanguage();
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <button onClick={toggle}>toggle</button>
    </div>
  );
}

function renderProvider() {
  return render(
    <LanguageProvider>
      <LocaleProbe />
    </LanguageProvider>
  );
}

async function flushEffects() {
  await act(async () => {});
}

function setNavigatorLanguage(lang: string) {
  Object.defineProperty(window.navigator, "language", {
    value: lang,
    configurable: true,
  });
}

// Fix #44: hydration mismatch #418 — o provider agora inicializa com "pt"
// (determinístico, idêntico ao server) e detecta o locale real pós-mount.
// No jsdom, render() já flusha efeitos, então o que observamos é o estado
// pós-detecção — o que importa é: detecção correta + toggle estável.
describe("LanguageProvider (fix #44)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("detecta 'en' pós-mount quando navigator.language é en-US", async () => {
    setNavigatorLanguage("en-US");
    renderProvider();
    await flushEffects();
    expect(screen.getByTestId("locale").textContent).toBe("en");
  });

  it("permanece 'pt' quando navigator.language é pt-BR", async () => {
    setNavigatorLanguage("pt-BR");
    renderProvider();
    await flushEffects();
    expect(screen.getByTestId("locale").textContent).toBe("pt");
  });

  it("permanece 'pt' quando navigator.language é pt-PT", async () => {
    setNavigatorLanguage("pt-PT");
    renderProvider();
    await flushEffects();
    expect(screen.getByTestId("locale").textContent).toBe("pt");
  });

  it("toggle manual alterna e o efeito pós-mount não sobrescreve", async () => {
    setNavigatorLanguage("en-US");
    renderProvider();
    await flushEffects();
    expect(screen.getByTestId("locale").textContent).toBe("en");

    const btn = screen.getByRole("button", { name: "toggle" });
    act(() => btn.click());
    expect(screen.getByTestId("locale").textContent).toBe("pt");

    // segundo toggle volta pra en
    act(() => btn.click());
    expect(screen.getByTestId("locale").textContent).toBe("en");

    // flush extra: efeito não rodou de novo nem resetou nada
    await flushEffects();
    expect(screen.getByTestId("locale").textContent).toBe("en");
  });
});
