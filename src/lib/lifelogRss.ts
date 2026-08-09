// ═══════════════════════════════════════════════════════════════
// lifelogRss — busca os últimos posts do LifeLog via RSS
// Server-side apenas (fetch com revalidate ISR).
// Segurança: URL fixa (sem SSRF), timeout, fallback silencioso,
// parser restrito (sem XXE), links http(s) validados, accent #hex.
// ═══════════════════════════════════════════════════════════════

const LIFELOG_RSS_URL = "https://lifelog-sepia.vercel.app/rss.xml";
const FETCH_TIMEOUT_MS = 5000;
export const LIFELOG_CACHE_TTL = 3600; // 1h ISR
export const MAX_POSTS = 8; // server busca mais; componente filtra PT/EN e mostra 3

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
      cache: "force-cache",
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
