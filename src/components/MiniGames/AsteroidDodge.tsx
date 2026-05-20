"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Asteroid {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  rotation: number;
}

export function AsteroidDodge() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [playerX, setPlayerX] = useState(50);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const gameRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const lastSpawnRef = useRef(0);
  const scoreRef = useRef(0);

  const spawnAsteroid = useCallback(() => {
    const newAsteroid: Asteroid = {
      id: Date.now() + Math.random(),
      x: Math.random() * 90 + 5,
      y: -5,
      size: Math.random() * 20 + 15,
      speed: Math.random() * 2 + 1.5 + scoreRef.current * 0.02,
      rotation: Math.random() * 360,
    };
    setAsteroids((prev) => [...prev, newAsteroid]);
  }, []);

  const checkCollision = useCallback(
    (asteroid: Asteroid, px: number) => {
      const playerLeft = px - 4;
      const playerRight = px + 4;
      const asteroidLeft = asteroid.x - asteroid.size / 10;
      const asteroidRight = asteroid.x + asteroid.size / 10;
      const playerBottom = 90;
      const playerTop = 85;
      const asteroidBottom = asteroid.y + asteroid.size / 10;
      const asteroidTop = asteroid.y - asteroid.size / 10;

      return (
        playerRight > asteroidLeft &&
        playerLeft < asteroidRight &&
        playerTop < asteroidBottom &&
        playerBottom > asteroidTop
      );
    },
    []
  );

  useEffect(() => {
    if (!started || gameOver) return;

    let lastTime = performance.now();
    const gameLoop = (time: number) => {
      const delta = (time - lastTime) / 16;
      lastTime = time;

      // Spawn asteroids
      if (time - lastSpawnRef.current > Math.max(400, 1000 - scoreRef.current * 20)) {
        spawnAsteroid();
        lastSpawnRef.current = time;
      }

      // Update score
      setScore((s) => {
        const newScore = s + Math.round(delta);
        scoreRef.current = newScore;
        return newScore;
      });

      // Move asteroids
      setAsteroids((prev) => {
        const updated = prev
          .map((a) => ({ ...a, y: a.y + a.speed * delta }))
          .filter((a) => {
            if (a.y > 105) return false;
            return true;
          });

        // Check collisions
        for (const a of updated) {
          if (checkCollision(a, playerX)) {
            setGameOver(true);
            setHighScore((h) => Math.max(h, scoreRef.current));
            return updated;
          }
        }

        return updated;
      });

      animRef.current = requestAnimationFrame(gameLoop);
    };

    animRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animRef.current);
  }, [started, gameOver, playerX, spawnAsteroid, checkCollision]);

  const startGame = useCallback(() => {
    setAsteroids([]);
    setScore(0);
    setGameOver(false);
    setStarted(true);
    scoreRef.current = 0;
    lastSpawnRef.current = performance.now();
  }, []);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameRef.current || gameOver) return;
    const rect = gameRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setPlayerX(Math.max(5, Math.min(95, x)));
  };

  const handleTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!gameRef.current || gameOver) return;
    const rect = gameRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    setPlayerX(Math.max(5, Math.min(95, x)));
  };

  return (
    <div className="py-2">
      <h3 className="font-mono text-sm text-[var(--accent)] mb-4 text-center">
        🚀 ASTEROID DODGE
      </h3>

      <div className="flex justify-between items-center mb-3 px-2">
        <p className="font-mono text-xs text-[var(--text-secondary)]">
          Score: <span className="text-[var(--accent)]">{score}</span>
        </p>
        <p className="font-mono text-xs text-[var(--text-secondary)]">
          Best: <span className="text-[var(--accent-alt)]">{highScore}</span>
        </p>
      </div>

      <div
        ref={gameRef}
        onClick={handleContainerClick}
        onTouchMove={handleTouch}
        className="relative w-full h-48 rounded-lg overflow-hidden bg-[var(--bg-primary)]/50 border border-[var(--border)] cursor-crosshair select-none"
      >
        {/* Stars background */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 rounded-full bg-[var(--accent)]/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Player ship */}
        <motion.div
          className="absolute bottom-2 text-lg"
          style={{ left: `${playerX}%`, transform: "translateX(-50%)" }}
          animate={{ scale: gameOver ? [1, 1.5, 0] : 1 }}
          transition={{ duration: 0.3 }}
        >
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

        {/* Overlay */}
        {(!started || gameOver) && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-primary)]/70 backdrop-blur-sm">
            <div className="text-center">
              {gameOver && (
                <p className="font-mono text-sm text-[var(--error)] mb-2">
                  💥 GAME OVER! Score: {score}
                </p>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startGame();
                }}
                className="px-6 py-2 rounded-lg font-mono text-sm text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/30 hover:bg-[var(--accent)]/20 transition-colors"
              >
                {started ? "🔄 REINICIAR" : "🚀 INICIAR"}
              </button>
              {!started && (
                <p className="font-mono text-[10px] text-[var(--text-secondary)] mt-2">
                  Clique/toque para mover a nave
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
