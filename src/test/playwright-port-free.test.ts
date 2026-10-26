import { describe, it, expect, vi } from 'vitest';
import { buildPreviewCommand, freePort, readIdentitySignals, isPortifolioResponse } from '../../tests/global-setup';

// 25/10 (r6-r8): guard do desenho NOVO — o tests/global-setup.ts e o unico
// dono do preview. O que impede o "3450 is already used": freePort (fuser -k)
// roda no INICIO do globalSetup, ANTES de subir o next start; o webServer
// plugin (que abortava no health-check antes de qualquer command) foi
// removido do playwright.config.ts.
describe('global-setup port cleanup', () => {
  it('buildPreviewCommand sobe next start NA porta pedida e falha claro sem build', () => {
    const cmd = buildPreviewCommand('http://127.0.0.1:3450');
    expect(cmd).toContain('next start -p 3450');
    expect(cmd).toContain('BUILD_ID');
  });

  it('buildPreviewCommand usa :3000 quando a URL nao tem porta', () => {
    const cmd = buildPreviewCommand('http://localhost');
    expect(cmd).toContain('next start -p 3000');
  });

  it('freePort retorna true quando o fuser mata listener', async () => {
    const ok = await freePort('3450', 1000, async () => ({ stdout: '3450/tcp:', stderr: '' }));
    expect(ok).toBe(true);
  });

  it('freePort trata rc=1 (porta livre / fuser ausente) como nao-falha', async () => {
    const ok = await freePort('3450', 1000, async () => { throw new Error('exit 1'); });
    expect(ok).toBe(false);
  });

  it('identidade: title com Samuel + main#main-content = portifolio', () => {
    const html = '<title>Samuel Medeiros — Portfólio</title><main id="main-content"></main>';
    const s = readIdentitySignals(html);
    expect(isPortifolioResponse(s)).toBe(true);
  });

  it('identidade: app alheio na porta NAO passa', () => {
    const html = '<title>Outro App</title><body></body>';
    const s = readIdentitySignals(html);
    expect(isPortifolioResponse(s)).toBe(false);
  });
});
