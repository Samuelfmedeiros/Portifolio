import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import {
  STORAGE_KEY,
  LanguageContext,
  useLanguage,
  useT,
  getInitialLocale,
  translate,
} from "./i18n";

/**
 * Contrato REAL de src/lib/i18n.ts (medido 06/11/2026):
 * - `getInitialLocale()` NAO le localStorage nem cookie — so navigator.language.
 *   Regra do Samuel (07/08/2026): pt-BR/pt-PT abrem em PT, qualquer outro idioma
 *   (inclusive desconhecido) abre em EN — default "pt" so vale sem window (SSR).
 * - `translate(locale, key, fallback?)` — a locale vem PRIMEIRO e o dicionario
 *   usado e o global `dict`; nao existe parametro de dicionario.
 */
function stubNavigator(language: string, languages?: string[]) {
  vi.stubGlobal("navigator", { language, languages });
}

describe("i18n", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("STORAGE_KEY", () => {
    it('usa a chave "mc-locale"', () => {
      expect(STORAGE_KEY).toBe("mc-locale");
    });
  });

  describe("LanguageContext sem provider", () => {
    it("comeca em pt e o t devolve fallback ou a propria chave", () => {
      const { result } = renderHook(() => useLanguage());
      expect(result.current.locale).toBe("pt");
      expect(typeof result.current.setLocale).toBe("function");
      expect(typeof result.current.toggle).toBe("function");
      expect(result.current.t("chave.qualquer", "Fallback")).toBe("Fallback");
      expect(result.current.t("chave.qualquer")).toBe("chave.qualquer");
    });

    it("useT devolve exatamente a funcao t do contexto", () => {
      const { result } = renderHook(() => useT());
      expect(typeof result.current).toBe("function");
      expect(result.current("chave.qualquer", "FB")).toBe("FB");
      expect(result.current("chave.qualquer")).toBe("chave.qualquer");
    });

    it("o contexto default e exportado e consumivel direto", () => {
      expect(LanguageContext).toBeDefined();
    });
  });

  describe("getInitialLocale", () => {
    it("sem window (SSR) devolve pt", () => {
      vi.stubGlobal("window", undefined);
      expect(getInitialLocale()).toBe("pt");
    });

    it("pt-BR do navegador devolve pt", () => {
      stubNavigator("pt-BR");
      expect(getInitialLocale()).toBe("pt");
    });

    it("pt-PT do navegador devolve pt", () => {
      stubNavigator("pt-PT");
      expect(getInitialLocale()).toBe("pt");
    });

    it("en-US do navegador devolve en", () => {
      stubNavigator("en-US");
      expect(getInitialLocale()).toBe("en");
    });

    it("en-GB do navegador devolve en", () => {
      stubNavigator("en-GB");
      expect(getInitialLocale()).toBe("en");
    });

    it("idioma desconhecido (fr) devolve en — regra do Samuel 07/08/2026", () => {
      stubNavigator("fr");
      expect(getInitialLocale()).toBe("en");
    });

    it("language vazio cai para o primeiro item de navigator.languages", () => {
      stubNavigator("", ["pt-BR", "en-US"]);
      expect(getInitialLocale()).toBe("pt");
    });

    it("language e languages vazios devolvem pt (ultimo fallback do codigo)", () => {
      stubNavigator("", []);
      expect(getInitialLocale()).toBe("pt");
    });
  });

  describe("translate", () => {
    it("traduz chave real do dicionario em pt e em", () => {
      expect(translate("pt", "nav.home")).toBe("Início");
      expect(translate("en", "nav.home")).toBe("Home");
    });

    it("locale invalido cai no dicionario PT", () => {
      expect(translate("fr" as never, "nav.home")).toBe("Início");
    });

    it("chave inexistente devolve o fallback informado", () => {
      expect(translate("pt", "chave.que.nao.existe", "FB")).toBe("FB");
    });

    it("chave inexistente sem fallback devolve a propria chave", () => {
      expect(translate("en", "chave.que.nao.existe")).toBe("chave.que.nao.existe");
    });
  });
});
