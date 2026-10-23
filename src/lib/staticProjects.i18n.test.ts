// Contrato dos cards novos (23/10/2026): site direto, sem GitHub, capa PT/EN.
// Regra: card privado aponta só pro site (padrão DogWalk); todo card com site
// precisa de descrição nos dois idiomas, senão o card fica pelado em EN.
import { describe, it, expect } from "vitest";
import { STATIC_PROJECTS } from "./staticProjects";
import { getProjectI18n } from "./profileData";

const NOVOS = ["Focinho", "Skills Shop", "SafMarket"];

describe("cards novos — contrato site-direto", () => {
  it("existem em STATIC_PROJECTS", () => {
    for (const n of NOVOS) {
      const card = STATIC_PROJECTS.find((p) => p.name === n);
      expect(card, `${n} ausente em STATIC_PROJECTS`).toBeTruthy();
    }
  });

  it("apontam só pro site (html_url vazio, homepage http)", () => {
    for (const n of NOVOS) {
      const card = STATIC_PROJECTS.find((p) => p.name === n)!;
      expect(card.html_url, `${n} não deveria ter GitHub público`).toBe("");
      expect(card.homepage, `${n} sem homepage`).toMatch(/^https:\/\//);
      expect(card.imageUrl, `${n} sem capa`).toMatch(/^\/projects\/.+\.webp$/);
    }
  });

  it("têm descrição PT e EN no dicionário", () => {
    for (const n of NOVOS) {
      for (const locale of ["pt", "en"] as const) {
        const entry = getProjectI18n(locale, n);
        expect(entry, `${n} sem descrição em ${locale}`).toBeTruthy();
        expect(entry!.description.length).toBeGreaterThan(30);
      }
    }
  });
});
