"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── CSS keyframes injection ───
const starfieldStyles = `
@keyframes drift-cyan { 0% { transform: translateY(0) translateX(0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(-600px) translateX(40px); opacity: 0; } }
@keyframes drift-indigo { 0% { transform: translateY(0) translateX(0); opacity: 0; } 10% { opacity: 0.7; } 90% { opacity: 0.7; } 100% { transform: translateY(-500px) translateX(-30px); opacity: 0; } }
@keyframes drift-white { 0% { transform: translateY(0) translateX(0); opacity: 0; } 15% { opacity: 0.5; } 85% { opacity: 0.5; } 100% { transform: translateY(-800px) translateX(20px); opacity: 0; } }
@keyframes depth-pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
@keyframes warp-streak { 0% { transform: translateX(0) scaleX(0); opacity: 0; } 20% { opacity: 0.6; } 80% { opacity: 0.6; } 100% { transform: translateX(-400px) scaleX(3); opacity: 0; } }
@keyframes tunnel-pulse { 0%, 100% { opacity: 0.15; transform: scale(0.3) rotateX(75deg); } 50% { opacity: 0.4; transform: scale(0.5) rotateX(75deg); } }
@keyframes letterbox-in { 0% { transform: scaleY(1); } 100% { transform: scaleY(0); } }
@keyframes letterbox-out { 0% { transform: scaleY(0); } 100% { transform: scaleY(1); } }
`;

// ─── Types ───
type Star = { x: number; y: number; size: number; depth: number; hue: number; delay: number; duration: number };

// ─── Generate stars ───
function genStars(count: number, w: number, h: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * 100, y: Math.random() * 100,
      size: 0.5 + Math.random() * 3,
      depth: 0.1 + Math.random() * 0.9,
      hue: 180 + Math.random() * 100, // 180-280 (cyan to purple)
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 5,
    });
  }
  return stars;
}

// ─── Static star layer (pure CSS, 0 React cost) ───
function StarLayer({ stars, className }: { stars: Star[]; className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className ?? ""}`}>
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size,
            background: s.depth > 0.6
              ? `radial-gradient(circle, hsla(${s.hue}, 80%, 70%, 0.8), transparent)`
              : `radial-gradient(circle, hsla(210, 30%, 80%, 0.4), transparent)`,
            boxShadow: s.depth > 0.7 ? `0 0 ${s.size * 3}px hsla(${s.hue}, 70%, 60%, 0.3)` : "none",
            animation: `drift-${i % 3 === 0 ? "cyan" : i % 3 === 1 ? "indigo" : "white"} ${s.duration}s ${s.delay}s linear infinite`,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}

// ─── Warp streaks (pure CSS) ───
function WarpStreaks({ count = 40 }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const length = 60 + Math.random() * 200;
        const hue = Math.random() > 0.5 ? 190 : 240;
        return (
          <div
            key={i}
            className="absolute h-px"
            style={{
              left: `${x}%`, top: `${y}%`,
              width: length,
              background: `linear-gradient(90deg, transparent, hsla(${hue}, 80%, 60%, 0.4), transparent)`,
              boxShadow: `0 0 8px hsla(${hue}, 80%, 60%, 0.2)`,
              animation: `warp-streak ${0.3 + Math.random() * 0.5}s ${i * 0.03}s linear infinite`,
              willChange: "transform, opacity",
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Warp tunnel rings (CSS) ───
function WarpRingLayer({ count = 25 }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ perspective: "900px" }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const size = 180 + i * 35;
        const thickness = Math.max(0.5, 2 - i * 0.08);
        const hue = i % 3 === 0 ? 190 : i % 3 === 1 ? 240 : 170;
        const alpha = Math.max(0.02, 0.25 - i * 0.01);
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size, height: size * 0.5,
              border: `${thickness}px solid hsla(${hue}, 70%, 55%, ${alpha})`,
              animation: `tunnel-pulse ${1.2 + i * 0.1}s ${i * 0.05}s ease-in-out infinite`,
              willChange: "transform, opacity",
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Treasure Planet Ship (SVG Framer Motion) ───
function TreasureShip({ phase }: { phase: number }) {
  const warp = phase >= 3;
  const glowIntensity = warp ? 1.5 : Math.min(1, phase / 2);
  return (
    <svg
      width="160" height="80" viewBox="0 0 160 80" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: `drop-shadow(0 0 ${40 + glowIntensity * 40}px rgba(99,102,241,${0.4 + glowIntensity * 0.3}))` }}
    >
      {/* Engine plume */}
      <motion.ellipse
        cx="135" cy="40"
        rx={15 + glowIntensity * 40} ry={8 + glowIntensity * 18}
        fill="url(#plumeGrad)"
        animate={{ opacity: [0.3, 0.9, 0.3], scaleX: [1, 1.3, 1], scaleY: [1, 1.15, 1] }}
        transition={{ duration: 0.12 + (1 - glowIntensity * 0.3) * 0.2, repeat: Infinity, ease: "linear" }}
        style={{ filter: "blur(14px)" }}
      />
      <motion.ellipse
        cx="132" cy="40"
        rx={8 + glowIntensity * 25} ry={4 + glowIntensity * 10}
        fill="#22d3ee"
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.15, 1] }}
        transition={{ duration: 0.08 + (1 - glowIntensity * 0.3) * 0.12, repeat: Infinity }}
        style={{ filter: "blur(8px)" }}
      />
      <motion.ellipse
        cx="130" cy="40"
        rx={3 + glowIntensity * 10} ry={1.5 + glowIntensity * 5}
        fill="#ffffff"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 0.06, repeat: Infinity }}
        style={{ filter: "blur(4px)" }}
      />

      {/* Solar sails */}
      <motion.path d="M50 40 L90 5 L130 15 L110 30 Z" fill="url(#sailGrad)" stroke="#6366f1" strokeWidth="0.6" opacity={0.7}
        animate={warp ? { scaleX: [1, 1.4, 1], opacity: [0.7, 0.2, 0.7] } : {}}
        transition={{ duration: 0.4, repeat: Infinity }}
      />
      <motion.path d="M50 40 L90 75 L130 65 L110 50 Z" fill="url(#sailGrad)" stroke="#6366f1" strokeWidth="0.6" opacity={0.7}
        animate={warp ? { scaleX: [1, 1.4, 1], opacity: [0.7, 0.2, 0.7] } : {}}
        transition={{ duration: 0.4, repeat: Infinity, delay: 0.08 }}
      />

      {/* Hull */}
      <motion.path d="M15 40 L40 22 L95 28 L125 37 L125 43 L95 52 L40 58 Z" fill="url(#hullGrad)" stroke="#22d3ee" strokeWidth="0.8" />
      <motion.path d="M20 40 L40 26 L85 32 L105 38" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" fill="none" />

      {/* Fins */}
      <motion.path d="M40 22 L55 10 L75 18 L70 24 Z" fill="#4f46e5" stroke="#6366f1" strokeWidth="0.4" opacity={0.8} />
      <motion.path d="M40 58 L55 70 L75 62 L70 56 Z" fill="#4f46e5" stroke="#6366f1" strokeWidth="0.4" opacity={0.8} />

      {/* Cockpit */}
      <motion.ellipse cx="38" cy="40" rx="8" ry="10" fill="#020617" stroke="#22d3ee" strokeWidth="0.6" />
      <motion.ellipse cx="38" cy="40" rx="4" ry="6" fill="#06b6d4" opacity={0.15} />
      <motion.circle cx="36" cy="37" r="1.5" fill="#22d3ee"
        animate={{ opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />

      {/* Warp rings */}
      {warp && [0, 1, 2].map((i) => (
        <motion.ellipse
          key={i}
          cx={65 + i * 15} cy="40"
          rx={5 + i * 10 * glowIntensity} ry={2 + i * 4 * glowIntensity}
          stroke={i % 2 === 0 ? "#06b6d4" : "#6366f1"}
          strokeWidth="0.5" fill="none"
          opacity={[0.4, 0.2, 0.1][i]}
          animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
          transition={{ duration: 0.3 + i * 0.15, repeat: Infinity, delay: i * 0.08 }}
        />
      ))}

      <defs>
        <radialGradient id="plumeGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity={1} />
          <stop offset="35%" stopColor="#6366f1" stopOpacity={0.6} />
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

// ─── Flash transition overlay ───
function FlashOverlay({ show }: { show: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-30"
      style={{
        background: "radial-gradient(ellipse at center, rgba(99,102,241,0.35), rgba(6,182,212,0.15), transparent)",
      }}
      animate={{
        opacity: show ? [0, 0.7, 0] : 0,
        scale: show ? [0.7, 1.3] : 1,
      }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    />
  );
}

// ─── Floating energy particles (Framer Motion, small batch) ───
function EnergyParticles({ warp }: { warp: boolean }) {
  if (!warp) return null;
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: 6 }).map((_, i) => {
        const x = 10 + Math.random() * 80;
        const y = 10 + Math.random() * 80;
        const size = 2 + Math.random() * 5;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${x}%`, top: `${y}%`,
              width: size, height: size,
              background: `radial-gradient(circle, rgba(255,255,255,0.9), rgba(99,102,241,0.3))`,
              boxShadow: `0 0 ${size * 4}px rgba(99,102,241,0.5)`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.9, 0],
              scale: [0, 2, 0],
              x: [0, -30 + Math.random() * 60, -60 + Math.random() * 120],
              y: [0, -30 + Math.random() * 60, -60 + Math.random() * 120],
            }}
            transition={{
              duration: 1.5 + Math.random() * 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
}

// ─── MAIN COMPONENT ───
export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [dims, setDims] = useState({ w: 1200, h: 800 });
  const containerRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  const mouseRef = useRef({ x: 0, y: 0 });
  onCompleteRef.current = onComplete;

  // Stars regeneram só quando dims mudam
  const stars = useMemo(() => genStars(400, dims.w, dims.h), [dims.w, dims.h]);

  // ── Animation timing ──
  useEffect(() => {
    const t: ReturnType<typeof setTimeout>[] = [];
    t.push(setTimeout(() => setPhase(1), 600));   // 0.6s: stars glow, nebula fades in
    t.push(setTimeout(() => setPhase(2), 2000));   // 2.0s: ship flies in from left
    t.push(setTimeout(() => setPhase(3), 3800));   // 3.8s: hyperspace warp
    t.push(setTimeout(() => setPhase(4), 5500));   // 5.5s: flash transit
    t.push(setTimeout(() => onCompleteRef.current(), 7000)); // 7.0s: done
    return () => t.forEach(clearTimeout);
  }, []);

  // ── Responsive dimensions ──
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect();
        setDims({ w: r.width, h: r.height });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ── Mouse parallax ──
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect();
        mouseRef.current = {
          x: (e.clientX - r.left) / r.width - 0.5,
          y: (e.clientY - r.top) / r.height - 0.5,
        };
      }
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  const warpActive = phase >= 3;
  const transitActive = phase === 4;
  const mx = mouseRef.current.x;
  const my = mouseRef.current.y;

  return (
    <>
      {/* Inject CSS keyframes once */}
      <style>{starfieldStyles}</style>

      <motion.div
        ref={containerRef}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[9999] bg-[#020617] overflow-hidden cursor-none"
        style={{ perspective: "1000px" }}
      >
        {/* ── LAYER 1: Deep background nebula ── */}
        <div
          className="absolute inset-0 opacity-40 transition-opacity duration-[2000ms]"
          style={{
            opacity: phase > 0 ? 0.4 : 0,
            background: `
              radial-gradient(ellipse at ${30 + mx * 12}% ${35 + my * 12}%, rgba(99,102,241,0.2) 0%, transparent 60%),
              radial-gradient(ellipse at ${70 - mx * 12}% ${65 - my * 12}%, rgba(6,182,212,0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.1) 0%, transparent 70%)
            `,
            filter: "blur(50px)",
            willChange: "opacity, background",
          }}
        />

        {/* ── LAYER 2: Starfield (400 CSS stars, 0 React cost) ── */}
        <StarLayer stars={stars} />

        {/* ── LAYER 3: Warp effects ── */}
        <div style={{ opacity: warpActive ? 1 : 0, transition: "opacity 0.3s" }}>
          <WarpRingLayer count={25} />
          <WarpStreaks count={40} />
        </div>

        {/* ── LAYER 4: Energy particles (React motion) ── */}
        <EnergyParticles warp={warpActive} />

        {/* ── LAYER 5: Flash transition ── */}
        <FlashOverlay show={transitActive} />

        {/* ── LAYER 6: Spaceship ── */}
        <motion.div
          className="absolute z-10 pointer-events-none"
          animate={
            phase === 0
              ? { x: "-20%", y: "45%", opacity: 0, scale: 0.3, rotate: -15 }
              : phase === 1
                ? { x: "calc(50vw - 80px)", y: "calc(50vh - 40px)", opacity: 1, scale: 0.8, rotate: -5 }
                : phase === 2
                  ? { x: "calc(50vw - 80px)", y: "calc(50vh - 40px)", scale: 1.1, rotate: 0 }
                  : phase === 3
                    ? { x: "calc(50vw - 80px)", y: "calc(50vh - 40px)", scale: [1.1, 1.5, 0.9], rotate: [0, 0, 3, -3, 0] }
                    : { x: "calc(50vw - 80px)", y: "calc(50vh - 40px)", scale: 0.15, opacity: 0 }
          }
          transition={
            phase === 1 ? { duration: 1, ease: [0.12, 0.8, 0.25, 1] } :
            phase === 2 ? { duration: 0.8, ease: "easeOut" } :
            phase === 3 ? { duration: 1.2, ease: "easeInOut" } :
            phase === 4 ? { duration: 0.7, ease: "easeIn" } :
            { duration: 0.6 }
          }
          style={{ transform: `translate(${mx * 18}px, ${my * 18}px)` }}
        >
          <TreasureShip phase={phase} />

          {/* Engine trail particles */}
          {phase >= 2 && (
            <div className="absolute top-1/2 left-full -translate-y-1/2">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 1 + Math.random() * 3,
                    height: 1 + Math.random() * 3,
                    background: `radial-gradient(circle, #22d3ee, #6366f1)`,
                    top: -6 + Math.random() * 12,
                    left: 0,
                    filter: "blur(1px)",
                  }}
                  animate={{
                    x: [0, -(30 + Math.random() * 80)],
                    opacity: [0.8, 0],
                    scale: [1, 0.1],
                  }}
                  transition={{
                    duration: 0.3 + Math.random() * 0.5,
                    repeat: Infinity,
                    delay: i * (0.05 + Math.random() * 0.06),
                    ease: "linear",
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* ── LAYER 7: Progress bar + Welcome ── */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="w-32 h-[2px] bg-indigo-950/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(100, (phase / 4) * 100)}%` }}
              transition={{ duration: 0.3 }}
              style={{ boxShadow: "0 0 8px rgba(6,182,212,0.5)" }}
            />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: phase >= 3 ? 1 : 0, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-center text-[10px] font-mono text-cyan-400/60 mt-2 tracking-[0.3em]"
          >
            SEJA BEM-VINDO
          </motion.p>
        </div>

        {/* ── LAYER 8: Cinematic overlays ── */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(2,6,23,0.7)_100%)]" />
        <div className="absolute inset-0 pointer-events-none opacity-[0.025] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(6,182,212,0.3)_2px,rgba(6,182,212,0.3)_3px)]" />

        {/* ── LAYER 9: Letterbox bars ── */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[12%] bg-[#020617] z-20 pointer-events-none"
          animate={{ opacity: transitActive ? 0 : 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[12%] bg-[#020617] z-20 pointer-events-none"
          animate={{ opacity: transitActive ? 0 : 1 }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
    </>
  );
}
