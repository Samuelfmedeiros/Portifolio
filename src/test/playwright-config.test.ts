/**
 * Guarda da config do Playwright — 25/10: UM dono de preview.
 *
 * Histórico: com webServer plugin + reuseExistingServer:false, o health-check
 * (isURLAvailable) do Playwright 1.63 roda ANTES do command e ABORTA com
 * "is already used" quando um órfão segura a porta (r6-r8: "3450 is already
 * used"); o fuser que vivia DENTRO do command nunca executava, e o globalSetup
 * (que limpava a porta) rodava DEPOIS do plugin — nenhum hook cura isso.
 * Cura: webServer REMOVIDO; tests/global-setup.ts é o dono (freePort no
 * início, next start da branch, identidade HTTP real, teardown no fim).
 * Estes testes travam esse desenho — sem eles, uma edição futura pode
 * reintroduzir o plugin e reabrir o gap.
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
  env: Partial<Record<(typeof ENV_KEYS)[number], string | undefined>>
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

describe('playwright.config — globalSetup é o único dono do preview', () => {
  it('globalSetup plugado em qualquer modo (remoto vira noop lá dentro)', async () => {
    const cfg = await loadConfig({});
    expect(cfg.globalSetup).toBe('./tests/global-setup.ts');
  });

  it('sem TEST_BASE_URL usa :3000 como baseURL', async () => {
    const cfg = await loadConfig({});
    expect(cfg.use?.baseURL).toBe('http://localhost:3000');
  });

  it('TEST_BASE_URL local (o gap: :3450) vira o baseURL da suíte', async () => {
    const cfg = await loadConfig({ TEST_BASE_URL: 'http://localhost:3450' });
    expect(cfg.use?.baseURL).toBe('http://localhost:3450');
  });

  it('TEST_BASE_URL local em 127.0.0.1 também é tratado como local', async () => {
    const cfg = await loadConfig({ TEST_BASE_URL: 'http://127.0.0.1:3512' });
    expect(cfg.use?.baseURL).toBe('http://127.0.0.1:3512');
  });

  it('TEST_BASE_URL remoto (produção) mantém baseURL e SEM webServer', async () => {
    const cfg = await loadConfig({ TEST_BASE_URL: 'https://samuelmedeiros.vercel.app' });
    expect(cfg.use?.baseURL).toBe('https://samuelmedeiros.vercel.app');
    expect(cfg.webServer).toBeUndefined();
  });

  it('NUNCA tem webServer (health-check abortava antes do command)', async () => {
    for (const env of [{}, { TEST_BASE_URL: 'http://localhost:3450' }, { CI: '1' }]) {
      const cfg = await loadConfig(env as Record<string, string>);
      expect(cfg.webServer, `webServer presente com env=${JSON.stringify(env)}`).toBeUndefined();
    }
  });
});
