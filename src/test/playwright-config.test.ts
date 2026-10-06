/**
 * Guarda da config do Playwright — regressão do gap de rodada 3:
 * "ERRO_IDENTIDADE_PREVIEW: 3450 nao serve o portifolio".
 *
 * Causa raiz: quando `TEST_BASE_URL` era local, a config ANTIGA desligava o
 * webServer inteiro (`process.env.TEST_BASE_URL ? undefined : {...}`) e a porta
 * pedida (ex: :3450) ficava sem NINGUÉM servindo a branch — o preview não
 * subia e a checagem de identidade batia em servidor alheio (a máquina tem
 * systemd/staging no :3000 e outro app pode ocupar a porta do harness).
 *
 * A config viva agora deriva a porta do `TEST_BASE_URL` e sobe o `next start`
 * da branch NESSA porta (local); URL remota (produção) continua sem webServer.
 * Estes testes travam essa derivação — sem eles, uma edição futura pode
 * reintroduzir o "webServer desligado" sem ninguém notar.
 */
import { describe, it, expect, vi } from 'vitest';

const ENV_KEYS = ['TEST_BASE_URL', 'CI'] as const;

function snapshotEnv(): Record<string, string | undefined> {
  return Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]));
}

function restoreEnv(snap: Record<string, string | undefined>): void {
  for (const k of ENV_KEYS) {
    if (snap[k] === undefined) delete process.env[k];
    else process.env[k] = snap[k];
  }
}

async function loadConfig(
  env: Partial<Record<(typeof ENV_KEYS)[number], string | undefined>>,
) {
  const snap = snapshotEnv();
  for (const k of ENV_KEYS) delete process.env[k];
  for (const [k, v] of Object.entries(env)) {
    if (v !== undefined) process.env[k] = v;
  }
  vi.resetModules();
  try {
    const mod = await import('../../playwright.config');
    return mod.default;
  } finally {
    restoreEnv(snap);
  }
}

type ServerConfig = { command: string; url: string; reuseExistingServer: boolean };

function webServerOf(cfg: { webServer?: ServerConfig | ServerConfig[] }): ServerConfig {
  expect(Array.isArray(cfg.webServer), 'webServer não deve ser lista').toBe(false);
  expect(cfg.webServer, 'webServer ausente — preview da branch não sobe').toBeTruthy();
  return cfg.webServer as ServerConfig;
}

describe('playwright.config — preview da branch na porta sob teste', () => {
  it('sem TEST_BASE_URL usa :3000 e sobe o next da branch (reuse em dev)', async () => {
    const cfg = await loadConfig({});
    expect(cfg.use?.baseURL).toBe('http://localhost:3000');
    const ws = webServerOf(cfg);
    expect(ws.url).toBe('http://localhost:3000');
    expect(ws.command).toContain('next start');
    expect(ws.command).toContain('-p 3000');
    expect(ws.reuseExistingServer).toBe(true);
  });

  it('TEST_BASE_URL local (o gap: :3450) sobe o next NA PORTA pedida', async () => {
    const cfg = await loadConfig({ TEST_BASE_URL: 'http://localhost:3450' });
    expect(cfg.use?.baseURL).toBe('http://localhost:3450');
    const ws = webServerOf(cfg);
    expect(ws.url).toBe('http://localhost:3450');
    expect(ws.command).toContain('-p 3450');
    // explicit local = operador já escolheu a porta; reusa se algo saudável responde
    expect(ws.reuseExistingServer).toBe(true);
  });

  it('TEST_BASE_URL local em 127.0.0.1 também é tratado como local', async () => {
    const cfg = await loadConfig({ TEST_BASE_URL: 'http://127.0.0.1:3512' });
    const ws = webServerOf(cfg);
    expect(ws.command).toContain('-p 3512');
    expect(ws.url).toBe('http://127.0.0.1:3512');
  });

  it('TEST_BASE_URL remoto (produção) roda SEM webServer', async () => {
    const cfg = await loadConfig({ TEST_BASE_URL: 'https://samuelmedeiros.vercel.app' });
    expect(cfg.use?.baseURL).toBe('https://samuelmedeiros.vercel.app');
    expect(cfg.webServer).toBeUndefined();
  });

  it('no CI (sem TEST_BASE_URL) o webServer não reusa servidor existente', async () => {
    const cfg = await loadConfig({ CI: '1' });
    const ws = webServerOf(cfg);
    expect(ws.reuseExistingServer).toBe(false);
    expect(ws.command).toContain('-p 3000');
  });
});