const path = require('path');

// Project root is the directory containing this config (mission-control)
const projectRoot = path.resolve(__dirname);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages: set NEXT_PUBLIC_STATIC_EXPORT=true in env
  ...(process.env.NEXT_PUBLIC_STATIC_EXPORT === "true" && {
    output: "export",
    images: { unoptimized: true },
    basePath: "",
    assetPrefix: "",
  }),
};

module.exports = nextConfig;