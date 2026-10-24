import { describe, expect, it } from "vitest";
import { isCuratedRepo } from "./projectCuration";

const repo = (over: Partial<Parameters<typeof isCuratedRepo>[0]> = {}) => ({
  name: "meu-projeto",
  fork: false,
  topics: ["featured"],
  ...over,
});

describe("isCuratedRepo — curadoria da grade de projetos", () => {
  it("aceita repo próprio com topic featured", () => {
    expect(isCuratedRepo(repo())).toBe(true);
  });

  it("recusa repo sem o topic featured (curadoria é ato explícito)", () => {
    expect(isCuratedRepo(repo({ topics: ["nextjs", "portfolio"] }))).toBe(false);
    expect(isCuratedRepo(repo({ topics: [] }))).toBe(false);
    expect(isCuratedRepo(repo({ topics: undefined as unknown as string[] }))).toBe(false);
  });

  it("recusa fork de terceiro mesmo com featured", () => {
    expect(isCuratedRepo(repo({ name: "awesome-claude-skills", fork: true }))).toBe(false);
  });

  it("recusa repo de skill (agent-skills) — já representado pelo card Skills Shop", () => {
    for (const name of [
      "roger-mlops-guard",
      "visual-regression-gates",
      "ship-your-mcp-server",
      "mcp-oauth-debug",
      "ai-test-loop",
    ]) {
      expect(isCuratedRepo(repo({ name, topics: ["featured", "agent-skills"] }))).toBe(false);
    }
  });

  it("recusa os repos bloqueados por nome", () => {
    for (const name of ["SamuelFmedeiros", "arachne-mcp", "Arachne_Os_Crawl"]) {
      expect(isCuratedRepo(repo({ name }))).toBe(false);
    }
  });

  it("recusa alias de repo que já tem card no catálogo estático", () => {
    expect(isCuratedRepo(repo({ name: "roger-Test-Loops-mlops" }))).toBe(false);
  });
});
