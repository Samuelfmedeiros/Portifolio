// @ts-check
const path = require('path');

/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },

  // Fix workspace root inference (stray pnpm-lock in home dir)
  outputFileTracingRoot: path.join(__dirname),

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
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://fundingchoicesmessages.google.com https://www.googletagmanager.com https://www.google-analytics.com https://ep2.adtrafficquality.google https://*.adtrafficquality.google https://capivara.seu.pet https://unpkg.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://www.googletagmanager.com https://www.google-analytics.com https://ep1.adtrafficquality.google https://avatars.githubusercontent.com https://*.googleusercontent.com https://api.qrserver.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://capivara.seu.pet https://api.github.com https://jwsdquwkrkonkqghyfns.supabase.co https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://*.adtrafficquality.google https://www.google-analytics.com",
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

  // Tree-shaking
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: true,
  },

  // Webpack fallbacks
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    return config;
  },
};

// basePath/assetPrefix — só define se BASE_PATH for string não vazia
const basePath = process.env.BASE_PATH;
if (basePath && basePath !== '') {
  nextConfig.basePath = basePath;
  nextConfig.assetPrefix = basePath;
}

module.exports = nextConfig;
