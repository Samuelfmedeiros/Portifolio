import { describe, expect, it } from "vitest";
import proxy from "../proxy";

/**
 * Garante que o proxy bloqueia o acesso DIRETO aos PDFs do currículo (404),
 * deixando passar todo o resto (incl. /api/download-cv, que serve os PDFs
 * pelo fluxo do modal com consent LGPD + log).
 * Contexto: 07/09/2026 — furo de download direto sem log/LGPD.
 */
type ProxyReq = Parameters<typeof proxy>[0];

function fakeRequest(pathname: string): ProxyReq {
  return {
    nextUrl: new URL(`https://samuelmedeiros.vercel.app${pathname}`),
  } as ProxyReq;
}

describe("proxy — bloqueio de PDFs estáticos do CV", () => {
  it("retorna 404 para o PDF PT acessado direto", () => {
    const res = proxy(fakeRequest("/Samuel_Andrade_2026.pdf"));
    expect(res.status).toBe(404);
  });

  it("retorna 404 para o PDF EN (resume) acessado direto", () => {
    const res = proxy(fakeRequest("/Samuel_Andrade_Resume_2026.pdf"));
    expect(res.status).toBe(404);
  });

  it("é case-insensitive na checagem", () => {
    const res = proxy(fakeRequest("/samuel_andrade_2026.pdf"));
    expect(res.status).toBe(404);
  });

  it("não bloqueia a rota da API (fluxo do modal continua funcionando)", () => {
    const res = proxy(fakeRequest("/api/download-cv"));
    expect(res.status).toBe(200);
  });

  it("não bloqueia páginas do site", () => {
    const res = proxy(fakeRequest("/sobre"));
    expect(res.status).toBe(200);
  });
});
