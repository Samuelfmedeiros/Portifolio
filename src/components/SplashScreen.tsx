"use client";

import { useState, useEffect, useLayoutEffect, useRef, useMemo, memo, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useDeviceTier, type DeviceTier } from "@/hooks/useDeviceTier";
import { useTheme } from "./ThemeProvider";

// ─── Types ───
type AnimationPhase = "initial" | "falling" | "walking" | "digging" | "revealed";
type Star = { x: number; y: number; size: number; depth: number; hue: number; delay: number; duration: number };
type DigCount = 0 | 1 | 2 | 3;

// ─── Phase numeric index ───
const PHASE_NUM: Record<AnimationPhase, number> = {
  initial: 0, falling: 1, walking: 2, digging: 3, revealed: 4,
};

const TIER_CFG: Record<DeviceTier, {
  stars: number; streaks: number; trailParticles: number;
  energyParticles: number;
}> = {
  low:    { stars: 80,  streaks: 0, trailParticles: 0,  energyParticles: 0 },
  mid:    { stars: 200, streaks: 10, trailParticles: 6,  energyParticles: 4 },
  high:   { stars: 400, streaks: 20, trailParticles: 12, energyParticles: 8 },
};

const splashStyles = [
  '@keyframes drift-cyan { 0% { transform: translateY(0) translateX(0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(-600px) translateX(40px); opacity: 0; } }',
  '@keyframes drift-indigo { 0% { transform: translateY(0) translateX(0); opacity: 0; } 10% { opacity: 0.7; } 90% { opacity: 0.7; } 100% { transform: translateY(-500px) translateX(-30px); opacity: 0; } }',
  '@keyframes drift-white { 0% { transform: translateY(0) translateX(0); opacity: 0; } 15% { opacity: 0.5; } 85% { opacity: 0.5; } 100% { transform: translateY(-800px) translateX(20px); opacity: 0; } }',
  '@keyframes walk-leg { 0%, 100% { transform: rotate(-12deg); } 50% { transform: rotate(12deg); } }',
  '@keyframes dig-leg { 0%, 100% { transform: rotate(-20deg) translateY(0); } 50% { transform: rotate(10deg) translateY(4px); } }',
  '@keyframes hole-pulse { 0%, 100% { opacity: 0.15; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.08); } }',
  '@keyframes particle-spiral { 0% { transform: rotate(0deg) translateX(0) scale(1); opacity: 0; } 20% { opacity: 0.7; } 80% { opacity: 0.7; } 100% { transform: rotate(360deg) translateX(80px) scale(0.3); opacity: 0; } }',
  '@keyframes dig-dust { 0% { transform: translateY(0) scale(1); opacity: 0.7; } 100% { transform: translateY(-30px) scale(0); opacity: 0; } }',
  '@keyframes boot-fade-in { 0% { opacity: 0; transform: translateY(6px); } 100% { opacity: 1; transform: translateY(0); } }',
  '@keyframes glitch-skew { 0% { clip-path: inset(0 0 0 0); transform: skew(0deg); } 10% { clip-path: inset(12% 0 50% 0); transform: skew(-1deg); } 20% { clip-path: inset(40% 0 8% 0); transform: skew(0.5deg); } 30% { clip-path: inset(5% 0 65% 0); transform: skew(-0.3deg); } 40% { clip-path: inset(80% 0 5% 0); transform: skew(1deg); } 50% { clip-path: inset(0 0 0 0); transform: skew(0deg); } }',
  '@keyframes scanline-sweep { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }',
  '@keyframes grain-shift { 0%, 100% { background-position: 0 0; } 20% { background-position: -5px 5px; } 40% { background-position: 5px -5px; } 60% { background-position: -3px 3px; } 80% { background-position: 3px -3px; } }',
  '@keyframes type-reveal { 0% { max-width: 0; border-right-color: transparent; } 1% { border-right-color: currentColor; } 90% { border-right-color: currentColor; } 100% { max-width: 400px; border-right-color: transparent; } }',
  '@keyframes blink-cursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }',
  '@keyframes vignette-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.85; } }',
  '@keyframes hole-suck { 0% { transform: scale(0); opacity: 0; } 30% { opacity: 0.6; } 100% { transform: scale(1); opacity: 0.4; } }',
  '@keyframes info-float { 0% { transform: translateY(40px) scale(0.5); opacity: 0; } 60% { opacity: 1; } 100% { transform: translateY(-20px) scale(1); opacity: 0; } }',
  '@keyframes tatu-fall {\n    0% { offset-distance: 0%; opacity: 0; scale: 0.25; rotate: 5deg; }\n    100% { offset-distance: 50%; opacity: 1; scale: 0.7; rotate: 0deg; }\n  }',
  '@keyframes tatu-walk {\n    0% { offset-distance: 50%; opacity: 1; scale: 0.7; rotate: 0deg; }\n    100% { offset-distance: 100%; opacity: 1; scale: 0.9; rotate: 0deg; }\n  }',
  '@keyframes tatu-fadeout { 0% { opacity: 1; scale: 0.9; rotate: 0deg; } 100% { opacity: 0; scale: 0.3; rotate: 5deg; } }',
  '@media (prefers-reduced-motion: reduce) { @keyframes drift-cyan { to { opacity: 0; } } @keyframes drift-indigo { to { opacity: 0; } } @keyframes drift-white { to { opacity: 0; } } @keyframes walk-leg { to { } } @keyframes dig-leg { to { } } @keyframes hole-pulse { 0%, 100% { opacity: 0.03; } } @keyframes boot-fade-in { to { opacity: 1; } } @keyframes tatu-fall { 0%, 100% { offset-distance: 0%; } } @keyframes tatu-walk { 0%, 100% { offset-distance: 100%; } } @keyframes tatu-fadeout { 0%, 100% { opacity: 1; } } }',
  '.tatu-mover {\\n    offset-rotate: 0deg;\\n    offset-anchor: top left;\\n    position: fixed;\\n    left: 0;\\n    top: 0;\\n    z-index: 15;\\n    will-change: offset-distance;\\n    pointer-events: none;\\n  }',
  '.tatu-mover.p0 { offset-distance: 0%; opacity: 0; }',
  '.tatu-mover.p1 {\\n    animation: tatu-fall 2.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;\\n  }',
  '.tatu-mover.p2 {\\n    animation: tatu-walk 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;\\n  }',
  '.tatu-mover.p3 { offset-distance: 100%; }',
  '.tatu-mover.p4 { animation: tatu-fadeout 0.8s ease forwards; z-index: 5; }',
  '@keyframes dig-progress { 0% { opacity: 0; } 100% { opacity: 0; } }',
  '.glitch-active { animation: glitch-skew 0.6s ease-in-out; }',
  '@media (prefers-reduced-motion: reduce) { .glitch-active { animation: none; } }',
].join("\n");


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
        <div key={i} className="absolute rounded-full"
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
//  BLACK HOLE — Expanding visual rings
// ══════════════════════════════════════════════════════════════
function BlackHole({ size, visible }: { size: 0 | 1 | 2 | 3; visible: boolean }) {
  const dims = [0, 40, 80, 160];
  const ringCounts = [0, 3, 5, 8];
  const dim = dims[size];
  if (!visible || size === 0) return null;
  return (
    <div className="absolute pointer-events-none"
      style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 0, height: 0 }}>
      {Array.from({ length: ringCounts[size] }).map((_, i) => {
        const ringSize = dim * (1 - i * 0.08);
        const rotation = i * 45;
        return (
          <motion.div key={`ring-${i}`} className="absolute rounded-full"
            style={{
              left: -ringSize / 2 + (dim - ringSize) / 2,
              top: -ringSize / 2 + (dim - ringSize) / 2,
              width: ringSize, height: ringSize * 0.6,
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
      {Array.from({ length: size * 3 }).map((_, i) => {
        const angle = (i / (size * 3)) * Math.PI * 2;
        const radius = dim * 0.35 + i * 3;
        return (
          <motion.div key={`accrete-${i}`} className="absolute rounded-full"
            style={{
              width: 2 + i % 2, height: 2 + i % 2,
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
              duration: 1.5 + i * 0.15, repeat: Infinity,
              delay: i * 0.1, ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}


// ══════════════════════════════════════════════════════════════
//  PORTFOLIO BURST
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
          <motion.div key={item.icon} className="absolute flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: [0, 1, 0.8], scale: [0.2, 1.3, 1], x: [0, Math.sin((angle * Math.PI) / 180) * 180], y: [0, Math.cos((angle * Math.PI) / 180) * 180 * 0.6] }}
            transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ filter: "drop-shadow(0 0 20px color-mix(in srgb, var(--accent, #22d3ee) 30%, transparent))" }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-[11px] font-bold tracking-wider mb-2"
              style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(99,102,241,0.15))", border: "1px solid color-mix(in srgb, var(--accent, #22d3ee) 30%, transparent)", color: "var(--accent, #22d3ee)", backdropFilter: "blur(8px)" }}>
              {item.icon}
            </div>
            <div className="text-center">
              <p className="text-[9px] font-bold tracking-[3px]" style={{ color: "var(--accent, #22d3ee)" }}>{item.label}</p>
              <p className="text-[7px] tracking-[2px] mt-0.5" style={{ color: "var(--accent-alt, #6366f1)", opacity: 0.6 }}>{item.sub}</p>
            </div>
          </motion.div>
        );
      })}
      <motion.div className="absolute rounded-full"
        style={{ width: 80, height: 80, background: "radial-gradient(circle, rgba(255,255,255,0.6), color-mix(in srgb, var(--accent, #22d3ee) 30%, transparent), transparent)", filter: "blur(12px)" }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 2.5, 1.5], opacity: [0, 0.8, 0.2] }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}


// ─── Boot messages ───
function BootMessages({ phaseNum }: { phaseNum: number }) {
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
        const visible = phaseNum >= msg.showAt;
        return (
          <motion.p key={i}
            className="text-[8px] font-mono tracking-[2px] leading-[2.2]"
            style={{ color: msg.highlight ? "var(--accent-alt, #a78bfa)" : "var(--accent, #22d3ee)", opacity: 0 }}
            animate={visible ? { opacity: msg.highlight ? 0.4 : 0.15 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: i * 0.8 + 0.1 }}>
            <span className="inline-block overflow-hidden whitespace-nowrap align-bottom border-r-2 border-current"
              style={{ maxWidth: visible ? 400 : 0, animation: visible ? `type-reveal ${0.5 + msg.text.length * 0.035}s steps(${msg.text.length}) ${i * 0.15}s forwards` : "none" }}>
              {msg.text}
            </span>
            {visible && (
              <span className="inline-block w-[2px] h-[9px] align-middle ml-[1px] bg-current"
                style={{ animation: "blink-cursor 0.8s step-end infinite", animationDelay: `${0.5 + msg.text.length * 0.035 + i * 0.15}s` }} />
            )}
          </motion.p>
        );
      })}
    </div>
  );
}


// ─── Flash overlay ───
function FlashOverlay({ show }: { show: boolean }) {
  return (
    <motion.div className="absolute inset-0 pointer-events-none z-30"
      style={{ background: "radial-gradient(ellipse at center, color-mix(in srgb, var(--accent-alt, #6366f1) 35%, transparent), color-mix(in srgb, var(--accent, #22d3ee) 15%, transparent), transparent)" }}
      animate={{ opacity: show ? [0, 0.7, 0] : 0, scale: show ? [0.7, 1.3] : 1 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    />
  );
}


// ─── Glitch overlay ───
function GlitchOverlay({ active }: { active: boolean }) {
  return (
    <motion.div className={`absolute inset-0 pointer-events-none z-40 ${active ? "glitch-active" : ""}`}
      style={{ background: "linear-gradient(90deg, color-mix(in srgb, var(--accent, #22d3ee) 8%, transparent) 0%, transparent 50%, color-mix(in srgb, var(--accent-alt, #6366f1) 8%, transparent) 100%)" }}
      animate={active ? { opacity: [0, 0.15, 0.3, 0.1, 0.2, 0] } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    />
  );
}


// ══════════════════════════════════════════════════════════════
//  TATU SVG — A stylized armadillo in Treasure Planet style
// ══════════════════════════════════════════════════════════════
function TatuSVG({ phase, size = 120 }: { phase: AnimationPhase; size?: number }) {
  const isDigging = phase === "digging";
  const isBurst = phase === "revealed";
  return (
    <svg width={size} height={size * 0.9} viewBox="0 0 120 108" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="shellGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent, #22d3ee)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--accent, #22d3ee)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="portalGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
          <stop offset="50%" stopColor="var(--accent, #22d3ee)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g style={{ transformOrigin: "60px 58px", filter: isBurst ? "drop-shadow(0 0 12px #22d3ee)" : "none" }}>
        {/* Shadow */}
        {!isBurst && <ellipse cx="60" cy="100" rx="28" ry="5" fill="rgba(0,0,0,0.3)" filter="blur(3px)" />}
        {/* Tail */}
        <path d="M18 56 C8 52, 2 42, 6 32 C8 27, 12 26, 14 30" stroke="var(--accent, #22d3ee)" strokeWidth="3" strokeLinecap="round" fill="none" opacity={0.8}
          style={{ transformOrigin: "18px 56px", animation: phase === "falling" ? "tatu-tail-fall 1s ease-in-out infinite alternate" : "none" }} />
        {/* Back legs */}
        <path d="M38 66 L34 80 L30 80" stroke="var(--accent, #22d3ee)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.7}
          style={{ transformOrigin: "38px 72px", animation: phase === "walking" ? "tatu-leg-walk 0.35s ease-in-out infinite alternate" : phase === "digging" ? "tatu-leg-dig 0.5s ease-in-out infinite alternate" : "none" }} />
        <path d="M78 66 L82 80 L86 80" stroke="var(--accent, #22d3ee)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.7}
          style={{ transformOrigin: "78px 72px", animation: phase === "walking" ? "tatu-leg-walk 0.35s ease-in-out infinite alternate" : phase === "digging" ? "tatu-leg-dig 0.5s ease-in-out infinite alternate" : "none", animationDelay: "0.12s" }} />
        {/* Shell bands */}
        <g style={{ transformOrigin: "60px 48px", animation: isDigging ? "tatu-shell-dig 0.6s ease-in-out infinite alternate" : (phase === "walking" ? "tatu-bob 0.4s ease-in-out infinite alternate" : "none") }}>
          <ellipse cx="60" cy="36" rx="30" ry="16" fill="none" stroke="var(--accent, #22d3ee)" strokeWidth="3" opacity={0.9} />
          <ellipse cx="60" cy="44" rx="34" ry="17" fill="none" stroke="#6366f1" strokeWidth="2.5" opacity={0.8} />
          <ellipse cx="60" cy="52" rx="36" ry="18" fill="none" stroke="var(--accent, #22d3ee)" strokeWidth="2.5" opacity={0.7} />
          <ellipse cx="60" cy="60" rx="34" ry="16" fill="none" stroke="#6366f1" strokeWidth="2" opacity={0.6} />
          <ellipse cx="60" cy="48" rx="30" ry="18" fill="url(#shellGlow)" opacity={0.15} />
        </g>
        {/* Front legs */}
        <path d="M44 64 L40 80 L36 80" stroke="var(--accent, #22d3ee)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.7}
          style={{ transformOrigin: "42px 70px", animation: phase === "walking" ? "tatu-leg-walk 0.35s ease-in-out infinite alternate" : phase === "digging" ? "tatu-leg-dig 0.5s ease-in-out infinite alternate" : "none", animationDelay: "0.06s" }} />
        <path d="M72 64 L76 80 L80 80" stroke="var(--accent, #22d3ee)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.7}
          style={{ transformOrigin: "74px 70px", animation: phase === "walking" ? "tatu-leg-walk 0.35s ease-in-out infinite alternate" : phase === "digging" ? "tatu-leg-dig 0.5s ease-in-out infinite alternate" : "none", animationDelay: "0.18s" }} />
        {/* Claws during dig */}
        {isDigging && <><path d="M36 78 L32 74" stroke="var(--accent, #22d3ee)" strokeWidth="1.5" strokeLinecap="round" opacity={0.6} /><path d="M80 78 L84 74" stroke="var(--accent, #22d3ee)" strokeWidth="1.5" strokeLinecap="round" opacity={0.6} /></>}
        {/* Head */}
        <g style={{ transformOrigin: "60px 30px", animation: isDigging ? "tatu-leg-dig 0.5s ease-in-out infinite alternate" : "none" }}>
          <path d="M52 28 C50 22, 54 16, 60 14 C66 16, 70 22, 68 28 Z" fill="none" stroke="var(--accent, #22d3ee)" strokeWidth="2.5" opacity={0.9} />
          <path d="M54 18 L50 10 L56 14" stroke="var(--accent, #22d3ee)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.7} />
          <path d="M66 18 L70 10 L64 14" stroke="var(--accent, #22d3ee)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.7} />
          <circle cx="56" cy="22" r="2" fill="var(--accent, #22d3ee)" style={{ animation: isBurst ? "tatu-eye-reveal 0.3s ease-out forwards" : "none" }} />
          <circle cx="64" cy="22" r="2" fill="var(--accent, #22d3ee)" style={{ animation: isBurst ? "tatu-eye-reveal 0.3s ease-out forwards" : "none", animationDelay: "0.1s" }} />
          <circle cx="60" cy="26" r="1.5" fill="#6366f1" opacity={0.8} />
        </g>
        {/* Portal burst on revealed */}
        {isBurst && (
          <g>
            <circle cx="60" cy="48" r="14" fill="none" stroke="url(#portalGlow)" strokeWidth="2" opacity={0.9}>
              <animate attributeName="r" values="14;22;14" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="60" cy="48" r="6" fill="#22d3ee" opacity={0.4}>
              <animate attributeName="r" values="6;12;6" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.1;0.4" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </g>
        )}
      </g>
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════
//  STARS
// ══════════════════════════════════════════════════════════════
//  STATE MACHINE — Centralized transition map
// ══════════════════════════════════════════════════════════════
//
//   initial ──[render]──► falling ──[animend]──► walking ──[animend]──► digging ──[dig 3×]──► revealed ──[fadeout]──► done
//
// ─── CSS animation names that drive transitions ───
const ANIM_FALL = "tatu-fall";
const ANIM_WALK = "tatu-walk";
const ANIM_DIG_CYCLE = "dig-progress";
const ANIM_FADEOUT = "tatu-fadeout";

// ─── Transition map: [current phase][animation name] → next phase ───
const PHASE_TRANSITIONS: Record<AnimationPhase, Record<string, AnimationPhase | "onComplete">> = {
  initial:  {},
  falling:  { [ANIM_FALL]: "walking" },
  walking:  { [ANIM_WALK]: "digging" },
  digging:  {},
  revealed: { [ANIM_FADEOUT]: "onComplete" },
};


// ══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>("initial");
  const [digCount, setDigCount] = useState<DigCount>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const tatuRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  const mouseRef = useRef({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();
  const tier = useDeviceTier();
  const { theme } = useTheme();
  onCompleteRef.current = onComplete;

  // ── Refs for stable closure in animationend handler ──
  const phaseRef = useRef(animationPhase);
  phaseRef.current = animationPhase;
  const digRef = useRef(digCount);
  digRef.current = digCount;

  const cfg = TIER_CFG[tier];

  // Stars
  const stars = useMemo(() => genStars(cfg.stars), [cfg.stars]);

  // ── Compute CSS offset-path from viewport ──
  const [offsetPathStyle, setOffsetPathStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    function updatePath() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const path = `path("M ${w} ${-h * 0.15} Q ${w * 0.75} ${h * 0.48}, ${Math.max(w / 2 - 75, 0)} ${h * 0.48}")`;
      setOffsetPathStyle({ offsetPath: path as unknown as string });
    }
    updatePath();
    window.addEventListener("resize", updatePath);
    return () => window.removeEventListener("resize", updatePath);
  }, []);

  // ── Reduced motion: skip all animations ──
  useEffect(() => {
    if (prefersReducedMotion) {
      onCompleteRef.current();
    }
  }, [prefersReducedMotion]);

  // ── Initial → falling: kick off the animation on mount ──
  useLayoutEffect(() => {
    if (animationPhase === "initial") {
      setAnimationPhase("falling");
    }
  }, []);

  // ══════════════════════════════════════════════════════════════
  //  CENTRALIZED STATE MACHINE — SINGLE event handler
  //  All animation transitions (phases AND dig count) flow through
  //  this one callback. No setTimeout. No hidden state.
  // ══════════════════════════════════════════════════════════════
  const handleAnimEvent = useCallback((e: React.AnimationEvent<HTMLDivElement>) => {
    const name = e.animationName;
    const currentPhase = phaseRef.current;
    const currentDig = digRef.current;

    // ── 1. Phase transitions ──
    const transition = PHASE_TRANSITIONS[currentPhase]?.[name];
    if (transition) {
      if (transition === "onComplete") {
        onCompleteRef.current();
      } else {
        setAnimationPhase(transition);
      }
      return;
    }

    // ── 2. Dig cycle (dig-progress on hidden driver) ──
    if (name === ANIM_DIG_CYCLE && currentPhase === "digging") {
      if (e.type === "animationiteration") {
        setDigCount(prev => Math.min(2, prev + 1) as DigCount);
      } else if (e.type === "animationend") {
        setDigCount(3);
        setAnimationPhase("revealed");
      }
      return;
    }
  }, []);

  // ── Reset digCount when entering digging ──
  useEffect(() => {
    if (animationPhase === "digging") {
      setDigCount(0);
    }
  }, [animationPhase]);

  const phaseNum = PHASE_NUM[animationPhase];
  const isBursting = animationPhase === "revealed";
  const holeSize = (animationPhase === "digging" ? digCount : animationPhase === "revealed" ? 3 : 0) as 0 | 1 | 2 | 3;

  const getHoleSizeCSS = (p: AnimationPhase, dc: DigCount): string => {
    if (p === "initial" || p === "falling" || p === "walking") return "0vw";
    if (p === "digging") {
      if (dc === 0) return "0vw";
      if (dc === 1) return "10vw";
      if (dc >= 2) return "20vw";
    }
    if (p === "revealed") return "150vmax";
    return "0vw";
  };
  const holeSizeCSS = getHoleSizeCSS(animationPhase, digCount);

  const tatuClass = ((p: AnimationPhase) => {
    switch (p) {
      case "initial":  return "p0";
      case "falling":  return "p1";
      case "walking":  return "p2";
      case "digging":  return "p3";
      case "revealed": return "p4";
    }
  })(animationPhase);

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

  const mx = mouseRef.current.x;
  const my = mouseRef.current.y;

  return (
    <>
      <style>{splashStyles}</style>

      {(animationPhase === "digging" || animationPhase === "revealed") && (
        <motion.div className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 10001,
            background: holeSizeCSS === "150vmax" ? "transparent"
              : `radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--accent, #22d3ee) 5%, transparent) 0%, color-mix(in srgb, var(--accent, #22d3ee) 15%, transparent) ${holeSizeCSS}, transparent calc(${holeSizeCSS} + 5vw))`,
            opacity: holeSizeCSS === "150vmax" ? 0 : 1,
          }}
          transition={{ duration: 0.6 }}
        />
      )}

      <button onClick={onComplete} tabIndex={0}
        className="fixed top-4 left-4 z-[10002] sr-only focus:not-sr-only focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-mono focus:bg-[var(--bg-primary,#020617)] focus:text-[var(--accent)] focus:border-2 focus:border-[var(--accent)] focus:outline-none"
        aria-label="Pular animacao de abertura">
        Pular {">"}
      </button>

      <motion.div
        exit={{ y: "-100%", opacity: 0, transition: { duration: 0.9, ease: [0.55, 0, 0.1, 1] } }}
        className="fixed inset-0 z-[9999]"
        style={{
          "--hole-size": holeSizeCSS,
          clipPath: "circle(var(--hole-size) at 50% 50%)",
          WebkitClipPath: "circle(var(--hole-size) at 50% 50%)",
          transition: "clip-path 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        } as React.CSSProperties}
      >
      <motion.div ref={containerRef}
        className="relative w-full h-full overflow-hidden cursor-default"
        style={{ perspective: "1000px", backgroundColor: theme === "light" ? "#0a0a1a" : "var(--bg-primary, #020617)" }}
      >
        <div className="absolute inset-0 transition-opacity duration-[2000ms]"
          style={{
            opacity: animationPhase !== "initial" ? 0.4 : 0,
            background: `radial-gradient(ellipse at ${30 + mx * 12}% ${35 + my * 12}%, color-mix(in srgb, var(--accent-alt, #6366f1) 20%, transparent) 0%, transparent 60%), radial-gradient(ellipse at ${70 - mx * 12}% ${65 - my * 12}%, color-mix(in srgb, var(--accent, #06b6d4) 15%, transparent) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--accent-alt, #a78bfa) 10%, transparent) 0%, transparent 70%)`,
            filter: "blur(50px)",
            willChange: "opacity, background",
          }}
        />

        <StarLayer stars={stars} />

        <img src={theme === "light" ? "/splash-bg-pattern-light.svg" : "/splash-bg-pattern.svg"} alt="" aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none select-none z-[2]"
          style={{ opacity: animationPhase !== "initial" ? 0.25 : 0, transition: "opacity 2s ease-out", mixBlendMode: "overlay" }}
        />

        <div className="absolute inset-0 pointer-events-none z-[2]" aria-hidden="true"
          style={{
            opacity: 0.35,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
            mixBlendMode: "overlay",
            animation: "grain-shift 8s steps(10) infinite",
            willChange: "background-position",
          }}
        />

        <div className="absolute inset-0 pointer-events-none z-[3]"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in srgb, var(--accent) 3%, transparent) 2px, color-mix(in srgb, var(--accent) 3%, transparent) 3px)",
            opacity: 0.6,
          }}
        />

        <HudCorners opacity={animationPhase !== "initial" ? 0.3 : 0} />

        <motion.div className="absolute top-[58px] left-0 right-0 text-center z-10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: animationPhase !== "initial" ? 1 : 0 }}
          transition={{ duration: 0.6 }}>
          <span className="text-[9px] tracking-[4px] font-mono" style={{ color: "var(--accent, #22d3ee)", opacity: 0.2 }}>TATU PROCURE v1.0</span>
        </motion.div>

        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none" style={{ perspective: "800px" }}>
          {holeSize > 0 && <div style={{ zIndex: animationPhase === "revealed" ? 10 : 1 }}><BlackHole size={holeSize} visible={true} /></div>}
          {animationPhase === "digging" && digCount >= 1 && (
            <div className="absolute" style={{ zIndex: 5 }}>
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * 360;
                return (
                  <motion.div key={`suck-${i}`} className="absolute"
                    style={{
                      width: 2, height: holeSize === 3 ? 80 : holeSize === 2 ? 50 : 30,
                      background: `linear-gradient(180deg, transparent, color-mix(in srgb, var(--accent, #22d3ee) ${30 + i * 5}%, transparent))`,
                      transformOrigin: "center bottom", left: -1,
                      top: -(holeSize === 3 ? 80 : holeSize === 2 ? 50 : 30),
                      filter: "blur(2px)", borderRadius: "1px",
                    }}
                    animate={{ rotate: [angle, angle + 360], opacity: [0.1, 0.4, 0.1] }}
                    transition={{ rotate: { duration: 2 + i * 0.2, repeat: Infinity, ease: "linear" }, opacity: { duration: 1 + i * 0.1, repeat: Infinity } }}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div ref={tatuRef} className={`tatu-mover ${tatuClass}`}
          style={{
            ...offsetPathStyle,
            transform: animationPhase === "digging" || animationPhase === "revealed" ? `translate(${mx * 8}px, ${my * 8}px)` : "none",
            willChange: "offset-distance, opacity, scale",
          }}
          onAnimationEnd={handleAnimEvent}>
          <TatuSVG phase={animationPhase} size={90} />

          {(animationPhase === "falling" || animationPhase === "walking") && (
            <div className="absolute" style={{ bottom: -5, left: 40 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div key={`walk-dust-${i}`} className="absolute rounded-full"
                  style={{
                    width: 3 + i, height: 3 + i,
                    background: `radial-gradient(circle, color-mix(in srgb, var(--accent, #22d3ee) 30%, transparent), transparent)`,
                    filter: "blur(1px)",
                  }}
                  animate={{ x: [0, -10 - i * 5], y: [0, -5 - i * 3], opacity: [0.4, 0], scale: [1, 0.2] }}
                  transition={{ duration: 0.5 + i * 0.15, repeat: Infinity, delay: i * 0.15, ease: "easeOut" }}
                />
              ))}
            </div>
          )}
        </div>

        <BootMessages phaseNum={phaseNum} />
        <FlashOverlay show={isBursting} />
        <GlitchOverlay active={isBursting} />

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          animate={isBursting ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.3 }}>
          <div className="w-32 h-[2px] bg-[var(--border)]/30 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(100, (phaseNum / 4) * 100)}%` }}
              transition={{ duration: 0.3 }}
              style={{ background: "linear-gradient(90deg, var(--accent-alt, #6366f1), var(--accent, #22d3ee))", boxShadow: "0 0 8px color-mix(in srgb, var(--accent) 50%, transparent)" }}
            />
          </div>
          <motion.p initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: phaseNum >= 2 ? 1 : 0, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-center text-[10px] font-mono text-[var(--accent)]/60 mt-2 tracking-[0.3em]">
            {phaseNum <= 1 ? "CARREGANDO" : phaseNum === 2 ? "APROXIMANDO" : phaseNum === 3 ? "CAVANDO" : "PRONTO"}
          </motion.p>
        </motion.div>

        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(2,6,23,0.7)_100%)]" />

        <motion.div className="absolute top-0 left-0 right-0 h-[12%] z-20 pointer-events-none"
          style={{ backgroundColor: theme === "light" ? "#0a0a1a" : "var(--bg-primary, #020617)", willChange: "opacity" }}
          animate={{ opacity: isBursting ? 0 : 1 }}
          transition={{ duration: 0.5 }} />
        <motion.div className="absolute bottom-0 left-0 right-0 h-[12%] z-20 pointer-events-none"
          style={{ backgroundColor: theme === "light" ? "#0a0a1a" : "var(--bg-primary, #020617)", willChange: "opacity" }}
          animate={{ opacity: isBursting ? 0 : 1 }}
          transition={{ duration: 0.5 }} />

        {animationPhase === "digging" && (
          <div aria-hidden="true" data-testid="dig-driver"
            style={{
              animation: "dig-progress 0.65s ease-in-out 3 forwards",
              position: "absolute", width: 0, height: 0, opacity: 0,
              pointerEvents: "none",
            }}
            onAnimationIteration={handleAnimEvent}
            onAnimationEnd={handleAnimEvent}
          />
        )}

        <PortfolioBurst visible={animationPhase === "revealed"} />

        {process.env.NODE_ENV === "development" && (
          <div className="absolute bottom-4 right-4 z-50 text-[8px] font-mono opacity-20 text-[var(--accent)]">{tier.toUpperCase()} &middot; {cfg.stars}</div>
        )}
      </motion.div>
      </motion.div>
    </>
  );
}
