// Detecta a marca/empresa citada no input do usuário e retorna o tema de cores.
// DETERMINÍSTICO: mapa curado de marcas — o LLM NÃO participa da escolha de cor.
// Guardrail: cores vêm só deste mapa fixo (nunca do texto do usuário), evitando
// prompt injection na formatação e cores arbitrárias/inválidas.

export interface BrandTheme {
  id: string;
  name: string;
  /** Cor primária em formato [r, g, b] 0-255 */
  primary: [number, number, number];
  /** Cor secundária (opcional, para detalhes) */
  secondary: [number, number, number];
  /** Precisamos saber se a cor é escura p/ manter legibilidade */
  dark?: boolean;
}

interface BrandEntry {
  dark?: boolean;
  id: string;
  name: string;
  primary: string; // hex
  secondary?: string;
  aliases?: string[]; // outros nomes/empresas do mesmo grupo
}

// ─── Mapa curado de marcas ────────────────────────────────────────────
// Ordem importa: marcas mais específicas (com alias) primeiro, e o detector
// tenta a correspondência mais longa primeiro para evitar falsos positivos
// ("Banco do Brasil" não casa com "Brasil" de outro lugar).
const BRANDS: BrandEntry[] = [
  { id: "google", name: "Google", primary: "#4285F4", secondary: "#EA4335", aliases: ["alphabet", "google cloud", "youtube"] },
  { id: "microsoft", name: "Microsoft", primary: "#00A4EF", secondary: "#F25022", aliases: ["azure", "microsoft 365", "windows", "office", "linkedin", "outlook", "teams"] },
  { id: "apple", name: "Apple", primary: "#555555", secondary: "#A2AAAD", aliases: ["iphone", "macos", "macbook"] },
  { id: "meta", name: "Meta", primary: "#0866FF", secondary: "#0668E1", aliases: ["facebook", "instagram", "whatsapp", "threads"] },
  { id: "amazon", name: "Amazon", primary: "#FF9900", secondary: "#232F3E", aliases: ["aws", "amazon web services", "prime video"] },
  { id: "netflix", name: "Netflix", primary: "#E50914", secondary: "#221F1F" },
  { id: "spotify", name: "Spotify", primary: "#1DB954", secondary: "#191414" },
  { id: "nvidia", name: "NVIDIA", primary: "#76B900", secondary: "#2C2C2C", aliases: ["geforce", "cuda"] },
  { id: "intel", name: "Intel", primary: "#0071C5", secondary: "#0068B5" },
  { id: "amd", name: "AMD", primary: "#ED1C24", secondary: "#2C2C2C", aliases: ["radeon", "ryzen"] },
  { id: "ibm", name: "IBM", primary: "#054ADA", secondary: "#161616" },
  { id: "oracle", name: "Oracle", primary: "#F80000", secondary: "#C74634" },
  { id: "salesforce", name: "Salesforce", primary: "#00A1E0", secondary: "#032D60" },
  { id: "sap", name: "SAP", primary: "#0FAAFF", secondary: "#1873B4" },
  { id: "adobe", name: "Adobe", primary: "#FA0F00", secondary: "#00005B" },
  { id: "ubisoft", name: "Ubisoft", primary: "#2E2E2E", secondary: "#77CBC4" },
  { id: "uber", name: "Uber", primary: "#000000", secondary: "#09091A", dark: true },
  { id: "airbnb", name: "Airbnb", primary: "#FF5A5F", secondary: "#484848" },
  { id: "mercadolivre", name: "Mercado Livre", primary: "#3483FA", secondary: "#FFE600", aliases: ["mercado libre", "mercadolivre", "mercado pago"] },
  { id: "nubank", name: "Nubank", primary: "#820AD1", secondary: "#6A14A1", aliases: ["nu"] },
  { id: "inter", name: "Banco Inter", primary: "#FF7A00", secondary: "#1C1C1C", aliases: ["banco inter"] },
  { id: "itau", name: "Itaú", primary: "#EC7000", secondary: "#F7C600", aliases: ["itau", "itaú"] },
  { id: "bradesco", name: "Bradesco", primary: "#CC092F", secondary: "#FFCC00" },
  { id: "santander", name: "Santander", primary: "#EC0000", secondary: "#3E3E3E" },
  { id: "bancobrasil", name: "Banco do Brasil", primary: "#012F6B", secondary: "#FEFE00", aliases: ["bb"] },
  { id: "caixa", name: "Caixa", primary: "#005CA9", secondary: "#00A94F", aliases: ["caixa economica", "caixa econômica"] },
  { id: "petrobras", name: "Petrobras", primary: "#0091BD", secondary: "#F7D000", aliases: ["petrobras"] },
  { id: "vale", name: "Vale", primary: "#EE3E30", secondary: "#F5A800" },
  { id: "magazineluiza", name: "Magazine Luiza", primary: "#0086D1", secondary: "#FF6500", aliases: ["magalu"] },
  { id: "ifood", name: "iFood", primary: "#EA1D2C", secondary: "#141414" },
  { id: "picpay", name: "PicPay", primary: "#11C76F", secondary: "#0A0A0A" },
  { id: "pagbank", name: "PagBank", primary: "#009CFF", secondary: "#8A2BE2", aliases: ["pagseguro", "pagseguro"] },
  { id: "xp", name: "XP Inc", primary: "#1FAEFF", secondary: "#131314", aliases: ["xp inc"] },
  { id: "btg", name: "BTG Pactual", primary: "#1B1B2F", secondary: "#D4AF37", aliases: ["btg pactual"] },
  { id: "tiktok", name: "TikTok", primary: "#000000", secondary: "#69C9D0", dark: true },
  { id: "twitter", name: "X (Twitter)", primary: "#000000", secondary: "#1D9BF0", aliases: ["twitter", "x"] },
  { id: "tesla", name: "Tesla", primary: "#CC0000", secondary: "#141414" },
  { id: "disney", name: "Disney", primary: "#113CCF", secondary: "#F4C531", aliases: ["disney+", "pixar", "marvel", "star wars"] },
  { id: "samsung", name: "Samsung", primary: "#1428A0", secondary: "#00A9E0", aliases: ["galaxy"] },
  { id: "lg", name: "LG", primary: "#A50034", secondary: "#333333" },
  { id: "dell", name: "Dell", primary: "#007DB8", secondary: "#2E2E2E" },
  { id: "hp", name: "HP", primary: "#0096D6", secondary: "#000000" },
  { id: "lenovo", name: "Lenovo", primary: "#E2231A", secondary: "#000000" },
  { id: "telegram", name: "Telegram", primary: "#0088CC", secondary: "#229ED9" },
  { id: "telecombr", name: "Telecom BR", primary: "#0E7A8F", secondary: "#FFFFFF" },
  { id: "blockchain", name: "Blockchain", primary: "#0077B6", secondary: "#00B4D8" },
];

// ─── Cores simples por nome (PT/EN) — fallback quando não há marca ────
const COLOR_KEYWORDS: Record<string, [number, number, number]> = {
  azul: [0, 112, 243], blue: [0, 112, 243],
  vermelho: [225, 29, 72], red: [225, 29, 72],
  verde: [5, 150, 105], green: [5, 150, 105],
  roxo: [109, 40, 217], purple: [109, 40, 217],
  laranja: [249, 115, 22], orange: [249, 115, 22],
  amarelo: [217, 119, 6], yellow: [217, 119, 6],
  rosa: [236, 72, 153], pink: [236, 72, 153],
  cinza: [71, 85, 105], gray: [71, 85, 105], grey: [71, 85, 105],
  preto: [15, 23, 42], black: [15, 23, 42],
  ciano: [8, 145, 178], cyan: [8, 145, 178],
  branco: [255, 255, 255], white: [255, 255, 255],
};

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  if (h.length === 3) {
    return [
      parseInt(h[0] + h[0], 16),
      parseInt(h[1] + h[1], 16),
      parseInt(h[2] + h[2], 16),
    ];
  }
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // remove acentos p/ casar "caixa economica"
}

/**
 * Detecta a marca citada no input. Retorna o tema de cores ou null.
 * Estratégia: testa a correspondência de substring mais longa primeiro
 * (evita "Banco do Brasil" casar com "brasil" de outra frase).
 */
export function detectBrand(input: string): BrandTheme | null {
  const normalized = normalize(input);
  if (!normalized || normalized.length < 3) return null;

  // 1) Marca por alias/substring — mais longa primeiro
  const candidates: { entry: BrandEntry; alias: string }[] = [];
  for (const entry of BRANDS) {
    const names = [entry.name, ...(entry.aliases ?? [])].map(normalize);
    for (const alias of names) {
      if (alias.length >= 3 && normalized.includes(alias)) {
        candidates.push({ entry, alias });
      }
    }
  }
  if (candidates.length) {
    candidates.sort((a, b) => b.alias.length - a.alias.length);
    const { entry } = candidates[0];
    return {
      id: entry.id,
      name: entry.name,
      primary: hexToRgb(entry.primary),
      secondary: hexToRgb(entry.secondary || entry.primary),
      dark: entry.dark,
    };
  }

  // 2) Fallback: cor por nome (ex: "quero um currículo azul")
  for (const [word, rgb] of Object.entries(COLOR_KEYWORDS)) {
    if (normalized.includes(word)) {
      return { id: "color", name: word, primary: rgb, secondary: rgb };
    }
  }

  return null;
}
