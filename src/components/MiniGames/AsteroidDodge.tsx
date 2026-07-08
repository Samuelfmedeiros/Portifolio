"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Helpers ────────────────────────────────────────────────────────
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ── Sound engine (Web Audio API) ───────────────────────────────── */
const POWER_UP_DURATION = 5000; // ms

function createAudio() {
  let ctx: AudioContext | null = null;

  const getCtx = () => {
    if (!ctx) ctx = new AudioContext();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  };

  const play = (freq: number, duration: number, type: OscillatorType, volume = 0.12) => {
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, c.currentTime);
      gain.gain.setValueAtTime(volume, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
      osc.connect(gain).connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + duration);
    } catch {
      // audio not available – silent fallback
    }
  };

  return {
    collision: () => play(120, 0.35, "sawtooth", 0.15),
    powerUp: () => {
      try {
        const c = getCtx();
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(400, c.currentTime);
        osc.frequency.linearRampToValueAtTime(800, c.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25);
        osc.connect(gain).connect(c.destination);
        osc.start();
        osc.stop(c.currentTime + 0.25);
      } catch { /* noop */ }
    },
    gameOver: () => {
      try {
        const c = getCtx();
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(300, c.currentTime);
        osc.frequency.linearRampToValueAtTime(60, c.currentTime + 0.6);
        gain.gain.setValueAtTime(0.12, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.6);
        osc.connect(gain).connect(c.destination);
        osc.start();
        osc.stop(c.currentTime + 0.6);
      } catch { /* noop */ }
    },
    milestone: () => play(660, 0.12, "sine", 0.08),
  };
}

/* ── Types ────────────────────────────────────────────────────────── */
interface Asteroid {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  rotation: number;
}

interface TrailPoint {
  x: number;
  opacity: number;
}

type PowerType = "shield" | "slowmo" | "2x";

interface PowerUp {
  id: number;
  x: number;
  y: number;
  type: PowerType;
  size: number;
  speed: number;
}

const POWER_UP_TYPES: PowerType[] = ["shield", "slowmo", "2x"];
const POWER_UP_ICON: Record<PowerType, string> = {
  shield: "🛡️",
  slowmo: "⏱️",
  "2x": "⭐",
};
const POWER_UP_COLOR: Record<PowerType, string> = {
  shield: "var(--accent-alt)",
  slowmo: "#60a5fa",
  "2x": "#fbbf24",
};

/* ── Reducer-style power-up expiry timer ─────────────────────────── */
// Instead of comparing Date.now() during render, we store booleans
// in state and schedule timeouts to clear them.

/* ── Component ───────────────────────────────────────────────────── */
export function AsteroidDodge() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [playerX, setPlayerX] = useState(50);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  // High score: lazy init from localStorage (avoids setState in effect)
  const [highScore, setHighScore] = useState(() => {
    try {
      const saved = localStorage.getItem("asteroid-dodge-highscore");
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);

  // Boolean state for render — avoids Date.now() in render path.
  // Actual expiry timestamps live in a ref for the game loop.
  const [shieldActive, setShieldActive] = useState(false);
  const [slowMoActive, setSlowMoActive] = useState(false);
  const [x2Active, setX2Active] = useState(false);
  const [shieldFlash, setShieldFlash] = useState(false);
  const [comboCount, setComboCount] = useState(0);

  /* ── Refs ──────────────────────────────────────────────────────── */
  const gameRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const lastSpawnRef = useRef(0);
  const lastPowerUpRef = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const playerXRef = useRef(50);
  const startedRef = useRef(false);
  const gameOverRef = useRef(false);
  // Expiry timestamps for game loop (refs avoid set-state-in-effect issues)
  const shieldExpiry = useRef(0);
  const slowMoExpiry = useRef(0);
  const x2Expiry = useRef(0);
  const keysRef = useRef<Set<string>>(new Set());
  const audioRef = useRef(createAudio());

  // ── Touch joystick ──────────────────────────────────────────────
  const touchLeftRef = useRef(false);
  const touchRightRef = useRef(false);
  const joystickRef = useRef<HTMLDivElement>(null);
  // larger collision margin for touch friendliness
  const COLLISION_MARGIN = 8;

  // keep value-refs in sync (effect, not render — React 19 strict-mode compliant)
  useEffect(() => {
    scoreRef.current = score;
    livesRef.current = lives;
    playerXRef.current = playerX;
    startedRef.current = started;
    gameOverRef.current = gameOver;
  });

  /* ── Persist high score ────────────────────────────────────────── */
  useEffect(() => {
    if (highScore > 0) {
      try {
        localStorage.setItem("asteroid-dodge-highscore", String(highScore));
      } catch { /* noop */ }
    }
  }, [highScore]);

  /* ── Stars (static background) ────────────────────────────────── */
  const stars = useMemo(() => {
    const rand = seededRandom(42);
    return Array.from({ length: 20 }, () => ({
      left: rand() * 100,
      top: rand() * 100,
    }));
  }, []);

  /* ── Collision check ──────────────────────────────────────────── */
  const checkCollision = useCallback((asteroid: Asteroid, px: number) => {
    const margin = COLLISION_MARGIN;
    return (
      px + margin > asteroid.x - asteroid.size / 10 &&
      px - margin < asteroid.x + asteroid.size / 10 &&
      90 > asteroid.y - asteroid.size / 10 &&
      85 < asteroid.y + asteroid.size / 10
    );
  }, []);

  /* ── Power-up collision check ─────────────────────────────────── */
  const checkPowerUpCollision = useCallback((pu: PowerUp, px: number) => {
    return (
      Math.abs(px - pu.x) < 6 &&
      pu.y > 82 &&
      pu.y < 95
    );
  }, []);

  /* ── Spawn helpers ────────────────────────────────────────────── */
  const spawnAsteroid = useCallback(() => {
    const a: Asteroid = {
      id: Date.now() + Math.random(),
      x: Math.random() * 90 + 5,
      y: -5,
      size: Math.random() * 20 + 15,
      speed: Math.random() * 2 + 1.5 + scoreRef.current * 0.02,
      rotation: Math.random() * 360,
    };
    setAsteroids((prev) => [...prev, a]);
  }, []);

  const spawnPowerUp = useCallback(() => {
    const type = POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)];
    const pu: PowerUp = {
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 10,
      y: -5,
      type,
      size: 18,
      speed: 0.8,
    };
    setPowerUps((prev) => [...prev, pu]);
  }, []);

  /* ── Activate a power-up (sets boolean + schedules auto-clear) ── */
  const activatePowerUp = useCallback((type: PowerType) => {
    const now = Date.now();
    audioRef.current.powerUp();
    setComboCount((c) => c + 1);

    if (type === "shield") {
      shieldExpiry.current = now + POWER_UP_DURATION;
      setShieldActive(true);
      setTimeout(() => {
        shieldExpiry.current = 0;
        setShieldActive(false);
      }, POWER_UP_DURATION);
    } else if (type === "slowmo") {
      slowMoExpiry.current = now + POWER_UP_DURATION;
      setSlowMoActive(true);
      setTimeout(() => {
        slowMoExpiry.current = 0;
        setSlowMoActive(false);
      }, POWER_UP_DURATION);
    } else if (type === "2x") {
      x2Expiry.current = now + POWER_UP_DURATION;
      setX2Active(true);
      setTimeout(() => {
        x2Expiry.current = 0;
        setX2Active(false);
      }, POWER_UP_DURATION);
    }
  }, []);

  /* ── Keyboard ─────────────────────────────────────────────────── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (gameOverRef.current || !startedRef.current) {
          const btn = gameRef.current?.querySelector("button");
          btn?.click();
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  /* ── Game loop ────────────────────────────────────────────────── */
  useEffect(() => {
    if (!started || gameOver) return;

    let lastTime = performance.now();

    const gameLoop = (time: number) => {
      const delta = (time - lastTime) / 16;
      lastTime = time;

      const now = Date.now();
      const hasSlowMo = slowMoExpiry.current > now;
      const has2x = x2Expiry.current > now;
      const speedMultiplier = hasSlowMo ? 0.45 : 1;

      // Spawn asteroids
      if (time - lastSpawnRef.current > Math.max(350, 900 - scoreRef.current * 18)) {
        spawnAsteroid();
        lastSpawnRef.current = time;
      }

      // Spawn power-ups (every 3.5-5.5s)
      if (time - lastPowerUpRef.current > 3500 + Math.random() * 2000) {
        spawnPowerUp();
        lastPowerUpRef.current = time;
      }

      // Score
      const pointsGain = Math.round(delta * (has2x ? 2 : 1));
      const newScore = scoreRef.current + pointsGain;
      const prevMilestone = Math.floor(scoreRef.current / 500);
      const newMilestone = Math.floor(newScore / 500);
      if (newMilestone > prevMilestone && newMilestone > 0) {
        audioRef.current.milestone();
      }
      scoreRef.current = newScore;
      setScore(newScore);

      // Keyboard input
      const keys = keysRef.current;
      const moveSpeed = 3;
      if (keys.has("ArrowLeft") || keys.has("a") || keys.has("A")) {
        setPlayerX((p) => Math.max(5, p - moveSpeed));
      }
      if (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) {
        setPlayerX((p) => Math.min(95, p + moveSpeed));
      }

      // Touch joystick input (mobile)
      const touchSpeed = 4;
      if (touchLeftRef.current) {
        setPlayerX((p) => Math.max(5, p - touchSpeed));
      }
      if (touchRightRef.current) {
        setPlayerX((p) => Math.min(95, p + touchSpeed));
      }

      // Move asteroids
      setAsteroids((prev) => {
        const updated = prev
          .map((a) => ({ ...a, y: a.y + a.speed * speedMultiplier * delta }))
          .filter((a) => a.y <= 105);

        for (const a of updated) {
          if (checkCollision(a, playerXRef.current)) {
            // Shield absorbs hit
            if (shieldExpiry.current > now) {
              shieldExpiry.current = 0;
              setShieldActive(false);
              setShieldFlash(true);
              setTimeout(() => setShieldFlash(false), 300);
              return updated.filter((x) => x.id !== a.id);
            }

            // Lose a life
            const newLives = livesRef.current - 1;
            livesRef.current = newLives;
            setLives(newLives);
            setComboCount(0);
            audioRef.current.collision();

            if (newLives <= 0) {
              setGameOver(true);
              setHighScore((h) => Math.max(h, scoreRef.current));
              audioRef.current.gameOver();
              return updated;
            }
            // Respawn at center after hit
            setPlayerX(50);
            return updated.filter((x) => x.id !== a.id);
          }
        }
        return updated;
      });

      // Move power-ups
      setPowerUps((prev) => {
        return prev
          .map((p) => ({ ...p, y: p.y + p.speed * delta }))
          .filter((p) => {
            if (p.y > 105) return false;
            if (checkPowerUpCollision(p, playerXRef.current)) {
              activatePowerUp(p.type);
              return false;
            }
            return true;
          });
      });

      // Engine trail
      setTrail((prev) => {
        const newTrail = [...prev, { x: playerXRef.current, opacity: 1 }];
        if (newTrail.length > 18) newTrail.splice(0, newTrail.length - 18);
        return newTrail.map((t) => ({ ...t, opacity: t.opacity - 0.06 })).filter((t) => t.opacity > 0);
      });

      animRef.current = requestAnimationFrame(gameLoop);
    };

    animRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animRef.current);
  }, [started, gameOver, spawnAsteroid, spawnPowerUp, checkCollision, checkPowerUpCollision, activatePowerUp]);

  /* ── Start / Restart ──────────────────────────────────────────── */
  const startGame = useCallback(() => {
    setAsteroids([]);
    setPowerUps([]);
    setScore(0);
    scoreRef.current = 0;
    setLives(3);
    livesRef.current = 3;
    setGameOver(false);
    setStarted(true);
    setTrail([]);
    setComboCount(0);
    setShieldFlash(false);
    setShieldActive(false);
    setSlowMoActive(false);
    setX2Active(false);
    shieldExpiry.current = 0;
    slowMoExpiry.current = 0;
    x2Expiry.current = 0;
    lastSpawnRef.current = performance.now();
    lastPowerUpRef.current = performance.now();
    setPlayerX(50);
  }, []);

  /* ── Mouse / Touch ────────────────────────────────────────────── */
  const updatePlayerFromPointer = (clientX: number) => {
    if (!gameRef.current || gameOverRef.current) return;
    const rect = gameRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPlayerX(Math.max(5, Math.min(95, x)));
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    updatePlayerFromPointer(e.clientX);
  };

  const handleTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    updatePlayerFromPointer(e.touches[0].clientX);
  };

  /* ── Joystick touch handlers ─────────────────────────────────── */
  const handleJoystickStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const mid = rect.width / 2;
    touchLeftRef.current = x < mid;
    touchRightRef.current = x >= mid;
  };

  const handleJoystickMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const mid = rect.width / 2;
    touchLeftRef.current = x < mid;
    touchRightRef.current = x >= mid;
  };

  const handleJoystickEnd = () => {
    touchLeftRef.current = false;
    touchRightRef.current = false;
  };

  /* ── Power-up icons for status bar ────────────────────────────── */
  const activePowerUpIcons = [
    shieldActive && "🛡️",
    slowMoActive && "⏱️",
    x2Active && "⭐",
  ].filter(Boolean);

  return (
    <div className="py-2">
      <h3 className="font-mono text-sm text-[var(--accent)] mb-4 text-center">
        🚀 ASTEROID DODGE
      </h3>

      {/* Status bar */}
      <div className="flex justify-between items-center mb-3 px-2">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[var(--text-secondary)]">
            Score: <span className="text-[var(--accent)]">{score}</span>
          </span>
          {activePowerUpIcons.length > 0 && (
            <span className="flex gap-1 text-sm">{activePowerUpIcons.join(" ")}</span>
          )}
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="flex gap-0.5">
            {Array.from({ length: 3 }, (_, i) => (
              <span
                key={i}
                className={i < lives ? "text-[var(--error)]" : "text-[var(--border)]"}
              >
                ❤️
              </span>
            ))}
          </span>
          <span className="text-[var(--text-secondary)]">
            Best: <span className="text-[var(--accent-alt)]">{highScore}</span>
          </span>
        </div>
      </div>

      {/* Game area */}
      <div
        ref={gameRef}
        onClick={handleContainerClick}
        onTouchMove={handleTouch}
        className={`relative w-full h-52 sm:h-64 lg:h-72 touch-none rounded-lg overflow-hidden bg-[var(--bg-primary)]/50 border border-[var(--border)] cursor-crosshair select-none ${
          slowMoActive ? "border-[#60a5fa]/50" : ""
        }`}
        tabIndex={0}
        role="application"
        aria-label="Asteroid Dodge game"
        style={shieldActive ? { boxShadow: "inset 0 0 30px rgba(250, 175, 50, 0.15)" } : undefined}
      >
        {/* Stars background */}
        <div className="absolute inset-0">
          {stars.map((star, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 rounded-full bg-[var(--accent)]/20"
              style={{ left: `${star.left}%`, top: `${star.top}%` }}
            />
          ))}
        </div>

        {/* SlowMo indicator */}
        {slowMoActive && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 font-mono text-[10px] text-[#60a5fa] animate-pulse">
            ⏱ SLOW MODE
          </div>
        )}

        {/* 2X Score indicator */}
        {x2Active && (
          <div className="absolute top-2 right-2 font-mono text-[10px] text-[#fbbf24] animate-pulse">
            ⭐ 2X SCORE
          </div>
        )}

        {/* Engine trail */}
        <div className="absolute inset-0 pointer-events-none">
          {trail.map((t, idx) => {
            const i = trail.length - 1 - idx;
            const size = 4 - (i / trail.length) * 3;
            return (
              <div
                key={idx}
                className="absolute bottom-2 rounded-full bg-[var(--accent)]"
                style={{
                  left: `${t.x}%`,
                  width: `${Math.max(2, size)}px`,
                  height: `${Math.max(2, size)}px`,
                  opacity: t.opacity * 0.6,
                  transform: "translateX(-50%)",
                }}
              />
            );
          })}
        </div>

        {/* Player ship */}
        <motion.div
          className={`absolute bottom-2 text-lg z-10 will-change-transform ${
            shieldFlash ? "brightness-200 scale-125" : ""
          }`}
          style={{ left: `${playerX}%`, transform: "translateX(-50%) translateZ(0)" }}
          animate={{ scale: gameOver ? [1, 1.5, 0] : 1 }}
          transition={{ duration: 0.3 }}
        >
          {shieldActive && (
            <div className="absolute inset-[-6px] rounded-full border-2 border-[var(--accent-alt)] animate-pulse opacity-60" />
          )}
          🛸
        </motion.div>

        {/* Asteroids */}
        <AnimatePresence>
          {asteroids.map((a) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute text-[var(--error)] font-bold"
              style={{
                left: `${a.x}%`,
                top: `${a.y}%`,
                fontSize: `${a.size}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              🪨
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Power-ups */}
        <AnimatePresence>
          {powerUps.map((p) => (
            <motion.div
              key={`pu-${p.id}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute font-bold flex items-center justify-center"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                fontSize: `${p.size}px`,
                transform: "translate(-50%, -50%)",
                filter: "drop-shadow(0 0 4px currentColor)",
                color: POWER_UP_COLOR[p.type],
              }}
            >
              {POWER_UP_ICON[p.type]}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Combo display */}
        {comboCount >= 2 && !gameOver && started && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 font-mono text-[var(--accent)] text-sm animate-bounce pointer-events-none">
            🔥 {comboCount}x COMBO
          </div>
        )}

        {/* ── Touch joystick (mobile) ─────────────────────────────── */}
        <div
          ref={joystickRef}
          onTouchStart={handleJoystickStart}
          onTouchMove={handleJoystickMove}
          onTouchEnd={handleJoystickEnd}
          onTouchCancel={handleJoystickEnd}
          className="absolute bottom-0 left-0 right-0 h-[72px] sm:hidden z-15 touch-none select-none"
          style={{ touchAction: 'none' }}
        >
          {/* Background zones */}
          <div className="absolute inset-0 flex">
            <div className="flex-1 flex items-center justify-start pl-6 bg-gradient-to-r from-white/[0.06] to-transparent">
              <span className="text-2xl text-white/50 pointer-events-none">◀</span>
            </div>
            <div className="flex-1 flex items-center justify-end pr-6 bg-gradient-to-l from-white/[0.06] to-transparent">
              <span className="text-2xl text-white/50 pointer-events-none">▶</span>
            </div>
          </div>
          {/* Divider line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-white/[0.04]" />
        </div>

        {/* Overlay */}
        {(!started || gameOver) && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-primary)]/70 backdrop-blur-sm z-20">
            <div className="text-center">
              {gameOver && (
                <div className="mb-2">
                  <p className="font-mono text-sm text-[var(--error)] mb-1">
                    💥 GAME OVER!
                  </p>
                  <p className="font-mono text-xs text-[var(--text-secondary)]">
                    Score: {score} {score >= highScore && score > 0 ? "🏆" : ""}
                  </p>
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startGame();
                  gameRef.current?.focus();
                }}
                className="px-6 py-2 rounded-lg font-mono text-sm text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/30 hover:bg-[var(--accent)]/20 transition-colors"
              >
                {started ? "🔄 REINICIAR" : "🚀 INICIAR"}
              </button>
              {!started && (
                <div className="mt-3 font-mono text-[10px] text-[var(--text-secondary)] space-y-1">
                  <p>🖱️ Clique/toque para mover a nave</p>
                  <p>⌨️ ← → ou A/D para mover</p>
                  <p>🛡️ Colete power-ups: 🛡️⏱️⭐</p>
                  <p>🏆 High score salvo!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
