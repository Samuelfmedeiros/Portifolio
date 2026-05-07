"use client";

import { useState, useCallback } from "react";

export function MiniGame() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isShowing, setIsShowing] = useState(false);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Pressione INICIAR para jogar");
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const playSequence = useCallback(async (seq: number[]) => {
    setIsShowing(true);
    setActiveButton(null);
    for (let i = 0; i < seq.length; i++) {
      await new Promise(r => setTimeout(r, 500));
      setActiveButton(seq[i]);
      await new Promise(r => setTimeout(r, 300));
      setActiveButton(null);
    }
    setIsShowing(false);
    setMessage("Sua vez! Repita a sequência.");
  }, []);

  const startGame = useCallback(() => {
    const first = [Math.floor(Math.random() * 4) + 1];
    setSequence(first);
    setPlayerSequence([]);
    setScore(0);
    setGameOver(false);
    setStarted(true);
    setMessage("Observe a sequência...");
    playSequence(first);
  }, [playSequence]);

  const handleButtonClick = useCallback((num: number) => {
    if (isShowing || gameOver) return;
    const newPlayer = [...playerSequence, num];
    setPlayerSequence(newPlayer);

    // Check if correct so far
    const idx = newPlayer.length - 1;
    if (newPlayer[idx] !== sequence[idx]) {
      setMessage(`❌ ERRADO! Sequência correta: ${sequence.join(" ")}. Score: ${score}`);
      setGameOver(true);
      return;
    }

    // Check if completed
    if (newPlayer.length === sequence.length) {
      const newScore = score + 1;
      setScore(newScore);
      setMessage(`✅ CORRETO! Pontuação: ${newScore}`);
      const next = [...sequence, Math.floor(Math.random() * 4) + 1];
      setTimeout(() => {
        setSequence(next);
        setPlayerSequence([]);
        playSequence(next);
      }, 1000);
    }
  }, [isShowing, gameOver, playerSequence, sequence, score, playSequence]);

  const buttons = [
    { num: 1, label: "1", position: "top-left" },
    { num: 2, label: "2", position: "top-right" },
    { num: 3, label: "3", position: "bottom-left" },
    { num: 4, label: "4", position: "bottom-right" },
  ];

  return (
    <div className="py-2">
      <h3 className="font-mono text-sm text-[var(--accent)] mb-4 text-center">
        🧠 SEQUÊNCIA LÓGICA
      </h3>

      <div className="text-center mb-4">
        <p className="font-mono text-sm text-[var(--text-secondary)]">{message}</p>
        {started && <p className="font-mono text-xs text-[var(--accent)] mt-1">Score: {score}</p>}
      </div>

      {!started || gameOver ? (
        <button
          onClick={startGame}
          className="w-full glass py-3 rounded-lg font-mono text-sm text-[var(--accent)] hover:bg-[var(--accent)]/10"
        >
          {started ? "🔄 REINICIAR" : "🚀 INICIAR"}
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {buttons.map(({ num, label }) => (
            <button
              key={num}
              onClick={() => handleButtonClick(num)}
              disabled={isShowing}
              className={`p-6 rounded-lg font-mono text-2xl transition-all ${
                activeButton === num
                  ? "bg-[var(--accent)] text-black scale-105 shadow-[0_0_20px_var(--accent)]"
                  : "bg-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--accent)]/20"
              } ${isShowing ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
