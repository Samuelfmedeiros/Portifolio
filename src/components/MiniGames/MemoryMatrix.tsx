"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Difficulty = 3 | 4 | 5;

interface CellState {
  index: number;
  isTarget: boolean;
  revealed: boolean;
  selected: boolean;
  correct: boolean | null;
}

export function MemoryMatrix() {
  const [gridSize, setGridSize] = useState<Difficulty>(3);
  const [cells, setCells] = useState<CellState[]>([]);
  const [targets, setTargets] = useState<number[]>([]);
  const [phase, setPhase] = useState<"showing" | "input" | "result" | "idle">("idle");
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [message, setMessage] = useState("Pressione INICIAR para jogar");
  const [showTimer, setShowTimer] = useState(0);

  const totalCells = gridSize * gridSize;
  const targetCount = Math.min(gridSize + level, totalCells - 1);

  const generateGrid = useCallback(() => {
    const total = gridSize * gridSize;
    const targetSet = new Set<number>();
    while (targetSet.size < targetCount) {
      targetSet.add(Math.floor(Math.random() * total));
    }
    const targetArr = Array.from(targetSet);

    const newCells: CellState[] = Array.from({ length: total }, (_, i) => ({
      index: i,
      isTarget: targetSet.has(i),
      revealed: false,
      selected: false,
      correct: null,
    }));

    return { cells: newCells, targets: targetArr };
  }, [gridSize, targetCount]);

  const showPhase = useCallback(() => {
    const { cells: newCells, targets: newTargets } = generateGrid();
    // Reveal targets
    newCells.forEach((c) => {
      if (c.isTarget) c.revealed = true;
    });
    setCells(newCells);
    setTargets(newTargets);
    setPhase("showing");
    setMessage(`Memorize as células destacadas...`);

    // Auto-switch to input phase
    const showDuration = Math.max(1000, 3000 - level * 200);
    setShowTimer(Math.ceil(showDuration / 1000));
  }, [generateGrid, level]);

  useEffect(() => {
    if (phase !== "showing") return;
    const timer = setInterval(() => {
      setShowTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Hide targets and switch to input
          setCells((prev) =>
            prev.map((c) => ({ ...c, revealed: false }))
          );
          setPhase("input");
          setMessage("Selecione as células que estavam destacadas!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  const startGame = useCallback(() => {
    setGridSize(3);
    setLevel(0);
    setScore(0);
    setMessage("Nível 1 — Memorize!");
    showPhase();
  }, [showPhase]);

  const handleCellClick = useCallback(
    (index: number) => {
      if (phase !== "input") return;
      const cell = cells[index];
      if (cell.selected || cell.revealed) return;

      const isCorrect = targets.includes(index);

      setCells((prev) =>
        prev.map((c, i) =>
          i === index
            ? { ...c, selected: true, correct: isCorrect }
            : c
        )
      );

      if (isCorrect) {
        setScore((s) => s + 10);
      }

      // Check if all targets found or too many wrong
      const newSelected = cells.filter((c) => c.selected).length + 1;
      const correctSelected = cells.filter((c) => c.selected && c.correct).length + (isCorrect ? 1 : 0);

      if (correctSelected === targetCount) {
        // Level complete
        setPhase("result");
        setMessage("🎯 NÍVEL COMPLETO!");
        setScore((s) => s + 50);
        setHighScore((h) => Math.max(h, score + 50 + 10));
        setTimeout(() => {
          const nextLevel = level + 1;
          setLevel(nextLevel);
          if (nextLevel % 3 === 0 && gridSize < 5) {
            setGridSize((g) => Math.min(5, g + 1) as Difficulty);
          }
          setMessage(`Nível ${nextLevel + 1} — Memorize!`);
          showPhase();
        }, 1500);
      } else if (!isCorrect && newSelected - correctSelected >= 2) {
        // Too many wrong — game over
        setPhase("result");
        setMessage(`❌ GAME OVER! Score: ${score}`);
        setCells((prev) =>
          prev.map((c) => ({
            ...c,
            revealed: c.isTarget,
            correct: c.isTarget ? true : c.selected ? false : null,
          }))
        );
        setHighScore((h) => Math.max(h, score));
      }
    },
    [phase, cells, targets, targetCount, level, gridSize, score, showPhase]
  );

  return (
    <div className="py-2">
      <h3 className="font-mono text-sm text-[var(--accent)] mb-4 text-center">
        🧠 MEMORY MATRIX
      </h3>

      <div className="flex justify-between items-center mb-3 px-2 font-mono text-xs">
        <span className="text-[var(--text-secondary)]">
          Nível: <span className="text-[var(--accent)]">{level + 1}</span>
        </span>
        <span className="text-[var(--text-secondary)]">
          Score: <span className="text-[var(--accent)]">{score}</span>
        </span>
        <span className="text-[var(--text-secondary)]">
          Best: <span className="text-[var(--accent-alt)]">{highScore}</span>
        </span>
      </div>

      <div className="text-center mb-4">
        <p className="font-mono text-sm text-[var(--text-secondary)]">
          {phase === "showing" ? (
            <span className="text-[var(--accent)] animate-pulse">
              {showTimer}s restantes...
            </span>
          ) : (
            message
          )}
        </p>
      </div>

      <div className="flex justify-center">
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
          <AnimatePresence>
            {cells.map((cell) => (
              <motion.button
                key={cell.index}
                onClick={() => handleCellClick(cell.index)}
                disabled={phase !== "input"}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-lg border-2 transition-all duration-200 ${
                  cell.revealed
                    ? "bg-[var(--accent)]/30 border-[var(--accent)] shadow-[0_0_15px_var(--accent)]"
                    : cell.selected
                    ? cell.correct
                      ? "bg-[var(--success)]/20 border-[var(--success)]"
                      : "bg-[var(--error)]/20 border-[var(--error)]"
                    : phase === "input"
                    ? "bg-[var(--bg-primary)]/40 border-[var(--border)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/10 cursor-pointer"
                    : "bg-[var(--bg-primary)]/30 border-[var(--border)] opacity-60"
                }`}
                whileHover={phase === "input" ? { scale: 1.05 } : {}}
                whileTap={phase === "input" ? { scale: 0.95 } : {}}
              >
                {cell.selected && cell.correct && (
                  <span className="text-[var(--success)] text-sm">✓</span>
                )}
                {cell.selected && cell.correct === false && (
                  <span className="text-[var(--error)] text-sm">✗</span>
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {(phase === "idle" || phase === "result") && (
        <div className="text-center mt-4">
          <button
            onClick={startGame}
            className="px-6 py-2 rounded-lg font-mono text-sm text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/30 hover:bg-[var(--accent)]/20 transition-colors"
          >
            {phase === "result" ? "🔄 REINICIAR" : "🚀 INICIAR"}
          </button>
        </div>
      )}
    </div>
  );
}
