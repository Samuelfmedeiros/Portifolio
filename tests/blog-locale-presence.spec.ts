import { test, expect } from '@playwright/test';

/**
 * tests/blog-locale-presence.spec.ts
 *
 * 🔴 Guard de regressao criado em 14/09/2026.
 *
 * O que protege: a secao DO BLOG (RSS do LifeLog) PRECISA existir nos DOIS
 * idiomas. Ela sumiu silenciosamente em modo EN quando o LifeLog separou os
 * feeds (/rss.xml virou PT-only e o EN migrou para /en/rss.xml): o BlogSection
 * filtrava por "/en/" num array so com posts PT -> 0 cards -> `return null`
 * -> -476px de layout. NENHUM teste pegou: os specs existentes mediam a home
 * so no locale default e o watchdog compara conteudo PT.
 *
 * Regras duras (pitfalls de 12-13/09 deste repo):
 *  - default de BASE = localhost:3000 (o webServer que o Playwright levanta).
 *    Producao SÓ via TEST_BASE_URL explicito — scripts/check-spec-base-url.mjs
 *    trava o CI se isso regredir.
 *  - liveness-first: servidor morto daria "pass" vazio.
 *  - nunca `networkidle` em producao (beacons seguram a rede).
 *  - o wrapper #blog existe mesmo com a secao vazia, entao a assercao e por
 *    CONTEUDO (cards + altura), nao pela presenca do id.
 */
const LOCALES: Array<{ locale: string; expectEn: boolean }> = [
  { locale: 'pt-BR', expectEn: false },
  { locale: 'en-US', expectEn: true },
];

for (const { locale, expectEn } of LOCALES) {
  test.describe(`blog presente — locale ${locale}`, () => {
    test.use({ locale, viewport: { width: 1280, height: 900 } });

    test(`secao DO BLOG renderiza cards em ${locale}`, async ({ page }) => {
      const res = await page.goto('/', { waitUntil: 'domcontentloaded' });
      expect(res, 'liveness: servidor nao respondeu').toBeTruthy();
      expect(res!.status(), 'liveness: GET / nao devolveu 200').toBe(200);
      await page.waitForLoadState('load', { timeout: 15000 }).catch(() => {});

      // idioma realmente aplicado (LanguageProvider detecta navigator no mount)
      await expect
        .poll(() => page.evaluate(() => document.documentElement.lang), { timeout: 15000 })
        .toBe(expectEn ? 'en' : 'pt-BR');

      // whileInView: as secoes so animam/hidratam com scroll progressivo
      await page.evaluate(async () => {
        const total = document.body.scrollHeight;
        for (let y = 0; y <= total; y += 400) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 120));
        }
      });

      const blog = page.locator('[id="blog"]');
      await expect(blog, 'section blog nao existe na pagina').toHaveCount(1);

      const cards = blog.locator('a[href*="/post/"]');
      await expect(
        cards,
        `secao DO BLOG sem cards em ${locale} (regressao do feed por idioma)`,
      ).toHaveCount(3, { timeout: 15000 });

      // o idioma dos cards tem que bater (nao basta "ter qualquer card")
      const hrefs = await cards.evaluateAll((els) =>
        els.map((e) => (e as HTMLAnchorElement).getAttribute('href') || ''),
      );
      const enHrefs = hrefs.filter((h) => h.includes('/en/'));
      if (expectEn) {
        expect(enHrefs.length, `locale EN exibindo cards PT: ${JSON.stringify(hrefs)}`)
          .toBeGreaterThanOrEqual(3);
      } else {
        expect(enHrefs.length, `locale PT exibindo cards EN: ${JSON.stringify(hrefs)}`)
          .toBe(0);
      }

      // prova de altura real (a secao nao pode ter colapsado)
      const box = await blog.boundingBox();
      expect(box, 'blog sem box (escondido/vazio)').toBeTruthy();
      expect(box!.height, 'secao DO BLOG colapsada').toBeGreaterThan(200);
    });
  });
}
