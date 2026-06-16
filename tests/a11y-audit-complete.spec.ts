
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const BASE_URL = 'http://localhost:3000';

test.describe('Acessibilidade - Auditoria Completa', () => {
  const pages = [
    { name: 'Home', path: '/' },
    { name: 'Privacidade', path: '/privacidade' },
    { name: 'Termos', path: '/termos' },
  ];

  for (const page of pages) {
    test(`${page.name} — auditoria axe completa`, async ({ page: p }) => {
      await p.goto(`${BASE_URL}${page.path}`);
      await p.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page: p })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
        .analyze();

      console.log(`\n=== ${page.name} (${page.path}) ===`);
      console.log(`Total de violações: ${results.violations.length}`);

      for (const v of results.violations) {
        console.log(`\n[IMPACT:${v.impact}] ${v.id}: ${v.help}`);
        console.log(`  WCAG: ${v.tags.filter(t => t.startsWith('wcag')).join(', ')}`);
        console.log(`  Help: ${v.helpUrl}`);
        for (const n of v.nodes.slice(0, 3)) {
          console.log(`  → ${n.target.join(', ')}`);
          console.log(`    ${n.failureSummary?.split('\\n')[0]}`);
        }
      }

      console.log(`\n--- Passes (${results.passes.length}) ---`);
      console.log(`--- Incomplete (${results.incomplete.length}) ---`);
      console.log(`--- Inapplicable (${results.inapplicable.length}) ---`);
    });

    test(`${page.name} — heading hierarchy`, async ({ page: p }) => {
      await p.goto(`${BASE_URL}${page.path}`);
      await p.waitForLoadState('networkidle');

      const headings = await p.evaluate(() => {
        const hs = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        return Array.from(hs).map(h => ({
          level: parseInt(h.tagName[1]),
          text: h.textContent?.trim().slice(0, 80) || '(empty)',
        }));
      });

      console.log(`\n=== Headings: ${page.name} ===`);
      for (const h of headings) {
        console.log(`  h${h.level}: ${h.text}`);
      }

      // Check for h1 presence
      const h1s = headings.filter(h => h.level === 1);
      expect(h1s.length).toBeGreaterThanOrEqual(1);
      expect(h1s.length).toBeLessThanOrEqual(1); // one h1 per page

      // Check no skipping
      let maxLevel = 0;
      for (const h of headings) {
        if (h.level > maxLevel + 1 && maxLevel > 0) {
          console.log(`  ⚠ Heading skip: h${maxLevel} -> h${h.level}`);
        }
        maxLevel = Math.max(maxLevel, h.level);
      }
    });

    test(`${page.name} — aria labels e landmarks`, async ({ page: p }) => {
      await p.goto(`${BASE_URL}${page.path}`);
      await p.waitForLoadState('networkidle');

      const info = await p.evaluate(() => {
        // Check landmark roles
        const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="region"], [role="form"], nav, main, footer, header');
        
        // Check elements with aria-label
        const ariaLabels = document.querySelectorAll('[aria-label], [aria-labelledby]');
        
        // Check images with alt
        const images = document.querySelectorAll('img');
        const imagesWithoutAlt = Array.from(images).filter(img => !img.hasAttribute('alt'));
        
        // Check buttons
        const buttons = document.querySelectorAll('button');
        const buttonsWithoutAria = Array.from(buttons).filter(btn => !btn.getAttribute('aria-label') && !btn.textContent?.trim());
        
        // Check for aria-hidden misuse
        const ariaHidden = document.querySelectorAll('[aria-hidden="true"]');

        return {
          landmarks: Array.from(landmarks).map(el => ({
            tag: el.tagName,
            role: el.getAttribute('role') || '(infered)',
            label: el.getAttribute('aria-label') || '',
          })),
          ariaLabels: Array.from(ariaLabels).map(el => ({
            tag: el.tagName,
            label: el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || '',
          })),
          imagesWithoutAlt: imagesWithoutAlt.length,
          buttonsWithoutText: buttonsWithoutAria.length,
          ariaHiddenCount: ariaHidden.length,
        };
      });

      console.log(`\n=== Aria & Landmarks: ${page.name} ===`);
      console.log(`Landmarks encontrados: ${info.landmarks.length}`);
      for (const l of info.landmarks) {
        console.log(`  <${l.tag}> role=${l.role} label="${l.label}"`);
      }
      console.log(`Elementos com aria-label: ${info.ariaLabels.length}`);
      for (const a of info.ariaLabels.slice(0, 5)) {
        console.log(`  <${a.tag}> aria-label="${a.label}"`);
      }
      if (info.ariaLabels.length > 5) {
        console.log(`  ... e mais ${info.ariaLabels.length - 5}`);
      }
      console.log(`Imagens sem alt: ${info.imagesWithoutAlt}`);
      console.log(`Botões sem texto/aria-label: ${info.buttonsWithoutText}`);
      console.log(`Elementos aria-hidden: ${info.ariaHiddenCount}`);

      expect(info.imagesWithoutAlt).toBe(0);
      expect(info.buttonsWithoutText).toBe(0);
    });
  }
});
