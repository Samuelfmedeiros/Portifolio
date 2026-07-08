"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Difficulty = 3 | 4 | 5 | 6;

interface CellState {
  index: number;
  isTarget: boolean;
  revealed: boolean;
  selected: boolean;
  correct: boolean | null;
}

interface ComboState {
  count: number;
  maxCombo: number;
  multiplier: number;
  justMilestone: boolean;
}

// ── Haptic feedback ────────────────────────────────────────────────────────

function haptic(pattern: number | number[]) {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch {
    // noop
  }
}

// ── Sound System (Web Audio API) ───────────────────────────────────────────

function createAudioContext(): AudioContext | null {
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch {
    return null;
  }
}

function playTone(
  ctx: AudioContext | null,
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.15
) {
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Silently fail — audio is non-critical
  }
}

function playCorrect(ctx: AudioContext | null, comboCount: number) {
  // Ascending pitch based on combo
  const baseFreq = 523 + comboCount * 30; // C5 + combo
  playTone(ctx, Math.min(baseFreq, 1200), 0.15, "sine", 0.12);
}

function playWrong(ctx: AudioContext | null) {
  playTone(ctx, 200, 0.3, "sawtooth", 0.08);
}

function playComboMilestone(ctx: AudioContext | null, combo: number) {
  // Arpeggio: 3 ascending notes
  const base = 440;
  setTimeout(() => playTone(ctx, base, 0.1, "sine", 0.1), 0);
  setTimeout(() => playTone(ctx, base * 1.25, 0.1, "sine", 0.1), 80);
  setTimeout(() => playTone(ctx, base * 1.5 + combo * 10, 0.15, "sine", 0.12), 160);
}

function playLevelComplete(ctx: AudioContext | null) {
  // Victory arpeggio
  const notes = [523, 659, 784, 1047];
  notes.forEach((f, i) => {
    setTimeout(() => playTone(ctx, f, 0.2, "sine", 0.12), i * 100);
  });
}

function playGameOver(ctx: AudioContext | null) {
  // Descending sad tone
  playTone(ctx, 400, 0.2, "triangle", 0.1);
  setTimeout(() => playTone(ctx, 300, 0.3, "triangle", 0.1), 200);
  setTimeout(() => playTone(ctx, 200, 0.5, "triangle", 0.08), 450);
}

function playWaveReveal(ctx: AudioContext | null) {
  playTone(ctx, 800, 0.05, "sine", 0.05);
}

// ─── localStorage helpers ───────────────────────────────────────────────────

const LS_PREFIX = "mm_";
const LS_HIGH_SCORE = `${LS_PREFIX}highScore`;
const LS_SOUND = `${LS_PREFIX}sound`;

function loadHighScore(): number {
  if (typeof window === "undefined") return 0;
  try {
    return parseInt(localStorage.getItem(LS_HIGH_SCORE) ?? "0", 10) || 0;
  } catch {
    return 0;
  }
}
function saveHighScore(score: number) {
  try {
    localStorage.setItem(LS_HIGH_SCORE, String(score));
  } catch {
    /* noop */
  }
}

function loadSoundPref(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const v = localStorage.getItem(LS_SOUND);
    return v === null ? true : v === "true";
  } catch {
    return true;
  }
}
function saveSoundPref(enabled: boolean) {
  try {
    localStorage.setItem(LS_SOUND, String(enabled));
  } catch {
    /* noop */
  }
}

// ─── Wave delay helper ──────────────────────────────────────────────────────

function getWaveDelay(index: number, gridSize: number): number {
  const row = Math.floor(index / gridSize);
  const col = index % gridSize;
  // Diagonal wave: row + col gives a diagonal scan
  return (row + col) * 0.06;
}

// ─── Combo threshold ────────────────────────────────────────────────────────

const COMBO_MILESTONES = [3, 5, 8, 12, 16, 20, 25, 30];

function getComboMultiplier(combo: number): number {
  if (combo >= 15) return 3.0;
  if (combo >= 10) return 2.5;
  if (combo >= 6) return 2.0;
  if (combo >= 3) return 1.5;
  return 1.0;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function MemoryMatrix() {
  const [gridSize, setGridSize] = useState<Difficulty>(3);
  const [cells, setCells] = useState<CellState[]>([]);
  const [targets, setTargets] = useState<number[]>([]);
  const [phase, setPhase] = useState<"showing" | "input" | "result" | "idle">("idle");
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(loadHighScore);
  const [message, setMessage] = useState("Pressione INICIAR para jogar");
  const [showTimer, setShowTimer] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(loadSoundPref);
  const [combo, setCombo] = useState<ComboState>({
    count: 0,
    maxCombo: 0,
    multiplier: 1,
    justMilestone: false,
  });

  const audioCtx = useRef<AudioContext | null>(null);

  // Lazy-init AudioContext on first user interaction
  const ensureAudio = useCallback(() => {
    if (!audioCtx.current) {
      audioCtx.current = createAudioContext();
    }
  }, []);

  const totalCells = gridSize * gridSize;
  const targetCount = Math.min(gridSize + level, totalCells - 1);

  // ── Persist high score ─────────────────────────────────────────────────
  useEffect(() => {
    saveHighScore(highScore);
  }, [highScore]);

  useEffect(() => {
    saveSoundPref(soundEnabled);
  }, [soundEnabled]);

  // ── Prevent double-tap zoom on mobile ─────────────────────────────────
  useEffect(() => {
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    let lastTouchEnd = 0;
    const preventDoubleTap = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) e.preventDefault();
      lastTouchEnd = now;
    };
    document.addEventListener('touchstart', preventZoom, { passive: false });
    document.addEventListener('touchend', preventDoubleTap, { passive: false });
    return () => {
      document.removeEventListener('touchstart', preventZoom);
      document.removeEventListener('touchend', preventDoubleTap);
    };
  }, []);

  // ── Sound wrapper ──────────────────────────────────────────────────────
  const sound = useCallback(
    (fn: (ctx: AudioContext | null) => void) => {
      if (!soundEnabled) return;
      fn(audioCtx.current);
    },
    [soundEnabled]
  );

  // ── Grid generation ────────────────────────────────────────────────────
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

  // ── Show / reveal phase ────────────────────────────────────────────────
  const showPhase = useCallback(() => {
    const { cells: newCells, targets: newTargets } = generateGrid();
    setCells(newCells);
    setTargets(newTargets);
    setPhase("showing");
    setMessage("Memorize as células destacadas...");

    // Staggered reveal — cells become visible in a diagonal wave
    newCells.forEach((c) => {
      if (c.isTarget) {
        const delay = getWaveDelay(c.index, gridSize);
        setTimeout(() => {
          setCells((prev) =>
            prev.map((pc) =>
              pc.index === c.index ? { ...pc, revealed: true } : pc
            )
          );
          sound(playWaveReveal);
        }, delay * 1000);
      }
    });

    const showDuration = Math.max(800, 3000 - level * 200);
    setShowTimer(Math.ceil(showDuration / 1000));

    // Hide after duration
    setTimeout(() => {
      setCells((prev) => prev.map((c) => ({ ...c, revealed: false })));
      setPhase("input");
      setMessage("Selecione as células que estavam destacadas!");
    }, showDuration);
  }, [generateGrid, gridSize, level, sound]);

  // ── Timer display (countdown) ─────────────────────────────────────────
  useEffect(() => {
    if (phase !== "showing") return;
    const interval = setInterval(() => {
      setShowTimer((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // ── Start game ─────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    ensureAudio();
    haptic(15);
    setGridSize(3);
    setLevel(0);
    setScore(0);
    setCombo({ count: 0, maxCombo: 0, multiplier: 1, justMilestone: false });
    setMessage("Nível 1 — Memorize!");
    showPhase();
  }, [showPhase, ensureAudio]);

  // ── Handle cell click ──────────────────────────────────────────────────
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
        const newComboCount = combo.count + 1;
        const multiplier = getComboMultiplier(newComboCount);
        const points = Math.round(10 * multiplier);
        const isMilestone = COMBO_MILESTONES.includes(newComboCount);

        haptic(8);
        setCombo({
          count: newComboCount,
          maxCombo: Math.max(combo.maxCombo, newComboCount),
          multiplier,
          justMilestone: isMilestone,
        });

        setScore((s) => s + points);

        if (isMilestone) {
          sound((ctx) => playComboMilestone(ctx, newComboCount));
        } else {
          sound((ctx) => playCorrect(ctx, newComboCount));
        }

        // Check if all targets found
        const newCorrectSelected =
          cells.filter((c) => c.selected && c.correct).length + 1;

        if (newCorrectSelected === targetCount) {
          // Level complete!
          setPhase("result");
          const bonus = combo.maxCombo * 5;
          setMessage(
            `🎯 NÍVEL COMPLETO! Streak: ${combo.maxCombo}x | Bônus: +${bonus}`
          );
          setScore((s) => s + 50 + bonus);
          setHighScore((h) => Math.max(h, score + 50 + bonus));
          haptic(20);
          sound(playLevelComplete);

          setTimeout(() => {
            const nextLevel = level + 1;
            setLevel(nextLevel);
            // Grow grid every 3 levels, up to 6
            if (nextLevel % 3 === 0 && gridSize < 6) {
              setGridSize((g) => Math.min(6, g + 1) as Difficulty);
            }
            setCombo({ count: 0, maxCombo: 0, multiplier: 1, justMilestone: false });
            setMessage(`Nível ${nextLevel + 1} — Memorize!`);
            showPhase();
          }, 2000);
        }
      } else {
        // Wrong pick
        haptic([15, 10, 25]);
        sound(playWrong);
        setCombo((prev) => ({
          ...prev,
          count: 0,
          multiplier: 1,
          justMilestone: false,
        }));

        // Too many wrong — game over after 2 errors
        const selectedCount = cells.filter((c) => c.selected).length + 1;
        const correctCount = cells.filter((c) => c.selected && c.correct).length;

        if (selectedCount - correctCount >= 2) {
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
          sound(playGameOver);
        }
      }
    },
    [phase, cells, targets, targetCount, level, gridSize, score, combo, showPhase, sound]
  );

  // ── Cell size ─────────────────────────────────────────────────────────
  const cellSize = gridSize <= 4
    ? "w-[52px] h-[52px] md:w-14 md:h-14"
    : "w-12 h-12 md:w-[52px] md:h-[52px]";

  // ── Combo badge color ─────────────────────────────────────────────────
  const comboColor =
    combo.multiplier >= 3
      ? "text-purple-400 border-purple-500/40 bg-purple-500/15"
      : combo.multiplier >= 2
      ? "text-orange-400 border-orange-500/40 bg-orange-500/15"
      : combo.multiplier > 1
      ? "text-yellow-400 border-yellow-500/40 bg-yellow-500/15"
      : "text-[var(--accent)]";

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="py-2 select-none touch-action-manipulation" style={{ WebkitTapHighlightColor: 'transparent' }}>
      {/* Header */}
      <h3 className="font-mono text-sm text-[var(--accent)] mb-4 text-center">
        🧠 MEMORY MATRIX
      </h3>

      {/* Info bar */}
      <div className="flex justify-between items-center mb-3 px-2 font-mono text-xs">
        <span className="text-[var(--text-secondary)]">
          Nível: <span className="text-[var(--accent)]">{level + 1}</span>
        </span>
        <span className="text-[var(--text-secondary)]">
          Grid: <span className="text-[var(--accent-alt)]">{gridSize}×{gridSize}</span>
        </span>
        <span className="text-[var(--text-secondary)]">
          Score: <span className="text-[var(--accent)]">{score}</span>
        </span>
        <span className="text-[var(--text-secondary)]">
          Best: <span className="text-[var(--accent-alt)]">{highScore}</span>
        </span>
      </div>

      {/* Message / Timer */}
      <div className="text-center mb-3">
        <p className="font-mono text-sm text-[var(--text-secondary)]">
          {phase === "showing" ? (
            <span className="text-[var(--accent)] animate-pulse">
              ⏳ {showTimer}s restantes...
            </span>
          ) : (
            message
          )}
        </p>
      </div>

      {/* Combo display */}
      <AnimatePresence>
        {combo.count >= 2 && phase === "input" && (
          <motion.div
            key="combo-badge"
            initial={{ scale: 0.5, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: -10 }}
            className={`text-center mb-3`}
          >
            <span
              className={`inline-block px-3 py-1 rounded-full font-mono text-sm
                border ${comboColor} transition-colors duration-300`}
            >
              🔥 Streak {combo.count}x
              {combo.multiplier > 1 && (
                <span className="ml-1">(×{combo.multiplier.toFixed(1)})</span>
              )}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cell size adjusts for larger grids */}
      <div className="flex justify-center touch-action-manipulation">
        <div
          className="grid gap-1.5 sm:gap-2"
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
          <AnimatePresence mode="popLayout">
            {cells.map((cell) => {
              const delay =
                phase === "showing" && cell.isTarget
                  ? getWaveDelay(cell.index, gridSize)
                  : 0;

              return (
                <motion.button
                  key={cell.index}
                  onClick={() => handleCellClick(cell.index)}
                  disabled={phase !== "input"}
                  layout
                  initial={
                    phase === "showing" && cell.isTarget
                      ? { scale: 0, opacity: 0 }
                      : false
                  }
                  animate={{
                    scale: 1,
                    opacity: 1,
                    backgroundColor:
                      cell.revealed
                        ? "var(--accent)"
                        : cell.selected
                        ? cell.correct
                          ? "var(--success)"
                          : "var(--error)"
                        : phase === "input"
                        ? "var(--bg-primary)"
                        : "var(--bg-primary)",
                    transition: {
                      delay,
                      duration: 0.2,
                      ease: "easeOut",
                    },
                  }}
                  whileHover={phase === "input" ? { scale: 1.08 } : {}}
                  whileTap={phase === "input" ? { scale: 0.92 } : {}}
                  className={`${cellSize} rounded-lg border-2 transition-colors duration-150 touch-action-manipulation select-none
                    ${
                      cell.revealed
                        ? "border-[var(--accent)] shadow-[0_0_12px_var(--accent)]"
                        : cell.selected
                        ? cell.correct
                          ? "border-[var(--success)]"
                          : "border-[var(--error)]"
                        : phase === "input"
                        ? "border-[var(--border)] hover:border-[var(--accent)]/50 cursor-pointer"
                        : "border-[var(--border)] opacity-50"
                    }
                    ${
                      cell.selected && cell.correct
                        ? "shadow-[0_0_8px_var(--success)]"
                        : ""
                    }
                    ${
                      cell.selected && cell.correct === false
                        ? "shadow-[0_0_8px_var(--error)]"
                        : ""
                    }
                  `}
                  style={{
                    ...(cell.revealed
                      ? { backgroundColor: "var(--accent)" }
                      : {}),
                    opacity: cell.selected && cell.correct === false ? 0.7 : 1,
                  }}
                  aria-label={`Célula ${cell.index + 1}${
                    cell.isTarget ? " (alvo)" : ""
                  }`}
                >
                  {cell.selected && cell.correct && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-white text-sm font-bold"
                    >
                      ✓
                    </motion.span>
                  )}
                  {cell.selected && cell.correct === false && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-white text-sm font-bold"
                    >
                      ✗
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-3 mt-4">
        {(phase === "idle" || phase === "result") && (
          <button
            onClick={startGame}
            className="px-6 py-2 rounded-lg font-mono text-sm text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/30 hover:bg-[var(--accent)]/20 transition-colors"
          >
            {phase === "result" ? "🔄 REINICIAR" : "🚀 INICIAR"}
          </button>
        )}

        {/* Sound toggle */}
        <button
          onClick={() => {
            if (soundEnabled) {
              setSoundEnabled(false);
            } else {
              ensureAudio();
              setSoundEnabled(true);
            }
          }}
          className="px-3 py-2 rounded-lg font-mono text-xs border border-[var(--border)] hover:border-[var(--accent)]/50 transition-colors"
          aria-label={soundEnabled ? "Desativar som" : "Ativar som"}
          title={soundEnabled ? "Som ativado" : "Som desativado"}
        >
          {soundEnabled ? "🔊" : "🔇"}
        </button>
      </div>
    </div>
  );
}
