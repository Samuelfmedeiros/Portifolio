"use client";

import dynamic from "next/dynamic";

export const GameShowcaseNoSSR = dynamic(
  () => import("@/components/GameShowcase").then((mod) => mod.GameShowcase),
  { ssr: false }
);
