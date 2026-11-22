/**
 * Contraste de texto sobre `--accent` — WCAG 1.4.3 AA.
 *
 * Achado medido em 22/11/2026 (axe em produção, /servico desktop + mobile, dark):
 * o botão "Aceitar" do CookieBanner usava `bg-[var(--accent)] text-white`.
 * Em dark o accent é claro (#22d3ee ciano), então branco sobre ciano dá 1.81:1 —
 * e isso valia para as 6 paletas (1.67 a 2.72). Em light o mesmo `text-white`
 * passava (5.0 a 7.1), então o defeito só aparecia em dark: nenhuma revisão de
 * tema claro pegaria. O banner é global — todo visitante novo via o CTA ilegível.
 *
 * A cura é a mesma que a navbar já usava: `text-[var(--bg-primary)]`, que em dark
 * é escuro (10.9:1 sobre ciano) e em light é claro (5.5:1 sobre azul).
 * Cálculo das 12 combinações (6 paletas × 2 temas) no relatório da ronda.
 *
 * Regra: em qualquer superfície pintada com `--accent`, o texto NÃO pode ser
 * `text-white`. Este contrato varre os .tsx do src inteiro — pega a família, não
 * só os dois arquivos que estavam errados hoje.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const SRC = path.resolve(__dirname, "..");

function arquivosTsx(dir: string): string[] {
  const saida: string[] = [];
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const alvo = path.join(dir, entrada.name);
    if (entrada.isDirectory()) {
      if (entrada.name === "node_modules") continue;
      saida.push(...arquivosTsx(alvo));
    } else if (entrada.name.endsWith(".tsx") && !entrada.name.endsWith(".test.tsx")) {
      saida.push(alvo);
    }
  }
  return saida;
}

describe("contraste sobre --accent (WCAG AA)", () => {
  it("nenhum className pinta fundo com --accent e texto branco ao mesmo tempo", () => {
    const ofensores: string[] = [];
    for (const arquivo of arquivosTsx(SRC)) {
      const linhas = readFileSync(arquivo, "utf8").split("\n");
      linhas.forEach((linha, i) => {
        if (!linha.includes("bg-[var(--accent)]")) return;
        // text-white exato (não casar text-white/80 nem text-white-something)
        if (/text-white(?![\w/-])/.test(linha)) {
          ofensores.push(`${path.relative(SRC, arquivo)}:${i + 1}`);
        }
      });
    }
    expect(ofensores).toEqual([]);
  });

  it("o botão de aceite do CookieBanner usa --bg-primary como cor do texto", () => {
    const fonte = readFileSync(path.join(SRC, "components/CookieBanner.tsx"), "utf8");
    // a linha do botão de aceite: a que chama acceptWithAds
    const bloco = fonte.split("\n").filter((l) => l.includes("bg-[var(--accent)]"));
    expect(bloco.length).toBeGreaterThan(0);
    for (const linha of bloco) {
      expect(linha).toContain("text-[var(--bg-primary)]");
      expect(linha).not.toContain("text-white");
    }
  });

  it("o botão de iniciar jogo (MiniGame) usa --bg-primary como cor do texto", () => {
    const fonte = readFileSync(path.join(SRC, "components/MiniGames/MiniGame.tsx"), "utf8");
    const bloco = fonte.split("\n").filter((l) => l.includes("bg-[var(--accent)]"));
    expect(bloco.length).toBeGreaterThan(0);
    for (const linha of bloco) {
      expect(linha).toContain("text-[var(--bg-primary)]");
      expect(linha).not.toContain("text-white");
    }
  });
});
