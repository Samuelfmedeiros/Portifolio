import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy same-origin para a API do Portifolio hospedada no Capivara.
 *
 * Contexto (14/09/2026): o dominio custom https://portifolio.seu.pet NAO esta na
 * allowlist de CORS do Capivara (backend/main.py -> CORSMiddleware.allow_origins
 * lista capivara.seu.pet, localhost:8001, samuelmedeiros.vercel.app e um preview).
 * Medido: o preflight OPTIONS de https://portifolio.seu.pet para
 * /api/portifolio/public/messages volta 400 sem access-control-allow-origin, e no
 * browser o fetch morre com "TypeError: Failed to fetch". Consequencia: quem entra
 * pelo dominio proprio nao consegue enviar o formulario de contato
 * (POST /messages), nao registra download de CV (POST /cv-downloads) e o beacon do
 * Umami (POST /api/umami/api/send) e bloqueado — zero tracking no dominio proprio.
 *
 * Solucao: rota same-origin no proprio Next. O browser conversa so com o dominio
 * do site (sem preflight, sem depender da allowlist do Capivara) e o servidor da
 * Vercel conversa com o Capivara server-to-server (CORS nao se aplica entre
 * servidores).
 *
 * Seguranca: allowlist FECHADA de prefixos + comparacao byte-a-byte.
 *
 * O contrato do segmento e deliberadamente paranoico: cada segmento e decodificado
 * em LOOP (decode unico deixa `%252e` passar), rejeitado se virar `.`/`..` ou
 * contiver separador, e a URL alvo e remontada a partir dos segmentos ja validados.
 * Motivo historico neste projeto: o guard de PDFs do CV sofreu bypass por
 * percent-encoding (13/09/2026) porque comparava string crua; a mesma classe de
 * erro aqui transformaria a allowlist em proxy aberto para o Capivara.
 */
const CAPIVARA = "https://capivara.seu.pet";
const ALLOWED_PREFIXES = ["portifolio/public/", "umami/"];
const MAX_SEGMENTS = 8;

function decodeFully(segment: string): string {
  let current = segment;
  for (let i = 0; i < 3; i++) {
    let next: string;
    try {
      next = decodeURIComponent(current);
    } catch {
      return "\u0000"; // malformado => nunca casa
    }
    if (next === current) break;
    current = next;
  }
  return current;
}

/** Um segmento valido e decodificado, nao-vazio, sem separador e sem `.`/`..`. */
function sanitize(path: string[]): string[] | null {
  if (!Array.isArray(path) || path.length === 0 || path.length > MAX_SEGMENTS) return null;
  const out: string[] = [];
  for (const raw of path) {
    if (typeof raw !== "string") return null;
    const decoded = decodeFully(raw);
    if (
      decoded === "" ||
      decoded === "." ||
      decoded === ".." ||
      decoded.includes("/") ||
      decoded.includes("\\") ||
      decoded.includes("\u0000")
    ) {
      return null;
    }
    out.push(decoded);
  }
  const joined = out.join("/");
  if (!ALLOWED_PREFIXES.some((prefix) => joined.startsWith(prefix))) return null;
  return out;
}

async function forward(req: NextRequest, path: string[]) {
  const safe = sanitize(path);
  if (!safe) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const target = new URL(`${CAPIVARA}/api/${safe.join("/")}`);
  req.nextUrl.searchParams.forEach((v, k) => target.searchParams.append(k, v));

  const headers = new Headers();
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const userAgent = req.headers.get("user-agent");
  if (userAgent) headers.set("user-agent", userAgent);
  const referer = req.headers.get("referer");
  if (referer) headers.set("referer", referer);

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const body = hasBody ? await req.text() : undefined;

  try {
    const res = await fetch(target.toString(), {
      method: req.method,
      headers,
      body,
      redirect: "manual",
      cache: "no-store",
    });
    const buf = await res.arrayBuffer();
    const out = new NextResponse(buf, { status: res.status });
    const ct = res.headers.get("content-type");
    if (ct) out.headers.set("content-type", ct);
    return out;
  } catch (err) {
    console.error("[pf-proxy] upstream falhou:", err);
    return NextResponse.json({ error: "Upstream unavailable" }, { status: 502 });
  }
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(req, path);
}

export async function GET(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(req, path);
}
