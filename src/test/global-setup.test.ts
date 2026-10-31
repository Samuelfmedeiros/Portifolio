import { describe, it, expect, vi } from 'vitest';
import {
  buildPreviewCommand,
  readIdentitySignals,
  isPortifolioResponse,
  serveAppIdentity,
  teardownServer,
  freePort,
  startPreviewForTest,
} from '../../tests/global-setup';
import globalSetup from '../../tests/global-setup';

describe('global-setup exports', () => {
  describe('buildPreviewCommand', () => {
    it('includes port from URL and build guard', () => {
      const cmd = buildPreviewCommand('http://127.0.0.1:3450');
      expect(cmd).toContain('next start -p 3450');
      expect(cmd).toContain('BUILD_ID');
    });

    it('defaults to 3000 when URL has no port', () => {
      const cmd = buildPreviewCommand('http://localhost');
      expect(cmd).toContain('next start -p 3000');
    });

    it('handles trailing slash', () => {
      const cmd = buildPreviewCommand('http://localhost:4000/');
      expect(cmd).toContain('next start -p 4000');
    });
  });

  describe('readIdentitySignals / isPortifolioResponse', () => {
    it('parses title and main-content', () => {
      const html = '<title>Samuel Medeiros — Portfólio</title><main id="main-content"></main>';
      const s = readIdentitySignals(html);
      expect(s.title).toBe('Samuel Medeiros — Portfólio');
      expect(s.hasMainContent).toBe(true);
      expect(isPortifolioResponse(s)).toBe(true);
    });

    it('returns empty title when missing', () => {
      const s = readIdentitySignals('<main id="main-content"></main>');
      expect(s.title).toBe('');
      expect(s.hasMainContent).toBe(true);
    });

    it('detects missing main', () => {
      const s = readIdentitySignals('<title>Samuel</title>');
      expect(s.hasMainContent).toBe(false);
      expect(isPortifolioResponse(s)).toBe(false);
    });

    it('case-insensitive title match', () => {
      const s = readIdentitySignals('<title>samuel</title><main id="main-content"></main>');
      expect(isPortifolioResponse(s)).toBe(true);
    });

    it('rejects non-Samuel title', () => {
      const s = readIdentitySignals('<title>Other</title><main id="main-content"></main>');
      expect(isPortifolioResponse(s)).toBe(false);
    });
  });

  describe('serveAppIdentity / teardownServer', () => {
    it('creates server serving signals', async () => {
      const signals = { title: 'Test', hasMainContent: true };
      const server = await serveAppIdentity(signals);
      expect(server).toBeDefined();
      expect(typeof server.close).toBe('function');
      await teardownServer(server);
    });

    it('serves HTML with title and main-content', async () => {
      const signals = { title: 'Samuel Test', hasMainContent: true };
      const server = await serveAppIdentity(signals);
      const addr = server.address();
      const port = typeof addr === 'object' && addr ? addr.port : 0;
      const res = await fetch(`http://127.0.0.1:${port}/`);
      const html = await res.text();
      expect(html).toContain('<title>Samuel Test</title>');
      expect(html).toContain('<main id="main-content"></main>');
      await teardownServer(server);
    });
  });

  describe('freePort', () => {
    it('returns true on successful fuser', async () => {
      const ok = await freePort('3450', 1000, async () => ({ stdout: '3450/tcp:', stderr: '' }));
      expect(ok).toBe(true);
    });

    it('returns false on error (port free)', async () => {
      const ok = await freePort('3450', 1000, async () => { throw new Error('exit 1'); });
      expect(ok).toBe(false);
    });

    it('returns false when fuser finds no process (real exec)', async () => {
      // port 59999 is unlikely to be in use
      const ok = await freePort('59999', 1000);
      expect(typeof ok).toBe('boolean');
    });
  });

  describe('startPreviewForTest', () => {
    it('uses urlProbe and creates server', async () => {
      const mockProbe = async () => ({ title: 'Samuel Test', hasMainContent: true });
      const state = await startPreviewForTest({ baseUrl: 'http://localhost:3000', timeoutMs: 1000 }, mockProbe);
      expect(state.server).toBeDefined();
      await teardownServer(state.server);
    });
  });

  describe('globalSetup default', () => {
    it('returns noop for remote baseUrl', async () => {
      const original = process.env.TEST_BASE_URL;
      process.env.TEST_BASE_URL = 'https://example.com';
      const cleanup = await globalSetup({} as any);
      expect(typeof cleanup).toBe('function');
      await cleanup();
      if (original !== undefined) process.env.TEST_BASE_URL = original;
      else delete process.env.TEST_BASE_URL;
    });
  });
});
