import { test, expect } from '@playwright/test';

/**
 * Visual Regression Testing — Portifolio Samuel
 * Foco nas seções principais. Portifolio usa Framer Motion + GitHub API —
 * por isso: reducedMotion no navegador + espera de rede + scroll determinístico.
 * Baseline: TEST_BASE_URL=https://samuelmedeiros.vercel.app pnpm exec playwright test --update-snapshots
 */
const ROTAS = [
  { rota: '/', nome: 'home' },
  { rota: '/#projects', nome: 'projetos' },
  { rota: '/#games', nome: 'games' },
  { rota: '/#contact', nome: 'contato' },
];

test.beforeEach(async ({ page }) => {
  // desliga animações de verdade (Framer Motion respeita prefers-reduced-motion)
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

for (const r of ROTAS) {
  test(`visual: ${r.nome}`, async ({ page }) => {
    await page.addStyleTag({
      content: '* { transition: none !important; caret-color: transparent !important; }',
    });
    await page.goto(r.rota, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    if (r.rota.includes('#')) {
      const id = r.rota.split('#')[1];
      await page.evaluate((secId) => {
        const el = document.getElementById(secId);
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, id);
    } else {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    }
    // espera animações/API terminarem
    await page.waitForTimeout(1500);
    // 🔴 12/08/2026 lazy-hydration: GameShowcase/ContactForm hidratam via
    // next/dynamic quando o scroll chega. Scroll PROGRESSIVO (400px/passo) até
    // o fim para disparar a hidratação de TODAS as seções lazy (scrollTo direto
    // ao bottom pularia o games e deixaria o fallback pra sempre), espera o
    // fallback sumir, e volta ao topo para o fullPage capturar o conteúdo REAL.
    await page.evaluate(async () => {
      const total = document.body.scrollHeight;
      for (let y = 0; y <= total; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 150));
      }
    });
    await page.waitForFunction(
      () => !document.body.innerText.toLowerCase().includes("carregando"),
      null,
      { timeout: 20000 }
    );
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(300);
    // 🎬 30/08: vídeo seu-pet-scroll.mp4 (card DogWalk) em autoplay+loop
    // NUNCA estabiliza o fullPage — animations:'disabled' congela CSS
    // animations mas NÃO pausa <video>. Pausa explícita antes do screenshot.
    await page.evaluate(() => {
      document.querySelectorAll('video').forEach((v) => v.pause());
    });
    // 🔴 20/10/2026: `mask` do #150 NÃO resolvia a seção do blog. Mascarar só pinta um
    // retângulo por cima do pixel — não devolve a ALTURA que o bloco ocupa. O pipeline do
    // LifeLog publica 2 posts/dia e a home mostra os últimos 3 via RSS ao vivo; cada
    // publicação muda a altura da #blog e, como a spec fotografa a PÁGINA INTEIRA, o
    // fullPage sai com altura diferente da baseline: `Expected 1280x7394, received
    // 1280x8367` (988px = exatamente a #blog). Medido também no master: as 4 specs falham
    // igual com o mask aplicado e o código do master — logo a baseline estava stale, não
    // havia regressão de UI. Curar a altura: ocultar a seção ANTES do screenshot, para o
    // que sobra ser só a UI do Portifólio (determinística). A cobertura do bloco continua
    // inteira em tests/blog-locale-presence.spec.ts (por CONTEÚDO, nos dois idiomas).
    await page.evaluate(() => {
      const blog = document.querySelector('#blog');
      if (blog instanceof HTMLElement) blog.style.display = 'none';
    });
    await page.waitForTimeout(200);
    await expect(page).toHaveScreenshot(`${r.nome}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    });
  });
}
