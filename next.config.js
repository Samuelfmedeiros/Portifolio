// @ts-check
const path = require('path');

/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Fix workspace root inference (stray pnpm-lock in home dir)
  outputFileTracingRoot: path.join(__dirname),

  // Turbopack (Next.js 16 default) — webpack config removido, não é necessário
  turbopack: {},

  // Headers de segurança
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
          {
            key: 'Content-Security-Policy',
            // FONTE ÚNICA da CSP em produção é vercel.json (ela sobrescreve este bloco
            // no Vercel). Este array existe só para dev/`next start` baterem com ela.
            // 'unsafe-inline' em script-src/style-src é EXCEÇÃO DOCUMENTADA — see
            // docs/adr/ADR-004-csp-unsafe-inline-excecao.md (Next 16 flight payloads +
            // 263 style attrs; nonce/hash mataria cache edge + ISR).
            // 15/09: removido 'unsafe-eval' (divergia do header servido; nada no build
            // Turbopack de produção depende dele).
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://fundingchoicesmessages.google.com https://www.googletagmanager.com https://www.google-analytics.com https://ep2.adtrafficquality.google https://*.adtrafficquality.google https://capivara.seu.pet https://unpkg.com https://static.cloudflareinsights.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://www.googletagmanager.com https://www.google-analytics.com https://ep1.adtrafficquality.google https://avatars.githubusercontent.com https://*.googleusercontent.com https://api.qrserver.com https://lifelog-sepia.vercel.app",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://capivara.seu.pet https://api.github.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://*.adtrafficquality.google https://www.google-analytics.com",
              "frame-src 'self' https://googleads.g.doubleclick.net https://td.doubleclick.net https://fundingchoicesmessages.google.com https://ep2.adtrafficquality.google https://www.google.com",
              "form-action 'self'",
              "base-uri 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },

  // Otimização de imagens
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

// basePath/assetPrefix — só define se BASE_PATH for string não vazia
const basePath = process.env.BASE_PATH;
if (basePath && basePath !== '') {
  nextConfig.basePath = basePath;
  nextConfig.assetPrefix = basePath;
}

module.exports = nextConfig;
