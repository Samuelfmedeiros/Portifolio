import { test, expect } from "@playwright/test";

/**
 * 🔴 Anti-bypass do acesso DIRETO aos PDFs do CV (guard: src/proxy.ts).
 *
 * Contexto (13/09/2026): o guard criado em 07/09 para fechar o furo de LGPD
 * (download direto sem consent/log) VIVIA BYPASSADO em produção. Medido nos
 * DOIS domínios (samuelmedeiros.vercel.app e portifolio.seu.pet): as variantes
 * percent-encoded abaixo respondiam 200 + application/pdf entregando o arquivo
 * real (70968 bytes, MD5 7caf656437148384e18b4367b6a713df), porque o matcher
 * só casava as duas strings exatas e o Vercel decodificava o path DEPOIS.
 *
 * Esta spec ASSERTE (não só loga) que:
 *   1. Toda variante do path do CV responde != 200 (sem bytes de PDF).
 *   2. O fluxo LEGÍTIMO continua funcionando: POST /api/download-cv entrega
 *      application/pdf de verdade (protege contra o guard "quebrar por engano"
 *      e virar o download do modal num 404).
 *
 * Controle negativo OBRIGATÓRIO (regra da skill portfolio-code): contra a
 * produção PRÉ-fix esta spec DEVE falhar (os vetores respondiam 200). Rode com
 *   TEST_BASE_URL=https://samuelmedeiros.vercel.app npx playwright test cv-direct-pdf-guard
 * antes e depois do deploy do fix — RED -> GREEN é o que prova o valor da spec.
 *
 * Não insere registro: o POST usa um User-Agent de teste identificável e o
 * backend grava em cv_downloads; por isso o teste só roda o POST se
 * RUN_CV_WRITE_TEST=1 estiver setado (ver testes de higiene de dados no cron).
 */

// 🔴 13/09: o default era a PRODUÇÃO — e o CI não seta TEST_BASE_URL, então os
// shards batiam no site pré-fix (ainda vazando) em vez do webServer da branch
// (localhost:3000, ver playwright.config.ts). Default correto = o servidor que
// o próprio playwright levanta. Produção é alvo SOMENTE com TEST_BASE_URL
// explícito, que é o controle negativo RED->GREEN documentado acima.
const BASE = process.env.TEST_BASE_URL || "http://localhost:3000";

// Vetores codificados: cada um é o MESMO arquivo que /Samuel_Andrade_2026.pdf
// via um encoding diferente. Eram 200 na produção antes do fix de 13/09.
const BYPASS_VECTORS = [
  "/Sam%75el_Andrade_2026.pdf",
  "/%53amuel_Andrade_2026.pdf",
  "/Samuel_Andrade_2026.p%64f",
  "/Samuel%5FAndrade%5F2026%2epdf",
  "/Samuel%5fAndrade%5f2026%2epdf",
  "/SAMUEL_ANDRADE_2026.PDF",
  "/Samuel_Andrade_2026.PDF",
  "/Sam%2575el_Andrade_2026.pdf", // double-encoding
  "/public/Samuel_Andrade_2026.pdf",
  "/.%2e/Samuel_Andrade_2026.pdf",
];

const RESUME_VECTORS = [
  "/Samuel_Andrade_Resume_2026.pdf",
  "/Samuel%5FAndrade%5FResume%5F2026%2epdf",
  "/samuel_andrade_resume_2026.pdf",
];

test.describe("CV direct-download guard (LGPD) — nenhum encoding escapa", () => {
  test.describe.configure({ mode: "serial" });
  test.setTimeout(45_000);

  // Liveness FIRST: sem isso um servidor morto faz todo request lançar e os
  // testes de bloqueio virarem passe vacuo (armadilha encontrada 13/09/2026 —
  // `next start` lançado em sessão WSL anterior já tinha morrido).
  test("servidor de teste está de pé (anti passe-vacuo)", async ({ request }) => {
    const res = await request.get(`${BASE}/`, { timeout: 20_000 });
    expect(res.status(), `${BASE}/ deve responder 200`).toBe(200);
  });

  for (const vector of [...BYPASS_VECTORS, ...RESUME_VECTORS]) {
    test(`bloqueia acesso direto: ${vector}`, async ({ request }) => {
      const url = `${BASE}${vector}`;
      // SEM try/catch: erro de rede é FALHA, não passe (ver liveness acima).
      const res = await request.get(url, {
        headers: { accept: "application/pdf,*/*" },
        timeout: 20_000,
      });
      // O ponto: NUNCA pode devolver o PDF. 200 + application/pdf = vazamento.
      const ct = res.headers()["content-type"] || "";
      const leaked = res.status() === 200 && ct.includes("application/pdf");
      expect(leaked, `${vector} está servindo o PDF direto (status=${res.status()} ct=${ct})`).toBe(
        false,
      );
    });
  }

  test("assets legítimos NÃO são bloqueados (sem colateral)", async ({ request }) => {
    for (const p of ["/", "/ads.txt", "/robots.txt", "/icon.svg", "/projects/arachne.webp"]) {
      const res = await request.get(`${BASE}${p}`);
      expect(res.status(), `${p} deveria servir`).toBe(200);
    }
  });

  test("API de download continua viva (consent exigido, sem bypass)", async ({ request }) => {
    // POST sem consent -> 400 (prova que a rota existe E que a guarda LGPD vive)
    const res = await request.post(`${BASE}/api/download-cv`, {
      data: { consent: false, locale: "pt" },
    });
    expect(res.status()).toBe(400);
    const body = await res.json().catch(() => ({}));
    expect(String((body as { error?: string }).error || "").toLowerCase()).toContain(
      "consent",
    );
  });

  test(
    "fluxo legítimo entrega PDF de verdade (POST consent:true) — opt-in",
    async ({ request }) => {
      test.skip(
        process.env.RUN_CV_WRITE_TEST !== "1",
        "insere registro em cv_downloads; só roda com RUN_CV_WRITE_TEST=1 (higiene: apagar depois)",
      );
      const res = await request.post(`${BASE}/api/download-cv`, {
        data: { consent: true, locale: "pt" },
        headers: { "user-agent": "cv-guard-e2e-antibypass" },
      });
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toContain("application/pdf");
      const buf = await res.body();
      expect(buf.length, "PDF deve ter bytes reais").toBeGreaterThan(10000);
    },
  );
});
