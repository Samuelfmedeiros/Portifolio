/**
 * Contrato do next.config.js — BASE_PATH e opções estáticas.
 *
 * O bloco de BASE_PATH (linhas finais do config) nunca era exercitado: os
 * testes existentes só chamavam headers()/rewrites() do módulo já carregado
 * sem BASE_PATH, então a branch `basePath && basePath !== ''` ficava 0/4.
 * Aqui o módulo é recarregado com o cache do require limpo para cada cenário,
 * cobrindo: sem env, env vazia e env preenchida (basePath = assetPrefix).
 */
import { afterEach, describe, expect, it } from "vitest";
import { createRequire } from "node:module";
import path from "node:path";

const requireCjs = createRequire(import.meta.url);
const CONFIG_PATH = path.resolve(__dirname, "../../next.config.js");

type LoadedConfig = {
  reactStrictMode: boolean;
  poweredByHeader: boolean;
  outputFileTracingRoot: string;
  outputFileTracingIncludes: Record<string, string[]>;
  turbopack: Record<string, unknown>;
  images: {
    formats: string[];
    deviceSizes: number[];
    imageSizes: number[];
  };
  headers: () => Promise<
    { source: string; headers: { key: string; value: string }[] }[]
  >;
  rewrites: () => Promise<{ source: string; destination: string }[]>;
  basePath?: string;
  assetPrefix?: string;
};

const ORIGINAL_BASE_PATH = process.env.BASE_PATH;

function loadConfig(basePath: string | undefined): LoadedConfig {
  if (basePath === undefined) {
    delete process.env.BASE_PATH;
  } else {
    process.env.BASE_PATH = basePath;
  }
  delete requireCjs.cache[requireCjs.resolve(CONFIG_PATH)];
  return requireCjs(CONFIG_PATH) as LoadedConfig;
}

afterEach(() => {
  if (ORIGINAL_BASE_PATH === undefined) {
    delete process.env.BASE_PATH;
  } else {
    process.env.BASE_PATH = ORIGINAL_BASE_PATH;
  }
  delete requireCjs.cache[requireCjs.resolve(CONFIG_PATH)];
});

describe("next.config.js — opções estáticas", () => {
  it("mantém as flags de build e o tracing root do projeto", () => {
    const config = loadConfig(undefined);
    expect(config.reactStrictMode).toBe(true);
    expect(config.poweredByHeader).toBe(false);
    expect(config.turbopack).toEqual({});
    expect(config.outputFileTracingRoot).toBe(
      path.resolve(__dirname, "../.."),
    );
  });

  it("inclui os PDFs do CV no bundle da rota /api/download-cv", () => {
    const config = loadConfig(undefined);
    expect(config.outputFileTracingIncludes["/api/download-cv"]).toEqual([
      "./public/*.pdf",
    ]);
  });

  it("declara os formatos e tamanhos de imagem esperados", () => {
    const config = loadConfig(undefined);
    expect(config.images.formats).toEqual(["image/avif", "image/webp"]);
    expect(config.images.deviceSizes).toContain(1920);
    expect(config.images.imageSizes).toContain(384);
  });
});

describe("next.config.js — BASE_PATH", () => {
  it("sem BASE_PATH não define basePath nem assetPrefix", () => {
    const config = loadConfig(undefined);
    expect(config.basePath).toBeUndefined();
    expect(config.assetPrefix).toBeUndefined();
  });

  it("com BASE_PATH vazio não define basePath nem assetPrefix", () => {
    const config = loadConfig("");
    expect(config.basePath).toBeUndefined();
    expect(config.assetPrefix).toBeUndefined();
  });

  it("com BASE_PATH preenchido espelha em basePath e assetPrefix", () => {
    const config = loadConfig("/staging");
    expect(config.basePath).toBe("/staging");
    expect(config.assetPrefix).toBe("/staging");
  });
});

describe("next.config.js — rewrites de infraestrutura", () => {
  it("mantém OpenPanel e o beacon /api/hit no proxy same-origin", async () => {
    const config = loadConfig(undefined);
    const rewrites = await config.rewrites();
    expect(rewrites).toEqual(
      expect.arrayContaining([
        {
          source: "/analytics/op1.js",
          destination: "https://openpanel.seu.pet/op1.js",
        },
        {
          source: "/api/op/:path*",
          destination: "https://openpanel.seu.pet/api/:path*",
        },
        {
          source: "/api/hit",
          destination: "https://skills.seu.pet/api/hit",
        },
      ]),
    );
  });
});
