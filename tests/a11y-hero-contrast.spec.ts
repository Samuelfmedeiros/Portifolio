import { test, expect } from '@playwright/test';

/**
 * Contraste REAL dos 2 elementos do hero citados na auditoria de UI de 27/11/2026:
 * o CTA "Ver Projetos" e o texto do TypeWriter ("Desenvolvedor...").
 *
 * Por que esta spec existe ao lado da axe-core: o CTA tem fundo em GRADIENTE
 * (`bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent)]/5` sobre
 * `--bg-card`). O axe-core trata fundo com gradiente como desconhecido e NÃO
 * emite violação — o texto passava "verde" no CI com 4.32:1 no tema light
 * (medido em 27/11/2026: `#0369a1` sobre `rgb(202,223,235)`, fonte 16px bold,
 * que não é "large text" e portanto exige 4.5:1). A cura foi o token
 * `--accent-readable` em globals.css (dark mantém `var(--accent)`; light
 * mistura 80% do accent com o slate do tema -> 5.22:1).
 *
 * A razão aqui é calculada no browser real: cor do texto composta (alpha) sobre
 * o PIOR stop de gradiente do elemento e dos ancestrais, por sua vez sobre o
 * fundo sólido mais próximo. Nenhuma cor é fixada no teste — se alguém trocar
 * o token por uma cor que reprove AA, a spec quebra.
 */
const THEMES = ['dark', 'light'] as const;

const ALVOS = [
  { nome: 'CTA "Ver Projetos"', selector: '#profile a[href="#projects"]' },
  { nome: 'TypeWriter do hero', selector: '#profile p.h-7 span' },
];

const INJECT_CSS =
  '*, *::before, *::after { transition: none !important; opacity: 1 !important; transform: none !important; }';

/** Razão de contraste efetiva (pior caso) de um elemento, calculada in-page. */
const measure = (selector: string) => {
  const oklabToRgb = (L: number, a: number, b: number): [number, number, number] => {
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.291485548 * b;
    const l = l_ ** 3;
    const m = m_ ** 3;
    const s = s_ ** 3;
    const lin = [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ];
    return lin.map((v) => {
      const c = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(Math.max(v, 0), 1 / 2.4) - 0.055;
      return Math.min(255, Math.max(0, c * 255));
    }) as [number, number, number];
  };
  const parse = (c: string): number[] => {
    const ok = c.match(/oklab\(([^)]+)\)/);
    if (ok) {
      const parts = ok[1].split('/').map((x) => x.trim());
      const [L, a, b] = parts[0].split(/\s+/).map(Number);
      const alpha = parts[1] ? Number(parts[1]) : 1;
      return [...oklabToRgb(L, a, b), alpha];
    }
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return [0, 0, 0, 0];
    const p = m[1].split(/[,\s/]+/).filter(Boolean).map((x) => parseFloat(x));
    return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
  };
  const over = (fg: number[], bg: number[]) => [
    fg[3] * fg[0] + (1 - fg[3]) * bg[0],
    fg[3] * fg[1] + (1 - fg[3]) * bg[1],
    fg[3] * fg[2] + (1 - fg[3]) * bg[2],
    1,
  ];
  const lum = (c: number[]) => {
    const f = (v: number) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };
  const ratio = (a: number[], b: number[]) => {
    const l1 = lum(a);
    const l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };
  const rgb = (c: number[]) => `rgb(${c.slice(0, 3).map((v) => Math.round(v)).join(',')})`;

  const el = document.querySelector(selector);
  if (!el) return null;
  const cs = getComputedStyle(el);
  if (cs.visibility === 'hidden' || cs.display === 'none') return null;
  const fg = parse(cs.color);
  const text = (el.textContent ?? '').trim();
  if (!text) return null;

  // fundo sólido mais próximo (empilhando backgroundColor dos ancestrais)
  let base = [255, 255, 255, 1];
  const stack: number[][] = [];
  let node: Element | null = el;
  while (node) {
    const c = parse(getComputedStyle(node).backgroundColor);
    if (c[3] > 0) stack.push(c);
    if (c[3] === 1) break;
    node = node.parentElement;
  }
  for (let i = stack.length - 1; i >= 0; i--) base = over(stack[i], base);

  // pior caso: cada combinação de stops de gradiente (elemento + ancestrais)
  let chains: number[][][] = [[]];
  node = el;
  while (node) {
    const bi = getComputedStyle(node).backgroundImage;
    if (bi && bi !== 'none') {
      const stops = [...bi.matchAll(/oklab\([^)]+\)|rgba?\([^)]+\)/g)].map((m) => parse(m[0]));
      if (stops.length) chains = chains.flatMap((chain) => stops.map((s) => [...chain, s]));
    }
    node = node.parentElement;
  }
  let worst = { r: ratio(fg, base), bg: rgb(base) };
  for (const chain of chains) {
    const bg = chain.reduce((acc, s) => over(s, acc), base);
    const r = ratio(fg, bg);
    if (r < worst.r) worst = { r, bg: rgb(bg) };
  }
  return { ratio: worst.r, fg: cs.color, bg: worst.bg, text: text.slice(0, 40) };
};

for (const theme of THEMES) {
  test(`contrato AA do hero (${theme}): CTA e TypeWriter`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.addInitScript((t) => {
      window.localStorage.setItem('mc-theme', t);
      window.localStorage.setItem('mc-analytics-consent', 'declined');
    }, theme);
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2500);
    // animações do hero (Framer Motion) terminam e o texto final fica medível
    await page.evaluate(async () => {
      for (let i = 0; i < 3; i++) {
        for (const a of document.getAnimations()) {
          try {
            a.finish();
          } catch {
            /* animação não finalizável */
          }
        }
        await new Promise((r) => setTimeout(r, 150));
      }
    });
    await page.addStyleTag({ content: INJECT_CSS });

    for (const alvo of ALVOS) {
      const m = await page.evaluate(measure, alvo.selector);
      expect(m, `${alvo.nome} não encontrado em #profile (selector mudou?)`).not.toBeNull();
      expect(m!.text.length, `${alvo.nome} sem texto medível`).toBeGreaterThan(0);
      expect(
        Number(m!.ratio.toFixed(2)),
        `${alvo.nome} (${theme}): ${m!.ratio.toFixed(2)}:1 — fg=${m!.fg} bg=${m!.bg} texto="${m!.text}"`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });
}