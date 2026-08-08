// Grava vídeo da região projetos: filtros + modal
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    locale: 'pt-BR',
    recordVideo: { dir: '/tmp/portfolio-video', size: { width: 1280, height: 900 } },
  });
  const page = await context.newPage();

  await page.goto('http://localhost:3100', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  // Rola até a região projetos
  await page.evaluate(() => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  await page.waitForTimeout(1500);

  // Screenshot inicial da região
  await page.screenshot({ path: '/tmp/portfolio-video/01-projetos-inicial.png' });

  // Mostra os filtros — clica em "IA"
  const iaBtn = page.getByRole('button', { name: 'IA' });
  if (await iaBtn.count()) {
    await iaBtn.click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: '/tmp/portfolio-video/02-filtro-ia.png' });
  }

  // Clica em "Todos"
  const todosBtn = page.getByRole('button', { name: 'Todos' });
  if (await todosBtn.count()) {
    await todosBtn.click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: '/tmp/portfolio-video/03-filtro-todos.png' });
  }

  // Abre o modal do Arachne (não tem link → abre modal)
  const arachneCard = page.getByText('Arachne', { exact: false }).first();
  if (await arachneCard.count()) {
    await arachneCard.click();
    await page.waitForTimeout(1400);
    await page.screenshot({ path: '/tmp/portfolio-video/04-modal-arachne.png' });
    // Fecha
    const closeBtn = page.getByRole('button', { name: 'Fechar' });
    if (await closeBtn.count()) await closeBtn.click();
    await page.waitForTimeout(800);
  }

  await page.waitForTimeout(600);
  await browser.close();
  console.log('DONE');
})();
