import { describe, expect, it } from "vitest";
import path from "path";

/**
 * O beacon saiu de skills.seu.pet e passou a bater em /api/hit (relativo) pra não ser
 * barrado por COEP. Se o rewrite cair do next.config.js, o beacon volta a dar 404 no
 * próprio domínio — e a falha é silenciosa (o painel só mostra "0 visita").
 * Este teste amarra as duas pontas: URL relativa no cliente + rewrite no servidor.
 */
describe("rewrite /api/hit do next.config.js", () => {
  it("repassa /api/hit pro caixa da loja", async () => {
    const { default: config } = await import(
      path.resolve(process.cwd(), "next.config.js")
    );
    expect(typeof config.rewrites).toBe("function");
    const rewrites = await config.rewrites();
    expect(rewrites).toEqual(
      expect.arrayContaining([
        { source: "/api/hit", destination: "https://skills.seu.pet/api/hit" },
      ]),
    );
  });
});
