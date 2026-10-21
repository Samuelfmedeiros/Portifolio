// TEMPORARIO: prova que o alerta de CI dispara com teste vermelho. Apagar com a branch.
import { describe, expect, it } from "vitest";

describe("prova do alerta de CI", () => {
  it("falha de proposito", () => {
    expect(1).toBe(2);
  });
});
