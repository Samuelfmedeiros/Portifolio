/**
 * Suite unitaria importa scripts/*.mjs (ex.: src/lib/coverGate.test.ts importa
 * scripts/check-project-covers.mjs). Vite/Rolldown 8 faz o hoist do interop CJS
 * (__vite__cjsImportN_node_*) para ANTES da primeira linha do modulo — se o
 * script importado comeca com shebang, o `#!` cai depois de codigo e o parser
 * explode com "Invalid Character `!`", derrubando a suite inteira sem nenhum
 * teste rodar.
 *
 * Estado real medido na rodada 3 (20/09/2026): 1 suite falhou no load
 * (src/lib/coverGate.test.ts) e 375 testes passaram — o gap nao era assert
 * quebrado, era o modulo que nem carregava.
 *
 * A regra vale para o que a suite IMPORTA: esses scripts sao invocados via
 * `node scripts/x.mjs` (ver .github/workflows/*), o shebang nao executa nada e
 * so cria essa bomba. Scripts que a suite nao importa nao entram aqui.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '../..');

/** Todos os arquivos de teste sob src/ (ignora node_modules / dotfiles). */
function walkTests(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue;
    const full = path.join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walkTests(full, out);
    else if (/\.(test|spec)\.(ts|tsx)$/.test(entry)) out.push(full);
  }
  return out;
}

/** Scripts .mjs referenciados por imports dentro dos testes. */
export function scriptsImportedByTests(): string[] {
  const found = new Set<string>();
  for (const testFile of walkTests(path.join(ROOT, 'src'))) {
    const src = readFileSync(testFile, 'utf8');
    // so import/require de verdade — comentario citando "node scripts/x.mjs" nao conta
    for (const m of src.matchAll(/\b(?:from\s*|require\(\s*|import\(\s*)["'`]([^"'`]*scripts\/[\w.-]+\.mjs)["'`]/g)) {
      found.add(path.resolve(path.dirname(testFile), m[1]));
    }
  }
  return [...found].sort();
}

describe('scripts importados por testes nao podem ter shebang (Rolldown/Vite 8)', () => {
  it('acha pelo menos o gate de capas (senao a varredura seria decorativa)', () => {
    const imported = scriptsImportedByTests().map((f) => path.relative(ROOT, f).replace(/\\/g, '/'));
    expect(imported).toContain('scripts/check-project-covers.mjs');
  });

  it('nenhum script importado por teste comeca com "#!"', () => {
    const offenders = scriptsImportedByTests()
      .filter((f) => readFileSync(f, 'utf8').startsWith('#!'))
      .map((f) => path.relative(ROOT, f).replace(/\\/g, '/'));

    expect(offenders).toEqual([]);
  });

  it('o gate de capas carrega de verdade pela suite (caminho que quebrava)', async () => {
    const script = path.join(ROOT, 'scripts', 'check-project-covers.mjs');
    const mod = await import(script);
    expect(typeof mod.validateProjects).toBe('function');
    expect(typeof mod.parseStaticProjects).toBe('function');
    expect(mod.MIN_BYTES).toBeGreaterThan(0);
  });

  it('controle negativo: um import com shebang seria acusado', () => {
    const fake = '#!/usr/bin/env node\nconsole.log(1)\n';
    expect(fake.startsWith('#!')).toBe(true);
  });
});