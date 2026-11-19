/**
 * Contrato dos headers de segurança do next.config.js.
 *
 * Motivo: a CSP já quebrou produção duas vezes por drift entre o que o site
 * serve e o que o teste acreditava (incidente CSP+COEP de 30/08, que bloqueou
 * 8/8 imagens). Este teste exercita a API REAL do config:
 *   - `headers()` é ASSÍNCRONA e devolve `[{ source, headers: [...] }]`
 *     (não uma lista plana de `{ key, value }`);
 *   - `vercel.json` é a fonte que vale em produção, então os dois precisam
 *     concordar nos pontos que doem (img-src do LifeLog, sem 'unsafe-eval').
 *
 * NÃO reescrever para um formato "mais simples": a versão que existia em
 * 18/11/2026 chamava `headers()` como síncrona e esperava um array plano,
 * dava 9/9 vermelho e `X-XSS-Protection` (que só existe no vercel.json).
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const requireCjs = createRequire(import.meta.url);
const config = requireCjs("../../next.config.js");

type HeaderRule = { source: string; headers: { key: string; value: string }[] };

const REPO_ROOT = process.cwd();

async function regras(): Promise<HeaderRule[]> {
  return await (config.headers as () => Promise<HeaderRule[]>)();
}

function mapa(rule: HeaderRule): Record<string, string> {
  return Object.fromEntries(rule.headers.map((h) => [h.key, h.value]));
}

describe("next.config.js — headers de segurança", () => {
  let rule: HeaderRule;
  let h: Record<string, string>;

  beforeAll(async () => {
    const rules = await regras();
    expect(Array.isArray(rules)).toBe(true);
    const global = rules.find((r) => r.source === "/:path*");
    expect(global).toBeDefined();
    rule = global as HeaderRule;
    h = mapa(rule);
  });

  it("headers() é assíncrona e devolve regras por source", async () => {
    const rules = await regras();
    expect(rules.length).toBeGreaterThan(0);
    rules.forEach((r) => {
      expect(typeof r.source).toBe("string");
      expect(Array.isArray(r.headers)).toBe(true);
    });
  });

  it("mantém os headers básicos de endurecimento", () => {
    expect(h["X-Content-Type-Options"]).toBe("nosniff");
    expect(h["X-Frame-Options"]).toBe("SAMEORIGIN");
    expect(h["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["Strict-Transport-Security"]).toContain("max-age=");
    expect(h["Strict-Transport-Security"]).toContain("preload");
    expect(h["Permissions-Policy"]).toContain("camera=()");
  });

  it("publica a CSP com default-src 'self' e sem 'unsafe-eval'", () => {
    const csp = h["Content-Security-Policy"];
    expect(csp).toBeTruthy();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("style-src 'self' 'unsafe-inline'");
    expect(csp).not.toContain("unsafe-eval");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
  });

  it("img-src permite as capas do blog no host canônico do LifeLog", () => {
    const csp = h["Content-Security-Policy"];
    const imgSrc = csp
      .split(";")
      .map((p) => p.trim())
      .find((p) => p.startsWith("img-src"));
    expect(imgSrc).toBeDefined();
    expect(imgSrc).toContain("https://lifelog.seu.pet");
    expect(imgSrc).toContain("data:");
    expect(imgSrc).toContain("blob:");
  });

  it("vercel.json (fonte em produção) concorda nos pontos críticos", () => {
    const vercel = JSON.parse(
      fs.readFileSync(path.join(REPO_ROOT, "vercel.json"), "utf8"),
    ) as { headers: HeaderRule[] };
    const cspVercel = vercel.headers
      .flatMap((r) => r.headers)
      .find((x) => x.key === "Content-Security-Policy")?.value ?? "";

    expect(cspVercel).toContain("default-src 'self'");
    expect(cspVercel).not.toContain("unsafe-eval");
    expect(cspVercel).toContain("https://lifelog.seu.pet");
  });
});

describe("next.config.js — rewrites same-origin", () => {
  it("mantém /api/hit como proxy same-origin (beacon de visita)", async () => {
    const rewrites = await (config.rewrites as () => Promise<{ source: string; destination: string }[]>)();
    const hit = rewrites.find((r) => r.source === "/api/hit");
    expect(hit).toBeDefined();
    expect(hit!.destination).toContain("skills.seu.pet");
  });
});
