import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { POST } from "../app/api/download-cv/route";
import { NextRequest } from "next/server";
import nextConfig from "../../next.config.js";

/**
 * Contrato anti-regressão do download do CV.
 *
 * Contexto (medido 08/11/2026 em samuelmedeiros.vercel.app): o POST /api/download-cv
 * travava 60s com 0 bytes — o `fetch` de notificação para o Capivara não tinha
 * timeout e a rota esperava `Promise.allSettled(notifications)` ANTES de servir
 * o PDF (linha 224). O host do Capivara passou a responder só atrás de Cloudflare
 * Access, então o fetch nunca resolvia. Duas curas, dois contratos:
 *
 *  1. cada notificação tem AbortSignal.timeout(4_000) → o download responde
 *     mesmo com o upstream pendurado para sempre;
 *  2. outputFileTracingIncludes traz os PDFs de public/ para o bundle da
 *     serverless function — sem isso o fs.readFileSync daria ENOENT → 404.
 *
 * Ambiente `node` (não jsdom): jsdom sombreia o AbortSignal global e o
 * `AbortSignal.timeout` Some aí — o teste preciso do teto precisa do global do Node.
 */

const TETO_MS = 12_000; // teto real é 4s; margem para CPU carregada (nunca 60s+)

function makeReq(ip: string, body: Record<string, unknown> = {}) {
  return new NextRequest("http://localhost/api/download-cv", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify({
      name: "Teste Diagnostico",
      email: "samuel@exemplo.com",
      consent: true,
      locale: "pt",
      ...body,
    }),
  });
}

/**
 * Mock fiel de um fetch que NUNCA responde: a promise só rejeita quando o
 * signal aborta (é exatamente o que o fetch real faz). Um mock que só pendura
 * sem honrar o signal nunca provaria o teto — a promise ficaria pendurada
 * para sempre mesmo com timeout correto.
 */
function fetchPendurado() {
  return vi.fn(
    (_url: string, init?: RequestInit) =>
      new Promise((_resolve, reject) => {
        const signal = init?.signal;
        if (!signal) return; // sem signal = nunca resolve (regressão silenciosa)
        if (signal.aborted) {
          reject(new DOMException("Aborted", "AbortError"));
          return;
        }
        signal.addEventListener("abort", () =>
          reject(new DOMException("Aborted", "AbortError")),
        );
      }),
  );
}

beforeEach(() => {
  vi.stubGlobal("fetch", fetchPendurado());
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("download-cv — download responde com upstream pendurado", () => {
  it("serve o PDF PT em menos de 12s mesmo com TODAS as notificações penduradas", async () => {
    const t0 = Date.now();
    const res = await POST(makeReq("10.0.0.1"));
    const elapsed = Date.now() - t0;

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/pdf");
    expect(elapsed).toBeLessThan(TETO_MS);

    const buf = new Uint8Array(await res.arrayBuffer());
    // 15KB: o curriculo bifurcado cabe em 1 pagina (21KB). O antigo de 2 paginas
    // tinha 31KB. O contrato aqui e' "PDF de verdade, nao placeholder vazio".
    expect(buf.byteLength).toBeGreaterThan(15_000);
    expect(String.fromCharCode(...buf.subarray(0, 4))).toBe("%PDF");
  }, 30_000);

  it("locale en serve o Resume EN (attachment com o nome certo)", async () => {
    const res = await POST(makeReq("10.0.0.2", { locale: "en" }));

    expect(res.status).toBe(200);
    expect(res.headers.get("content-disposition")).toContain(
      "Samuel_Andrade_Resume_Dados_2026.pdf",
    );
  }, 30_000);

  // Bifurcacao do curriculo (08/11/2026): o PDF servido depende da variante
  // escolhida no modal. Sem isso, o usuario escolhe "Full Stack" e recebe o
  // curriculo de Dados — a regressao exata que motivou a mudanca.
  it("variant fullstack serve o PDF Full Stack (PT)", async () => {
    const res = await POST(makeReq("10.0.0.9", { variant: "fullstack" }));

    expect(res.status).toBe(200);
    expect(res.headers.get("content-disposition")).toContain(
      "Samuel_Andrade_FullStack_2026.pdf",
    );
  }, 30_000);

  it("variant fullstack + locale en serve o Resume Full Stack (EN)", async () => {
    const res = await POST(makeReq("10.0.0.10", { variant: "fullstack", locale: "en" }));

    expect(res.status).toBe(200);
    expect(res.headers.get("content-disposition")).toContain(
      "Samuel_Andrade_Resume_FullStack_2026.pdf",
    );
  }, 30_000);

  it("sem variant cai na versao Dados & BI (default)", async () => {
    const res = await POST(makeReq("10.0.0.11"));

    expect(res.status).toBe(200);
    expect(res.headers.get("content-disposition")).toContain(
      "Samuel_Andrade_Dados_2026.pdf",
    );
  }, 30_000);

  it("as 4 variantes de curriculo existem em public/ e sao PDFs validos", async () => {
    const { existsSync, readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const root = process.cwd();
    const nomes = [
      "Samuel_Andrade_Dados_2026.pdf",
      "Samuel_Andrade_Resume_Dados_2026.pdf",
      "Samuel_Andrade_FullStack_2026.pdf",
      "Samuel_Andrade_Resume_FullStack_2026.pdf",
    ];
    for (const n of nomes) {
      const p = join(root, "public", n);
      expect(existsSync(p), `${n} ausente em public/`).toBe(true);
      const head = readFileSync(p).subarray(0, 4).toString("latin1");
      expect(head, `${n} nao comeca com %PDF`).toBe("%PDF");
    }
  });

  it("sem consent responde 400 sem servir o PDF", async () => {
    const res = await POST(makeReq("10.0.0.3", { consent: false }));

    expect(res.status).toBe(400);
    expect(res.headers.get("content-type")).toContain("application/json");
  }, 30_000);

  it("cada fetch de notificação é disparado com signal de timeout", async () => {
    await POST(makeReq("10.0.0.4"));

    const fetchMock = vi.mocked(globalThis.fetch);
    expect(fetchMock).toHaveBeenCalled();
    for (const call of fetchMock.mock.calls) {
      const init = call[1] as RequestInit | undefined;
      expect(init?.signal).toBeDefined();
    }
  }, 30_000);
});

describe("download-cv — bundle serverless contém os PDFs", () => {
  it("next.config.js tem outputFileTracingIncludes para /api/download-cv com os PDFs de public/", () => {
    const includes = nextConfig.outputFileTracingIncludes as
      | Record<string, string[]>
      | undefined;

    expect(includes).toBeDefined();
    expect(includes?.["/api/download-cv"]).toContain("./public/*.pdf");
  });
});
