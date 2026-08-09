// ═══════════════════════════════════════════════════════════════
// lifelogRss — busca o último post do LifeLog via RSS
// Server-side apenas (fetch com revalidate ISR).
// Segurança: URL fixa (sem SSRF), timeout, fallback silencioso,
// parser restrito a <title>/<link> (sem XXE), link validado http(s).
// ═══════════════════════════════════════════════════════════════

const LIFELOG_RSS_URL = "https://lifelog-sepia.vercel.app/rss.xml";
const FETCH_TIMEOUT_MS = 5000;
export const LIFELOG_CACHE_TTL = 3600; // 1h ISR

export interface LifelogPost {
  title: string;
  url: string;
}

/** Extrai title/link do primeiro <item> do RSS sem resolver entidades externas. */
export function parseFirstRssItem(xml: string): LifelogPost | null {
  if (!xml || typeof xml !== "string") return null;
  // Remove DOCTYPE (proteção contra XXE) antes de qualquer parsing
  const safeXml = xml.replace(/<!DOCTYPE[^>]*>/gi, "");
  const itemMatch = safeXml.match(/<item>([\s\S]*?)<\/item>/i);
  if (!itemMatch) return null;

  const item = itemMatch[1];
  const titleMatch = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
  const linkMatch = item.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);

  const title = titleMatch ? titleMatch[1].trim() : "";
  const url = linkMatch ? linkMatch[1].trim() : "";

  if (!title || !url) return null;
  // Só aceita http(s) — nunca javascript: nem dados arbitrários
  if (!/^https?:\/\//i.test(url)) return null;
  // Rejeita referências de entidade não resolvidas (&xxe;, &amp; não resolvido etc.)
  // — com DOCTYPE removido elas viram texto literal; não queremos exibir lixo
  if (/&[a-zA-Z0-9#]+;/.test(title)) return null;

  return { title, url };
}

/** Busca o último post do blog. Retorna null (fallback) em qualquer falha. */
export async function getLatestLifelogPost(): Promise<LifelogPost | null> {
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
      return null;
    }
    const xml = await res.text();
    return parseFirstRssItem(xml);
  } catch (err) {
    console.warn(`[lifelogRss] fetch failed — fallback: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}
