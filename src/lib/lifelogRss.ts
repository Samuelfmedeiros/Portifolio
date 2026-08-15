// ═══════════════════════════════════════════════════════════════
// lifelogRss — busca os últimos posts do LifeLog via RSS
// Server-side apenas (fetch com revalidate ISR).
// Segurança: URL fixa (sem SSRF), timeout, fallback silencioso,
// parser restrito (sem XXE), links http(s) validados, accent #hex.
// ═══════════════════════════════════════════════════════════════

const LIFELOG_RSS_URL = "https://lifelog-sepia.vercel.app/rss.xml";
const FETCH_TIMEOUT_MS = 5000;
export const LIFELOG_CACHE_TTL = 1800; // 30min ISR — alinhado com revalidate da página (Samuel 09/08/2026)
export const MAX_POSTS = 30; // pega bastante; parse mantém PT+EN e o BlogSection filtra por locale (garante 3 por idioma)

export interface LifelogPost {
  title: string;
  url: string;
  date?: string; // ISO string do pubDate
  excerpt?: string;
  cover?: string; // capa (enclosure)
  project?: string; // id do projeto (ex: capivara)
  accent?: string; // cor do projeto (ex: #f59e0b)
}

/** Valida se é uma cor hex (#rgb/#rrggbb) — nunca url()/javascript:. */
function isValidHex(color: string): boolean {
  return /^#[0-9a-fA-F]{3,8}$/.test(color);
}

/** Extrai os primeiros N itens do RSS sem resolver entidades externas. */
export function parseRssItems(xml: string, max: number = MAX_POSTS): LifelogPost[] {
  if (!xml || typeof xml !== "string") return [];
  // Remove DOCTYPE (proteção contra XXE) antes de qualquer parsing
  const safeXml = xml.replace(/<!DOCTYPE[^>]*>/gi, "");
  const itemMatches = Array.from(safeXml.matchAll(/<item>([\s\S]*?)<\/item>/gi));
  if (itemMatches.length === 0) return [];

  const posts: LifelogPost[] = [];
  for (const m of itemMatches) {
    const item = m[1];

    const titleMatch = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
    const linkMatch = item.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
    const dateMatch = item.match(/<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/i);
    const descMatch = item.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
    const enclosureMatch = item.match(/<enclosure[^>]*url="([^"]+)"[^>]*\/?>/i);
    const projectMatch = item.match(/<project>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/project>/i);
    const accentMatch = item.match(/<accent>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/accent>/i);

    const title = titleMatch ? titleMatch[1].trim() : "";
    const url = linkMatch ? linkMatch[1].trim() : "";
    if (!title || !url) continue;
    // Só aceita http(s) — nunca javascript: nem dados arbitrários
    if (!/^https?:\/\//i.test(url)) continue;
    // Rejeita referências de entidade não resolvidas (&xxe; etc.)
    if (/&[a-zA-Z0-9#]+;/.test(title)) continue;
    // Mantém PT E EN no array — o BlogSection filtra por locale
    // (PT mostra sem /en/, EN mostra com /en/). Antes filtrávamos EN aqui
    // e o modo EN do site ficava sem a seção DO BLOG (bug 15/08/2026).

    const cover = enclosureMatch?.[1]?.trim();
    const accent = accentMatch ? accentMatch[1].trim() : undefined;

    posts.push({
      title,
      url,
      date: dateMatch ? dateMatch[1].trim() : undefined,
      excerpt: descMatch ? descMatch[1].trim().slice(0, 220) : undefined,
      cover: cover && /^https?:\/\//i.test(cover) ? cover : undefined,
      project: projectMatch ? projectMatch[1].trim() : undefined,
      accent: accent && isValidHex(accent) ? accent : undefined,
    });

    if (posts.length >= max) break;
  }

  // Ordena por data de publicação desc — posts PT/EN com a mesma pubDate
  // (ex: grade cíclica 2 posts/dia) têm ordem instável no RSS; o portifólio
  // deve mostrar os 3 MAIS RECENTES, não os primeiros do XML (bug 09/08/2026).
  posts.sort((a, b) => {
    const da = Date.parse(a.date || "");
    const db = Date.parse(b.date || "");
    if (!Number.isNaN(da) && !Number.isNaN(db) && da !== db) return db - da;
    // Empate na data: título como tiebreaker determinístico
    return a.title.localeCompare(b.title);
  });

  return posts;
}

/** Busca os últimos posts do blog. Retorna [] (fallback) em qualquer falha. */
export async function getLatestLifelogPosts(): Promise<LifelogPost[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const res = await fetch(LIFELOG_RSS_URL, {
      next: { revalidate: LIFELOG_CACHE_TTL },
      signal: controller.signal,
      headers: { Accept: "application/rss+xml, application/xml, text/xml" },
      // Sem force-cache: com revalidate ISR, o Next decide quando revalidar.
      // force-cache aqui fazia o fetch reutilizar o cache antigo do build (bug 09/08).
    });

    clearTimeout(timer);

    if (!res.ok) {
      console.warn(`[lifelogRss] HTTP ${res.status} — fallback`);
      return [];
    }
    const xml = await res.text();
    return parseRssItems(xml);
  } catch (err) {
    console.warn(`[lifelogRss] fetch failed — fallback: ${err instanceof Error ? err.message : String(err)}`);
    return [];
  }
}
