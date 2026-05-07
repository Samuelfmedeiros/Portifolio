import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages: set NEXT_PUBLIC_STATIC_EXPORT=true in env
  ...(process.env.NEXT_PUBLIC_STATIC_EXPORT === "true" && {
    output: "export",
    images: { unoptimized: true },
  }),
};

export default nextConfig;
