// Centraliza as URLs de imagem.
// As capas do Portifólio são servidas do MESMO domínio (Vercel) para evitar
// bloqueio de rastreamento/adblock em domínio externo (img.seu.pet causava
// cards com imagem vazia em navegador real, 30/08). Manter same-origin.
// CDN Cloudflare (R2 + image-proxy) fica como opção futura, não default.

export function img(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const clean = path.replace(/^\/+/, "");
  return `/${clean}`;
}
