import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Regressão das violações axe encontradas na home em produção (12/09/2026):
 *  - serious color-contrast: texto branco no botão WhatsApp (1.98:1, todos os temas)
 *    e link `repo` dos mini-games com --accent-alt cru (4.41:1 no dark).
 *  - moderate region: linha de Apoio/Consultoria do layout ficava fora de landmark.
 *
 * Prevenção: falha o CI se qualquer uma dessas classes voltar.
 */
test.describe('a11y — contraste e landmarks (regressão)', () => {
  const themes = [
    { name: 'dark', value: 'dark' },
    { name: 'light', value: 'light' },
  ];

  for (const theme of themes) {
    test(`home ${theme.name} — sem color-contrast nem region fora de landmark`, async ({ page }) => {
      // Home cresceu (4 posts do RSS, 10 cards) e o scroll real pela página inteira
      // em 20 round-trips page.evaluate estourava o timeout default de 60s sob
      // workers paralelos (medido 06/11/2026: 8/8 falhas por TIMEOUT, zero
      // violação de contraste). Teto explícito + loop dentro de um evaluate só.
      test.setTimeout(120_000);

      await page.addInitScript((t) => {
        localStorage.setItem('mc-theme', t);
        localStorage.setItem('mc-analytics-consent', 'accepted');
      }, theme.value);

      // Sem rede externa: capas do RSS/AdSense só adicionam latência e flake.
      // Mas a própria origem sob teste (baseURL) sempre passa — inclusive em produção.
      const baseHost = new URL(process.env.TEST_BASE_URL || 'http://localhost:3000').host;
      await page.route('**/*', (route) => {
        const url = route.request().url();
        if (url.startsWith('data:') || url.includes('localhost') || url.includes('127.0.0.1') || url.includes(baseHost)) {
          return route.continue();
        }
        return route.abort();
      });

      await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(3000);

      // Guard de identidade: a porta baseURL pode ser reaproveitada por outro app
      // (reuseExistingServer fora do CI) — nesse caso o axe mediria contraste de um
      // site ESTRANGEIRO e reportaria violações falsas. Falha cedo, com causa clara.
      const isPortifolio =
        (await page.locator('main#main-content').count()) > 0 &&
        (await page.getByRole('link', { name: /^pular para/i }).first().count()) > 0;
      if (!isPortifolio) {
        throw new Error(
          `[a11y ${theme.name}] baseURL não serve o Portifolio — abortando para não auditar app estrangeiro. ` +
            `Espera <main id="main-content"> + skip-link "Pular para…". Título: "${await page.title()}". ` +
            `Suba o app correto em ${baseHost} ou exporte TEST_BASE_URL.`,
        );
      }

      // Seções lazy (contato/games) só montam perto da viewport — scroll progressivo.
      // Loop DENTRO de um único evaluate: cada page.evaluate é uma ida e volta ao
      // browser e, com N workers disputando CPU, 20 delas custavam mais que o teste
      // inteiro. Um evaluate só percorre a página sem round-trip (mesmo efeito de
      // montagem das seções lazy, 1/20 do custo).
      await page.evaluate(async () => {
        const height = document.body.scrollHeight;
        for (let y = 0; y < height; y += 400) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 100));
        }
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 600));
      });

      // O item ativo da navbar usa `transition-all`: ao voltar ao topo, fundo
      // (ciano -> glass) e texto (bg-primary -> text-secondary) transicionam em
      // velocidades diferentes. Medido 06/11/2026: nessa janela o axe pegava o
      // frame intermediário (#94a3b8 sobre #22d3ee = 1.41:1 no dark, #526079
      // sobre #0369a1 = 1.06:1 no light) e reprovava cerca de 1 em cada 12
      // rodadas, em tema aleatório. O estado FINAL do elemento está correto.
      // Esperar as animações não resolve (o React participa depois do scroll e o
      // `finished` de animação idle do framer-motion nunca resolve). Desligar as
      // transições CSS antes de medir é determinístico e NÃO afrouxa a regra:
      // as cores finais são as mesmas e o framer-motion usa WAAPI, imune a
      // `transition: none`.
      await page.addStyleTag({
        content: '*, *::before, *::after { transition: none !important; }',
      });

      const results = await new AxeBuilder({ page })
        .withRules(['color-contrast', 'region'])
        .analyze();

      const failing = results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => n.target.join(' ')).slice(0, 6),
        why: v.nodes[0]?.failureSummary?.replace(/\n/g, ' | ').slice(0, 200),
      }));

      console.log(`[a11y ${theme.name}] ${new Date().toISOString()} violacoes=${failing.length}`);
      expect(failing, JSON.stringify(failing, null, 2)).toEqual([]);
    });
  }
});
