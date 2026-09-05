import { describe, it, expect } from "vitest";
import { detectBrand } from "./brandColors";

describe("detectBrand", () => {
  it("detecta Google em texto de vaga", () => {
    const theme = detectBrand("Vaga de Analista de Dados Pleno no Google");
    expect(theme).not.toBeNull();
    expect(theme!.id).toBe("google");
    expect(theme!.name).toBe("Google");
    expect(theme!.primary).toEqual([66, 133, 244]);
  });

  it("detecta Microsoft por alias (Azure)", () => {
    const theme = detectBrand("Engenheiro de dados na Azure");
    expect(theme).not.toBeNull();
    expect(theme!.id).toBe("microsoft");
  });

  it("detecta Google Cloud (alias composto) em vez de pegar substring errada", () => {
    const theme = detectBrand("SRE no Google Cloud");
    expect(theme).not.toBeNull();
    expect(theme!.id).toBe("google");
  });

  it("detecta Nubank (cor roxa)", () => {
    const theme = detectBrand("Quero me candidatar ao Nubank");
    expect(theme).not.toBeNull();
    expect(theme!.id).toBe("nubank");
    expect(theme!.primary).toEqual([130, 10, 209]);
  });

  it("retorna null para texto sem marca e sem cor", () => {
    expect(detectBrand("Vaga de analista de dados pleno em banco")).toBeNull();
  });

  it("retorna tema de cor simples para palavra de cor", () => {
    const theme = detectBrand("Currículo com tema azul");
    expect(theme).not.toBeNull();
    expect(theme!.id).toBe("color");
  });

  it("é case-insensitive e acento-insensitive", () => {
    expect(detectBrand("VAGAS NO ITAÚ")!.id).toBe("itau");
    expect(detectBrand("vaga na Caixa Econômica")!.id).toBe("caixa");
  });

  it("não casa substring curta demais (ex: 'nu' dentro de outra palavra)", () => {
    // 'nu' como alias do Nubank tem length < 3 → não deve casar em "nuvem"
    expect(detectBrand("Vaga na nuvem")).toBeNull();
  });

  it("prioriza marca de alias mais longo (Banco do Brasil antes de Brasil isolado)", () => {
    const theme = detectBrand("Analista no Banco do Brasil");
    expect(theme).not.toBeNull();
    expect(theme!.id).toBe("bancobrasil");
  });
});
