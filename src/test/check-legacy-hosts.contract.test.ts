import { describe, it, expect, afterEach } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

/**
 * Contrato REAL do guard `scripts/check-legacy-hosts.mjs` (CLI, sem exports).
 *
 * Teste de comportamento executando o script de verdade em diretórios
 * temporários — nunca uma cópia da regex do guard dentro do teste. O arquivo
 * anterior (`src/test/check-legacy-hosts.test.ts`, 301 linhas, quarentenado em
 * 17/11/2026) reimplementava os conjuntos de extensões e a regex localmente e
 * dava 39/39 vermelho: media a si mesmo, não o script.
 */
const REPO = resolve(__dirname, '../..');
const GUARD = join(REPO, 'scripts', 'check-legacy-hosts.mjs');

let dirs: string[] = [];

function tree(files: Record<string, string>): string {
  const dir = mkdtempSync(join(tmpdir(), 'legacy-hosts-'));
  dirs.push(dir);
  for (const [rel, content] of Object.entries(files)) {
    const full = join(dir, rel);
    mkdirSync(join(full, '..'), { recursive: true });
    writeFileSync(full, content);
  }
  return dir;
}

function run(...args: string[]) {
  const r = spawnSync(process.execPath, [GUARD, ...args], { encoding: 'utf8' });
  return { status: r.status, out: `${r.stdout || ''}${r.stderr || ''}` };
}

afterEach(() => {
  for (const d of dirs) rmSync(d, { recursive: true, force: true });
  dirs = [];
});

describe('check-legacy-hosts (contrato do CLI)', () => {
  it('falha e aponta arquivo:linha quando html cita host legado', () => {
    const dir = tree({
      'index.html': '<h1>ok</h1>\n<a href="https://samuelmedeiros.vercel.app">x</a>\n',
    });
    const { status, out } = run(dir);
    expect(status).toBe(1);
    expect(out).toMatch(/FAIL check-legacy-hosts/);
    expect(out).toMatch(/index\.html:2:/);
  });

  it('passa em diretório limpo', () => {
    const dir = tree({ 'index.html': '<p>https://portifolio.seu.pet</p>\n' });
    const { status, out } = run(dir);
    expect(status).toBe(0);
    expect(out).toMatch(/PASS check-legacy-hosts/);
  });

  it('não confunde vercel.com com o host legado .app', () => {
    const dir = tree({ 'a.js': 'const u = "https://vercel.com/docs";\n' });
    expect(run(dir).status).toBe(0);
  });

  it('varre subdiretórios e extensões de texto (.md, .svg, .json)', () => {
    const dir = tree({
      'sub/page.md': '# t\nhttps://portifolio-30.vercel.app/games\n',
      'img/logo.svg': '<svg><desc>samuelmedeiros.vercel.app</desc></svg>\n',
      'dados.json': '{"url":"https://x.vercel.app"}\n',
    });
    const { status, out } = run(dir);
    expect(status).toBe(1);
    for (const f of ['page.md', 'logo.svg', 'dados.json']) expect(out).toContain(f);
  });

  it('ignora extensão binária sem varredura (.png)', () => {
    const dir = tree({ 'foto.png': 'binario samuelmedeiros.vercel.app binario\n' });
    expect(run(dir).status).toBe(0);
  });

  it('aceita arquivo único como argumento', () => {
    const dir = tree({ 'nota.txt': 'migrou de portifolio-30.vercel.app\n' });
    const { status, out } = run(join(dir, 'nota.txt'));
    expect(status).toBe(1);
    expect(out).toMatch(/nota\.txt:1:/);
  });

  it('caminho inexistente não explode e não vira FAIL', () => {
    const { status, out } = run(join(tmpdir(), 'nao-existe-xyz-12345'));
    expect(status).toBe(0);
    expect(out).toMatch(/PASS/);
  });

  it('gate real do repo: public/ está limpo', () => {
    const { status, out } = run();
    expect(status).toBe(0);
    expect(out).toMatch(/PASS check-legacy-hosts/);
  });
});
