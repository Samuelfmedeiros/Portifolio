export interface Palette {
  id: string;
  name: string;
  accentDark: string;
  accentLight: string;
  altDark: string;
  altLight: string;
}

export const PALETTES: Palette[] = [
  // accentLight/altLight escurecidos (12/08/2026) p/ contraste >= 4.5:1 no light theme (axe WCAG AA)
  { id: "cyan",    name: "Ciano",    accentDark: "#22d3ee", accentLight: "#0369a1", altDark: "#6366f1", altLight: "#3730a3" },
  { id: "emerald", name: "Esmeralda",accentDark: "#34d399", accentLight: "#047857", altDark: "#818cf8", altLight: "#4338ca" },
  { id: "violet",  name: "Violeta",  accentDark: "#a78bfa", accentLight: "#6d28d9", altDark: "#f472b6", altLight: "#be123c" },
  { id: "amber",   name: "Âmbar",    accentDark: "#fbbf24", accentLight: "#b45309", altDark: "#fb923c", altLight: "#c2410c" },
  { id: "rose",    name: "Rosa",     accentDark: "#fb7185", accentLight: "#be123c", altDark: "#a78bfa", altLight: "#6d28d9" },
  { id: "blue",    name: "Azul",     accentDark: "#60a5fa", accentLight: "#1d4ed8", altDark: "#34d399", altLight: "#047857" },
];

export const DEFAULT_PALETTE = "cyan";
export const STORAGE_PALETTE_KEY = "mc-palette";
