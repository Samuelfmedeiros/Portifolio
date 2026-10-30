#!/usr/bin/env node
/**
 * Guard anti-host-legado em assets estaticos servidos ao usuario (07/10 — PR #132).
 *
 * Contexto: public/games/terminal/index.html imprimia em producao, meses depois da
 * migracao pro dominio proprio:
 *   "Site: samuelmedeiros.vercel.app"
 *   "Todos disponiveis em: https://portifolio-30.vercel.app/games/..."
 * HTML estatico em public/ nao passa pelo build do framework nem por nenhuma
 * varredura de src/ — so um grep pega.
 *
 * Regra: nenhum arquivo de texto em public/ pode citar *.vercel.app.
 * Usos INTENCIONAIS do host legado (proxy de redirect, allowlist de img-src/CSP,
 * blocklist do guard de specs) vivem em src/, next.config.js, vercel.json e
 * scripts/ — fora de public/, que e servido como esta ao visitante.
 *
 * Uso: node scripts/check-legacy-hosts.mjs [dir arquivo...]   (default: public/)
 * Exit 0 = limpo | Exit 1 = violacao (mostra arquivo:linha).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const LEGACY_HOST = /(^|[/.])vercel\.app\b/i;
const TEXT_EXT = new Set([
  ".html", ".htm", ".js", ".mjs", ".cjs", ".css", ".json",
  ".txt", ".xml", ".svg", ".md", ".webmanifest", ".map",
]);

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const st = statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (TEXT_EXT.has(extname(p).toLowerCase())) acc.push(p);
  }
  return acc;
}

const args = process.argv.slice(2);
const roots = args.length ? args : ["public"];
const violations = [];

for (const root of roots) {
  let files;
  try {
    files = statSync(root).isDirectory() ? walk(root) : [root];
  } catch {
    continue;
  }
  for (const file of files) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      if (LEGACY_HOST.test(line)) {
        violations.push(`${file}:${i + 1}: cita host legado *.vercel.app`);
      }
    });
  }
}

if (violations.length) {
  console.error("FAIL check-legacy-hosts: host legado *.vercel.app em asset estatico");
  for (const v of violations) console.error("  " + v);
  console.error("\nFix: usar o dominio canonico (ex: portifolio.seu.pet / lifelog.seu.pet).");
  console.error("Legado intencional (redirect/allowlist) mora em src/, next.config.js,");
  console.error("vercel.json e scripts/ — fora de public/.");
  process.exit(1);
}
console.log("PASS check-legacy-hosts: nenhum host legado *.vercel.app em public/");
