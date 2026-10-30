import { describe, expect, it } from "vitest";

import { comUtm, utmsDaPagina } from "@/lib/utm";

/**
 * Regra de amarração (24/10/2026): link que sai do portfólio precisa dizer quem mandou.
 * Medição do @moedas: 13 links cruzados, zero com UTM — tráfego chegava sem origem.
 */
describe("comUtm", () => {
  it("põe source=portfolio, medium e campaign", () => {
    const url = comUtm("https://skills.seu.pet", {
      medium: "projeto",
      campaign: "skills",
    });
    const q = new URL(url).searchParams;
    expect(q.get("utm_source")).toBe("portfolio");
    expect(q.get("utm_medium")).toBe("projeto");
    expect(q.get("utm_campaign")).toBe("skills");
    // destino continua o mesmo (só ganhou query)
    const destino = new URL(url);
    expect(destino.host).toBe("skills.seu.pet");
    expect(destino.pathname).toBe("/");
  });

  it("preserva query existente e não duplica parâmetro", () => {
    const url = comUtm("https://lifelog.seu.pet/?lang=pt", {
      medium: "footer",
      campaign: "portfolio",
    });
    const q = new URL(url).searchParams;
    expect(q.get("lang")).toBe("pt");
    expect(q.get("utm_medium")).toBe("footer");
  });

  it("permite forçar a origem (source)", () => {
    const url = comUtm("https://seu.pet", {
      medium: "footer",
      campaign: "portfolio",
      source: "portfolio-news",
    });
    expect(new URL(url).searchParams.get("utm_source")).toBe("portfolio-news");
  });

  it("caminho relativo é resolvido contra o site (nunca retorna link quebrado)", () => {
    const url = comUtm("/projetos", { medium: "x", campaign: "y" });
    expect(url.startsWith("https://portifolio.seu.pet/projetos?")).toBe(true);
    expect(new URL(url).searchParams.get("utm_source")).toBe("portfolio");
  });
});

describe("utmsDaPagina", () => {
  it("sem utm na query, a origem é o portfólio", () => {
    expect(utmsDaPagina("")).toEqual({ utm_source: "portfolio" });
  });

  it("mantém a atribuição de quem chegou de fora", () => {
    const utms = utmsDaPagina("?utm_source=lifelog&utm_medium=post&utm_campaign=guia-coleira");
    expect(utms).toEqual({
      utm_source: "lifelog",
      utm_medium: "post",
      utm_campaign: "guia-coleira",
    });
  });

  it("corta valor gigante (o destino tem teto de 64)", () => {
    const utms = utmsDaPagina(`?utm_campaign=${"a".repeat(200)}`);
    expect(utms.utm_campaign).toHaveLength(64);
  });
});
