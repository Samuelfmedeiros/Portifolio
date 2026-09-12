// @ts-nocheck — teste de regressão de dependências que lê arquivos (node fs) e
// resolve módulos; segue o padrão de src/test/i18n-audit.test.ts.
/**
 * Deps Regression Batch8 — trava os 4 bumps da campanha batch-deps-8 (e9f8240):
 * next ^16.3.4 · stripe ^22.6.1 · lucide-react ^1.41.0 · @types/node ^26.4.1
 *
 * O que cada teste protege (pontos de integração REAIS das libs no app):
 * 1. lucide-react 1.41: todo ícone importado em src/ precisa existir no pacote
 *    instalado (rename/remoção de export quebraria o build em produção)
 * 2. lucide-react runtime: ícone renderiza SVG de verdade via React Testing Lib
 * 3. versões instaladas satisfazem os ranges do package.json (anti-lockfile drift)
 * 4. stripe 22 SDK: constrói cliente offline e expõe a API de checkout usada
 * 5. next 16: todos os entry points públicos usados pelo app resolvem no pacote
 */
import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, readdirSync } from "fs";
import { join, relative } from "path";
import { createRequire } from "module";

const ROOT = process.cwd();
const require = createRequire(join(ROOT, "noop.js"));

/** Varre src/ recursivamente, pulando node_modules, _old e arquivos de teste. */
function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === "_old") continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(e.name) && !/\.(test|spec)\.(ts|tsx)$/.test(e.name))
      out.push(p);
  }
  return out;
}

/** Extrai os nomes importados de `import { A, B as C } from "lucide-react"` (multilinha ok). */
function lucideImports(file: string): { name: string; local: string }[] {
  const txt = readFileSync(file, "utf8");
  const re = /import\s*\{([^}]*)\}\s*from\s*["']lucide-react["']/g;
  const found: { name: string; local: string }[] = [];
  let m;
  while ((m = re.exec(txt)) !== null) {
    for (const part of m[1].split(",")) {
      const raw = part.trim().replace(/^type\s+/, "");
      if (!raw) continue;
      const [name, local] = raw.split(/\s+as\s+/).map((s) => s.trim());
      if (/^[A-Z]/.test(name)) found.push({ name, local: local || name });
    }
  }
  return found;
}

function readJson(p: string) {
  return JSON.parse(readFileSync(join(ROOT, p), "utf8"));
}

/** Compara semver: -1 a<b, 0 igual, 1 a>b. */
function cmpSemver(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] ?? 0) > (pb[i] ?? 0)) return 1;
    if ((pa[i] ?? 0) < (pb[i] ?? 0)) return -1;
  }
  return 0;
}

const BUMPED = [
  { pkg: "next", min: "16.3.4" },
  { pkg: "stripe", min: "22.6.1" },
  { pkg: "lucide-react", min: "1.41.0" },
  { pkg: "@types/node", min: "26.4.1" },
];

describe("deps batch8 — regressão dos 4 bumps (e9f8240)", () => {
  it("todos os ícones lucide-react importados em src/ existem no pacote instalado", async () => {
    const lucide = await import("lucide-react");
    const files = walk(join(ROOT, "src"));
    const checked: string[] = [];
    const missing: string[] = [];

    for (const f of files) {
      for (const imp of lucideImports(f)) {
        checked.push(`${relative(ROOT, f)} → ${imp.name}`);
        if (typeof (lucide as Record<string, unknown>)[imp.name] === "undefined") {
          missing.push(`${relative(ROOT, f)}: export "${imp.name}" não existe no lucide-react instalado`);
        }
      }
    }

    // sanidade: o scanner precisa achar imports de verdade (não pode falar verde por regex quebrado)
    expect(checked.length).toBeGreaterThan(40);
    expect(missing).toEqual([]);
  });

  it("lucide-react 1.41 renderiza SVG de verdade via React (runtime, não só export)", async () => {
    const { render } = await import("@testing-library/react");
    const { Send, Mail } = await import("lucide-react");
    const { container } = render(
      <span>
        <Send data-testid="send-icon" />
        <Mail />
      </span> as any
    );
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBe(2);
    for (const svg of Array.from(svgs)) {
      expect(svg.getAttribute("viewBox")).toMatch(/^0 0 24 24$/);
    }
  });

  it("versões instaladas satisfazem o range do package.json e o mínimo do batch", () => {
    const pkg = readJson("package.json");
    const declared = { ...pkg.dependencies, ...pkg.devDependencies };
    const failures: string[] = [];

    for (const { pkg: name, min } of BUMPED) {
      const range = declared[name];
      expect(range, `package.json não declara "${name}"`).toBeTruthy();
      expect(range.startsWith("^"), `range inesperado para ${name}: ${range}`).toBe(true);

      const installed = readJson(join("node_modules", name, "package.json")).version;
      const minRange = range.slice(1);

      if (installed.split(".")[0] !== minRange.split(".")[0]) {
        failures.push(`${name}: major instalada ${installed} ≠ major do range ^${minRange}`);
      }
      if (cmpSemver(installed, minRange) < 0) {
        failures.push(`${name}: instalada ${installed} < mínimo do range ^${minRange}`);
      }
      if (cmpSemver(installed, min) < 0) {
        failures.push(`${name}: instalada ${installed} < versão do batch ${min} (lockfile regrediu?)`);
      }
    }
    expect(failures).toEqual([]);
  });

  it("stripe 22 SDK constrói cliente offline e expõe API de checkout", async () => {
    const mod = await import("stripe");
    const Stripe = mod.default ?? (mod as any);
    const client = new Stripe("sk_test_offline_surface_probe_only");
    expect(client).toBeTruthy();
    expect(typeof client.checkout.sessions.create).toBe("function");
    expect(typeof client.prices.retrieve).toBe("function");
    const installed = readJson(join("node_modules", "stripe", "package.json")).version;
    expect(installed.split(".")[0]).toBe("22");
  });

  it("entry points públicos do next 16 usados pelo app resolvem no pacote instalado", () => {
    const entries = ["server", "og", "navigation", "link", "dynamic", "image"];
    const broken: string[] = [];
    for (const e of entries) {
      try {
        require.resolve(`next/${e}`);
      } catch {
        broken.push(`next/${e}`);
      }
    }
    expect(broken).toEqual([]);
    // o package do next instalado é o do batch (^16.3.4, major 16)
    const installed = readJson(join("node_modules", "next", "package.json")).version;
    expect(installed.split(".")[0]).toBe("16");
    expect(existsSync(join(ROOT, "node_modules", "next"))).toBe(true);
  });
});
