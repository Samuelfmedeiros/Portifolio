"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Utilities ───
function rand(min: number, max: number) { return Math.random() * (max - min) + min; }

interface Particle {
  x: number; y: number;
  size: number; depth: number;
  speed: number; opacity: number;
  hue: number;   // color hue for variety
}

function generateParticles(count: number, w: number, h: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: rand(0, w), y: rand(0, h),
    size: rand(0.3, 3),
    depth: rand(0.1, 1),
    speed: rand(0.5, 2),
    opacity: rand(0.2, 0.9),
    hue: rand(180, 260), // blue to purple range
  }));
}

// ─── Nebula background ───
function NebulaLayer({ progress, mouseX, mouseY }: { progress: number; mouseX: number; mouseY: number }) {
  const active = progress > 0.15;
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 0.6 : 0 }}
      transition={{ duration: 2 }}
      style={{
        background: `
          radial-gradient(ellipse at ${30 + mouseX * 10}% ${40 + mouseY * 10}%, rgba(99,102,241,0.15) 0%, transparent 60%),
          radial-gradient(ellipse at ${70 - mouseX * 10}% ${60 - mouseY * 10}%, rgba(6,182,212,0.1) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.08) 0%, transparent 70%)
        `,
        filter: "blur(40px)",
      }}
    />
  );
}

// ─── Treasure Planet style spaceship ───
function TreasureShip({ progress, warp }: { progress: number; warp: boolean }) {
  const engine = Math.min(1, Math.max(0, (progress - 0.08) / 0.3));
  const glowIntensity = warp ? 1.5 : engine;

  return (
    <svg
      width="160"
      height="80"
      viewBox="0 0 160 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_0_40px_rgba(99,102,241,0.6)]"
    >
      {/* Engine plume - massive glow */}
      <motion.ellipse
        cx="135"
        cy="40"
        rx={15 + glowIntensity * 35}
        ry={8 + glowIntensity * 15}
        fill="url(#plumeGrad)"
        animate={{ opacity: [0.4, 0.9, 0.4], scaleX: [1, 1.2, 1], scaleY: [1, 1.1, 1] }}
        transition={{ duration: 0.15 + (1 - glowIntensity) * 0.2, repeat: Infinity, ease: "linear" }}
        style={{ filter: "blur(12px)" }}
      />
      {/* Inner engine core */}
      <motion.ellipse
        cx="132"
        cy="40"
        rx={8 + glowIntensity * 20}
        ry={4 + glowIntensity * 8}
        fill="#22d3ee"
        animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.1, 1] }}
        transition={{ duration: 0.1 + (1 - glowIntensity) * 0.15, repeat: Infinity }}
        style={{ filter: "blur(6px)" }}
      />
      {/* Engine core white hot */}
      <motion.ellipse
        cx="130"
        cy="40"
        rx={3 + glowIntensity * 8}
        ry={1.5 + glowIntensity * 4}
        fill="#ffffff"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 0.08, repeat: Infinity }}
        style={{ filter: "blur(3px)" }}
      />

      {/* Solar sail wings (Treasure Planet style) */}
      <motion.path
        d="M50 40 L90 5 L130 15 L110 30 Z"
        fill="url(#sailGrad)"
        stroke="#6366f1"
        strokeWidth="0.6"
        opacity={0.7}
        animate={warp ? { scaleX: [1, 1.3, 1], opacity: [0.7, 0.3, 0.7] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
      <motion.path
        d="M50 40 L90 75 L130 65 L110 50 Z"
        fill="url(#sailGrad)"
        stroke="#6366f1"
        strokeWidth="0.6"
        opacity={0.7}
        animate={warp ? { scaleX: [1, 1.3, 1], opacity: [0.7, 0.3, 0.7] } : {}}
        transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
      />

      {/* Hull - main body */}
      <motion.path
        d="M15 40 L40 22 L95 28 L125 37 L125 43 L95 52 L40 58 Z"
        fill="url(#hullGrad)"
        stroke="#22d3ee"
        strokeWidth="0.8"
      />
      {/* Hull highlight */}
      <motion.path
        d="M20 40 L40 26 L85 32 L105 38"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        fill="none"
      />

      {/* Fore fins */}
      <motion.path d="M40 22 L55 10 L75 18 L70 24 Z" fill="#4f46e5" stroke="#6366f1" strokeWidth="0.4" opacity={0.8} />
      <motion.path d="M40 58 L55 70 L75 62 L70 56 Z" fill="#4f46e5" stroke="#6366f1" strokeWidth="0.4" opacity={0.8} />

      {/* Cockpit */}
      <motion.ellipse cx="38" cy="40" rx="8" ry="10" fill="#020617" stroke="#22d3ee" strokeWidth="0.6" />
      <motion.ellipse cx="38" cy="40" rx="4" ry="6" fill="#06b6d4" opacity={0.15} />
      <motion.circle cx="36" cy="37" r="1.5" fill="#22d3ee" animate={{ opacity: [0.2, 0.7, 0.2] }} transition={{ duration: 1.2, repeat: Infinity }} />

      {/* Warp rings (hyperspace effect around ship) */}
      {warp && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.ellipse
              key={i}
              cx={65 + i * 15}
              cy="40"
              rx={5 + i * 8 * glowIntensity}
              ry={2 + i * 3 * glowIntensity}
              stroke={i % 2 === 0 ? "#06b6d4" : "#6366f1"}
              strokeWidth="0.5"
              fill="none"
              opacity={[0.3, 0.15, 0.08][i]}
              animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
              transition={{ duration: 0.4 + i * 0.2, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </>
      )}

      {/* Gradients */}
      <defs>
        <radialGradient id="plumeGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity={1} />
          <stop offset="40%" stopColor="#6366f1" stopOpacity={0.6} />
          <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="sailGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
          <stop offset="50%" stopColor="#06b6d4" stopOpacity={0.2} />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.05} />
        </linearGradient>
        <linearGradient id="hullGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="40%" stopColor="#6366f1" />
          <stop offset="70%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Hyperspace streak ───
function HyperspaceStreak({ delay }: { delay: number }) {
  const length = rand(80, 200);
  const x = rand(0, 100);
  const y = rand(0, 100);
  const hue = Math.random() > 0.5 ? 190 : 240; // cyan or indigo
  return (
    <motion.div
      className="absolute h-px"
      style={{
        left: `${x}%`, top: `${y}%`,
        width: length,
        background: `linear-gradient(90deg, transparent, hsla(${hue}, 80%, 60%, ${rand(0.2, 0.5)}), transparent)`,
        boxShadow: `0 0 6px hsla(${hue}, 80%, 60%, 0.2)`,
      }}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{
        scaleX: [0, 1, 0],
        opacity: [0, rand(0.4, 0.8), 0],
        x: [0, -300 * rand(0.5, 1.5)],
      }}
      transition={{ duration: rand(0.3, 0.8), repeat: Infinity, delay, ease: "linear" }}
    />
  );
}

// ─── Energy orb ───
function EnergyOrb({ delay }: { delay: number }) {
  const size = rand(2, 6);
  const x = rand(5, 95);
  const y = rand(5, 95);
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: `${x}%`, top: `${y}%`,
        width: size, height: size,
        background: `radial-gradient(circle, rgba(255,255,255,0.8), rgba(99,102,241,0.3))`,
        boxShadow: `0 0 ${size * 3}px rgba(99,102,241,0.4)`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.8, 0],
        scale: [0, 1.5, 0],
        x: [0, rand(-50, 50), rand(-100, 100)],
        y: [0, rand(-50, 50), rand(-100, 100)],
      }}
      transition={{ duration: rand(1, 2.5), repeat: Infinity, delay, ease: "easeOut" }}
    />
  );
}

// ─── Warp tunnel ───
function WarpTunnel({ progress }: { progress: number }) {
  const p = Math.min(1, Math.max(0, (progress - 0.5) / 0.4));
  if (p <= 0) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ perspective: "800px" }}>
      {Array.from({ length: 20 }).map((_, i) => {
        const scale = 0.1 + (i / 20) * 0.9;
        const alpha = (1 - i / 20) * p * 0.2;
        const hue = i % 3 === 0 ? 190 : i % 3 === 1 ? 240 : 170;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${200 + i * 30}px`,
              height: `${100 + i * 15}px`,
              border: `1px solid hsla(${hue}, 70%, 55%, ${alpha})`,
              opacity: alpha,
              filter: `blur(${i * 0.3}px)`,
            }}
            initial={{ rotateX: 70, scale: 0.3, opacity: 0 }}
            animate={{
              scale: [0.3, 1.2],
              opacity: [0, alpha, 0],
            }}
            transition={{ duration: 1 + i * 0.08, repeat: Infinity, delay: i * 0.06, ease: "linear" }}
          />
        );
      })}
    </div>
  );
}

// ─── Speed lines (background warp) ───
function SpeedLines({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-px"
          style={{
            left: `${rand(0, 100)}%`,
            height: rand(20, 80),
            background: `linear-gradient(to bottom, transparent, hsla(${Math.random() > 0.5 ? 190 : 240}, 70%, 60%, ${rand(0.1, 0.3)}), transparent)`,
          }}
          animate={{
            y: [-200, 400],
            opacity: [0, rand(0.2, 0.5), 0],
          }}
          transition={{ duration: rand(0.3, 0.8), repeat: Infinity, delay: i * 0.05, ease: "linear" }}
        />
      ))}
    </div>
  );
}

// ─── Flash transition ───
function FlashOverlay({ show }: { show: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: "radial-gradient(ellipse at center, rgba(99,102,241,0.3), rgba(6,182,212,0.1), transparent)",
      }}
      animate={{
        opacity: show ? [0, 0.6, 0] : 0,
        scale: show ? [0.8, 1.2] : 1,
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    />
  );
}

// ─── MAIN COMPONENT ───
export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [dims, setDims] = useState({ w: 1200, h: 800 });
  onCompleteRef.current = onComplete;

  const particles = useMemo(() => generateParticles(150, dims.w, dims.h), [dims.w, dims.h]);

  // Animation sequence
  useEffect(() => {
    const t: ReturnType<typeof setTimeout>[] = [];
    t.push(setTimeout(() => setPhase(1), 800));   // 0.8s: nebulae + ship arrives
    t.push(setTimeout(() => setPhase(2), 2500));   // 2.5s: accelerating
    t.push(setTimeout(() => setPhase(3), 4000));   // 4.0s: hyperspace warp
    t.push(setTimeout(() => setPhase(4), 5800));   // 5.8s: flash transit
    t.push(setTimeout(() => onCompleteRef.current(), 7200)); // 7.2s: done
    return () => t.forEach(clearTimeout);
  }, []);

  // Smooth progress (0-1 over 7.2s)
  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const animate = (now: number) => {
      setProgress(Math.min(1, (now - start) / 7200));
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Dimensions
  useEffect(() => {
    const update = () => { if (containerRef.current) setDims({ w: containerRef.current.offsetWidth, h: containerRef.current.offsetHeight }); };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Mouse parallax
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect();
        mouseRef.current = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 };
      }
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  const mx = mouseRef.current.x;
  const my = mouseRef.current.y;
  const warpActive = phase >= 3;
  const transitActive = phase === 4;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] bg-[#020617] overflow-hidden cursor-none"
    >
      {/* Deep space stars layer - slow parallax */}
      <div className="absolute inset-0" style={{ transform: `translate(${mx * 5}px, ${my * 5}px)` }}>
        {particles.map((p, i) => {
          const pSpeed = 0.5 + p.depth * 4;
          const move = phase > 0;
          const warpMul = warpActive ? 12 : 1;
          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: p.x, top: p.y,
                width: p.size, height: p.size,
                backgroundColor: p.depth > 0.7 ? `hsla(${p.hue}, 70%, 60%, ${p.opacity})` : `hsla(210, 30%, 70%, ${p.opacity * 0.5})`,
                boxShadow: p.depth > 0.6 ? `0 0 ${p.size * 2}px hsla(${p.hue}, 60%, 50%, 0.3)` : "none",
              }}
              animate={move ? {
                y: p.y + 300 * pSpeed * warpMul * progress,
                opacity: warpActive ? [p.opacity, p.opacity * 4, 0] : p.opacity,
                scaleX: warpActive ? [1, 1 + p.depth * 6] : 1,
              } : { opacity: [0, p.opacity], scale: [0, 1] }}
              transition={move ? { duration: 2 / (pSpeed * warpMul), repeat: Infinity, ease: "linear" } : { duration: 0.5 + p.depth * 0.8, delay: p.depth * 0.3 }}
            />
          );
        })}
      </div>

      {/* Nebula clouds */}
      <NebulaLayer progress={progress} mouseX={mx} mouseY={my} />

      {/* Hyperspace speed lines */}
      <SpeedLines active={warpActive} />

      {/* Warp tunnel rings */}
      <WarpTunnel progress={progress} />

      {/* Energy orbs during warp */}
      {warpActive && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <EnergyOrb key={i} delay={i * 0.15} />
          ))}
        </div>
      )}

      {/* Hyperspace streaks */}
      {warpActive && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <HyperspaceStreak key={i} delay={i * 0.08} />
          ))}
        </div>
      )}

      {/* Flash transition */}
      <FlashOverlay show={transitActive} />

      {/* Spaceship */}
      <motion.div
        className="absolute z-10 pointer-events-none"
        style={{ transform: `translate(${mx * 15}px, ${my * 15}px)` }}
        animate={
          phase === 0
            ? { x: "-20%", y: "40%", opacity: 0, scale: 0.4, rotate: -15 }
            : phase === 1
              ? { x: "calc(50vw - 80px)", y: "calc(50vh - 40px)", opacity: 1, scale: 1, rotate: 0 }
              : phase === 2
                ? { x: "calc(50vw - 80px)", y: "calc(50vh - 40px)", scale: 1.15, rotate: 0 }
                : phase === 3
                  ? {
                      x: "calc(50vw - 80px)", y: "calc(50vh - 40px)",
                      scale: [1.15, 1.4, 1],
                      rotate: [0, 0, 5, -5, 0],
                    }
                  : { x: "calc(50vw - 80px)", y: "calc(50vh - 40px)", scale: 0.2, opacity: 0 }
        }
        transition={
          phase === 1 ? { duration: 1.2, ease: [0.12, 0.8, 0.3, 1] } :
          phase === 3 ? { duration: 1.5, ease: "easeInOut" } :
          phase === 4 ? { duration: 0.8, ease: "easeIn" } :
          { duration: 0.8 }
        }
      >
        <TreasureShip progress={progress} warp={warpActive} />

        {/* Engine trail particles */}
        {(phase >= 2) && (
          <div className="absolute top-1/2 left-full -translate-y-1/2">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: rand(1, 3), height: rand(1, 3),
                  background: `radial-gradient(circle, #22d3ee, #6366f1)`,
                  top: rand(-10, 10),
                  left: 0,
                  filter: "blur(1px)",
                }}
                animate={{
                  x: [0, -rand(40, 100)],
                  opacity: [0.8, 0],
                  scale: [1, 0.1],
                }}
                transition={{ duration: rand(0.3, 0.8), repeat: Infinity, delay: i * rand(0.05, 0.12), ease: "linear" }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Bottom progress bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-32 h-[2px] bg-indigo-950/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 rounded-full"
            animate={{ width: `${Math.min(100, progress * 100)}%` }}
            transition={{ duration: 0.05, ease: "linear" }}
            style={{ boxShadow: "0 0 6px rgba(6,182,212,0.5)" }}
          />
        </div>
        {progress > 0.85 && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-[10px] font-mono text-cyan-400/60 mt-2 tracking-[0.3em]"
          >
            SEJA BEM-VINDO
          </motion.p>
        )}
      </div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(2,6,23,0.7)_100%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(6,182,212,0.5)_2px,rgba(6,182,212,0.5)_3px)]" />

      {/* Letterbox bars */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[12%] bg-[#020617] z-20 pointer-events-none"
        animate={{ opacity: transitActive ? 0 : 1 }}
        transition={{ duration: 0.6 }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[12%] bg-[#020617] z-20 pointer-events-none"
        animate={{ opacity: transitActive ? 0 : 1 }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  );
}
