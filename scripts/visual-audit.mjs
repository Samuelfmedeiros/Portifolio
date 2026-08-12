#!/usr/bin/env node
/**
 * 👁️ Visual Audit — Portifólio Samuel (12/08/2026)
 * Auditoria visual semântica com VLM NVIDIA NIM (nemotron-nano-12b-v2-vl).
 * Screenshots Playwright (mobile 390 + desktop 1280) → base64 → POST
 * /v1/chat/completions → findings JSON por categoria.
 *
 * Uso:
 *   node scripts/visual-audit.mjs                # produção (padrão)
 *   TEST_BASE_URL=http://localhost:3000 node scripts/visual-audit.mjs   # local
 *
 * Deps: playwright (já presente), NVIDIA_API_KEY em ~/.hermes/.env (Win)
 */

import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const FINDINGS_DIR = resolve(ROOT, 'docs/agents/qualidade/visual-audit');
const SHOTS_DIR = resolve(ROOT, '.audit-shots');
const BASE = process.env.TEST_BASE_URL || 'https://samuelmedeiros.vercel.app';

const AUDIT_PROMPT =
  'Você é um auditor de UI/UX. Analise este screenshot de página web. ' +
  'Liste em JSON: 1) quebras de layout, 2) sobreposição de elementos, ' +
  '3) texto cortado ou ilegível, 4) problemas de contraste, 5) alinhamento quebrado, ' +
  '6) problemas mobile. Se tudo ok, diga OK. Responda apenas o JSON.';

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true },
];

function loadNimKey() {
  const env = process.env.NVIDIA_API_KEY;
  if (env) return env;
  // tenta ~/.hermes/.env (Windows)
  try {
    const p = resolve(process.env.USERPROFILE || '~', 'AppData/Local/hermes/.env');
    const txt = readFileSync(p, 'utf8');
    const m = txt.match(/^NVIDIA_API_KEY=(.+)$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, '');
  } catch { /* ignore */ }
  throw new Error('NVIDIA_API_KEY não encontrada (env ou ~/AppData/Local/hermes/.env)');
}

async function auditShot(pngPath, key) {
  const b64 = readFileSync(pngPath).toString('base64');
  const payload = {
    model: 'nvidia/nemotron-nano-12b-v2-vl',
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: AUDIT_PROMPT },
        { type: 'image_url', image_url: { url: `data:image/png;base64,${b64}` } },
      ],
    }],
    max_tokens: 800,
  };
  const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(300000),
  });
  if (!res.ok) throw new Error(`NIM HTTP ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '(sem resposta)';
}

async function run() {
  const key = loadNimKey();
  mkdirSync(SHOTS_DIR, { recursive: true });
  mkdirSync(FINDINGS_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const results = {
    timestamp: new Date().toISOString(),
    url: BASE,
    model: 'nvidia/nemotron-nano-12b-v2-vl',
    shots: [],
  };

  try {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
        isMobile: vp.isMobile,
        hasTouch: vp.hasTouch,
      });
      const consoleErrors = [];
      const pageErrors = [];
      page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)); });
      page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 300)));

      console.log(`[audit] ${vp.name} ${BASE} ...`);
      await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(1200); // deixa animações/estado estabilizar

      const shot = resolve(SHOTS_DIR, `shot-${vp.name}.png`);
      await page.screenshot({ path: shot, fullPage: true });

      console.log(`[audit] ${vp.name} → NIM ...`);
      const raw = await auditShot(shot, key);
      let parsed;
      try {
        const cleaned = raw.replace(/```json\n?/g, '').replace(/```/g, '').trim();
        parsed = JSON.parse(cleaned);
      } catch {
        parsed = { raw };
      }

      results.shots.push({ viewport: vp.name, consoleErrors, pageErrors, findings: parsed });
      await page.close();
    }
  } finally {
    await browser.close();
  }

  const reportPath = resolve(FINDINGS_DIR, `visual-audit-${new Date().toISOString().split('T')[0]}.json`);
  writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n[audit] relatório: ${reportPath}`);

  // Resumo compacto
  for (const s of results.shots) {
    const f = s.findings;
    const txt = typeof f === 'string' ? f : JSON.stringify(f);
    const ok = /^OK$/i.test(txt.trim()) || (f && f.status === 'OK');
    console.log(`[${s.viewport}] ${ok ? '✅ OK' : '⚠️ findings'}${s.consoleErrors.length ? ` · consoleErrors ${s.consoleErrors.length}` : ''}${s.pageErrors.length ? ` · pageErrors ${s.pageErrors.length}` : ''}`);
    if (!ok) console.log(txt.slice(0, 1200));
  }
}

run().catch((e) => { console.error('[audit] ERRO:', e.message); process.exit(1); });
