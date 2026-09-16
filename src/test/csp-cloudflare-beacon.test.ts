/**
 * Guarda da CSP: o beacon do Cloudflare Web Analytics.
 *
 * portifolio.seu.pet e proxied pela Cloudflare e a EDGE injeta
 * https://static.cloudflareinsights.com/beacon.min.js no HTML (nao existe no
 * origin). Sem o host no script-src, toda visita ao dominio custom gera console
 * error de CSP (achado 14/09/2026). O beacon posta em /cdn-cgi/rum same-origin,
 * entao connect-src 'self' ja cobre — nao precisa de cloudflareinsights.com la.
 *
 * A CSP vive em DUAS fontes (regra do projeto): next.config.js e vercel.json —
 * o Vercel prioriza vercel.json se houver conflito. As DUAS precisam autorizar.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '../..');
const BEACON_HOST = 'https://static.cloudflareinsights.com';

function scriptSrcOf(raw: string): string {
  const m = raw.match(/script-src[^"']*(?:https:[^;"']*)*/);
  const line = raw.split(/\r?\n/).find((l) => l.includes('script-src'));
  expect(line, 'script-src ausente').toBeTruthy();
  return line as string;
}

describe('CSP autoriza o beacon injetado pela Cloudflare (dominio custom)', () => {
  it('next.config.js — script-src inclui static.cloudflareinsights.com', () => {
    const src = readFileSync(path.join(ROOT, 'next.config.js'), 'utf8');
    expect(scriptSrcOf(src)).toContain(BEACON_HOST);
  });

  it('vercel.json — script-src inclui static.cloudflareinsights.com', () => {
    const raw = readFileSync(path.join(ROOT, 'vercel.json'), 'utf8');
    const cfg = JSON.parse(raw);
    const header = (cfg.headers || [])
      .flatMap((h: { headers: { key: string; value: string }[] }) => h.headers || [])
      .find((h: { key: string }) => h.key.toLowerCase() === 'content-security-policy');
    expect(header, 'CSP ausente no vercel.json').toBeTruthy();
    const scriptSrc = header.value.split(/;\s*/).find((d: string) => d.startsWith('script-src'));
    expect(scriptSrc, 'script-src ausente no vercel.json').toContain(BEACON_HOST);
  });
});
