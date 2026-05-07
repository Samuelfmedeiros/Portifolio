"use client";

import { useState, useEffect } from "react";

export function MiniGame() {
  const [target, setTarget] = useState(0);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState("");
  const [won, setWon] = useState(false);

  useEffect(() => {
    newGame();
  }, []);

  const newGame = () => {
    setTarget(Math.floor(Math.random() * 100) + 1);
    setGuess("");
    setAttempts(0);
    setMessage("Adivinhe um número entre 1 e 100");
    setWon(false);
  };

  const handleGuess = () => {
    const num = parseInt(guess);
    if (isNaN(num) || num < 1 || num > 100) {
      setMessage("⚠ Entrada inválida. Digite 1-100.");
      return;
    }

    setAttempts((a) => a + 1);

    if (num === target) {
      setMessage(`🎯 ACERTOU em ${attempts + 1} tentativas!`);
      setWon(true);
    } else if (num < target) {
      setMessage(`📈 ${num} é muito BAIXO. Tente maior.`);
    } else {
      setMessage(`📉 ${num} é muito ALTO. Tente menor.`);
    }
    setGuess("");
  };

  return (
    <div className="py-2">
      <h3 className="font-mono text-sm text-[var(--accent)] mb-4 text-center">🎮 LÓGICA: ADIVINHE</h3>

      <div className="bg-black/30 rounded-lg p-4 mb-4 text-center">
        <p className="font-mono text-sm text-[var(--accent)]">{message}</p>
        {attempts > 0 && !won && (
          <p className="font-mono text-xs text-[var(--text-secondary)] mt-2">
            Tentativas: {attempts}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGuess()}
          className="flex-1 bg-black/30 border border-[var(--border)] rounded-lg px-3 py-2 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
          placeholder="1-100"
          min={1}
          max={100}
          disabled={won}
        />
        <button
          onClick={won ? newGame : handleGuess}
          className="glass px-4 py-2 rounded-lg font-mono text-sm text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
        >
          {won ? "NOVO" : "GO"}
        </button>
      </div>
    </div>
  );
}
