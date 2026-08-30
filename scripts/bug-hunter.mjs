#!/usr/bin/env node
/**
 * 🐛 Bug Hunter — Portifólio Samuel (06/08/2026)
 * Next.js 16 SPA single-page. Sem auth.
 * Verifica se as seções da home renderizam.
 */

import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const FINDINGS_DIR = resolve(ROOT, 'docs/agents/qualidade/bug-hunter/findings');
const REPORT_PATH = resolve(FINDINGS_DIR, `audit-${new Date().toISOString().split('T')[0]}.json`);
const PREVIEW = 'https://samuelmedeiros.vercel.app';

const ROUTES = ['/']; // SPA single-page

const ROUTE_RENDER_CHECKS = {
  '/': [
    { id: 'root-mounted', desc: 'Next.js renderizou', check: (page) => page.evaluate(() => {
        const root = document.querySelector('#__next') || document.querySelector('#root') || document.body;
        return { ok: root && root.innerHTML.length > 500, detail: `root len=${root?.innerHTML?.length || 0}` };
      }) },
    { id: 'content-presente', desc: 'Conteúdo principal carregou', check: (page) => page.evaluate(() => {
        const body = document.body?.innerText || '';
        return { ok: body.length > 2000, detail: `body ${body.length} chars` };
      }) },
    { id: 'secao-profile', desc: 'Seção Profile presente', check: (page) => page.evaluate(() => {
        const profile = document.querySelector('#profile') || document.querySelector('[class*="profile"]');
        return { ok: !!profile, detail: profile ? 'profile OK' : 'sem #profile' };
      }) },
    { id: 'secao-projects', desc: 'Seção Projects presente', check: (page) => page.evaluate(() => {
        const projects = document.querySelector('#projects') || document.querySelector('[class*="project"]');
        return { ok: !!projects, detail: projects ? 'projects OK' : 'sem #projects' };
      }) },
    { id: 'secao-contact', desc: 'Seção Contact presente', check: (page) => page.evaluate(() => {
        const contact = document.querySelector('#contact') || document.querySelector('[class*="contact"]');
        return { ok: !!contact, detail: contact ? 'contact OK' : 'sem #contact' };
      }) },
    { id: 'temas-presentes', desc: 'Temas/Paletas carregaram', check: (page) => page.evaluate(() => {
        const palettes = document.querySelectorAll('[class*="palette"], [class*="theme"]');
        return { ok: palettes.length > 0, detail: `${palettes.length} elementos de tema` };
      }) },
  ],
};

async function checkRouteServesHtml(page) {
  return page.evaluate(async () => {
    try {
      const res = await fetch(window.location.href, {
        method: 'GET', credentials: 'include',
        headers: { 'Accept': 'text/html' },
      });
      const ct = (res.headers.get('content-type') || '').toLowerCase();
      return { ok: ct.includes('text/html'), detail: `content-type=${ct || 'none'} status=${res.status}` };
    } catch (e) {
      return { ok: false, detail: `fetch falhou: ${e.message}` };
    }
  });
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = {
    timestamp: new Date().toISOString(), url: PREVIEW, duration: 0,
    routes: {}, consoleErrors: [], pageErrors: [], requestFailed: [],
    networkErrors: [], navigationFailures: [], brokenImages: [],
    passed: 0, failed: 0, loginOk: true,
  };
  page.on('console', msg => {
    if (msg.type() === 'error') results.consoleErrors.push({ text: msg.text().substring(0, 200) });
  });
  page.on('pageerror', err => results.pageErrors.push({ text: err.message?.substring(0, 200) }));
  page.on('response', res => {
    if (res.status() >= 400) results.networkErrors.push({ url: res.url().substring(0, 200), status: res.status() });
  });
  page.on('requestfailed', req => results.requestFailed.push({ url: req.url().substring(0, 200), error: (req.failure()?.errorText || '').substring(0, 100) }));
  const startTime = Date.now();

  try {
    console.log('[1/2] Carregando SPA...');
    for (const route of ROUTES) {
      await new Promise(r => setTimeout(r, 2000));
      const rr = { url: `${PREVIEW}${route}` };
      try {
        await page.goto(`${PREVIEW}${route}`, { waitUntil: 'networkidle', timeout: 20000 });
        await page.waitForTimeout(3000);
        rr.title = await page.title().catch(() => 'no-title');
        rr.contentSize = await page.evaluate(() => document.body?.innerHTML?.length || 0);
        rr.servesHtml = await checkRouteServesHtml(page);
        const checks = ROUTE_RENDER_CHECKS[route] || [];
        rr.renderChecks = [];
        for (const rc of checks) {
          try {
            const r = await rc.check(page);
            rr.renderChecks.push({ id: rc.id, desc: rc.desc, ok: r.ok, detail: r.detail });
            if (!r.ok) { results.failed++; results.navigationFailures.push({ route, error: `[render] ${rc.desc}: ${r.detail}` }); }
          } catch (err) {
            rr.renderChecks.push({ id: rc.id, desc: rc.desc, ok: false, detail: err.message?.substring(0, 100) });
            results.failed++;
          }
        }
        if (!rr.servesHtml.ok) { results.failed++; results.navigationFailures.push({ route, error: `[html] ${rr.servesHtml.detail}` }); }
        // Check de imagens quebradas (naturalWidth=0)
        const broken = await page.evaluate(() => {
          return [...document.querySelectorAll('img')]
            .filter(img => img.complete && img.naturalWidth === 0)
            .map(img => ({ src: (img.currentSrc || img.src || '').substring(0, 150), alt: (img.alt || '').substring(0, 60) }));
        });
        if (broken.length > 0) {
          results.brokenImages.push(...broken);
          results.failed++;
        }
        results.passed++;
        results.routes[route] = rr;
        console.log(`  ${route}: ✅ (${rr.contentSize}b)`);
      } catch (err) {
        rr.error = err.message?.substring(0, 200);
        results.failed++;
        results.navigationFailures.push({ route, error: err.message?.substring(0, 200) });
        console.log(`  ${route}: ❌`);
      }
    }

    results.duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n📊 RESUMO FINAL:\n    ⏱️  ${results.duration}s\n    ✅ ${results.passed} checks OK\n    ❌ ${results.failed} checks com erro`);
    mkdirSync(FINDINGS_DIR, { recursive: true });
    writeFileSync(REPORT_PATH, JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('❌ Bug Hunter FALHOU:', err.message);
  } finally {
    await browser.close();
  }
}
run();