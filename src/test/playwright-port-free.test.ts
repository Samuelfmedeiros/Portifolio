import { describe, it, expect, vi } from 'vitest';

async function loadConfig(env: Record<string, string | undefined>) {
  const snap = { TEST_BASE_URL: process.env.TEST_BASE_URL };
  delete process.env.TEST_BASE_URL;
  if (env.TEST_BASE_URL !== undefined) process.env.TEST_BASE_URL = env.TEST_BASE_URL;
  vi.resetModules();
  const mod = await import('../../playwright.config');
  const cfg = mod.default;
  process.env.TEST_BASE_URL = snap.TEST_BASE_URL;
  return cfg;
}

describe('playwright webServer port cleanup', () => {
  it('command liberates port with fuser loop before starting next', async () => {
    const cfg = await loadConfig({ TEST_BASE_URL: 'http://localhost:3450' });
    const ws = cfg.webServer as any;
    expect(ws).toBeTruthy();
    expect(typeof ws.command).toBe('string');
    // The command must contain a loop that waits for port to be free
    expect(ws.command).toMatch(/while\s+fuser/);
    expect(ws.command).toContain('fuser -k');
    expect(ws.command).toContain('next start -p 3450');
    // reuse disabled to avoid identity error
    expect(ws.reuseExistingServer).toBe(false);
  });
});
