export interface Palette {
  id: string;
  name: string;
  accentDark: string;
  accentLight: string;
  altDark: string;
  altLight: string;
}

export const PALETTES: Palette[] = [
  { id: "cyan",    name: "Ciano",    accentDark: "#22d3ee", accentLight: "#0284c7", altDark: "#6366f1", altLight: "#4338ca" },
  { id: "emerald", name: "Esmeralda",accentDark: "#34d399", accentLight: "#059669", altDark: "#818cf8", altLight: "#4f46e5" },
  { id: "violet",  name: "Violeta",  accentDark: "#a78bfa", accentLight: "#7c3aed", altDark: "#f472b6", altLight: "#db2777" },
  { id: "amber",   name: "Âmbar",    accentDark: "#fbbf24", accentLight: "#d97706", altDark: "#fb923c", altLight: "#ea580c" },
  { id: "rose",    name: "Rosa",     accentDark: "#fb7185", accentLight: "#e11d48", altDark: "#a78bfa", altLight: "#7c3aed" },
  { id: "blue",    name: "Azul",     accentDark: "#60a5fa", accentLight: "#2563eb", altDark: "#34d399", altLight: "#059669" },
];

export const DEFAULT_PALETTE = "cyan";
export const STORAGE_PALETTE_KEY = "mc-palette";
