/**
 * Contrato da página /servico — a oferta de automação com IA.
 *
 * A página nasceu na campanha de 22/11/2026 sem nenhum teste: metadata,
 * entrada no sitemap e as 44 chaves de dicionário que ela consome ficavam
 * soltas. Se uma chave `servico.*` desaparecer, a página cai no fallback PT
 * (translate() usa PT quando EN falta) e o modo inglês passa a mostrar
 * português sem ninguém notar. Este contrato prende as três pontas.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { dict } from "@/lib/dictionary";
import { SITE_URL } from "@/lib/types";
import { metadata } from "@/app/servico/page";
import sitemap from "@/app/sitemap";

/** Chaves `servico.*` consumidas por src/components/ServicoContent.tsx */
const CHAVES = [
  "servico.back",
  "servico.hero.label",
  "servico.hero.title",
  "servico.hero.subtitle",
  "servico.hero.cta",
  "servico.problem.label",
  "servico.problem.title",
  "servico.problem.1.title",
  "servico.problem.1.desc",
  "servico.problem.2.title",
  "servico.problem.2.desc",
  "servico.problem.3.title",
  "servico.problem.3.desc",
  "servico.how.label",
  "servico.how.title",
  "servico.how.1.title",
  "servico.how.1.desc",
  "servico.how.2.title",
  "servico.how.2.desc",
  "servico.how.3.title",
  "servico.how.3.desc",
  "servico.how.4.title",
  "servico.how.4.desc",
  "servico.includes.label",
  "servico.includes.title",
  "servico.includes.1.title",
  "servico.includes.1.desc",
  "servico.includes.2.title",
  "servico.includes.2.desc",
  "servico.includes.3.title",
  "servico.includes.3.desc",
  "servico.includes.4.title",
  "servico.includes.4.desc",
  "servico.proof.label",
  "servico.proof.title",
  "servico.proof.note",
  "servico.price.label",
  "servico.price.title",
  "servico.price.setup",
  "servico.price.maintenance",
  "servico.price.note",
  "servico.price.floor",
  "servico.cta.title",
  "servico.cta.subtitle",
  "servico.cta.label",
] as const;

describe("/servico — metadata", () => {
  it("declara title, description e canonical no domínio canônico", () => {
    expect(metadata.title).toBe("Automação com IA em 48h");
    expect(String(metadata.description)).toContain("48h");
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/servico`);
  });

  it("leva a mesma oferta para OpenGraph e Twitter", () => {
    const og = metadata.openGraph as Record<string, unknown> & { url?: string; title?: string };
    expect(og.url).toBe(`${SITE_URL}/servico`);
    expect(og.title).toBe("Automação com IA em 48h");
    const tw = metadata.twitter as Record<string, unknown> & { card?: string };
    expect(tw.card).toBe("summary_large_image");
  });
});

describe("/servico — sitemap", () => {
  it("entra no sitemap com prioridade de página comercial", () => {
    const alvo = sitemap().find((e) => e.url === `${SITE_URL}/servico`);
    expect(alvo).toBeDefined();
    expect(alvo?.priority).toBe(0.9);
    expect(alvo?.changeFrequency).toBe("monthly");
  });
});

describe("/servico — dicionário PT e EN", () => {
  it("tem todas as chaves consumidas nos dois idiomas", () => {
    const faltando: string[] = [];
    for (const k of CHAVES) {
      if (!(dict.pt as Record<string, string>)[k]) faltando.push(`pt:${k}`);
      if (!(dict.en as Record<string, string>)[k]) faltando.push(`en:${k}`);
    }
    expect(faltando).toEqual([]);
  });

  it("não deixa o inglês cair no texto português (translate usa PT como fallback)", () => {
    const iguais = CHAVES.filter(
      (k) => (dict.pt as Record<string, string>)[k] === (dict.en as Record<string, string>)[k],
    );
    expect(iguais).toEqual([]);
  });

  it("mantém a oferta de preço explícita nos dois idiomas", () => {
    const pt = dict.pt as Record<string, string>;
    const en = dict.en as Record<string, string>;
    // Os valores vivem no JSX (não no dicionário): preço não muda por idioma.
    // Contrato de arquivo — se alguém remover o número, o teste avisa.
    const fonte = readFileSync(
      path.resolve(__dirname, "../components/ServicoContent.tsx"),
      "utf8",
    );
    expect(fonte).toContain("R$ 1.900");
    expect(fonte).toContain("R$ 490/mês");
    expect(pt["servico.price.note"]).toMatch(/48h/);
    expect(en["servico.price.note"]).toMatch(/48 hours/);
  });
});
