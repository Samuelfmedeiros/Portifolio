"use client";

import { useState, useEffect, useRef, useMemo, memo } from "react";
import { motion, AnimatePresence, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { useDeviceTier, type DeviceTier } from "@/hooks/useDeviceTier";
import { useTheme } from "./ThemeProvider";

// ─── Tier config ───
const TIER_CFG: Record<DeviceTier, {
  stars: number; rings: number; streaks: number; trailParticles: number;
  energyParticles: number; phase1: number; phase2: number; phase3: number;
  phase4: number; complete: number;
}> = {
  low:    { stars: 80,  rings: 8,  streaks: 10, trailParticles: 6,  energyParticles: 0, phase1: 200,  phase2: 600,  phase3: 1200, phase4: 2000, complete: 3200 },
  mid:    { stars: 200, rings: 15, streaks: 20, trailParticles: 10, energyParticles: 4, phase1: 400,  phase2: 1400, phase3: 2400, phase4: 3600, complete: 4500 },
  high:   { stars: 400, rings: 25, streaks: 40, trailParticles: 20, energyParticles: 8, phase1: 600,  phase2: 1800, phase3: 3000, phase4: 4200, complete: 5800 },
};

// ─── CSS keyframes injection ───
const starfieldStyles = `
@keyframes drift-cyan { 0% { transform: translateY(0) translateX(0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(-600px) translateX(40px); opacity: 0; } }
@keyframes drift-indigo { 0% { transform: translateY(0) translateX(0); opacity: 0; } 10% { opacity: 0.7; } 90% { opacity: 0.7; } 100% { transform: translateY(-500px) translateX(-30px); opacity: 0; } }
@keyframes drift-white { 0% { transform: translateY(0) translateX(0); opacity: 0; } 15% { opacity: 0.5; } 85% { opacity: 0.5; } 100% { transform: translateY(-800px) translateX(20px); opacity: 0; } }
@keyframes warp-streak { 0% { transform: translateX(0) scaleX(0); opacity: 0; } 20% { opacity: 0.6; } 80% { opacity: 0.6; } 100% { transform: translateX(-400px) scaleX(3); opacity: 0; } }
@keyframes tunnel-pulse { 0%, 100% { opacity: 0.15; transform: scale(0.3) rotateX(75deg); } 50% { opacity: 0.4; transform: scale(0.5) rotateX(75deg); } }
@keyframes draw-logo { 0% { stroke-dashoffset: 900; opacity: 0; } 30% { opacity: 0.4; } 100% { stroke-dashoffset: 0; opacity: 1; } }
@keyframes engine-glow-pulse { 0%, 100% { opacity: 0.35; transform: translateX(-50%) scaleY(0.85); } 50% { opacity: 0.7; transform: translateX(-50%) scaleY(1.15); } }
@keyframes boot-fade-in { 0% { opacity: 0; transform: translateY(6px); } 100% { opacity: 1; transform: translateY(0); } }
@keyframes pulse-subtle { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.5; } }
@keyframes glitch-skew { 0% { clip-path: inset(0 0 0 0); transform: skew(0deg); } 10% { clip-path: inset(12% 0 50% 0); transform: skew(-1deg); } 20% { clip-path: inset(40% 0 8% 0); transform: skew(0.5deg); } 30% { clip-path: inset(5% 0 65% 0); transform: skew(-0.3deg); } 40% { clip-path: inset(80% 0 5% 0); transform: skew(1deg); } 50% { clip-path: inset(0 0 0 0); transform: skew(0deg); } }
@keyframes scanline-sweep { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
@media (prefers-reduced-motion: reduce) { @keyframes drift-cyan { to { opacity: 0; } } @keyframes drift-indigo { to { opacity: 0; } } @keyframes drift-white { to { opacity: 0; } } @keyframes warp-streak { to { opacity: 0; } } @keyframes tunnel-pulse { 0%, 100% { opacity: 0.03; } } @keyframes draw-logo { to { stroke-dashoffset: 0; opacity: 1; } } @keyframes engine-glow-pulse { to { opacity: 0.35; } } @keyframes boot-fade-in { to { opacity: 1; } } @keyframes glitch-skew { to { transform: skew(0deg); } } }
@keyframes vignette-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.85; } }
.glitch-active { animation: glitch-skew 0.6s ease-in-out; }
@media (prefers-reduced-motion: reduce) { .glitch-active { animation: none; } }
@keyframes grain-shift { 0%, 100% { background-position: 0 0; } 20% { background-position: -5px 5px; } 40% { background-position: 5px -5px; } 60% { background-position: -3px 3px; } 80% { background-position: 3px -3px; } }
@keyframes type-reveal { 0% { max-width: 0; border-right-color: transparent; } 1% { border-right-color: currentColor; } 90% { border-right-color: currentColor; } 100% { max-width: 400px; border-right-color: transparent; } }
@keyframes blink-cursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
`;

// ─── Types ───
type Star = { x: number; y: number; size: number; depth: number; hue: number; delay: number; duration: number };

// ─── Generate stars ───
function genStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100, y: Math.random() * 100,
    size: 0.5 + Math.random() * 3,
    depth: 0.1 + Math.random() * 0.9,
    hue: 180 + Math.random() * 100,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 5,
  }));
}

// ─── Static star layer (pure CSS, 0 React cost) ───
const StarLayer = memo(function StarLayer({ stars, className }: { stars: Star[]; className?: string }) {
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
});

// ─── Warp streaks (pure CSS) ───
const WarpStreaks = memo(function WarpStreaks({ count = 40 }: { count: number }) {
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
});

// ─── Warp tunnel rings (CSS) ───
const WarpRingLayer = memo(function WarpRingLayer({ count = 25 }: { count: number }) {
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
});

// ─── HUD corner brackets ───
function HudCorners({ opacity = 0.3 }: { opacity?: number }) {
  const corner = (side: "tl" | "tr" | "bl" | "br") => {
    const rotate = side === "tr" ? "scaleX(-1)" : side === "bl" ? "scaleY(-1)" : side === "br" ? "scale(-1, -1)" : "";
    const pos = side.startsWith("t") ? "top-12" : "bottom-28";
    const lr = side.endsWith("l") ? "left-4" : "right-4";
    return (
      <div
        className={`absolute ${pos} ${lr} z-10`}
        style={{ transform: rotate, opacity }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M2 26 L2 2 L26 2" stroke="var(--accent, #22d3ee)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  };
  return <>{corner("tl")}{corner("tr")}{corner("bl")}{corner("br")}</>;
}

// ─── MC Monogram with draw animation ───
function McMonogram({ phase }: { phase: number }) {
  const visible = phase >= 1;
  return (
    <motion.div
      className="z-10"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }}
    >
      <svg width="110" height="110" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="monoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee"/>
            <stop offset="100%" stopColor="#6366f1"/>
          </linearGradient>
        </defs>
        {/* M */}
        <path d="M 56 210 L 56 80 L 98 124 L 114 80 L 114 210"
              stroke="url(#monoGrad)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"
              strokeDasharray="900" strokeDashoffset={visible ? 0 : 900}
              style={{ transition: "stroke-dashoffset 2.2s ease-out, opacity 1s ease-out", opacity: visible ? 1 : 0 }} />
        {/* C */}
        <path d="M 148 80 Q 210 80 210 145 Q 210 210 148 210"
              stroke="url(#monoGrad)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"
              strokeDasharray="900" strokeDashoffset={visible ? 0 : 900}
              style={{ transition: "stroke-dashoffset 2.5s ease-out 0.3s, opacity 1s ease-out 0.3s", opacity: visible ? 1 : 0 }} />
        {/* Inner accents */}
        <path d="M 64 200 L 64 92 L 92 124 L 106 92 L 106 200"
              stroke="#22d3ee" strokeWidth="2" opacity={0.2 * (visible ? 1 : 0)} strokeLinecap="round"
              style={{ transition: "opacity 1.5s ease-out 0.8s" }} />
        <path d="M 156 92 Q 202 92 202 145 Q 202 198 156 198"
              stroke="#6366f1" strokeWidth="2" opacity={0.2 * (visible ? 1 : 0)} strokeLinecap="round"
              style={{ transition: "opacity 1.5s ease-out 1s" }} />
        {/* Dots */}
        <circle cx="48" cy="130" r="2.5" fill="#22d3ee" opacity={0.3 * (visible ? 1 : 0)}
                style={{ transition: "opacity 1s ease-out 1.2s" }} />
        <circle cx="208" cy="115" r="2.5" fill="#6366f1" opacity={0.3 * (visible ? 1 : 0)}
                style={{ transition: "opacity 1s ease-out 1.4s" }} />
      </svg>
    </motion.div>
  );
}

// ─── Wordmark + tagline ───
function Wordmark({ phase }: { phase: number }) {
  const show = phase >= 2;
  return (
    <motion.div
      className="z-10 text-center mt-1"
      initial={{ opacity: 0, y: 12 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div
        className="text-[22px] sm:text-[26px] font-bold tracking-[6px] sm:tracking-[8px] leading-tight"
        style={{
          background: "linear-gradient(90deg, #22d3ee, #a78bfa, #6366f1)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        MISSION
      </div>
      <div
        className="text-[22px] sm:text-[26px] font-bold tracking-[6px] sm:tracking-[8px] leading-tight"
        style={{
          background: "linear-gradient(90deg, #22d3ee, #a78bfa, #6366f1)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        CONTROL
      </div>
      <p className="text-[9px] tracking-[5px] mt-2" style={{ color: "var(--accent, #22d3ee)", opacity: 0.2 }}>
        ▸ FULL STACK COMMAND CENTER ◂
      </p>
    </motion.div>
  );
}

// ─── Boot messages ───
function BootMessages({ phase }: { phase: number }) {
  const messages = [
    { text: "> BOOTING NEXT.JS ENGINE ........ OK", highlight: false, showAt: 2 },
    { text: "> MOUNTING SUPABASE CLIENT ....... OK", highlight: false, showAt: 3 },
    { text: "> SYNCING POWER BI DASHBOARDS ... OK", highlight: false, showAt: 3 },
    { text: "> FULL STACK COMMAND CENTER ...... READY", highlight: true, showAt: 4 },
  ];
  return (
    <div className="absolute bottom-32 left-8 right-8 z-10 pointer-events-none">
      {messages.map((msg, i) => {
        const visible = phase >= msg.showAt;
        const charCount = msg.text.length;
        return (
          <motion.p
            key={i}
            className="text-[8px] font-mono tracking-[2px] leading-[2.2]"
            style={{
              color: msg.highlight ? "var(--accent-alt, #a78bfa)" : "var(--accent, #22d3ee)",
              opacity: 0,
            }}
            animate={visible ? { opacity: msg.highlight ? 0.4 : 0.15 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: i * 0.8 + 0.1 }}
          >
            <span
              className="inline-block overflow-hidden whitespace-nowrap align-bottom border-r-2 border-current"
              style={{
                maxWidth: visible ? 400 : 0,
                animation: visible
                  ? `type-reveal ${0.5 + charCount * 0.04}s steps(${charCount}) ${i * 0.15}s forwards`
                  : "none",
              }}
            >
              {msg.text}
            </span>
            {visible && (
              <span
                className="inline-block w-[2px] h-[9px] align-middle ml-[1px] bg-current"
                style={{
                  animation: "blink-cursor 0.8s step-end infinite",
                  animationDelay: `${0.5 + charCount * 0.04 + i * 0.15}s`,
                }}
              />
            )}
          </motion.p>
        );
      })}
    </div>
  );
}

// ─── Engine glow (CSS animation) ───
function EngineGlow({ visible }: { visible: boolean }) {
  return (
    <div
      className="absolute bottom-24 left-1/2 z-[5] pointer-events-none"
      style={{
        width: 100,
        height: 200,
        marginLeft: -50,
        background: "linear-gradient(0deg, var(--accent, #22d3ee) 0%, var(--accent-alt, #6366f1) 30%, transparent 70%)",
        filter: "blur(40px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 1s ease-out",
        animation: visible ? "engine-glow-pulse 1.8s ease-in-out infinite" : "none",
      }}
    />
  );
}

// ─── Treasure Planet Solar Sailer — Authentic redesign ───
function TreasureShip({ phase, glowIntensity: gi }: { phase: number; glowIntensity: number }) {
  const warp = phase >= 3;
  const exiting = phase === 4;
  const charge = phase === 2;

  // Dynamic plume scaling: charge → plume grows, warp → max, exit → fades
  const plumeRx = exiting ? 4 : 14 + gi * 42 + (charge ? 10 : 0);
  const plumeRy = exiting ? 2 : 7 + gi * 18 + (charge ? 6 : 0);

  // Sail flutter intensity during warp
  const sailFlutter = warp ? (phase === 4 ? 0.3 : 1) : 0;

  return (
    <svg
      width="180" height="100" viewBox="0 0 180 100"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: exiting
          ? "drop-shadow(0 0 8px var(--accent-alt, #6366f1))"
          : `drop-shadow(0 0 ${30 + gi * 60}px var(--accent-alt, #6366f1)) drop-shadow(0 0 ${15 + gi * 40}px var(--accent, #22d3ee))`,
        transition: "filter 0.3s ease-out",
      }}
    >
      <defs>
        {/* Engine plume gradient — cyan core → indigo → transparent */}
        <radialGradient id="plumeGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.9} />
          <stop offset="15%" stopColor="var(--accent, #22d3ee)" stopOpacity={0.8} />
          <stop offset="40%" stopColor="var(--accent-alt, #6366f1)" stopOpacity={0.4} />
          <stop offset="100%" stopColor="var(--accent-alt, #6366f1)" stopOpacity={0} />
        </radialGradient>

        {/* Sail gradient — translucent cyan-to-indigo with internal glow */}
        <linearGradient id="sailGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent-alt, #6366f1)" stopOpacity={0.35} />
          <stop offset="40%" stopColor="var(--accent, #06b6d4)" stopOpacity={0.15} />
          <stop offset="80%" stopColor="var(--accent, #22d3ee)" stopOpacity={0.08} />
          <stop offset="100%" stopColor="var(--accent-alt, #4f46e5)" stopOpacity={0.02} />
        </linearGradient>

        {/* Sail grid pattern */}
        <pattern id="sailGrid" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="none" />
          <path d="M8 0L0 0 0 8" fill="none" stroke="var(--accent, #22d3ee)" strokeWidth="0.3" opacity="0.15" />
        </pattern>

        {/* Hull gradient — dark metallic with cyan/indigo sheen */}
        <linearGradient id="hullGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="30%" stopColor="var(--accent-alt, #4f46e5)" stopOpacity={0.6} />
          <stop offset="55%" stopColor="var(--accent-alt, #6366f1)" stopOpacity={0.4} />
          <stop offset="80%" stopColor="var(--accent, #06b6d4)" stopOpacity={0.3} />
          <stop offset="100%" stopColor="var(--accent, #0891b2)" stopOpacity={0.5} />
        </linearGradient>

        {/* Hull edge highlight */}
        <linearGradient id="hullEdge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(99,102,241,0.08)" />
        </linearGradient>

        {/* Engine nozzle gradient */}
        <linearGradient id="nozzleGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2d2d44" />
          <stop offset="50%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="var(--accent-alt, #4f46e5)" stopOpacity={0.5} />
        </linearGradient>

        {/* Cockpit glow */}
        <radialGradient id="cockpitGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent, #22d3ee)" stopOpacity={0.4} />
          <stop offset="60%" stopColor="var(--accent-alt, #6366f1)" stopOpacity={0.1} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Hull glow overlay for charge phase */}
        <radialGradient id="hullGlowGrad" cx="40%" cy="50%" r="60%">
          <stop offset="0%" stopColor="var(--accent, #22d3ee)" stopOpacity={0.3} />
          <stop offset="60%" stopColor="var(--accent-alt, #6366f1)" stopOpacity={0.08} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* ── LAYER 1: Engine plume (behind everything) ── */}
      <motion.ellipse
        cx="148" cy="50"
        rx={plumeRx} ry={plumeRy}
        fill="url(#plumeGrad)"
        animate={exiting ? { opacity: [0.4, 0.1, 0], scale: [1, 0.4, 0] } : {
          opacity: charge ? [0.3, 0.95, 0.3] : [0.25, 0.85, 0.25],
          scaleX: [1, 1.35, 1],
          scaleY: [1, 1.2, 1],
        }}
        transition={exiting
          ? { duration: 0.5, ease: "easeIn" }
          : { duration: charge ? 0.12 : 0.2 + (1 - gi * 0.3) * 0.3, repeat: Infinity, ease: "easeInOut" }
        }
        style={{ filter: "blur(16px)" }}
      />
      <motion.ellipse
        cx="144" cy="50"
        rx={exiting ? 2 : 7 + gi * 26 + (charge ? 6 : 0)}
        ry={exiting ? 1 : 3 + gi * 10 + (charge ? 4 : 0)}
        fill="var(--accent, #22d3ee)"
        animate={exiting ? { opacity: [0.6, 0.1, 0] } : {
          opacity: [0.4, 1, 0.4],
          scale: [1, charge ? 1.3 : 1.12, 1],
        }}
        transition={exiting
          ? { duration: 0.35, ease: "easeIn" }
          : { duration: charge ? 0.08 : 0.12 + (1 - gi * 0.3) * 0.2, repeat: Infinity, ease: "easeInOut" }
        }
        style={{ filter: "blur(6px)" }}
      />
      <motion.ellipse
        cx="142" cy="50"
        rx={exiting ? 0.8 : 2 + gi * 10 + (charge ? 3 : 0)}
        ry={exiting ? 0.4 : 1 + gi * 5 + (charge ? 2 : 0)}
        fill="#ffffff"
        animate={exiting ? { opacity: [0.8, 0, 0] } : { opacity: [0.5, 1, 0.5] }}
        transition={exiting
          ? { duration: 0.25 }
          : { duration: charge ? 0.03 : 0.05, repeat: Infinity }
        }
        style={{ filter: "blur(3px)" }}
      />

      {/* ── LAYER 2: Upper solar sail ── */}
      <g>
        <motion.path
          d="M48 50 L85 2 L130 12 L108 32 Z"
          fill="url(#sailGrad)" stroke="var(--accent-alt, #6366f1)" strokeWidth="0.5"
          animate={exiting
            ? { scaleX: [1, 0.5, 0], opacity: [0.6, 0.15, 0], x: [0, -8, -20], y: [0, -4, -10] }
            : warp
              ? { scaleX: [1, 1.4, 0.7, 1.35, 1], opacity: [0.6, 0.2, 0.4, 0.15, 0.6], y: [0, -3, 2, -2, 0] }
              : charge
                ? { scaleX: [1, 1.1, 1], opacity: [0.6, 0.4, 0.6] }
                : {}
          }
          transition={exiting
            ? { duration: 0.5, ease: "easeIn" }
            : warp
              ? { duration: 0.7, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.6 + gi * 0.3, repeat: Infinity, ease: "easeInOut" }
          }
        />
        {/* Sail grid overlay */}
        <motion.path
          d="M48 50 L85 2 L130 12 L108 32 Z"
          fill="url(#sailGrid)" stroke="none"
          animate={exiting ? { opacity: 0 } : { opacity: sailFlutter > 0 ? [0.4, 0.15, 0.4] : 0.4 }}
          transition={warp ? { duration: 0.7, repeat: Infinity } : {}}
        />
        {/* Sail boom / mast line */}
        <line x1="48" y1="50" x2="130" y2="12" stroke="var(--accent-alt, #6366f1)" strokeWidth="0.5" opacity={0.3} />
      </g>

      {/* ── LAYER 3: Lower solar sail ── */}
      <g>
        <motion.path
          d="M48 50 L85 98 L130 88 L108 68 Z"
          fill="url(#sailGrad)" stroke="var(--accent-alt, #6366f1)" strokeWidth="0.5"
          animate={exiting
            ? { scaleX: [1, 0.5, 0], opacity: [0.6, 0.15, 0], x: [0, -8, -20], y: [0, 4, 10] }
            : warp
              ? { scaleX: [1, 1.4, 0.7, 1.35, 1], opacity: [0.6, 0.2, 0.4, 0.15, 0.6], y: [0, 3, -2, 2, 0] }
              : charge
                ? { scaleX: [1, 1.1, 1], opacity: [0.6, 0.4, 0.6] }
                : {}
          }
          transition={exiting
            ? { duration: 0.5, ease: "easeIn", delay: 0.06 }
            : warp
              ? { duration: 0.7, repeat: Infinity, ease: "easeInOut", delay: 0.08 }
              : { duration: 0.6 + gi * 0.3, repeat: Infinity, ease: "easeInOut", delay: 0.08 }
          }
        />
        <motion.path
          d="M48 50 L85 98 L130 88 L108 68 Z"
          fill="url(#sailGrid)" stroke="none"
          animate={exiting ? { opacity: 0 } : { opacity: sailFlutter > 0 ? [0.4, 0.15, 0.4] : 0.4 }}
          transition={warp ? { duration: 0.7, repeat: Infinity, delay: 0.08 } : {}}
        />
        <line x1="48" y1="50" x2="130" y2="88" stroke="var(--accent-alt, #6366f1)" strokeWidth="0.5" opacity={0.3} />
      </g>

      {/* ── LAYER 4: Main hull ── */}
      <motion.path
        d="M12 50 L35 28 L88 36 L140 45 L140 55 L88 64 L35 72 Z"
        fill="url(#hullGrad)"
        stroke="var(--accent, #22d3ee)"
        strokeWidth="0.6"
        animate={exiting ? { opacity: 0, scale: 0.4 } : {
          filter: charge ? ["brightness(1)", "brightness(1.4)", "brightness(1)"] : undefined,
        }}
        transition={exiting ? { duration: 0.4 } : { duration: 0.4, repeat: charge ? Infinity : 0, ease: "easeInOut" }}
      />
      {/* Hull edge highlight line */}
      <motion.path
        d="M12 50 L35 28 L88 36 L140 45"
        fill="none" stroke="url(#hullEdge)" strokeWidth="1"
        animate={exiting ? { opacity: 0 } : { opacity: [0.4, 0.8, 0.4] }}
        transition={charge ? { duration: 0.6, repeat: Infinity } : { duration: 0 }}
      />

      {/* ── LAYER 5: Hull panel lines (greebles) ── */}
      <g
        opacity={exiting ? 0 : 0.15}
        style={{ transition: "opacity 0.3s" }}
      >
        {/* Horizontal panel line */}
        <path d="M30 42 L120 48" stroke="var(--accent, #22d3ee)" strokeWidth="0.3" fill="none" />
        <path d="M30 58 L120 52" stroke="var(--accent-alt, #6366f1)" strokeWidth="0.3" fill="none" />
        {/* Vertical panel lines */}
        <path d="M60 34 L60 66" stroke="var(--accent, #22d3ee)" strokeWidth="0.2" fill="none" opacity={0.5} />
        <path d="M90 37 L90 63" stroke="var(--accent-alt, #6366f1)" strokeWidth="0.2" fill="none" opacity={0.5} />
        <path d="M110 40 L110 59" stroke="var(--accent, #22d3ee)" strokeWidth="0.2" fill="none" opacity={0.5} />
        {/* Rivet dots */}
        <circle cx="75" cy="36" r="0.6" fill="var(--accent, #22d3ee)" opacity={0.5} />
        <circle cx="100" cy="38" r="0.6" fill="var(--accent-alt, #6366f1)" opacity={0.5} />
        <circle cx="75" cy="64" r="0.6" fill="var(--accent, #22d3ee)" opacity={0.5} />
        <circle cx="100" cy="62" r="0.6" fill="var(--accent-alt, #6366f1)" opacity={0.5} />
        {/* Side marking accent */}
        <path d="M30 50 L50 50" stroke="var(--accent, #22d3ee)" strokeWidth="0.4" fill="none" opacity={0.3} />
      </g>

      {/* ── LAYER 6: Engine nozzle ── */}
      <motion.path
        d="M132 42 L155 44 L158 50 L155 56 L132 58 Z"
        fill="url(#nozzleGrad)"
        stroke="var(--accent-alt, #6366f1)" strokeWidth="0.4"
        animate={exiting ? { opacity: 0, scaleX: 0.6 } : {
          fill: charge ? ["url(#nozzleGrad)", "var(--accent, #22d3ee)", "url(#nozzleGrad)"] : undefined,
        }}
        transition={{ duration: 0.3 }}
      />
      {/* Nozzle inner ring glow */}
      <motion.ellipse
        cx="155" cy="50" rx="4" ry="8"
        fill="none" stroke="var(--accent, #22d3ee)" strokeWidth="0.3"
        animate={exiting ? { opacity: 0 } : { opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 0.15 + (1 - gi) * 0.2, repeat: Infinity }}
      />

      {/* ── LAYER 7: Upper fin/wing ── */}
      <path
        d="M35 28 L50 14 L72 22 L68 30 Z"
        fill="var(--accent-alt, #4f46e5)" stroke="var(--accent-alt, #6366f1)" strokeWidth="0.3"
        opacity={exiting ? 0 : 0.7}
        style={{ transition: "opacity 0.3s" }}
      />
      {/* Lower fin */}
      <path
        d="M35 72 L50 86 L72 78 L68 70 Z"
        fill="var(--accent-alt, #4f46e5)" stroke="var(--accent-alt, #6366f1)" strokeWidth="0.3"
        opacity={exiting ? 0 : 0.7}
        style={{ transition: "opacity 0.3s" }}
      />

      {/* ── LAYER 8: Cockpit ── */}
      <ellipse
        cx="28" cy="50" rx="9" ry="12"
        fill="var(--bg-primary, #020617)"
        stroke="var(--accent, #22d3ee)" strokeWidth="0.5"
      />
      {/* Cockpit glass reflection */}
      <motion.ellipse
        cx="28" cy="50" rx="6" ry="8"
        fill="url(#cockpitGrad)"
        animate={exiting ? { opacity: 0 } : { opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 0.8 + gi * 0.4, repeat: Infinity }}
      />
      {/* Cockpit inner glow dot */}
      <motion.circle
        cx="26" cy="47" r="2"
        fill="var(--accent, #22d3ee)"
        animate={exiting ? { opacity: 0 } : charge
          ? { opacity: [0.3, 1, 0.3], r: [2, 3.5, 2] }
          : { opacity: [0.15, 0.7, 0.15] }
        }
        transition={charge
          ? { duration: 0.25, repeat: Infinity }
          : { duration: 0.6, repeat: Infinity }
        }
      />
      {/* Cockpit rim */}
      <path
        d="M20 42 Q28 39 36 42"
        stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" fill="none"
      />

      {/* ── LAYER 9: Stern ornament / tail accent ── */}
      <path
        d="M125 42 L140 35 L140 65 L125 58 Z"
        fill="var(--accent-alt, #6366f1)"
        opacity={exiting ? 0 : 0.08}
        style={{ transition: "opacity 0.3s" }}
      />

      {/* ── LAYER 10: Warp charge rings (phase 2) ── */}
      {charge && !exiting && [0, 1, 2].map((i) => (
        <motion.ellipse
          key={`charge-${i}`}
          cx="145" cy="50"
          rx={2 + i * 14} ry={1 + i * 6}
          stroke={i % 2 === 0 ? "var(--accent, #06b6d4)" : "var(--accent-alt, #6366f1)"}
          strokeWidth="0.3" fill="none"
          animate={{ rx: [2 + i * 14, 2 + i * 22], opacity: [0.35, 0] }}
          transition={{ duration: 0.4 + i * 0.15, repeat: Infinity, delay: i * 0.08 }}
        />
      ))}

      {/* ── LAYER 11: Warp rings (phase 3+) ── */}
      {warp && !exiting && [0, 1, 2].map((i) => (
        <motion.ellipse
          key={`warp-${i}`}
          cx={70 + i * 18} cy="50"
          rx={4 + i * 12 * gi} ry={1.5 + i * 5 * gi}
          stroke={i % 2 === 0 ? "var(--accent, #06b6d4)" : "var(--accent-alt, #6366f1)"}
          strokeWidth="0.4" fill="none"
          animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
          transition={{ duration: 0.2 + i * 0.1, repeat: Infinity, delay: i * 0.05 }}
        />
      ))}

      {/* ── LAYER 12: Hull glow during charge ── */}
      {charge && (
        <motion.ellipse
          cx="75" cy="50" rx="55" ry="20"
          fill="url(#hullGlowGrad)"
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ pointerEvents: "none" }}
        />
      )}

      {/* ── LAYER 13: Warp stretch lines (phase 3 only) ── */}
      {warp && !exiting && (
        <>
          {[0, 1, 2, 3].map((i) => (
            <motion.line
              key={`stretch-${i}`}
              x1={20 + i * 30} y1={15 + i * 8}
              x2={20 + i * 30} y2={20 + i * 8}
              stroke="var(--accent, #22d3ee)" strokeWidth="0.3"
              animate={{ opacity: [0, 0.3, 0], y: [0, -15] }}
              transition={{ duration: 0.15 + i * 0.05, repeat: Infinity, delay: i * 0.04 }}
            />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <motion.line
              key={`stretch-b-${i}`}
              x1={20 + i * 30} y1={80 - i * 8}
              x2={20 + i * 30} y2={85 - i * 8}
              stroke="var(--accent-alt, #6366f1)" strokeWidth="0.3"
              animate={{ opacity: [0, 0.3, 0], y: [0, 15] }}
              transition={{ duration: 0.15 + i * 0.05, repeat: Infinity, delay: i * 0.04 }}
            />
          ))}
        </>
      )}
    </svg>
  );
}

// ─── Flash transition overlay ───
function FlashOverlay({ show }: { show: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-30"
      style={{
        background: "radial-gradient(ellipse at center, color-mix(in srgb, var(--accent-alt, #6366f1) 35%, transparent), color-mix(in srgb, var(--accent, #22d3ee) 15%, transparent), transparent)",
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
function EnergyParticles({ warp, count = 6 }: { warp: boolean; count?: number }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      size: 2 + Math.random() * 5,
      dx: -30 + Math.random() * 60,
      dy: -30 + Math.random() * 60,
      dx2: -60 + Math.random() * 120,
      dy2: -60 + Math.random() * 120,
      duration: 1.5 + Math.random() * 1.5,
      delay: i * 0.2,
    })), [count]);

  if (!warp) return null;
  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            background: `radial-gradient(circle, rgba(255,255,255,0.9), color-mix(in srgb, var(--accent-alt, #6366f1) 30%, transparent))`,
            boxShadow: `0 0 ${p.size * 4}px color-mix(in srgb, var(--accent-alt, #6366f1) 50%, transparent)`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.9, 0],
            scale: [0, 2, 0],
            x: [0, p.dx, p.dx2],
            y: [0, p.dy, p.dy2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Glitch overlay for exit ───
function GlitchOverlay({ active }: { active: boolean }) {
  return (
    <motion.div
      className={`absolute inset-0 pointer-events-none z-40 ${active ? "glitch-active" : ""}`}
      style={{
        background: "linear-gradient(90deg, color-mix(in srgb, var(--accent, #22d3ee) 8%, transparent) 0%, transparent 50%, color-mix(in srgb, var(--accent-alt, #6366f1) 8%, transparent) 100%)",
      }}
      animate={active ? {
        opacity: [0, 0.15, 0.3, 0.1, 0.2, 0],
      } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    />
  );
}

// ─── MAIN COMPONENT ───
export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  const mouseRef = useRef({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();
  const tier = useDeviceTier();
  const { theme } = useTheme();
  onCompleteRef.current = onComplete;

  const cfg = TIER_CFG[tier];

  // Stars — regenerated only when tier changes
  const stars = useMemo(() => genStars(cfg.stars), [cfg.stars]);

  // Skip animation timing entirely for reduced motion
  useEffect(() => {
    if (prefersReducedMotion) {
      onCompleteRef.current();
      return;
    }
    const t: ReturnType<typeof setTimeout>[] = [];
    t.push(setTimeout(() => setPhase(1), cfg.phase1));
    t.push(setTimeout(() => setPhase(2), cfg.phase2));
    t.push(setTimeout(() => setPhase(3), cfg.phase3));
    t.push(setTimeout(() => setPhase(4), cfg.phase4));
    t.push(setTimeout(() => onCompleteRef.current(), cfg.complete));
    return () => t.forEach(clearTimeout);
  }, [prefersReducedMotion, cfg.phase1, cfg.phase2, cfg.phase3, cfg.phase4, cfg.complete]);

  // Mouse parallax
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

  // ── Click/tap anywhere to skip ──
  useEffect(() => {
    const skip = () => { if (!prefersReducedMotion) onCompleteRef.current(); };
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("click", skip);
    return () => el.removeEventListener("click", skip);
  }, [prefersReducedMotion]);

  const warpActive = phase >= 3;
  const transitActive = phase === 4;
  const mx = mouseRef.current.x;
  const my = mouseRef.current.y;

  // Build ship animation phases — dramatic Treasure Planet flight path
  const shipPhase = (p: number): HTMLMotionProps<"div">["animate"] => {
    if (p === 0) {
      return {
        x: "55vw", y: "-20vh",
        opacity: 0, scale: 0.08, rotate: 35,
      };
    }
    if (p === 1) {
      // Swoop in from upper-right on a curved arc, decelerate to center
      return {
        x: ["55vw", "calc(50vw + 160px)", "calc(50vw)"],
        y: ["-20vh", "calc(50vh - 150px)", "calc(50vh - 50px)"],
        opacity: [0, 0.4, 1],
        scale: [0.08, 0.35, 0.75],
        rotate: [35, 15, -4],
      };
    }
    if (p === 2) {
      // Charge phase — ship settles with energy vibration
      return {
        x: "calc(50vw)", y: "calc(50vh - 50px)",
        opacity: 1,
        scale: [0.75, 1.15, 0.9, 1.1, 1.0],
        rotate: [-4, -2, -1, -2, -1],
      };
    }
    if (p === 3) {
      // Warp activation — ship shakes, strains against the warp field
      return {
        x: "calc(50vw)", y: "calc(50vh - 50px)",
        scale: [1.0, 1.35, 0.85, 1.25, 0.9, 1.1],
        rotate: [-1, 3, -2, 4, -1, 0],
      };
    }
    // Phase 4 — dramatic exit: ship shoots upward with scale trick
    return {
      x: "calc(50vw)", y: "-45vh",
      opacity: 0, scale: 0.08, rotate: 25,
    };
  };

  return (
    <>
      {/* Inject CSS keyframes once */}
      <style>{starfieldStyles}</style>

      {/* Skip button — appears on focus */}
      <button
        onClick={onComplete}
        tabIndex={0}
        className="fixed top-4 left-4 z-[10000] sr-only focus:not-sr-only focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-mono focus:bg-[var(--bg-primary,#020617)] focus:text-[var(--accent)] focus:border-2 focus:border-[var(--accent)] focus:outline-none"
        aria-label="Pular animação de abertura"
      >
        Pular ▸
      </button>

      {/* ── Exit transition: slide-up + glitch ── */}
      <motion.div
        exit={{
          y: "-100%",
          opacity: 0,
          transition: { duration: 0.9, ease: [0.55, 0, 0.1, 1] },
        }}
        className="fixed inset-0 z-[9999]"
      >
      <motion.div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden cursor-default"
        style={{
          perspective: "1000px",
          backgroundColor: theme === "light" ? "#0a0a1a" : "var(--bg-primary, #020617)",
        }}
      >
        {/* ── LAYER 1: Deep background nebula ── */}
        <div
          className="absolute inset-0 transition-opacity duration-[2000ms]"
          style={{
            opacity: phase > 0 ? 0.4 : 0,
            background: `
              radial-gradient(ellipse at ${30 + mx * 12}% ${35 + my * 12}%, color-mix(in srgb, var(--accent-alt, #6366f1) 20%, transparent) 0%, transparent 60%),
              radial-gradient(ellipse at ${70 - mx * 12}% ${65 - my * 12}%, color-mix(in srgb, var(--accent, #06b6d4) 15%, transparent) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--accent-alt, #a78bfa) 10%, transparent) 0%, transparent 70%)
            `,
            filter: "blur(50px)",
            willChange: "opacity, background",
          }}
        />

        {/* ── LAYER 2: Starfield (CSS, 0 React cost) ── */}
        <StarLayer stars={stars} />

        {/* ── LAYER 2.5: Background pattern asset ── */}
        <img
          src={theme === "light" ? "/splash-bg-pattern-light.svg" : "/splash-bg-pattern.svg"}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none select-none z-[2]"
          style={{
            opacity: phase > 0 ? 0.25 : 0,
            transition: "opacity 2s ease-out",
            mixBlendMode: "overlay",
          }}
        />

        {/* ── LAYER 2.6: Film grain overlay — small tiled texture (cache-friendly), shifted via background-position for zero-layout cost ── */}
        <div
          className="absolute inset-0 pointer-events-none z-[2]"
          aria-hidden="true"
          style={{
            opacity: 0.35,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
            mixBlendMode: "overlay",
            animation: "grain-shift 8s steps(10) infinite",
            willChange: "background-position",
          }}
        />

        {/* ── LAYER 3: Scanline sweep ── */}
        <div
          className="absolute inset-0 pointer-events-none z-[3]"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in srgb, var(--accent) 3%, transparent) 2px, color-mix(in srgb, var(--accent) 3%, transparent) 3px)",
            opacity: 0.6,
          }}
        />

        {/* ── LAYER 4: HUD corners + status ── */}
        <HudCorners opacity={phase >= 1 ? 0.3 : 0} />

        {/* Status line */}
        <motion.div
          className="absolute top-[58px] left-0 right-0 text-center z-10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[9px] tracking-[4px] font-mono" style={{ color: "var(--accent, #22d3ee)", opacity: 0.2 }}>
            SYSTEM CONTROL v3.1
          </span>
        </motion.div>

        {/* ── LAYER 5: Engine glow ── */}
        <EngineGlow visible={phase >= 1} />

        {/* ── LAYER 6: MC Logo + Wordmark ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10" style={{ marginTop: "-40px" }}>
          <McMonogram phase={phase} />
          <Wordmark phase={phase} />
        </div>

        {/* ── LAYER 7: Boot messages ── */}
        <BootMessages phase={phase} />

        {/* ── LAYER 8: Warp effects ── */}
        {tier !== "low" && (
          <div style={{ opacity: warpActive ? 1 : 0, transition: "opacity 0.3s" }}>
            <WarpRingLayer count={cfg.rings} />
            <WarpStreaks count={cfg.streaks} />
          </div>
        )}

        {/* ── LAYER 9: Ship ── */}
        <motion.div
          className="absolute z-10 pointer-events-none"
          animate={shipPhase(phase)}
          transition={
            phase === 1 ? { duration: 2.0, ease: [0.25, 0.6, 0.2, 1] } :
            phase === 2 ? { duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] } :
            phase === 3 ? { duration: 1.5, ease: "easeInOut" } :
            phase === 4 ? { duration: 1.2, ease: [0.55, 0, 1, 0.45] } :
            { duration: 1 }
          }
          style={{ transform: `translate(${mx * 16}px, ${my * 16}px)`, willChange: "transform, opacity" }}
        >
          <TreasureShip phase={phase} glowIntensity={Math.min(1, phase / 2)} />

          {/* Engine trail particles — enhanced with spark/ember effect */}
          {phase >= 2 && (
            <div className="absolute top-1/2 left-[calc(100%)] -translate-y-1/2" style={{ width: 0, height: 0 }}>
              {Array.from({ length: cfg.trailParticles }).map((_, i) => {
                const isSpark = i % 3 === 0;
                return (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: isSpark ? 1 + Math.random() * 2 : 1 + Math.random() * 4,
                      height: isSpark ? 1 + Math.random() * 2 : 1 + Math.random() * 4,
                      background: isSpark
                        ? `radial-gradient(circle, rgba(255,255,255,0.9), var(--accent, #22d3ee))`
                        : `radial-gradient(circle, var(--accent, #22d3ee), var(--accent-alt, #6366f1))`,
                      top: -8 + Math.random() * 16,
                      left: 0,
                      filter: isSpark ? "blur(0.5px)" : "blur(1.5px)",
                      boxShadow: isSpark
                        ? "0 0 4px var(--accent, #22d3ee)"
                        : "0 0 2px var(--accent-alt, #6366f1)",
                    }}
                    animate={{
                      x: [0, -(30 + Math.random() * 120)],
                      y: isSpark ? [0, -8 + Math.random() * 16] : [0, -4 + Math.random() * 8],
                      opacity: [0.9, 0],
                      scale: [1, 0.05],
                    }}
                    transition={{
                      duration: phase >= 3
                        ? 0.1 + Math.random() * 0.15
                        : 0.2 + Math.random() * 0.4,
                      repeat: Infinity,
                      delay: i * (0.02 + Math.random() * 0.04),
                      ease: "easeOut",
                    }}
                  />
                );
              })}
            </div>
          )}
        </motion.div>

        {/* ── LAYER 10: Energy particles ── */}
        <EnergyParticles warp={warpActive} count={cfg.energyParticles} />

        {/* ── LAYER 11: Flash transition ── */}
        <FlashOverlay show={transitActive} />

        {/* ── LAYER 12: Glitch overlay on exit ── */}
        <GlitchOverlay active={transitActive} />

        {/* ── LAYER 13: Progress bar + loading ── */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          animate={transitActive ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-32 h-[2px] bg-[var(--border)]/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(100, (phase / 4) * 100)}%` }}
              transition={{ duration: 0.3 }}
              style={{
                background: `linear-gradient(90deg, var(--accent-alt, #6366f1), var(--accent, #22d3ee))`,
                boxShadow: "0 0 8px color-mix(in srgb, var(--accent) 50%, transparent)",
              }}
            />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-center text-[10px] font-mono text-[var(--accent)]/60 mt-2 tracking-[0.3em]"
          >
            {phase <= 3 ? "INICIALIZANDO" : "PRONTO"}
          </motion.p>
        </motion.div>

        {/* ── LAYER 14: Vignette ── */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(2,6,23,0.7)_100%)]" />

        {/* ── LAYER 15: Letterbox bars ── */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[12%] z-20 pointer-events-none"
          style={{
            backgroundColor: theme === "light" ? "#0a0a1a" : "var(--bg-primary, #020617)",
            willChange: "opacity",
          }}
          animate={{ opacity: transitActive ? 0 : 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[12%] z-20 pointer-events-none"
          style={{
            backgroundColor: theme === "light" ? "#0a0a1a" : "var(--bg-primary, #020617)",
            willChange: "opacity",
          }}
          animate={{ opacity: transitActive ? 0 : 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Tier badge (dev only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="absolute bottom-4 right-4 z-50 text-[8px] font-mono opacity-20 text-[var(--accent)]">
            {tier.toUpperCase()} · ⭐{cfg.stars}
          </div>
        )}
      </motion.div>
      </motion.div>
    </>
  );
}
