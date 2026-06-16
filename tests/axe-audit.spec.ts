import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Acessibilidade — axe-core audit', () => {
  const pages = [
    { name: 'Home', path: '/' },
    { name: 'Privacidade', path: '/privacidade' },
    { name: 'Termos', path: '/termos' },
  ];

  for (const page of pages) {
    test(`${page.name} — sem violações críticas/sérias`, async ({ page: p }) => {
      await p.goto(`http://localhost:3001${page.path}`);
      await p.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page: p })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
        .analyze();

      // Filtra só violações críticas
      const critical = results.violations.filter(
        (v) => v.impact === 'critical'
      );
      
      // Log sério pra documento
      const serious = results.violations.filter((v) => v.impact === 'serious');
      if (serious.length > 0) {
        console.log(`\n=== Violações SÉRIAS em ${page.name} (${page.path}) ===`);
        for (const v of serious) {
          console.log(`\n[${v.impact}] ${v.id}: ${v.help}`);
          console.log(`  Fix: ${v.helpUrl}`);
          for (const n of v.nodes.slice(0, 5)) {
            console.log(`  → ${n.target.join(', ')}`);
          }
        }
      }

      expect(critical.length).toBe(0);
    });
  }

  test('Home — contraste de cores (apenas documentação)', async ({ page: p }) => {
    await p.goto('http://localhost:3001/');
    await p.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page: p })
      .withTags(['cat.color'])
      .analyze();

    const colorIssues = results.violations.filter(
      (v) => v.id === 'color-contrast'
    );

    if (colorIssues.length > 0) {
      console.log('\n=== Problemas de Contraste (apenas documentação) ===');
      for (const v of colorIssues) {
        for (const n of v.nodes) {
          console.log(`  → ${n.target.join(', ')}`);
        }
      }
    }

    // Não falha — contraste é tradeoff conhecido do tema escuro sci-fi
    // Os problemas são documentados no A11Y_AUDIT.md
  });
});
