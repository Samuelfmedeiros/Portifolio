"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const COLORS = ["#ef4444", "#22c55e", "#3b82f6", "#f59e0b"] as const;
const COLOR_LABELS = ["VERMELHO", "VERDE", "AZUL", "AMARELO"] as const;

export function MiniGame() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerTurn, setPlayerTurn] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<"idle" | "showing" | "playing" | "gameover">("idle");
  const playerIdx = useRef(0);

  const startGame = useCallback(() => {
    const first = Math.floor(Math.random() * 4);
    setSequence([first]);
    setScore(0);
    setPhase("showing");
    playerIdx.current = 0;
  }, []);

  const flashSequence = useCallback(async () => {
    for (let i = 0; i < sequence.length; i++) {
      await new Promise((r) => setTimeout(r, 400));
      setActiveIdx(sequence[i]);
      await new Promise((r) => setTimeout(r, 300));
      setActiveIdx(null);
    }
    setPlayerTurn(true);
    setPhase("playing");
    playerIdx.current = 0;
  }, [sequence]);

  useEffect(() => {
    if (phase === "showing" && sequence.length > 0) {
      flashSequence();
    }
  }, [phase, sequence, flashSequence]);

  const handleClick = useCallback(
    (idx: number) => {
      if (!playerTurn || phase !== "playing") return;

      setActiveIdx(idx);
      setTimeout(() => setActiveIdx(null), 250);

      if (idx !== sequence[playerIdx.current]) {
        setPhase("gameover");
        setPlayerTurn(false);
        return;
      }

      playerIdx.current += 1;

      if (playerIdx.current === sequence.length) {
        setPlayerTurn(false);
        setScore((s) => s + 1);
        const next = Math.floor(Math.random() * 4);
        setSequence((seq) => [...seq, next]);
        setPhase("showing");
      }
    },
    [playerTurn, phase, sequence]
  );

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <p className="font-mono text-xs text-[var(--text-secondary)]">
        {phase === "idle" && "Clique em Iniciar para jogar!"}
        {phase === "showing" && "👀 Observe a sequência..."}
        {phase === "playing" && "🎯 Repita a sequência!"}
        {phase === "gameover" && `💀 Game Over! Pontuação: ${score}`}
      </p>

      <div className="grid grid-cols-2 gap-2 w-40 h-40">
        {COLORS.map((color, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            disabled={phase !== "playing"}
            className={`rounded-xl transition-all duration-150 ${
              activeIdx === i
                ? "scale-110 brightness-150 shadow-lg shadow-white/20"
                : "brightness-75 hover:brightness-100"
            } ${phase === "playing" ? "cursor-pointer" : "cursor-default"}`}
            style={{ backgroundColor: color }}
            aria-label={COLOR_LABELS[i]}
          />
        ))}
      </div>

      <p className="font-mono text-lg font-bold text-[var(--accent)]">Score: {score}</p>

      {phase === "idle" || phase === "gameover" ? (
        <button
          onClick={startGame}
          className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white font-mono text-xs hover:brightness-110 transition-all"
        >
          {phase === "gameover" ? "🔄 Tentar Novamente" : "▶ Iniciar Jogo"}
        </button>
      ) : null}
    </div>
  );
}
