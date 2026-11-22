import { describe, expect, it } from "vitest";
import proxy, { isBlockedCvPath } from "../proxy";

/**
 * Contrato anti-regressão do bloqueio de acesso DIRETO aos PDFs do CV.
 *
 * Contexto: o guard criado em 07/09/2026 (matcher de 2 strings + Set.has no
 * path cru) VIVIA BYPASSADO em produção até 13/09/2026. Os casos marcados com
 * 🔴 abaixo foram MEDIDOS retornando 200 + application/pdf (70968 bytes, MD5
 * 7caf656437148384e18b4367b6a713df = o arquivo real) em
 * samuelmedeiros.vercel.app E portifolio.seu.pet.
 *
 * Este arquivo é a única coisa que impede a volta do bypass: qualquer mudança
 * que re-introduza um matcher restritivo ou uma comparação não-normalizada
 * quebra aqui antes de ir pra produção.
 */

type ProxyReq = Parameters<typeof proxy>[0];

function fakeRequest(pathname: string): ProxyReq {
  return {
    nextUrl: new URL(`https://samuelmedeiros.vercel.app${pathname}`),
    headers: new Headers({ "user-agent": "vitest-cv-guard" }),
  } as ProxyReq;
}

function bareRequest(pathname: string): ProxyReq {
  // sem headers: o guard NUNCA pode lançar (uma exceção no proxy derruba o site)
  return {
    nextUrl: new URL(`https://samuelmedeiros.vercel.app${pathname}`),
  } as ProxyReq;
}

describe("proxy — bloqueio de PDFs estáticos do CV", () => {
  it("retorna 404 para o PDF PT acessado direto", () => {
    expect(proxy(fakeRequest("/Samuel_Andrade_2026.pdf")).status).toBe(404);
  });

  it("retorna 404 para o PDF EN (resume) acessado direto", () => {
    expect(proxy(fakeRequest("/Samuel_Andrade_Resume_2026.pdf")).status).toBe(404);
  });

  it("é case-insensitive na checagem", () => {
    expect(proxy(fakeRequest("/samuel_andrade_2026.pdf")).status).toBe(404);
  });

  // 🔴 MEDIDO em produção 22/11/2026: as 4 variantes do modal respondiam
  //    200 application/pdf direto (sem consentimento, sem log em cv_downloads).
  //    A regex antiga (`^samuel_andrade(_resume)?_2026…`) não casava porque o
  //    segmento da variante vem ANTES do ano. Estes casos travam a regressão.
  const variantes = [
    "/Samuel_Andrade_Dados_2026.pdf",
    "/Samuel_Andrade_FullStack_2026.pdf",
    "/Samuel_Andrade_Resume_Dados_2026.pdf",
    "/Samuel_Andrade_Resume_FullStack_2026.pdf",
  ];

  it.each(variantes)("bloqueia a variante do modal acessada direto: %s", (path) => {
    expect(proxy(fakeRequest(path)).status).toBe(404);
  });

  it.each(variantes)("bloqueia a variante com encoding no path: %s", (path) => {
    const encoded = path.replace("S", "%53").replace("A", "%41");
    expect(proxy(fakeRequest(encoded)).status).toBe(404);
  });

  it("bloqueia cópia baixada pelo navegador da família do CV", () => {
    expect(proxy(fakeRequest("/Samuel_Andrade_Dados_2026%20(1).pdf")).status).toBe(404);
    expect(proxy(fakeRequest("/samuel-andrade-fullstack-2026.pdf")).status).toBe(404);
  });

  it("não bloqueia PDF que não é da família do CV", () => {
    expect(proxy(fakeRequest("/projects/doc.pdf")).status).toBe(200);
    expect(proxy(fakeRequest("/modalidades/dados.pdf")).status).toBe(200);
  });

  it("bloqueia CV da família em outros anos (2025, 2027)", () => {
    expect(isBlockedCvPath("/samuel_andrade_2025.pdf")).toBe(true);
    expect(isBlockedCvPath("/Samuel_Andrade_Resume_FullStack_2027.pdf")).toBe(true);
  });

  it("não bloqueia a rota da API (fluxo do modal continua funcionando)", () => {
    expect(proxy(fakeRequest("/api/download-cv")).status).toBe(200);
  });

  it("não bloqueia páginas do site", () => {
    expect(proxy(fakeRequest("/sobre")).status).toBe(200);
  });

  it("não lança quando a request vem sem headers (proxy roda em toda request)", () => {
    expect(() => proxy(bareRequest("/Samuel_Andrade_2026.pdf"))).not.toThrow();
    expect(proxy(bareRequest("/Samuel_Andrade_2026.pdf")).status).toBe(404);
    expect(proxy(bareRequest("/sobre")).status).toBe(200);
  });
});

describe("isBlockedCvPath — variantes medidas no bypass de 13/09/2026", () => {
  // 🔴 cada linha desta lista foi PROVADA em produção servindo o PDF real
  const bypassVectors = [
    "/Sam%75el_Andrade_2026.pdf", // 'u' codificado
    "/%53amuel_Andrade_2026.pdf", // 'S' codificado
    "/Samuel_Andrade_2026.p%64f", // 'df' codificado
    "/Samuel%5FAndrade%5F2026%2epdf", // underscores + ponto codificados
    "/Samuel%5fAndrade%5f2026%2epdf", // idem, minúsculas
    "/SAMUEL_ANDRADE_2026.PDF", // case flip completo
    "/Samuel_Andrade_2026.PDF", // extensão maiúscula
    "/Samuel_Andrade_2026%2ePDF", // ponto + extensão maiúscula
    "/public/Samuel_Andrade_2026.pdf", // prefixo public
    "/.%2e/Samuel_Andrade_2026.pdf", // dot-segment codificado
    "/./Samuel_Andrade_2026.pdf", // dot-segment literal
    "//Samuel_Andrade_2026.pdf", // slash duplicado
    "///Samuel_Andrade_2026.pdf", // slash triplicado
    "/Samuel_Andrade_2026.pdf/", // trailing slash
    "/Samuel_Andrade_2026.pdf.", // trailing dot
    "/Samuel_Andrade_2026.pdf...", // trailing dots
    "/Samuel_Andrade_2026.pdf ", // trailing space
    "/Sam%2575el_Andrade_2026.pdf", // double-encoding (%2575 -> %75 -> u)
    "/Samuel_Andrade_2026.pdf%00", // NUL smuggling
    "/Samuel_Andrade_2026.pdf\x00", // NUL cru
    "/index/../Samuel_Andrade_2026.pdf", // traversal relativo
    "/a/b/../../Samuel_Andrade_2026.pdf", // traversal com colapso
    "/_next/static/../Samuel_Andrade_2026.pdf", // via _next
    "/Samuel_Andrade_Resume_2026.pdf",
    "/samuel%5Fandrade%5Fresume%5F2026%2epdf",
  ];

  for (const vector of bypassVectors) {
    it(`bloqueia ${JSON.stringify(vector)}`, () => {
      expect(isBlockedCvPath(vector)).toBe(true);
    });
  }

  it("proxy() devolve 404 para as variantes que antes serviam o PDF", () => {
    for (const vector of [
      "/Sam%75el_Andrade_2026.pdf",
      "/%53amuel_Andrade_2026.pdf",
      "/Samuel_Andrade_2026.p%64f",
    ]) {
      expect(proxy(fakeRequest(vector)).status).toBe(404);
    }
  });
});

describe("isBlockedCvPath — não bloqueia o que deve passar", () => {
  const allowed = [
    "/",
    "/api/download-cv",
    "/api/contact-notify",
    "/api/game/simon",
    "/privacidade",
    "/termos",
    "/robots.txt",
    "/sitemap.xml",
    "/manifest.webmanifest",
    "/ads.txt",
    "/opengraph-image",
    "/_next/static/chunks/main-abc123.js",
    "/_next/image?url=%2Fprojects%2Farachne.webp&w=1080&q=75",
    "/projects/arachne.webp",
    "/projects/seu.pet.png",
    "/projects/storydesk.webp",
    "/games/simon-game/index.html",
    "/games/simon-game.webp",
    "/icon.svg",
    "/tatu-armadillo.svg",
    "/v3-screenshot.png",
    "/samuel", // nome parecido, não é o CV
    // 22/11/2026: `/samuel_andrade_2025.pdf` SAiu desta lista. O contrato antigo
    // ("outro ano: fora do contrato atual") só valia enquanto o guard era por
    // nome exato — e foi exatamente isso que deixou as 4 variantes de 2026
    // abertas em produção. CV de qualquer ano é dado pessoal: bloqueia.
    "/Samuel_Andrade_2026.pdf.txt", // não é pdf
    "/cv-samuel.pdf", // não casa o padrão do arquivo do CV
  ];

  for (const path of allowed) {
    it(`deixa passar ${JSON.stringify(path)}`, () => {
      expect(isBlockedCvPath(path)).toBe(false);
    });
  }

  it("não converte imagens em bloqueio (mesmo com encoding)", () => {
    expect(isBlockedCvPath("/projects/arachne%2ewebp")).toBe(false);
    expect(isBlockedCvPath("/%61rachne.webp")).toBe(false);
  });
});

describe("guard tem camada única e inescapável", () => {
  it("não exporta config/matcher (matcher restritivo foi o vetor do bypass)", async () => {
    const mod = await import("../proxy");
    expect((mod as { config?: { matcher?: unknown } }).config).toBeUndefined();
  });
});
