import { test } from '@playwright/test';

const PALETTES = ['cyan', 'emerald', 'violet', 'amber', 'rose', 'blue'];
const THEMES = ['dark', 'light'];

test('SOBRE: contraste do heading nas 12 combinacoes paleta x tema', async ({ page }) => {
  const out: any[] = [];
  for (const theme of THEMES) {
    for (const pal of PALETTES) {
      await page.addInitScript(([t, p]) => {
        localStorage.setItem('mc-theme', t as string);
        localStorage.setItem('mc-palette', p as string);
      }, [theme, pal] as const);
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1800);
      const r = await page.evaluate(() => {
        const h = Array.from(document.querySelectorAll('h2')).find((e) => /^(SOBRE|ABOUT)$/i.test((e.textContent || '').trim()));
        if (!h) return { erro: 'heading nao achado' };
        const cs = getComputedStyle(h);
        const col = cs.color;
        // background efetivo: sobe ancestrais compositando alpha
        const parse = (c: string) => {
          const m = c.match(/[\d.]+/g)!.map(Number);
          return { r: m[0], g: m[1], b: m[2], a: m.length > 3 ? m[3] : 1 };
        };
        const over = (fg: any, bg: any) => ({
          r: fg.r * fg.a + bg.r * (1 - fg.a),
          g: fg.g * fg.a + bg.g * (1 - fg.a),
          b: fg.b * fg.a + bg.b * (1 - fg.a),
          a: 1,
        });
        let bg = { r: 255, g: 255, b: 255, a: 1 };
        const chain: any[] = [];
        let el: Element | null = h;
        const layers: any[] = [];
        while (el) {
          const s = getComputedStyle(el);
          const bc = s.backgroundColor;
          const bci = s.backgroundImage;
          if (bc && bc !== 'rgba(0, 0, 0, 0)') layers.push(parse(bc));
          if (bci && bci !== 'none') layers.push({ grad: true, v: bci.slice(0, 30) });
          el = el.parentElement;
        }
        for (const l of layers.reverse()) {
          if (l.grad) continue;
          bg = over(l, bg);
        }
        const lum = (c: any) => {
          const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
          return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
        };
        const l1 = lum(parse(col));
        const l2 = lum(bg);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        return {
          color: col,
          bg: `rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)})`,
          grad: layers.filter((l) => l.grad).length,
          fontSize: cs.fontSize,
          ratio: Math.round(ratio * 100) / 100,
        };
      });
      out.push({ theme, pal, ...r });
    }
  }
  console.log(JSON.stringify(out, null, 1));
});