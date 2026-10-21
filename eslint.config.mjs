import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".next-root/**",
    "src/.next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "*.config.*",
    "*.cjs",
    "public/games/**",
  ]),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    // Testes de contrato/auditoria leem arquivos com `node:fs` e resolvem módulos
    // em tempo de execução; o tsconfig do app nao inclui `types: ["node"]`, entao o
    // typecheck estrito nao se aplica e eles usam `// @ts-nocheck` de proposito.
    // Aqui a excecao e declarada uma vez, em vez de 4 comentarios soltos.
    files: ["src/test/**/*.ts", "src/test/**/*.tsx"],
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
]);

export default eslintConfig;
