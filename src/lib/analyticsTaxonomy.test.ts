import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Contrato da taxonomia de `ui_click`.
 *
 * Medido em producao 26/11/2026: o handler de clique do engagement.ts estava
 * correto, mas o DOM nao tinha NENHUM `[data-analytics-id]` — `ui_click` era
 * zero evento. Testar o handler nao pega isso: o defeito estava na marcacao.
 * Aqui a marcacao e o contrato.
 */

const RAIZ = join(process.cwd(), 'src', 'components');

function fonte(arquivo: string): string {
  return readFileSync(join(RAIZ, arquivo), 'utf8');
}

/** Ids estaticos (`data-analytics-id="x"`) declarados num arquivo. */
function idsEstaticos(arquivo: string): string[] {
  return [...fonte(arquivo).matchAll(/data-analytics-id="([^"]+)"/g)].map((m) => m[1]);
}

describe('taxonomia de data-analytics-id', () => {
  it.each([
    ['Navbar.tsx', 'nav.${item.href.replace("#", "")}'],
    ['ProfileSection.tsx', 'hero.projects'],
    ['ProfileSection.tsx', 'hero.cv'],
    ['ContactForm.tsx', 'contact.submit'],
    ['DownloadModal.tsx', 'cv.download'],
  ])('%s declara %s', (arquivo, id) => {
    expect(fonte(arquivo)).toContain(id);
  });

  it.each([
    ['ThemeToggle.tsx', 'nav.theme'],
    ['LanguageToggle.tsx', 'nav.lang'],
    ['PalettePicker.tsx', 'nav.palette'],
  ])('%s declara %s', (arquivo, id) => {
    expect(idsEstaticos(arquivo)).toContain(id);
  });

  it('o card de projeto carrega id por projeto (GlassCard repassa o atributo)', () => {
    expect(fonte('ProjectHangar.tsx')).toContain('data-analytics-id={`project.open.${repo.name.toLowerCase()}`}');
    // GlassCard precisa TIPAR o atributo: `...rest` sem tipo = erro de compilacao.
    const glass = fonte('GlassCard.tsx');
    expect(glass).toContain('"data-analytics-id"?: string;');
    expect(glass).toContain('{...rest}');
  });

  it('nenhum id estatico duplicado entre componentes (um clique, um id)', () => {
    const arquivos = [
      'ThemeToggle.tsx', 'LanguageToggle.tsx', 'PalettePicker.tsx',
      'ProfileSection.tsx', 'ContactForm.tsx', 'DownloadModal.tsx', 'ProjectHangar.tsx',
    ];
    const todos = arquivos.flatMap(idsEstaticos);
    expect(todos.length).toBeGreaterThanOrEqual(5);
    expect(new Set(todos).size).toBe(todos.length);
  });
});
