import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Security: prevent path traversal
  const sanitized = slug.replace(/\.\.\//g, "").replace(/\.\.\\/g, "").replace(/\//g, "").replace(/\\/g, "");
  if (sanitized !== slug) {
    return new NextResponse("Invalid game slug", { status: 400 });
  }

  const filePath = path.join(process.cwd(), "public/games", slug, "index.html");

  if (!fs.existsSync(filePath)) {
    return new NextResponse("Game not found", { status: 404 });
  }

  const html = fs.readFileSync(filePath, "utf-8");
  // Guarda anti-regressao (06/10/2026): em 16/09/2026 o commit 9a34b69 gravou
  // este index.html em base64 e o endpoint devolveu a string codificada com
  // HTTP 200 + Content-Type: text/html — os 5 jogos ficaram quebrados por 3
  // semanas sem nenhum sinal no log. Se o arquivo nao comeca com "<" (ignorando
  // BOM e espacos), ele nao e HTML: falha alto em vez de servir lixo.
  const head = html.replace(/^\uFEFF/, "").trimStart();
  if (!head.startsWith("<")) {
    console.error(
      `[api/game] ${slug}/index.html nao e HTML — primeiros bytes: ${JSON.stringify(html.slice(0, 32))}`
    );
    return new NextResponse("Game asset is not valid HTML", { status: 500 });
  }

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // No CSP headers — game runs freely
      "X-Frame-Options": "SAMEORIGIN",
      // SEO: este endpoint serve o MESMO conteudo de /games/<slug>/index.html
      // (e e carregado dentro de iframe). Sem noindex, o Google ve duas URLs
      // identicas e a indexacao se dilui — a versao canonica e a pagina estatica.
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
