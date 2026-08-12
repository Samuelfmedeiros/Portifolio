"use client";

import dynamic from "next/dynamic";
import { LazySection } from "./LazySection";
import type { Repo } from "@/lib/types";

// 🔴 Bloco perf 12/08/2026 — GameShowcase tem GSAP + iframe de jogos (chunk
// ~120KB+): só carrega quando o usuário rola até a seção. ssr:false = fora do
// bundle inicial. Fallback com altura medida (mobile 346 / desktop 354) → CLS 0.
const GameShowcase = dynamic(
  () => import("./GameShowcase").then((m) => m.GameShowcase),
  {
    ssr: false,
    loading: () => <GamesFallback />,
  }
);

export function GamesFallback() {
  return (
    <div
      className="flex items-center justify-center text-sm text-[var(--text-secondary)]"
      style={{ minHeight: "346px" }}
    >
      🎮 Jogos carregando…
    </div>
  );
}

export function LazyGameShowcase({ repos }: { repos: Repo[] }) {
  return (
    <LazySection fallback={<GamesFallback />}>
      <GameShowcase repos={repos} />
    </LazySection>
  );
}
