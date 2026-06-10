"use client";

import { useState, useEffect, useRef, useMemo, memo } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { useDeviceTier, type DeviceTier } from "@/hooks/useDeviceTier";
import { useTheme } from "./ThemeProvider";

// ─── Tier config ───
const TIER_CFG: Record<DeviceTier, {
  stars: number; streaks: number; trailParticles: number;
  energyParticles: number; phase1: number; phase2: number; phase3: number;
  phase4: number; complete: number;
}> = {
  low:    { stars: 80,  streaks: 0, trailParticles: 0,  energyParticles: 0, phase1: 800,  phase2: 2200, phase3: 4800, phase4: 7300,  complete: 8800 },
  mid:    { stars: 200, streaks: 10, trailParticles: 6,  energyParticles: 4, phase1: 1200, phase2: 3500, phase3: 6000, phase4: 9000,  complete: 11000 },
  high:   { stars: 400, streaks: 20, trailParticles: 12, energyParticles: 8, phase1: 1500, phase2: 4200, phase3: 7500, phase4: 11000, complete: 13000 },
};

// ─── CSS keyframes injection ───
const splashStyles = `
@keyframes drift-cyan { 0% { transform: translateY(0) translateX(0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(-600px) translateX(40px); opacity: 0; } }
@keyframes drift-indigo { 0% { transform: translateY(0) translateX(0); opacity: 0; } 10% { opacity: 0.7; } 90% { opacity: 0.7; } 100% { transform: translateY(-500px) translateX(-30px); opacity: 0; } }
@keyframes drift-white { 0% { transform: translateY(0) translateX(0); opacity: 0; } 15% { opacity: 0.5; } 85% { opacity: 0.5; } 100% { transform: translateY(-800px) translateX(20px); opacity: 0; } }
@keyframes walk-leg { 0%, 100% { transform: rotate(-12deg); } 50% { transform: rotate(12deg); } }
@keyframes dig-leg { 0%, 100% { transform: rotate(-20deg) translateY(0); } 50% { transform: rotate(10deg) translateY(4px); } }
@keyframes hole-pulse { 0%, 100% { opacity: 0.15; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.08); } }
@keyframes particle-spiral { 0% { transform: rotate(0deg) translateX(0) scale(1); opacity: 0; } 20% { opacity: 0.7; } 80% { opacity: 0.7; } 100% { transform: rotate(360deg) translateX(80px) scale(0.3); opacity: 0; } }
@keyframes dig-dust { 0% { transform: translateY(0) scale(1); opacity: 0.7; } 100% { transform: translateY(-30px) scale(0); opacity: 0; } }
@keyframes boot-fade-in { 0% { opacity: 0; transform: translateY(6px); } 100% { opacity: 1; transform: translateY(0); } }
@keyframes glitch-skew { 0% { clip-path: inset(0 0 0 0); transform: skew(0deg); } 10% { clip-path: inset(12% 0 50% 0); transform: skew(-1deg); } 20% { clip-path: inset(40% 0 8% 0); transform: skew(0.5deg); } 30% { clip-path: inset(5% 0 65% 0); transform: skew(-0.3deg); } 40% { clip-path: inset(80% 0 5% 0); transform: skew(1deg); } 50% { clip-path: inset(0 0 0 0); transform: skew(0deg); } }
@keyframes scanline-sweep { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
@keyframes grain-shift { 0%, 100% { background-position: 0 0; } 20% { background-position: -5px 5px; } 40% { background-position: 5px -5px; } 60% { background-position: -3px 3px; } 80% { background-position: 3px -3px; } }
@keyframes type-reveal { 0% { max-width: 0; border-right-color: transparent; } 1% { border-right-color: currentColor; } 90% { border-right-color: currentColor; } 100% { max-width: 400px; border-right-color: transparent; } }
@keyframes blink-cursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
@keyframes vignette-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.85; } }
@keyframes hole-suck { 0% { transform: scale(0); opacity: 0; } 30% { opacity: 0.6; } 100% { transform: scale(1); opacity: 0.4; } }
@keyframes info-float { 0% { transform: translateY(40px) scale(0.5); opacity: 0; } 60% { opacity: 1; } 100% { transform: translateY(-20px) scale(1); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { @keyframes drift-cyan { to { opacity: 0; } } @keyframes drift-indigo { to { opacity: 0; } } @keyframes drift-white { to { opacity: 0; } } @keyframes walk-leg { to { } } @keyframes dig-leg { to { } } @keyframes hole-pulse { 0%, 100% { opacity: 0.03; } } @keyframes boot-fade-in { to { opacity: 1; } } }
.glitch-active { animation: glitch-skew 0.6s ease-in-out; }
@media (prefers-reduced-motion: reduce) { .glitch-active { animation: none; } }
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

// ─── Static star layer ───
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

// ─── HUD corner brackets ───
function HudCorners({ opacity = 0.3 }: { opacity?: number }) {
  const corner = (side: "tl" | "tr" | "bl" | "br") => {
    const rotate = side === "tr" ? "scaleX(-1)" : side === "bl" ? "scaleY(-1)" : side === "br" ? "scale(-1, -1)" : "";
    const pos = side.startsWith("t") ? "top-12" : "bottom-28";
    const lr = side.endsWith("l") ? "left-4" : "right-4";
    return (
      <div className={`absolute ${pos} ${lr} z-10`} style={{ transform: rotate, opacity }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M2 26 L2 2 L26 2" stroke="var(--accent, #22d3ee)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  };
  return <>{corner("tl")}{corner("tr")}{corner("bl")}{corner("br")}</>;
}

// ══════════════════════════════════════════════════════════════
//  TATU SVG — A stylized armadillo in Treasure Planet style
// ══════════════════════════════════════════════════════════════
function TatuSVG({
  phase,
  digCount,
}: {
  phase: number;
  digCount: number;
}) {
  const isDigging = phase === 3;
  const isBurst = phase >= 4;

  // Leg animation style
  const legAnim = isDigging ? "dig-leg 0.25s ease-in-out infinite" : "walk-leg 0.35s ease-in-out infinite";

  return (
    <svg width="150" height="100" viewBox="0 0 150 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shellGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="40%" stopColor="#2d2d4a" />
          <stop offset="100%" stopColor="#0f0f1a" />
        </linearGradient>
        <linearGradient id="shellTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.4} />
          <stop offset="50%" stopColor="#6366f1" stopOpacity={0.2} />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.05} />
        </linearGradient>
        <linearGradient id="bandShine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.5} />
          <stop offset="50%" stopColor="#6366f1" stopOpacity={0.1} />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.3} />
        </linearGradient>
      </defs>

      {/* Shadow under tatu (only when not in burst) */}
      {!isBurst && (
        <ellipse cx="80" cy="86" rx="35" ry="6" fill="rgba(0,0,0,0.3)" filter="blur(4px)" />
      )}

      {/* ── TAIL ── */}
      <motion.path
        d="M 117,52 C 130,48 140,32 143,22 C 145,16 147,14 145,18"
        stroke="#6366f1" strokeWidth="3.5" fill="none" strokeLinecap="round"
        animate={isDigging ? { d: ["M 117,52 C 130,48 140,32 143,22 C 145,16 147,14 145,18", "M 117,52 C 130,50 140,38 143,28 C 145,22 147,20 145,24", "M 117,52 C 130,48 140,32 143,22 C 145,16 147,14 145,18"] } : {}}
        transition={isDigging ? { duration: 0.3, repeat: Infinity } : {}}
      />

      {/* ── BACK LEG ── */}
      <motion.g
        animate={isBurst ? { opacity: 0 } : {}}
      >
        <motion.path
          d="M 100,72 L 100,88 Q 100,92 104,90"
          stroke="#2d2d4a" strokeWidth="5" strokeLinecap="round" fill="none"
          style={{ transformOrigin: "100px 74px" }}
          animate={{ rotate: isDigging ? [-12, 12, -12] : [-8, 8, -8] }}
          transition={{ duration: isDigging ? 0.25 : 0.4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Foot glow */}
        <circle cx="102" cy="89" r="3" fill="#22d3ee" opacity={0.15} filter="blur(2px)" />
      </motion.g>

      {/* ── BODY SHELL ── */}
      <motion.path
        d="M 55,48 C 55,20 72,10 98,12 C 118,14 130,26 130,48 C 130,64 120,74 100,76 C 72,78 55,68 55,48 Z"
        fill="url(#shellGrad)"
        stroke="#22d3ee" strokeWidth="0.8"
        animate={isDigging ? { d: ["M 55,48 C 55,20 72,10 98,12 C 118,14 130,26 130,48 C 130,64 120,74 100,76 C 72,78 55,68 55,48 Z", "M 55,50 C 55,22 72,12 98,14 C 118,16 130,28 130,50 C 130,66 120,76 100,78 C 72,80 55,70 55,50 Z"] } : {}}
        transition={isDigging ? { duration: 0.25, repeat: Infinity } : {}}
      />

      {/* Shell top highlight */}
      <motion.path
        d="M 60,48 C 60,24 74,14 98,16 C 114,17 126,27 126,48"
        stroke="url(#shellTop)" strokeWidth="2" fill="none"
        animate={isDigging ? { opacity: [0.3, 0.6, 0.3] } : { opacity: 0.3 }}
        transition={isDigging ? { duration: 0.25, repeat: Infinity } : {}}
      />

      {/* ── SHELL BAND SEGMENTS ── */}
      {[
        { x1: 68, y1: 14, x2: 68, y2: 74 },
        { x1: 84, y1: 11, x2: 84, y2: 76 },
        { x1: 100, y1: 11, x2: 100, y2: 76 },
        { x1: 116, y1: 15, x2: 116, y2: 72 },
      ].map((line, i) => (
        <motion.line
          key={`band-${i}`}
          x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
          stroke="url(#bandShine)" strokeWidth="1.2" fill="none"
          animate={isDigging ? { opacity: [0.3, 0.7, 0.3] } : {}}
          transition={{ duration: 0.3 + i * 0.05, repeat: Infinity }}
        />
      ))}

      {/* Shell band accent dots */}
      {[72, 88, 104, 120].map((x, i) => (
        <circle key={`dot-${i}`} cx={x} cy={i % 2 === 0 ? 22 : 68} r="1.2" fill="#22d3ee" opacity={0.4 + i * 0.1} />
      ))}

      {/* ── HEAD ── */}
      <motion.path
        d="M 55,48 C 50,30 38,24 28,26 C 18,28 10,34 8,42 C 6,50 14,54 24,54 C 34,54 45,54 55,48 Z"
        fill="#1a1a2e" stroke="#6366f1" strokeWidth="0.8"
        animate={isDigging ? { d: ["M 55,48 C 50,30 38,24 28,26 C 18,28 10,34 8,42 C 6,50 14,54 24,54 C 34,54 45,54 55,48 Z", "M 55,50 C 50,32 38,26 28,28 C 18,30 10,36 8,44 C 6,52 14,56 24,56 C 34,56 45,56 55,50 Z"] } : {}}
        transition={isDigging ? { duration: 0.25, repeat: Infinity } : {}}
      />

      {/* ── SNOUT ── */}
      <motion.path
        d="M 8,42 C 3,43 0,43 0,44"
        stroke="#22d3ee" strokeWidth="2" strokeLinecap="round"
        animate={isDigging ? { d: ["M 8,42 C 3,43 0,43 0,44", "M 8,44 C 3,45 0,45 0,46"] } : {}}
        transition={isDigging ? { duration: 0.25, repeat: Infinity } : {}}
      />

      {/* Nostril glow */}
      <circle cx="1" cy="44" r="1" fill="#22d3ee" opacity={0.6} filter="blur(1px)" />

      {/* ── EYE ── */}
      <motion.circle
        cx="28" cy="33" r="2.5" fill="#22d3ee"
        animate={isDigging ? { r: [2.5, 1.5, 2.5] } : {}}
        transition={{ duration: 0.3, repeat: Infinity }}
      />
      <motion.circle
        cx="28" cy="33" r="1" fill="white"
        animate={isDigging ? { r: [1, 0.4, 1] } : {}}
        transition={{ duration: 0.3, repeat: Infinity }}
      />
      {/* Eye glow */}
      <circle cx="28" cy="33" r="5" fill="#22d3ee" opacity={0.12} filter="blur(3px)" />

      {/* ── EAR ── */}
      <motion.path
        d="M 35,25 C 33,18 35,14 40,16 C 44,18 42,24 38,26"
        fill="#2d2d4a" stroke="#6366f1" strokeWidth="0.6"
        animate={isDigging ? { d: ["M 35,25 C 33,18 35,14 40,16 C 44,18 42,24 38,26", "M 35,27 C 33,20 35,16 40,18 C 44,20 42,26 38,28"] } : {}}
        transition={isDigging ? { duration: 0.25, repeat: Infinity } : {}}
      />

      {/* ── FRONT LEG ── */}
      <motion.g
        animate={isBurst ? { opacity: 0 } : {}}
      >
        <motion.path
          d="M 70,72 L 70,88 Q 70,92 74,90"
          stroke="#2d2d4a" strokeWidth="5" strokeLinecap="round" fill="none"
          style={{ transformOrigin: "70px 74px" }}
          animate={{ rotate: isDigging ? [12, -12, 12] : [8, -8, 8] }}
          transition={{ duration: isDigging ? 0.25 : 0.4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Foot glow */}
        <circle cx="72" cy="89" r="3" fill="#6366f1" opacity={0.15} filter="blur(2px)" />
      </motion.g>

      {/* ── DIG DUST PARTICLES (phase 3 only) ── */}
      {isDigging && Array.from({ length: 3 }).map((_, i) => (
        <motion.circle
          key={`dust-${i}`}
          cx={40 + i * 20} cy={82 + i * 3}
          r={2 + i * 0.5}
          fill="#22d3ee"
          animate={{
            cy: [82 + i * 3, 65 - i * 8, 50 - i * 5],
            opacity: [0.6, 0.3, 0],
            scale: [1, 0.3, 0],
          }}
          transition={{
            duration: 0.4 + i * 0.1,
            repeat: Infinity,
            delay: i * 0.08,
            ease: "easeOut",
          }}
        />
      ))}

      {/* ── BODY GLOW (subtle during dig) ── */}
      {isDigging && (
        <ellipse cx="85" cy="45" rx="30" ry="20" fill="#6366f1" opacity={0.08} filter="blur(10px)" />
      )}
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════
//  BLACK HOLE — Expanding vortex in 3 stages
// ══════════════════════════════════════════════════════════════
function BlackHole({
  size,
  visible,
}: {
  size: 0 | 1 | 2 | 3;
  visible: boolean;
}) {
  const dims = [0, 40, 80, 160];
  const ringCounts = [0, 3, 5, 8];
  const dim = dims[size];

  if (!visible || size === 0) return null;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: 0,
        height: 0,
      }}
    >
      {/* Main black hole disc */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: -dim / 2,
          top: -dim / 2,
          width: dim,
          height: dim,
          background: `radial-gradient(
            ellipse at 30% 40%,
            rgba(0,0,0,0.95) 0%,
            rgba(15,15,35,0.9) 30%,
            color-mix(in srgb, var(--accent-alt, #6366f1) 25%, transparent) 60%,
            color-mix(in srgb, var(--accent, #22d3ee) 10%, transparent) 100%
          )`,
          borderRadius: "50%",
          filter: "blur(8px)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: size >= 3 ? 1 : 0.7,
        }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      />

      {/* Spiral accretion rings */}
      {Array.from({ length: ringCounts[size] }).map((_, i) => {
        const ringSize = dim * (1 - i * 0.08);
        const rotation = i * 45;
        return (
          <motion.div
            key={`ring-${i}`}
            className="absolute rounded-full"
            style={{
              left: -ringSize / 2 + (dim - ringSize) / 2,
              top: -ringSize / 2 + (dim - ringSize) / 2,
              width: ringSize,
              height: ringSize * 0.6,
              border: `1px solid color-mix(in srgb, ${i % 2 === 0 ? "var(--accent, #22d3ee)" : "var(--accent-alt, #6366f1)"} ${0.5 - i * 0.05}, transparent)`,
              borderRadius: "50%",
            }}
            animate={{
              rotate: [rotation, rotation + 360],
              scale: [1, 1.05, 1],
              opacity: [0.2 + i * 0.05, 0.4 + i * 0.05, 0.2 + i * 0.05],
            }}
            transition={{
              rotate: { duration: 3 + i * 0.5, repeat: Infinity, ease: "linear" },
              scale: { duration: 2 + i * 0.3, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 1.5 + i * 0.2, repeat: Infinity },
            }}
          />
        );
      })}

      {/* Accretion glow particles */}
      {Array.from({ length: size * 3 }).map((_, i) => {
        const angle = (i / (size * 3)) * Math.PI * 2;
        const radius = dim * 0.35 + i * 3;
        return (
          <motion.div
            key={`accrete-${i}`}
            className="absolute rounded-full"
            style={{
              width: 2 + i % 2,
              height: 2 + i % 2,
              background: i % 2 === 0 ? "#22d3ee" : "#6366f1",
              filter: "blur(1px)",
              boxShadow: `0 0 4px ${i % 2 === 0 ? "#22d3ee" : "#6366f1"}`,
            }}
            animate={{
              x: [Math.cos(angle) * radius, Math.cos(angle + 0.3) * (radius + 8)],
              y: [Math.sin(angle) * radius * 0.6, Math.sin(angle + 0.3) * (radius + 8) * 0.6],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 1.5 + i * 0.15,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  PORTFOLIO BURST — Info emerging from black hole
// ══════════════════════════════════════════════════════════════
function PortfolioBurst({ visible }: { visible: boolean }) {
  const items = useMemo(() => [
    { icon: "MC", label: "MISSION CONTROL", sub: "Full-Stack Portfolio" },
    { icon: "PP", label: "PATA-PASS", sub: "Dog Walking Platform" },
    { icon: "AR", label: "ARACHNE", sub: "Data Intelligence" },
  ], []);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
      {items.map((item, i) => {
        const angle = -30 + i * 30;
        return (
          <motion.div
            key={item.icon}
            className="absolute flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{
              opacity: [0, 1, 0.8],
              scale: [0.2, 1.3, 1],
              x: [0, Math.sin((angle * Math.PI) / 180) * 180],
              y: [0, Math.cos((angle * Math.PI) / 180) * 180 * 0.6],
            }}
            transition={{
              duration: 1.2,
              delay: 0.3 + i * 0.15,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{
              filter: "drop-shadow(0 0 20px color-mix(in srgb, var(--accent, #22d3ee) 30%, transparent))",
            }}
          >
            {/* Icon badge */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-[11px] font-bold tracking-wider mb-2"
              style={{
                background: "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(99,102,241,0.15))",
                border: "1px solid color-mix(in srgb, var(--accent, #22d3ee) 30%, transparent)",
                color: "var(--accent, #22d3ee)",
                backdropFilter: "blur(8px)",
              }}
            >
              {item.icon}
            </div>
            {/* Label */}
            <div className="text-center">
              <p
                className="text-[9px] font-bold tracking-[3px]"
                style={{ color: "var(--accent, #22d3ee)" }}
              >
                {item.label}
              </p>
              <p
                className="text-[7px] tracking-[2px] mt-0.5"
                style={{ color: "var(--accent-alt, #6366f1)", opacity: 0.6 }}
              >
                {item.sub}
              </p>
            </div>
          </motion.div>
        );
      })}

      {/* Center core burst flare */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 80,
          height: 80,
          background: "radial-gradient(circle, rgba(255,255,255,0.6), color-mix(in srgb, var(--accent, #22d3ee) 30%, transparent), transparent)",
          filter: "blur(12px)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 2.5, 1.5], opacity: [0, 0.8, 0.2] }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

// ─── Boot messages ───
function BootMessages({ phase }: { phase: number }) {
  const messages = [
    { text: "> TATU PROCURE SYSTEM ...... ONLINE", highlight: false, showAt: 1 },
    { text: "> MAPPING PORTFOLIO DATA ..... OK", highlight: false, showAt: 2 },
    { text: "> EXCAVATION DRILL ......... ARMED", highlight: false, showAt: 2 },
    { text: "> BLACK HOLE GENERATOR ...... ACTIVE", highlight: false, showAt: 3 },
    { text: "> FULL STACK COMMAND CENTER .. READY", highlight: true, showAt: 4 },
  ];
  return (
    <div className="absolute bottom-32 left-8 right-8 z-10 pointer-events-none">
      {messages.map((msg, i) => {
        const visible = phase >= msg.showAt;
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
                  ? `type-reveal ${0.5 + msg.text.length * 0.035}s steps(${msg.text.length}) ${i * 0.15}s forwards`
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
                  animationDelay: `${0.5 + msg.text.length * 0.035 + i * 0.15}s`,
                }}
              />
            )}
          </motion.p>
        );
      })}
    </div>
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

// ─── Glitch overlay ───
function GlitchOverlay({ active }: { active: boolean }) {
  return (
    <motion.div
      className={`absolute inset-0 pointer-events-none z-40 ${active ? "glitch-active" : ""}`}
      style={{
        background: "linear-gradient(90deg, color-mix(in srgb, var(--accent, #22d3ee) 8%, transparent) 0%, transparent 50%, color-mix(in srgb, var(--accent-alt, #6366f1) 8%, transparent) 100%)",
      }}
      animate={active ? { opacity: [0, 0.15, 0.3, 0.1, 0.2, 0] } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    />
  );
}

// ══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [digCount, setDigCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  const mouseRef = useRef({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();
  const tier = useDeviceTier();
  const { theme } = useTheme();
  onCompleteRef.current = onComplete;

  const cfg = TIER_CFG[tier];

  // Stars
  const stars = useMemo(() => genStars(cfg.stars), [cfg.stars]);

  // Phase timing
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

  // Dig cycle during phase 3 — 3 digs that grow the black hole
  useEffect(() => {
    if (phase !== 3) {
      setDigCount(0);
      return;
    }
    const t: ReturnType<typeof setTimeout>[] = [];
    // 3 digs spaced 500ms apart → digCount 1, 2, 3
    t.push(setTimeout(() => setDigCount(1), 500));
    t.push(setTimeout(() => setDigCount(2), 1200));
    t.push(setTimeout(() => setDigCount(3), 2000));
    return () => t.forEach(clearTimeout);
  }, [phase]);

  // Black hole size based on dig count
  const holeSize = (phase === 3 ? digCount : phase >= 4 ? 3 : 0) as 0 | 1 | 2 | 3;

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

  // Click/tap to skip
  useEffect(() => {
    const skip = () => { if (!prefersReducedMotion) onCompleteRef.current(); };
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("click", skip);
    return () => el.removeEventListener("click", skip);
  }, [prefersReducedMotion]);

  const mx = mouseRef.current.x;
  const my = mouseRef.current.y;

  // ── Tatu animation path ──
  const tatuPhase = (p: number): HTMLMotionProps<"div">["animate"] => {
    if (p === 0) {
      // Start off-screen top-right
      return {
        x: "85vw",
        y: "-15vh",
        opacity: 0,
        scale: 0.25,
        rotate: 5,
      };
    }
    if (p === 1) {
      // Walk vertically down along the right side → to middle
      return {
        x: ["85vw", "70vw", "58vw"],
        y: ["-15vh", "30vh", "48vh"],
        opacity: [0, 0.5, 1],
        scale: [0.25, 0.5, 0.7],
        rotate: [5, 2, 0],
      };
    }
    if (p === 2) {
      // Walk horizontally from right to center
      return {
        x: ["58vw", "25vw", "calc(50vw - 75px)"],
        y: "48vh",
        opacity: 1,
        scale: [0.7, 0.85, 0.9],
        rotate: [0, 1, -0.5, 0],
      };
    }
    if (p === 3) {
      // Digging: stay at center, bob up and down
      return {
        x: "calc(50vw - 75px)",
        y: ["48vh", "46vh", "49vh", "46vh", "48vh"],
        scale: [0.9, 0.92, 0.88, 0.92, 0.9],
        rotate: [-1, 0, 1, 0, -1],
      };
    }
    // Phase 4 — tatu recoils as info bursts out
    return {
      x: "calc(50vw - 75px)",
      y: "52vh",
      opacity: [1, 1, 0],
      scale: [0.9, 1.05, 0.3],
      rotate: [0, -3, 5],
    };
  };

  const isBursting = phase >= 4;

  return (
    <>
      {/* Inject CSS keyframes */}
      <style>{splashStyles}</style>

      {/* Skip button */}
      <button
        onClick={onComplete}
        tabIndex={0}
        className="fixed top-4 left-4 z-[10000] sr-only focus:not-sr-only focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-mono focus:bg-[var(--bg-primary,#020617)] focus:text-[var(--accent)] focus:border-2 focus:border-[var(--accent)] focus:outline-none"
        aria-label="Pular animação de abertura"
      >
        Pular ▸
      </button>

      {/* Exit transition */}
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

        {/* ── LAYER 2: Starfield ── */}
        <StarLayer stars={stars} />

        {/* ── LAYER 2.5: Background pattern ── */}
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

        {/* ── LAYER 2.6: Film grain ── */}
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

        {/* ── LAYER 4: HUD corners ── */}
        <HudCorners opacity={phase >= 1 ? 0.3 : 0} />

        {/* Status line */}
        <motion.div
          className="absolute top-[58px] left-0 right-0 text-center z-10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[9px] tracking-[4px] font-mono" style={{ color: "var(--accent, #22d3ee)", opacity: 0.2 }}>
            TATU PROCURE v1.0
          </span>
        </motion.div>

        {/* ── LAYER 5: Tatu + Black Hole container ── */}
        <div
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          style={{ perspective: "800px" }}
        >
          {/* Black hole (renders behind or over tatu based on phase) */}
          {holeSize > 0 && (
            <div style={{ zIndex: phase >= 4 ? 10 : 1 }}>
              <BlackHole size={holeSize} visible={true} />
            </div>
          )}

          {/* Portfolio burst info emerging */}
          <PortfolioBurst visible={phase >= 4} />

          {/* Black hole "suck" effect lines */}
          {phase >= 3 && digCount >= 1 && (
            <div className="absolute" style={{ zIndex: 5 }}>
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * 360;
                return (
                  <motion.div
                    key={`suck-${i}`}
                    className="absolute"
                    style={{
                      width: 2,
                      height: holeSize === 3 ? 80 : holeSize === 2 ? 50 : 30,
                      background: `linear-gradient(180deg, transparent, color-mix(in srgb, var(--accent, #22d3ee) ${30 + i * 5}%, transparent))`,
                      transformOrigin: "center bottom",
                      left: -1,
                      top: -(holeSize === 3 ? 80 : holeSize === 2 ? 50 : 30),
                      filter: "blur(2px)",
                      borderRadius: "1px",
                    }}
                    animate={{
                      rotate: [angle, angle + 360],
                      opacity: [0.1, 0.4, 0.1],
                    }}
                    transition={{
                      rotate: { duration: 2 + i * 0.2, repeat: Infinity, ease: "linear" },
                      opacity: { duration: 1 + i * 0.1, repeat: Infinity },
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* ── LAYER 6: Tatu character (animated position) ── */}
        <motion.div
          className="absolute z-15 pointer-events-none"
          animate={tatuPhase(phase)}
          transition={
            phase === 0 ? { duration: 0.5 } :
            phase === 1 ? { duration: 2.2, ease: [0.25, 0.46, 0.45, 0.94] } :
            phase === 2 ? { duration: 2.5, ease: [0.25, 0.46, 0.45, 0.94] } :
            phase === 3 ? { duration: 2.5, ease: "easeInOut" } :
            { duration: 1.2, ease: [0.55, 0, 1, 0.45] }
          }
          style={{
            transform: `translate(${mx * 8}px, ${my * 8}px)`,
            willChange: "transform, opacity",
            zIndex: phase >= 4 ? 5 : 15,
          }}
        >
          <TatuSVG phase={phase} digCount={digCount} />

          {/* Walking dust particles (phase 1 & 2) */}
          {(phase === 1 || phase === 2) && (
            <div className="absolute" style={{ bottom: -5, left: 40 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={`walk-dust-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: 3 + i,
                    height: 3 + i,
                    background: `radial-gradient(circle, color-mix(in srgb, var(--accent, #22d3ee) 30%, transparent), transparent)`,
                    filter: "blur(1px)",
                  }}
                  animate={{
                    x: [0, -10 - i * 5],
                    y: [0, -5 - i * 3],
                    opacity: [0.4, 0],
                    scale: [1, 0.2],
                  }}
                  transition={{
                    duration: 0.5 + i * 0.15,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* ── LAYER 7: Boot messages ── */}
        <BootMessages phase={phase} />

        {/* ── LAYER 8: Flash transition ── */}
        <FlashOverlay show={isBursting} />

        {/* ── LAYER 9: Glitch overlay ── */}
        <GlitchOverlay active={isBursting} />

        {/* ── LAYER 10: Progress bar ── */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          animate={isBursting ? { opacity: 0 } : { opacity: 1 }}
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
            {phase <= 1 ? "CARREGANDO" : phase === 2 ? "APROXIMANDO" : phase === 3 ? "CAVANDO" : "PRONTO"}
          </motion.p>
        </motion.div>

        {/* ── LAYER 11: Vignette ── */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(2,6,23,0.7)_100%)]" />

        {/* ── LAYER 12: Letterbox bars ── */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[12%] z-20 pointer-events-none"
          style={{
            backgroundColor: theme === "light" ? "#0a0a1a" : "var(--bg-primary, #020617)",
            willChange: "opacity",
          }}
          animate={{ opacity: isBursting ? 0 : 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[12%] z-20 pointer-events-none"
          style={{
            backgroundColor: theme === "light" ? "#0a0a1a" : "var(--bg-primary, #020617)",
            willChange: "opacity",
          }}
          animate={{ opacity: isBursting ? 0 : 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Tier badge */}
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
