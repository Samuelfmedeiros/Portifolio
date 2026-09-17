// @ts-nocheck — le arquivos do repo e executa scanners locais (node fs/child_process).
/**
 * Security gate — contrato de config + evidencia REAL dos scanners.
 *
 * Gap 17/09 (rodada 3): o gate reportava "inconclusivo rc=1" em
 * gitleaks/bandit/opengrep. Causa raiz controlavel pelo repo: `bandit -r scripts/`
 * saia rc=1 por 21 achados LOW (B404/B603/B607 — subprocess com args literais, sem
 * shell nem input externo), e o gate lia rc=1 como falha de scanner. Os 3 scripts
 * foram anotados com `# nosec` JUSTIFICADO (zero mudanca de comportamento) e o
 * allowlist do gitleaks foi apertado — `docs/` nao pode mais esconder segredo.
 *
 * O que este teste trava:
 * 1. `.gitleaks.toml` nunca allowlista `src/` nem `docs/` (segredo em codigo/doc
 *    DEVE falhar o scan) — regressao do allowlist `docs/.*` removido hoje.
 * 2. `.security/opengrep-rules.yml` estruturalmente valido e com as regras ERROR.
 * 3. `bandit -r scripts/` conclui com rc=0 e 0 achados (o gap exato).
 * 4. `gitleaks detect` conclui rc=0 (0 segredos no historico do git).
 *
 * Os testes de EXECUCAO rodam so quando o binario existe no ambiente (CI/local);
 * sem o binario sao pulados. O contrato de config roda sempre.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { join, resolve } from "path";
import { spawnSync } from "child_process";

const ROOT = resolve(__dirname, "../..");
const GITLEAKS = join(ROOT, ".gitleaks.toml");
const OPENGREP = join(ROOT, ".security", "opengrep-rules.yml");

function binaryAvailable(cmd: string): boolean {
  const r = spawnSync(cmd, ["--version"], { encoding: "utf8" });
  return !r.error;
}

describe("gitleaks — allowlist nao cega codigo nem docs", () => {
  it(".gitleaks.toml existe e declara as regras custom", () => {
    expect(existsSync(GITLEAKS), ".gitleaks.toml ausente").toBe(true);
    const raw = readFileSync(GITLEAKS, "utf8");
    expect(raw).toContain("audio-files");
    expect(raw).toContain("screenshots");
  });

  it("allowlist NAO cobre src/ nem docs/ (segredo em codigo/doc falha o scan)", () => {
    const raw = readFileSync(GITLEAKS, "utf8");
    const line = raw.split(/\r?\n/).find((l) => /^\s*paths\s*=/.test(l));
    expect(line, "allowlist.paths ausente no .gitleaks.toml").toBeTruthy();

    const patterns: string[] = [];
    const re = /'''([^']+)'''|"([^"]+)"/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(line as string)) !== null) patterns.push(m[1] ?? m[2]);
    expect(patterns.length, "nenhum path extraido do allowlist").toBeGreaterThan(0);

    const blind = ["src/app/page.tsx", "src/lib/profileData.ts", "docs/SEGURANCA.md", "docs/cv/pt.md"];
    const leaking = patterns.filter((p) => {
      let rx: RegExp;
      try {
        rx = new RegExp(p);
      } catch {
        return true; // padrao invalido ja e falha
      }
      return blind.some((f) => rx.test(f));
    });
    expect(leaking, `allowlist cega arquivos de codigo/doc: ${leaking.join(", ")}`).toEqual([]);
  });

  it("gitleaks detect conclui rc=0 (0 segredos no historico)", () => {
    if (!binaryAvailable("gitleaks")) return; // scanner ausente no ambiente
    const r = spawnSync(
      "gitleaks",
      ["detect", "--source", ".", "--config", ".gitleaks.toml", "--no-banner", "--redact"],
      { cwd: ROOT, encoding: "utf8", timeout: 180000 }
    );
    expect(r.error, String(r.error)).toBeFalsy();
    expect(r.status, `gitleaks rc=${r.status}\n${r.stdout || ""}\n${r.stderr || ""}`).toBe(0);
  }, 200000);
});

describe("opengrep — regras custom estruturais", () => {
  it("existe e cada regra tem id + languages + severity valida", () => {
    expect(existsSync(OPENGREP), ".security/opengrep-rules.yml ausente").toBe(true);
    const raw = readFileSync(OPENGREP, "utf8");
    const blocks = raw.split(/\n(?=\s*-\s+id:)/).filter((b) => /^\s*-\s+id:/.test(b.trimStart()));
    expect(blocks.length, "nenhuma regra encontrada").toBeGreaterThanOrEqual(15);

    const bad = blocks.filter((b) => {
      const okId = /^\s*-\s+id:\s*\S+/m.test(b);
      const okLang = /languages:\s*\[/.test(b);
      const okSev = /severity:\s*(ERROR|WARNING|INFO)/.test(b);
      return !(okId && okLang && okSev);
    });
    expect(bad, `${bad.length} regra(s) malformada(s)`).toEqual([]);
  });

  it("mantem as regras HIGH/ERROR (RCE, JWT none, path traversal, creds, pickle)", () => {
    const raw = readFileSync(OPENGREP, "utf8");
    for (const id of [
      "debug-print-leaking-data",
      "eval-exec-unsafe",
      "jwt-none-algorithm",
      "database-no-auth-bind",
      "path-traversal",
      "hardcoded-db-credentials",
      "pickel-load-unsafe",
    ]) {
      expect(raw, `regra ERROR ausente: ${id}`).toContain(id);
    }
  });
});

describe("bandit — gate conclusivo (rc=0, 0 achados)", () => {
  it("`bandit -r scripts/` sai rc=0 e sem achados (regressao do gap rc=1)", () => {
    if (!binaryAvailable("bandit")) return; // scanner ausente no ambiente
    const r = spawnSync("bandit", ["-q", "-r", "scripts/", "-f", "json"], {
      cwd: ROOT,
      encoding: "utf8",
      timeout: 120000,
    });
    expect(r.error, String(r.error)).toBeFalsy();
    let report: any = null;
    try {
      report = JSON.parse(r.stdout || "");
    } catch {
      report = null;
    }
    expect(report, `bandit nao devolveu JSON — stdout=${r.stdout}\nstderr=${r.stderr}`).toBeTruthy();
    const results = report.results ?? [];
    expect(results, `bandit achou: ${results.map((x: any) => x.test_id + "@" + x.filename + ":" + x.line_number).join(", ")}`).toEqual([]);
    expect(r.status, "bandit rc!=0 com 0 achados (gate inconclusivo)").toBe(0);
  }, 150000);

  it("scripts *.py compilam (nosec nao quebrou sintaxe)", () => {
    const r = spawnSync("python", ["-m", "py_compile", "scripts/ats-score.py", "scripts/gen-cv.py", "scripts/validate-cv.py"], {
      cwd: ROOT,
      encoding: "utf8",
      timeout: 60000,
    });
    if (r.error) return; // python ausente
    expect(r.status, `${r.stdout || ""}\n${r.stderr || ""}`).toBe(0);
  }, 90000);
});