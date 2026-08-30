// Centraliza as URLs de imagem servidas pelo CDN Cloudflare (R2 + image-proxy).
// Todas as imagens do Portifólio vivem em img.seu.pet (bucket portifolio-images).

export const IMG_BASE = "https://img.seu.pet";

export function img(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const clean = path.replace(/^\/+/, "");
  return `${IMG_BASE}/${clean}`;
}
