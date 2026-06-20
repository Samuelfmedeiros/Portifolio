// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produção otimizada
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Turbopack explícito com root correto
  turbopack: {
    root: path.resolve(__dirname),
  },

  // Base path para servir atrás do reverse proxy (/api/portifolio-proxy/ → Next.js)
  // Usa BASE_PATH env var (default: /api/portifolio-proxy para staging)
  // Produção: setar BASE_PATH= (vazio) → basePath undefined → serve na raiz
  // Staging: setar BASE_PATH=/api/portifolio-proxy ou omitir
  basePath: process.env.VERCEL
    ? undefined
    : (process.env.BASE_PATH === '' ? undefined : (process.env.BASE_PATH || '/api/portifolio-proxy')),
  // Asset prefix para os assets estáticos (necessário em produção - next start)
  assetPrefix: process.env.VERCEL
    ? undefined
    : (process.env.BASE_PATH === '' ? undefined : (process.env.BASE_PATH || '/api/portifolio-proxy')),
  
  // Otimização de imagens → WebP/AVIF automático
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Tree-shaking agressivo
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: true,
  },
  
  // Webpack otimizado (fallback se necessário)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
  
  // Headers de segurança + CSP para AdSense
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
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
            ].join('; ')
          }
        ]
      }
    ];
  }
};


// Bind only to localhost
const localConfig = {
  ...nextConfig,
  server: {
    host: '127.0.0.1',
  },
};

module.exports = localConfig;
