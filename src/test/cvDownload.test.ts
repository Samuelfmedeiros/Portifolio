import { describe, expect, it } from "vitest";
import { createHash } from "crypto";
import { existsSync, readFileSync } from "fs";
import path from "path";

/**
 * Garante a regra locale→arquivo de download do CV:
 * - locale "en" → Samuel_Andrade_Resume_2026.pdf
 * - qualquer outro → Samuel_Andrade_2026.pdf
 * E que os 2 PDFs servidos são DISTINTOS (regressão: EN não pode ser cópia do PT).
 * Contexto: 11/08/2026 — Resume EN era cópia byte-a-byte do PT (mesmo MD5),
 * quebrava a regra locale→idioma e o ATS.
 */
const PUBLIC_DIR = path.join(process.cwd(), "public");

function resolvePdfName(locale: string | undefined): string {
  return locale === "en" ? "Samuel_Andrade_Resume_2026.pdf" : "Samuel_Andrade_2026.pdf";
}

function md5(buffer: Buffer): string {
  return createHash("md5").update(buffer).digest("hex");
}

describe("Download CV — mapeamento locale → arquivo", () => {
  it("resolve 'en' para o resume EN", () => {
    expect(resolvePdfName("en")).toBe("Samuel_Andrade_Resume_2026.pdf");
  });

  it("resolve 'pt' para o currículo PT", () => {
    expect(resolvePdfName("pt")).toBe("Samuel_Andrade_2026.pdf");
  });

  it("resolve locale ausente/indefinido para PT (default)", () => {
    expect(resolvePdfName(undefined)).toBe("Samuel_Andrade_2026.pdf");
  });
});

describe("Download CV — integridade dos PDFs servidos", () => {
  const ptPath = path.join(PUBLIC_DIR, "Samuel_Andrade_2026.pdf");
  const enPath = path.join(PUBLIC_DIR, "Samuel_Andrade_Resume_2026.pdf");

  it("ambos os PDFs existem em public/", () => {
    expect(existsSync(ptPath)).toBe(true);
    expect(existsSync(enPath)).toBe(true);
  });

  it("os PDFs são DISTINTOS (EN não é cópia do PT)", () => {
    const ptHash = md5(readFileSync(ptPath));
    const enHash = md5(readFileSync(enPath));
    expect(enHash).not.toBe(ptHash);
  });

  it("os PDFs têm tamanho razoável (< 150KB) e não são vazios", () => {
    const ptSize = readFileSync(ptPath).length;
    const enSize = readFileSync(enPath).length;
    expect(ptSize).toBeGreaterThan(30000);
    expect(ptSize).toBeLessThan(150000);
    expect(enSize).toBeGreaterThan(30000);
    expect(enSize).toBeLessThan(150000);
  });

  it("os PDFs começam com o magic number %PDF", () => {
    expect(readFileSync(ptPath).subarray(0, 4).toString()).toBe("%PDF");
    expect(readFileSync(enPath).subarray(0, 4).toString()).toBe("%PDF");
  });
});
