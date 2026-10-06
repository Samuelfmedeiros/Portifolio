import { test, expect } from '@playwright/test';

// 06/10/2026 — o commit 9a34b69 (16/09) gravou os 5 public/games/*/index.html em
// base64. O endpoint /api/game/[slug] lia o arquivo e devolvia verbatim com
// Content-Type: text/html, entao o player (iframe) exibia a string codificada:
// HTTP 200, nenhum erro no log, 3 semanas no ar. Nenhum teste abria um jogo.
// Este spec abre os 5 jogos nos DOIS caminhos e falha se o conteudo nao for HTML.

const GAMES = ['asteroid-dodge', 'code-typing', 'memory-matrix', 'simon-game', 'terminal'];
const CANONICAL_HOST = 'https://portifolio.seu.pet';

/** Uma string longa so de [A-Za-z0-9+/=] e base64, nao HTML. */
function isBase64Blob(body: string): boolean {
  const compact = body.trim();
  if (compact.length < 200) return false;
  return /^[A-Za-z0-9+/=\r\n]+$/.test(compact.slice(0, 400));
}

test.describe('Jogos — integridade do HTML (anti-base64)', () => {
  for (const slug of GAMES) {
    test(`/games/${slug}/index.html serve HTML com canonical`, async ({ request }) => {
      const resp = await request.get(`/games/${slug}/index.html`);
      expect(resp.status(), `status de /games/${slug}/index.html`).toBe(200);

      const body = await resp.text();
      expect(isBase64Blob(body), `conteudo de ${slug} parece base64`).toBe(false);
      expect(body.trimStart().startsWith('<'), `conteudo de ${slug} nao comeca com "<"`).toBe(true);
      expect(body).toMatch(/<script/i);
      expect(body).toContain(`rel="canonical" href="${CANONICAL_HOST}/games/${slug}/index.html"`);
    });

    test(`/api/game/${slug} serve HTML e marca noindex`, async ({ request }) => {
      const resp = await request.get(`/api/game/${slug}`);
      expect(resp.status(), `status de /api/game/${slug}`).toBe(200);
      expect(resp.headers()['content-type'] ?? '').toContain('text/html');
      expect(resp.headers()['x-robots-tag'] ?? '').toContain('noindex');

      const body = await resp.text();
      expect(isBase64Blob(body), `conteudo de /api/game/${slug} parece base64`).toBe(false);
      expect(body.trimStart().startsWith('<')).toBe(true);
    });
  }
});
