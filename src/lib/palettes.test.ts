import { describe, it, expect } from "vitest";
import { PALETTES, DEFAULT_PALETTE, STORAGE_PALETTE_KEY } from "./palettes";
import type { Palette } from "./palettes";

const EXPECTED: Array<Palette> = [
  { id: "cyan", name: "Ciano", accentDark: "#22d3ee", accentLight: "#0369a1", altDark: "#6366f1", altLight: "#3730a3" },
  { id: "emerald", name: "Esmeralda", accentDark: "#34d399", accentLight: "#047857", altDark: "#818cf8", altLight: "#4338ca" },
  { id: "violet", name: "Violeta", accentDark: "#a78bfa", accentLight: "#6d28d9", altDark: "#f472b6", altLight: "#be123c" },
  { id: "amber", name: "Âmbar", accentDark: "#fbbf24", accentLight: "#b45309", altDark: "#fb923c", altLight: "#c2410c" },
  { id: "rose", name: "Rosa", accentDark: "#fb7185", accentLight: "#be123c", altDark: "#a78bfa", altLight: "#6d28d9" },
  { id: "blue", name: "Azul", accentDark: "#60a5fa", accentLight: "#1d4ed8", altDark: "#34d399", altLight: "#047857" },
];

describe("palettes", () => {
  it("exports the six curated palettes with exact colors", () => {
    expect(PALETTES).toEqual(EXPECTED);
  });

  it("has unique ids", () => {
    const ids = PALETTES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("defaults to cyan", () => {
    expect(DEFAULT_PALETTE).toBe("cyan");
    expect(PALETTES.some((p) => p.id === DEFAULT_PALETTE)).toBe(true);
  });

  it("uses the mc-palette storage key", () => {
    expect(STORAGE_PALETTE_KEY).toBe("mc-palette");
  });
});
