#!/usr/bin/env node
/**
 * Guard anti-"spec-de-seguranca-com-default-de-base-apontando-pra-producao" (13/09 — PR #98).
 *
 * Contexto da falha: tests/cv-direct-pdf-guard.spec.ts tinha
 *   const BASE = process.env.TEST_BASE_URL || "https://samuelmedeiros.vercel.app"
 * O CI (playwright.yml) NAO seta TEST_BASE_URL, entao os 3 shards batiam na
 * PRODUCAO pre-fix (que ainda vazava o CV) em vez do webServer da branch
 * (localhost:3000). O RED do controle negativo vazou pra dentro do CI e o CI
 * ficou vermelho sem haver regressao no codigo da branch.
 *
 * Este gate impede a classe inteira de voltar: em uma spec de teste, o
 * Fallback de base URL (a string depois do `||` / default de param /
 * `new URL(... )`) NAO pode ser um hostname de producao. Producao so entra como
 * override EXPLICITO via env (TEST_BASE_URL / BASE_URL), nunca como default.
 *
 * O que e permitido: URL de producao em COMENTARIO e em STRING de assercao de
 * conteudo (ex: links-audit espera o texto "samuelmedeiros.vercel.app" no body)
 * — por isso so olhamos o lado direito de atribuicoes/defaults de BASE-like.
 *
 * Uso: node scripts/check-spec-base-url.mjs [dir1 dir2 ...]   (default: tests/)
 * Exit 0 = limpo | Exit 1 = violacao (mostra arquivo:linha).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const PROD_HOSTS = [
  "samuelmedeiros.vercel.app",
  "portifolio.seu.pet",
  "www.samuelmedeiros.com",
];
// nomes de variavel que funcionam como "base URL do ambiente de teste"
const BASE_LIKE = /\b(BASE|BASE_URL|baseURL|baseUrl|origin|TEST_BASE)\b/;
const SPEC_EXT = new Set([".ts", ".tsx", ".js", ".mjs", ".cjs"]);

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const st = statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (SPEC_EXT.has(extname(p))) acc.push(p);
  }
  return acc;
}

// Remove comentario de bloco e linha pra nao acusar documentacao.
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1");
}

const dirs = process.argv.slice(2);
const roots = dirs.length ? dirs : ["tests"];
const violations = [];

for (const root of roots) {
  let files;
  try {
    files = statSync(root).isDirectory() ? walk(root) : [root];
  } catch {
    continue;
  }
  for (const file of files) {
    const raw = readFileSync(file, "utf8");
    const lines = stripComments(raw).split("\n");
    lines.forEach((line, i) => {
      // so liga se a linha define/usa um default de base-like E uma URL de prod
      if (!BASE_LIKE.test(line)) return;
      if (!/(https?:\/\/)|process\.env\./.test(line)) return;
      for (const host of PROD_HOSTS) {
        // padrao de VIOLACAO: default/const/FALLBACK apontando pra producao
        const isDefault =
          new RegExp(`\\|\\|\\s*[\`"']https?://[^ \`"']*${host
            .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\`"']`).test(line) ||
          new RegExp(`(const|let|var)\\s+\\w*BASE\\w*\\s*=\\s*[\`"']https?://[^ \`"']*${host
            .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(line);
        if (isDefault) {
          violations.push(`${file}:${i + 1}: default de base URL aponta pra producao (${host})`);
        }
      }
    });
  }
}

if (violations.length) {
  console.error("FAIL check-spec-base-url: defaults de teste apontando pra producao");
  for (const v of violations) console.error("  " + v);
  console.error("\nFix: default deve ser http://localhost:3000 (o webServer que o Playwright levanta).");
  console.error("Producao so via override explicito: TEST_BASE_URL=https://... (controle negativo).");
  process.exit(1);
}
console.log("PASS check-spec-base-url: nenhum default de spec aponta pra producao");
