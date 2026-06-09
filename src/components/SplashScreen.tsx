"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Starfield particles ───
interface Star {
  x: number;
  y: number;
  size: number;
  depth: number; // 0-1, closer = faster
  opacity: number;
}

function generateStars(count: number, w: number, h: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    size: Math.random() * 2.5 + 0.5,
    depth: Math.random(),
    opacity: Math.random() * 0.8 + 0.2,
  }));
}

// ─── Spaceship SVG ───
function SpaceshipSVG({ progress }: { progress: number }) {
  const engineGlow = Math.min(1, Math.max(0, (progress - 0.1) / 0.4));
  const warpGlow = Math.min(1, Math.max(0, (progress - 0.5) / 0.3));

  return (
    <svg
      width="120"
      height="60"
      viewBox="0 0 120 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]"
    >
      {/* Engine glow - outer */}
      <motion.ellipse
        cx="100"
        cy="30"
        rx={12 + engineGlow * 20}
        ry={6 + engineGlow * 10}
        fill="#06b6d4"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 0.3 + (1 - engineGlow) * 0.3, repeat: Infinity }}
        style={{ filter: "blur(8px)" }}
      />
      {/* Engine glow - inner */}
      <motion.ellipse
        cx="100"
        cy="30"
        rx={6 + engineGlow * 12}
        ry={3 + engineGlow * 6}
        fill="#22d3ee"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 0.2 + (1 - engineGlow) * 0.2, repeat: Infinity }}
        style={{ filter: "blur(4px)" }}
      />
      {/* Warp ring glow */}
      {warpGlow > 0 && (
        <motion.ellipse
          cx="60"
          cy="30"
          rx={50 * warpGlow}
          ry={15 * warpGlow}
          stroke="#6366f1"
          strokeWidth="1"
          fill="none"
          opacity={warpGlow * 0.4}
          style={{ filter: "blur(3px)" }}
        />
      )}
      {/* Ship body - main hull */}
      <motion.path
        d="M10 30 L30 10 L80 15 L105 28 L105 32 L80 45 L30 50 Z"
        fill="url(#shipGrad)"
        stroke="#06b6d4"
        strokeWidth="0.8"
      />
      {/* Ship body - top wing */}
      <motion.path
        d="M30 10 L50 2 L75 8 L80 15 L30 15 Z"
        fill="url(#wingGrad)"
        stroke="#06b6d4"
        strokeWidth="0.5"
        opacity={0.8}
      />
      {/* Ship body - bottom wing */}
      <motion.path
        d="M30 50 L50 58 L75 52 L80 45 L30 45 Z"
        fill="url(#wingGrad)"
        stroke="#06b6d4"
        strokeWidth="0.5"
        opacity={0.8}
      />
      {/* Cockpit */}
      <motion.ellipse
        cx="35"
        cy="30"
        rx="6"
        ry="8"
        fill="#020617"
        stroke="#22d3ee"
        strokeWidth="0.8"
      />
      <motion.ellipse
        cx="35"
        cy="30"
        rx="3"
        ry="5"
        fill="#06b6d4"
        opacity={0.3}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      {/* Cockpit glow */}
      <motion.circle
        cx="34"
        cy="28"
        r="1.5"
        fill="#22d3ee"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
      {/* Warp rings (concentric around ship when in hyperspace) */}
      {warpGlow > 0 && (
        <>
          <motion.ellipse
            cx="50"
            cy="30"
            rx={20 * warpGlow}
            ry={5 * warpGlow}
            stroke="#06b6d4"
            strokeWidth="0.5"
            fill="none"
            opacity={warpGlow * 0.3}
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: [1, 2], opacity: [warpGlow * 0.3, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
          <motion.ellipse
            cx="50"
            cy="30"
            rx={30 * warpGlow}
            ry={8 * warpGlow}
            stroke="#6366f1"
            strokeWidth="0.3"
            fill="none"
            opacity={warpGlow * 0.2}
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: [1, 1.5], opacity: [warpGlow * 0.2, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
          />
        </>
      )}
      {/* Gradients */}
      <defs>
        <linearGradient id="shipGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="40%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id="wingGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Speed streak ───
function SpeedStreak({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
      style={{ width: `${60 + Math.random() * 80}px`, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: 0.15 + Math.random() * 0.2 }}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{
        scaleX: [0, 1, 0],
        opacity: [0, 0.3, 0],
        x: [0, -200 * (0.5 + Math.random() * 0.5)],
      }}
      transition={{ duration: 0.8 + Math.random() * 0.5, repeat: Infinity, delay, ease: "linear" }}
    />
  );
}

// ─── Warp tunnel ring ───
function WarpTunnelRing({ index, progress }: { index: number; progress: number }) {
  const scale = 0.3 + index * 0.08;
  const opacity = (1 - index / 10) * progress * 0.15;
  return (
    <motion.div
      className="absolute rounded-full border border-cyan-400/20"
      style={{
        width: `${200 + index * 40}px`,
        height: `${100 + index * 20}px`,
        opacity,
        filter: "blur(1px)",
        perspective: "400px",
      }}
      initial={{ rotateX: 60, scale: 0.5, opacity: 0 }}
      animate={{
        scale: [0.5, 1.2],
        opacity: [0, opacity, 0],
      }}
      transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.12, ease: "linear" }}
    />
  );
}

// ─── MAIN ───
export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"stars" | "ship" | "accelerate" | "warp" | "transit">("stars");
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Container dimensions for stars
  const [dimensions, setDimensions] = useState({ w: 1200, h: 800 });

  // Parallax mouse position
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  // Stars
  const stars = useMemo(() => generateStars(120, dimensions.w, dimensions.h), [dimensions.w, dimensions.h]);

  // Animation sequence
  useEffect(() => {
    // Phase timings (total ~7s)
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setPhase("ship"), 1200));      // 1.2s: ship appears
    timers.push(setTimeout(() => setPhase("accelerate"), 2800)); // 2.8s: accelerating
    timers.push(setTimeout(() => setPhase("warp"), 4200));       // 4.2s: hyperspace
    timers.push(setTimeout(() => setPhase("transit"), 5800));    // 5.8s: transition
    timers.push(setTimeout(() => onCompleteRef.current(), 7000)); // 7.0s: done

    return () => timers.forEach(clearTimeout);
  }, []);

  // Smooth progress for animations and parallax
  useEffect(() => {
    let frame: number;
    let start = performance.now();
    const animate = (now: number) => {
      const elapsed = (now - start) / 1000;
      setProgress(Math.min(1, elapsed / 7));
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Update dimensions
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setDimensions({ w: containerRef.current.offsetWidth, h: containerRef.current.offsetHeight });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Mouse parallax
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseRef.current = {
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        };
      }
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const isWarp = phase === "warp" || phase === "transit";
  const parallaxX = (mouseRef.current.x - 0.5) * 20;
  const parallaxY = (mouseRef.current.y - 0.5) * 20;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[9999] bg-[#020617] overflow-hidden cursor-none"
    >
      {/* Stars layer */}
      <div className="absolute inset-0" style={{ transform: `translate(${parallaxX * 0.1}px, ${parallaxY * 0.1}px)` }}>
        <AnimatePresence>
          {stars.map((star, i) => {
            const starSpeed = 1 + star.depth * 3;
            const isMoving = phase !== "stars";
            const warpSpeed = isWarp ? 8 : 1;

            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: star.x,
                  top: star.y,
                  width: star.size,
                  height: star.size,
                  backgroundColor: star.depth > 0.7 ? "#6366f1" : star.depth > 0.3 ? "#06b6d4" : "#94a3b8",
                  boxShadow: star.depth > 0.6 ? "0 0 3px rgba(6,182,212,0.3)" : "none",
                }}
                animate={
                  isMoving
                    ? {
                        y: star.y + 200 * starSpeed * warpSpeed * progress,
                        opacity: isWarp ? [star.opacity, star.opacity * 3, 0] : star.opacity,
                        scaleX: isWarp ? [1, 1 + star.depth * 4] : 1,
                      }
                    : { opacity: [0, star.opacity], scale: [0, 1] }
                }
                transition={
                  isMoving
                    ? { duration: 2 / (starSpeed * warpSpeed), repeat: Infinity, ease: "linear" }
                    : { duration: 0.5 + star.depth * 0.8, delay: star.depth * 0.3 }
                }
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Speed streaks (warp phase) */}
      {isWarp && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <SpeedStreak key={i} delay={i * 0.1} />
          ))}
        </div>
      )}

      {/* Warp tunnel rings */}
      {isWarp && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ perspective: "600px" }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <WarpTunnelRing key={i} index={i} progress={Math.min(1, (progress - 0.6) / 0.3)} />
          ))}
        </div>
      )}

      {/* Spaceship */}
      <motion.div
        className="absolute z-10"
        animate={
          phase === "stars"
            ? { x: "-30%", y: 0, opacity: 0, scale: 0.6 }
            : phase === "ship"
              ? { x: "calc(50vw - 60px)", y: "calc(50vh - 30px)", opacity: 1, scale: 1 }
              : phase === "accelerate"
                ? { x: "calc(50vw - 60px)", y: "calc(50vh - 30px)", scale: 1.1 }
                : phase === "warp"
                  ? { x: "calc(50vw - 60px)", y: "calc(50vh - 30px)", scale: [1.1, 1.3, 0.8] }
                  : { x: "calc(50vw - 60px)", y: "calc(50vh - 30px)", scale: 0.3, opacity: 0 }
        }
        transition={
          phase === "ship"
            ? { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
            : phase === "warp"
              ? { duration: 1.5, ease: "easeInOut" }
              : { duration: 1, ease: "easeInOut" }
        }
        style={{ transform: `translate(${parallaxX * 0.3}px, ${parallaxY * 0.3}px)` }}
      >
        <SpaceshipSVG progress={progress} />

        {/* Ship trail particles */}
        {(phase === "accelerate" || phase === "warp") && (
          <div className="absolute top-1/2 left-full -translate-y-1/2 pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  backgroundColor: i % 2 === 0 ? "#06b6d4" : "#6366f1",
                  top: (Math.random() - 0.5) * 20,
                }}
                animate={{
                  x: [0, -60 - i * 20],
                  opacity: [0.8, 0],
                  scale: [1, 0.2],
                }}
                transition={{ duration: 0.6 + i * 0.1, repeat: Infinity, delay: i * 0.08, ease: "linear" }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Bottom UI — progress bar */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48">
        <div className="h-[2px] bg-cyan-900/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min(100, (progress / 1) * 100)}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        {phase === "transit" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[10px] font-mono text-cyan-400/60 mt-2 tracking-widest"
          >
                SEJA BEM-VINDO
          </motion.p>
        )}
      </div>

      {/* Vignette overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(2,6,23,0.6)_100%)]" />

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(6,182,212,0.3)_2px,rgba(6,182,212,0.3)_3px)]" />
    </motion.div>
  );
}
