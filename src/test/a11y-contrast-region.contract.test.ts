// @ts-nocheck — teste de contrato que lê arquivos (node fs); o tsconfig do app
// não inclui types:["node"], então o typecheck estrito não se aplica aqui.
/**
 * Contrato estático dos 3 fixes de a11y medidos pelo axe em produção (12/09/2026).
 *
 * A spec e2e `tests/a11y-contrast-region.spec.ts` mede o contraste real no browser,
 * mas depende de um servidor na baseURL (porta 3000) que fora do CI pode ser
 * reaproveitado por outro app. Este teste trava as MESMAS correções em nível de
 * fonte, de forma determinística e sem servidor — regressão volta a falhar o CI
 * mesmo quando o e2e está sendo sabotado por ambiente externo.
 *
 *  - WhatsApp CTA: token --whatsapp-contrast (escuro #0a0a12 / claro #ffffff).
 *  - Link repo dos games: utilitário .alt-readable + --alt-readable.
 *  - Linha Apoio/Consultoria: wrapper landmark role="region" com aria-label.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

function read(rel: string): string {
  const abs = join(process.cwd(), rel);
  if (!existsSync(abs)) throw new Error(`arquivo ausente: ${rel}`);
  return readFileSync(abs, "utf8");
}

describe("a11y contrast/region — contrato de fonte (sem servidor)", () => {
  it("globals.css define --whatsapp-contrast AA nos 2 temas", () => {
    const css = read("src/app/globals.css");
    const dark = /--whatsapp-contrast:\s*#0a0a12\s*;/i.test(css);
    const light = /--whatsapp-contrast:\s*#ffffff\s*;/i.test(css);
    expect(dark, "--whatsapp-contrast do tema dark (#0a0a12)").toBe(true);
    expect(light, "--whatsapp-contrast do tema light (#ffffff)").toBe(true);
  });

  it("globals.css define --alt-readable nos 2 temas + utilitário .alt-readable", () => {
    const css = read("src/app/globals.css");
    const occurrences = (css.match(/--alt-readable:/g) || []).length;
    expect(occurrences, "--alt-readable deve aparecer nos 2 escopos de tema").toBeGreaterThanOrEqual(2);
    expect(/\.alt-readable\s*\{\s*color:\s*var\(--alt-readable\)/.test(css), ".alt-readable mapeia para var(--alt-readable)").toBe(true);
  });

  it("ContactForm usa var(--whatsapp-contrast) no CTA WhatsApp, nunca branco cru", () => {
    const tsx = read("src/components/ContactForm.tsx");
    expect(/text-\[var\(--whatsapp-contrast\)\]/.test(tsx), "âncora WhatsApp usa o token de contraste").toBe(true);
  });

  it("GameShowcase link repo usa .alt-readable, não --accent-alt cru", () => {
    const tsx = read("src/components/GameShowcase.tsx");
    expect(/\balt-readable\b/.test(tsx), "âncora repo usa a classe .alt-readable").toBe(true);
    expect(/text-\[var\(--accent-alt\)\]/.test(tsx), "sem texto em --accent-alt cru").toBe(false);
  });

  it("layout envolve Apoio/Consultoria num landmark role=\"region\" com aria-label", () => {
    const layout = read("src/app/layout.tsx");
    const regionOpen = /role="region"[^>]*aria-label="Apoio e consultoria"/.test(layout) ||
      /aria-label="Apoio e consultoria"[^>]*role="region"/.test(layout);
    expect(regionOpen, 'wrapper role="region" aria-label="Apoio e consultoria" no layout').toBe(true);
  });
});
