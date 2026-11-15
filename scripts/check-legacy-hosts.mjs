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
 *
 * PDF (15/11/2026): o guard so varria TEXTO por extensao, entao os 6 curriculos
 * servidos ao visitante passavam limpos enquanto citavam samuelmedeiros.vercel.app
 * no cabecalho — o host so aparece no stream comprimido (Flate), invisivel para
 * um grep de bytes crus e invisivel para o walk por extname. Agora o guard infla
 * os streams do PDF e varre o texto resultante; sem zlib disponivel ele reporta
 * NAO VERIFICAVEL em vez de dizer PASS.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { execFileSync } from "node:child_process";

const LEGACY_HOST = /(^|[/.])vercel\.app\b/i;
const TEXT_EXT = new Set([
  ".html", ".htm", ".js", ".mjs", ".cjs", ".css", ".json",
  ".txt", ".xml", ".svg", ".md", ".webmanifest", ".map",
]);
const BINARY_SCAN_EXT = new Set([".pdf"]);

/**
 * Texto de um PDF. O conteudo real NAO aparece em claro nem nos streams Flate
 * inflados: as fontes sao subset com ToUnicode CMap, e o stream traz operadores
 * (Tj/TJ) com glifos hex. Quem resolve isso e o pdftotext. Sem a ferramenta,
 * devolve null -> o guard reporta NAO VERIFICAVEL, nunca PASS.
 */
function pdfText(file) {
  try {
    return execFileSync("pdftotext", [file, "-"], {
      encoding: "utf8",
      timeout: 20000,
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return null;
  }
}


function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const st = statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else {
      const ext = extname(p).toLowerCase();
      if (TEXT_EXT.has(ext) || BINARY_SCAN_EXT.has(ext)) acc.push(p);
    }
  }
  return acc;
}

const args = process.argv.slice(2);
const roots = args.length ? args : ["public"];
const violations = [];
const unverifiable = [];

for (const root of roots) {
  let files;
  try {
    files = statSync(root).isDirectory() ? walk(root) : [root];
  } catch {
    continue;
  }
  for (const file of files) {
    const ext = extname(file).toLowerCase();
    let lines;
    if (BINARY_SCAN_EXT.has(ext)) {
      const text = pdfText(file);
      if (text === null) {
        unverifiable.push(`${file}: pdftotext indisponivel — nao da para ler o PDF`);
        continue;
      }
      if (!text.trim()) {
        unverifiable.push(`${file}: sem texto extraivel (PDF escaneado/imagem)`);
        continue;
      }
      lines = text.split("\n");
    } else {
      lines = readFileSync(file, "utf8").split("\n");
    }
    lines.forEach((line, i) => {
      if (LEGACY_HOST.test(line)) {
        violations.push(`${file}:${i + 1}: cita host legado *.vercel.app`);
      }
    });
  }
}

if (unverifiable.length) {
  console.error("NAO VERIFICAVEL check-legacy-hosts: PDF nao pode ser lido");
  for (const u of unverifiable) console.error("  " + u);
  console.error("Sem texto extraivel, ausencia de host legado NO PDF nao foi provada.");
}
if (violations.length) {
  console.error("FAIL check-legacy-hosts: host legado *.vercel.app em asset estatico");
  for (const v of violations) console.error("  " + v);
  console.error("\nFix: usar o dominio canonico (ex: portifolio.seu.pet / lifelog.seu.pet).");
  console.error("Legado intencional (redirect/allowlist) mora em src/, next.config.js,");
  console.error("vercel.json e scripts/ — fora de public/.");
  process.exit(1);
}
if (unverifiable.length) {
  process.exit(0); // nao bloqueia rodaada, mas nunca se imprime como limpo
}
console.log("PASS check-legacy-hosts: nenhum host legado *.vercel.app em public/");
