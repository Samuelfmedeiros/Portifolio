#!/usr/bin/env node
/**
 * 🐛 i18n Audit — varredura ESTÁTICA de strings hardcoded (P0.1 do plano bug-hunter v3)
 * Portifólio Samuel — 30/08/2026
 *
 * Detecta em src/:
 *  1. Texto PT hardcoded em JSX (>=2 palavras, com acento OU palavras PT comuns)
 *     que não passa por t(...) — string literal dentro de <Tag>...</Tag> ou aria-label
 *  2. aria-label/title/placeholder com texto PT hardcoded
 *  3. Uso cru de repo.description / item.description / project.description
 *     onde existe getProjectI18n(locale) (bug real do modal, 29/08)
 *
 * Heurística anti-falso-positivo: ignora imports, className, style, comentários,
 * strings de dados (staticProjects/profileData), textos < 2 palavras, conteúdo
 * dinâmico ({...}).
 *
 * Uso: node scripts/i18n-audit.mjs [--dir src] [--json]
 * Saída: findings agrupados por tipo + flag de erro (exit 1 se achar)
 */

import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = resolve(ROOT, process.argv.includes('--dir') ? process.argv[process.argv.indexOf('--dir') + 1] : 'src');
const FINDINGS_DIR = resolve(ROOT, 'docs/agents/qualidade/bug-hunter/findings');

// Palavras PT comuns (sem acento) que denunciam texto PT hardcoded
const PT_WORDS = [
  'não', 'não', 'para', 'sobre', 'entre', 'com', 'você', 'nós', 'eles', 'essa', 'este',
  'projetos', 'contato', 'início', 'inicio', 'carregando', 'carregar', 'enviar', 'enviado',
  'todos', 'todas', 'mais', 'menos', 'entrar', 'sair', 'abrir', 'fechar', 'voltar',
  'também', 'tambem', 'pode', 'deve', 'será', 'sera', 'porque', 'quando', 'como',
  'atualizado', 'atualizar', 'detalhes', 'visitar', 'saber', 'saiba', 'jornada',
  'experiência', 'experiencia', 'formação', 'formacao', 'idiomas', 'baixar', 'currículo',
  'curriculo', 'privacidade', 'termos', 'política', 'politica', 'ferramentas', 'tecnologias',
  'soluções', 'solucoes', 'desenvolvimento', 'criado', 'criar', 'trabalho', 'freelancer',
  'analista', 'desenvolvedor', 'portfólio', 'portfolio', 'mensagem', 'nome', 'email',
  'enviando', 'obrigado', 'até', 'aqui', 'lá', 'já', 'só', 'ser', 'está', 'está',
];

// Acentos PT (string de conteúdo visível)
const PT_ACCENT = /[àáâãäçéèêëíìîïóòôõöúùûüÀÁÂÃÄÇÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜ]/;

// Padrões de atributos com texto visível (a11y + form)
const TEXT_ATTRS = ['aria-label', 'title', 'placeholder', 'aria-description', 'alt'];

// Expressão de texto PT hardcoded em JSX: >texto< com >=2 palavras
function findHardcodedJsx(file, code) {
  const findings = [];
  // captura >texto puro< (sem { e sem <)
  const jsxRe = />([^<>{}\n]{4,})</g;
  let m;
  while ((m = jsxRe.exec(code)) !== null) {
    const text = m[1].trim();
    if (!text) continue;
    if (looksLikeContent(text)) {
      findings.push({ file, line: lineOf(code, m.index), type: 'hardcoded-jsx', text: text.slice(0, 80) });
    }
  }
  return findings;
}

function looksLikeContent(text) {
  // precisa ser texto de conteúdo, não atributo/class
  if (text.length < 4 || text.length > 120) return false;
  if (/^[A-Za-z0-9_\-\s.,/]+$/.test(text) && !PT_ACCENT.test(text)) {
    // sem acento: precisa ter palavra PT forte OU ser multi-palavra suspeita
    const words = text.toLowerCase().split(/[\s,.]+/).filter(w => w.length > 2);
    const ptHits = words.filter(w => PT_WORDS.includes(w)).length;
    if (ptHits < 1) return false;
  }
  // evita className, path, ids, tecnologia
  if (/^[\w\-/.]+$/.test(text)) return false; // single token
  if (/^(https?:|\/|\$|\{|className|id=)/.test(text)) return false;
  // precisa ter pelo menos uma palavra com acento OU PT_WORDS
  if (!PT_ACCENT.test(text)) {
    const words = text.toLowerCase().split(/[\s,.!?]+/);
    const ptHits = words.filter(w => PT_WORDS.includes(w)).length;
    if (ptHits < 1) return false;
  }
  // ignora dados/falsos comuns
  const ignore = [/^[0-9.,]+$/, /^(Todos os direitos|All rights)/i, /^\d{4}/, /^\w+\.\w+$/];
  if (ignore.some(r => r.test(text))) return false;
  return true;
}

function findTextAttrs(file, code) {
  const findings = [];
  const lines = code.split('\n');
  lines.forEach((line, idx) => {
    TEXT_ATTRS.forEach(attr => {
      // aria-label="..." sem t() e sem { — conteúdo PT
      const re = new RegExp(`${attr}=\\s*[\`"']([^\`"'{}]{4,})[\`"']`, 'g');
      let m;
      while ((m = re.exec(line)) !== null) {
        const val = m[1];
        if (looksLikeContent(val)) {
          findings.push({ file, line: idx + 1, type: `attr-${attr}`, text: val.slice(0, 80) });
        }
      }
    });
  });
  return findings;
}

// Uso cru de X.description (onde deveria ser getProjectI18n)
function findRawDescription(file, code) {
  const findings = [];
  const re = /\{(repo|item|project|proj)\.description\}/g;
  let m;
  while ((m = re.exec(code)) !== null) {
    findings.push({ file, line: lineOf(code, m.index), type: 'raw-description', text: m[0] });
  }
  return findings;
}

function lineOf(code, index) {
  return code.slice(0, index).split('\n').length;
}

function walk(dir, out = []) {
  for (const ent of readdirSync(dir)) {
    const full = join(dir, ent);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (ent === 'node_modules' || ent === '.next') continue;
      walk(full, out);
    } else if (/\.(tsx|ts|jsx|js)$/.test(ent) && !ent.endsWith('.test.') && !ent.endsWith('.spec.')) {
      if (ent.includes('.test.') || ent.includes('.spec.')) continue;
      out.push(full);
    }
  }
  return out;
}

// Ignora arquivos onde texto PT é intencional (emails, dados, monetização)
function isIntentional(file) {
  const rel = file.replace(ROOT + '\\', '').replace(ROOT + '/', '');
  return (
    rel.includes('app/api/') || // emails/API de servidor
    rel.includes('lib/dictionary') || // dicionário é a fonte de tradução
    rel.includes('lib/staticProjects') || // dados
    rel.includes('lib/profileData') || // dados
    rel.includes('lib/palettes') || // dados de tema
    rel.includes('lib/types') // tipos
  );
}

const files = walk(SRC).filter(f => !/\.test\.|\.spec\.|__tests__/.test(f) && !isIntentional(f));
const all = [];

for (const f of files) {
  let code;
  try { code = readFileSync(f, 'utf8'); } catch { continue; }
  if (!code.trim()) continue;
  all.push(...findHardcodedJsx(f, code));
  all.push(...findTextAttrs(f, code));
  all.push(...findRawDescription(f, code));
}

// agrupa
const byType = {};
for (const x of all) {
  (byType[x.type] = byType[x.type] || []).push(x);
}

const summary = Object.entries(byType).map(([type, items]) => ({ type, count: items.length, items }));

mkdirSync(FINDINGS_DIR, { recursive: true });
const outPath = resolve(FINDINGS_DIR, `i18n-audit-${new Date().toISOString().split('T')[0]}.json`);
writeFileSync(outPath, JSON.stringify({ timestamp: new Date().toISOString(), filesScanned: files.length, summary }, null, 2));

// print resumido
console.log(`\n🧠 i18n Audit — ${files.length} arquivos escaneados\n`);
if (summary.length === 0) {
  console.log('✅ Nenhum texto hardcoded encontrado.');
} else {
  for (const { type, count, items } of summary) {
    console.log(`\n── ${type} (${count}) ──`);
    for (const it of items.slice(0, 15)) {
      const rel = it.file.replace(ROOT + '\\', '').replace(ROOT + '/', '');
      console.log(`  ${rel}:${it.line}  "${it.text}"`);
    }
    if (count > 15) console.log(`  ... +${count - 15} mais`);
  }
}
console.log(`\n📄 Relatório: ${outPath}`);
process.exit(summary.length > 0 ? 1 : 0);
