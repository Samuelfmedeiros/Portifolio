"use client";

import { useState, useEffect, useRef, memo, useCallback } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { TatuGlyph } from "./TatuGlyph";

// ─── Phase timing (ms from start) ───
const PHASES = {
  INIT:    0,
  DESCEND: 600,   // tatu appears top-right, starts descending
  CROSS:   2400,  // tatu reaches mid-right, starts crossing to center
  DIG:     4200,  // tatu at center, digs black hole
  REVEAL:  6800,  // black hole full size, cards emerge
  EXIT:    8800,  // splash fades
} as const;

const TOTAL_DURATION = 9400;
const DIG_CYCLE_MS = 500; // ms per individual dig motion

// ─── Boot lines per phase ───
interface BootLine {
  text: string;
  phase: number;
  accent?: boolean;
}

const BOOT_LINES: BootLine[] = [
  { text: "TATU PROCURE SYSTEM...",    phase: PHASES.INIT },
  { text: "SCANNING PORTFOLIO SPACE",  phase: PHASES.DESCEND },
  { text: "TARGET ACQUIRED",           phase: PHASES.CROSS, accent: true },
  { text: "EXCAVATION DRILL ARMED",    phase: PHASES.DIG },
  { text: "BLACK HOLE GENERATOR ACTIVE", phase: PHASES.REVEAL, accent: true },
  { text: "READY.",                    phase: PHASES.EXIT - 800 },
];

// ─── Stars ───
type Star = { x: number; y: number; size: number; delay: number; pulseDuration: number };
const STAR_COUNT = 200;

const genStars = () =>
  Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 0.3 + Math.random() * 2.2,
    delay: Math.random() * 4,
    pulseDuration: 1.5 + Math.random() * 3,
  }));

const StarField = memo(function StarField({ stars }: { stars: Star[] }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: i % 5 === 0 ? "#6366f1" : "#22d3ee",
            opacity: 0.1 + Math.random() * 0.35,
            boxShadow: `0 0 ${s.size * 2}px ${i % 5 === 0 ? "#6366f1" : "#22d3ee"}`,
            animation: `star-pulse ${s.pulseDuration}s ease-in-out ${s.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
});

// ─── Nebula overlay ───
const NebulaBg = memo(function NebulaBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <div
        className="absolute w-[60%] h-[60%] rounded-full opacity-[0.04]"
        style={{
          left: "20%",
          top: "10%",
          background:
            "radial-gradient(ellipse, #6366f1 0%, #22d3ee 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute w-[40%] h-[40%] rounded-full opacity-[0.025]"
        style={{
          right: "5%",
          bottom: "5%",
          background:
            "radial-gradient(ellipse, #22d3ee 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
    </div>
  );
});

// ─── Black Hole with gravitational lensing ───
function BlackHoleRing({
  radius,
  opacity,
  rotationSpeed,
  color = "#22d3ee",
  dashed = false,
}: {
  radius: number;
  opacity: number;
  rotationSpeed: number;
  color?: string;
  dashed?: boolean;
}) {
  return (
    <circle
      cx={0} cy={0}
      r={radius}
      stroke={color}
      strokeWidth={1.2}
      strokeDasharray={dashed ? "4 6" : undefined}
      fill="none"
      opacity={opacity}
      style={{
        animation: `blackhole-spin ${rotationSpeed}s linear infinite`,
        transformOrigin: "center",
      }}
    />
  );
}

const BlackHole = memo(function BlackHole({ size, show }: { size: number; show: boolean }) {
  if (!show) return null;
  return (
    <div
      className="absolute pointer-events-none z-[5]"
      style={{
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: size,
        height: size,
      }}
    >
      <svg
        viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
        className="w-full h-full"
        style={{ filter: "url(#bh-glow)" }}
      >
        <defs>
          <radialGradient id="bh-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#6366f1" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bh-glow-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
            <stop offset="40%" stopColor="#6366f1" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
          <filter id="bh-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer glow */}
        <circle cx={0} cy={0} r={size * 0.48} fill="url(#bh-core)" />

        {/* Gravitational lensing ring */}
        <ellipse
          cx={0} cy={0}
          rx={size * 0.42}
          ry={size * 0.12}
          fill="none"
          stroke="#22d3ee"
          strokeWidth={0.5}
          opacity={0.15}
          style={{
            animation: "blackhole-lensing 3s ease-in-out infinite alternate",
            transformOrigin: "center",
          }}
        />

        {/* Event horizon shadow */}
        <circle cx={0} cy={0} r={size * 0.22} fill="#000" opacity={0.95} />
        {/* Event horizon ring */}
        <circle
          cx={0} cy={0}
          r={size * 0.22}
          stroke="#6366f1"
          strokeWidth={1.5}
          fill="none"
          opacity={0.7}
        />

        {/* Accretion disk — multi-ring with gradient */}
        <BlackHoleRing radius={size * 0.38} opacity={0.4} rotationSpeed={3} color="#6366f1" />
        <BlackHoleRing radius={size * 0.32} opacity={0.55} rotationSpeed={4.5} />
        <BlackHoleRing radius={size * 0.26} opacity={0.4} rotationSpeed={6} color="#6366f1" dashed />
        <BlackHoleRing radius={size * 0.42} opacity={0.15} rotationSpeed={8} dashed />

        {/* Inner glow */}
        <circle
          cx={0} cy={0}
          r={size * 0.08}
          fill="#22d3ee"
          opacity={0.5}
          style={{ animation: "blackhole-pulse 0.8s ease-in-out infinite alternate" }}
        />

        {/* Accretion particles */}
        {[0, 1, 2, 3].map((i) => {
          const angle = (i / 4) * Math.PI * 2;
          const r = size * (0.24 + i * 0.04);
          return (
            <circle
              key={i}
              cx={Math.cos(angle) * r}
              cy={Math.sin(angle) * r}
              r={1.5}
              fill={i % 2 === 0 ? "#22d3ee" : "#6366f1"}
              opacity={0.6}
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from={`0 0 0`}
                to={`360 0 0`}
                dur={`${2 + i * 0.5}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}
      </svg>
    </div>
  );
});

// ─── Accretion stream particles (independent from black hole SVG) ───
const AccretionStream = memo(function AccretionStream({
  active,
  digLevel,
}: {
  active: boolean;
  digLevel: number;
}) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-[4]" aria-hidden>
      {/* Particles spiraling into the black hole */}
      {Array.from({ length: 12 + digLevel * 6 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.5;
        const dist = 30 + Math.random() * 50;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 1.5 + Math.random() * 2,
              height: 1.5 + Math.random() * 2,
              background: i % 3 === 0 ? "#6366f1" : "#22d3ee",
              boxShadow: `0 0 ${2 + Math.random() * 4}px ${i % 3 === 0 ? "#6366f1" : "#22d3ee"}`,
            }}
            initial={{
              x: `calc(50% + ${Math.cos(angle) * dist}px)`,
              y: `calc(50% + ${Math.sin(angle) * dist}px)`,
              opacity: 0,
            }}
            animate={{
              x: "50%",
              y: "50%",
              opacity: [0, 0.7, 0],
              scale: [0.5, 1, 0.3],
            }}
            transition={{
              duration: 1.5 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeIn",
            }}
          />
        );
      })}
    </div>
  );
});

// ─── Reveal burst particles ───
const RevealBurst = memo(function RevealBurst({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-[6]" aria-hidden>
      {Array.from({ length: 40 }).map((_, i) => {
        const angle = (i / 40) * Math.PI * 2;
        const dist = 80 + Math.random() * 120;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 1 + Math.random() * 3,
              height: 1 + Math.random() * 3,
              background: i % 5 < 2 ? "#fff" : i % 3 === 0 ? "#6366f1" : "#22d3ee",
              boxShadow: `0 0 ${2 + Math.random() * 6}px ${
                i % 3 === 0 ? "#6366f1" : "#22d3ee"
              }`,
            }}
            initial={{
              x: "50%",
              y: "50%",
              opacity: 1,
              scale: 1,
            }}
            animate={{
              x: `calc(50% + ${Math.cos(angle) * dist}px)`,
              y: `calc(50% + ${Math.sin(angle) * dist}px)`,
              opacity: [1, 0.6, 0],
              scale: [1, 0.8, 0],
            }}
            transition={{
              duration: 0.6 + Math.random() * 0.4,
              delay: Math.random() * 0.2,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
});

// ─── Portfolio Card ───
const PORTFOLIO_ITEMS = [
  { name: "PATA-PASS", subtitle: "DogWalk App", color: "#22d3ee", delay: 0, icon: "🐾" },
  { name: "MISSION CONTROL", subtitle: "Portfólio", color: "#6366f1", delay: 150, icon: "🛸" },
  { name: "ARACHNE", subtitle: "Data Platform", color: "#22d3ee", delay: 300, icon: "🕸️" },
];

const PortfolioCards = memo(function PortfolioCards({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-[7] flex items-center justify-center">
      <div className="relative w-80 h-56">
        {PORTFOLIO_ITEMS.map((item, i) => {
          const angle = (i / PORTFOLIO_ITEMS.length) * Math.PI * 2 - Math.PI / 2;
          const dist = 90 + i * 15;
          const x = Math.cos(angle) * dist;
          const y = Math.sin(angle) * dist;
          return (
            <motion.div
              key={item.name}
              className="absolute"
              initial={{ x: 0, y: 0, opacity: 0, scale: 0.1, rotate: 0 }}
              animate={{ x, y, opacity: 1, scale: 1, rotate: 360 }}
              transition={{
                delay: item.delay / 1000,
                duration: 0.6,
                ease: "backOut",
              }}
              style={{ left: "50%", top: "50%", marginLeft: -64, marginTop: -28 }}
            >
              <div
                className="w-32 h-14 rounded-lg border flex items-center gap-2 px-3"
                style={{
                  borderColor: item.color,
                  background: "rgba(10, 10, 26, 0.88)",
                  boxShadow: `0 0 16px ${item.color}44, inset 0 0 8px ${item.color}22`,
                  backdropFilter: "blur(4px)",
                }}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <div className="flex flex-col">
                  <span
                    style={{
                      color: item.color,
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "2px",
                      fontFamily: "monospace",
                    }}
                  >
                    {item.name}
                  </span>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.35)",
                      fontSize: 7,
                      letterSpacing: "1px",
                      fontFamily: "monospace",
                    }}
                  >
                    {item.subtitle}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

// ─── Props ───
interface Props {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const [elapsed, setElapsed] = useState(0);
  const [exiting, setExiting] = useState(false);
  const doneRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const stars = useRef(genStars()).current;

  // ── Phase from elapsed ──
  const phase =
    elapsed < PHASES.DESCEND ? "init" :
    elapsed < PHASES.CROSS ? "descend" :
    elapsed < PHASES.DIG ? "cross" :
    elapsed < PHASES.REVEAL ? "dig" :
    elapsed < PHASES.EXIT ? "reveal" :
    "exit";

  const isDigging = phase === "dig";
  const digElapsed = elapsed - PHASES.DIG;
  const digCycle = isDigging ? Math.floor(digElapsed / DIG_CYCLE_MS) : 0;
  const digLevel = Math.min(digCycle, 3); // 0-3 digs
  const digProgress = isDigging ? (digElapsed % DIG_CYCLE_MS) / DIG_CYCLE_MS : 0;
  const sinkAmount = digLevel / 3; // 0 to 1 as digs progress

  const blackHoleSizes = [30, 60, 100, 160];
  const blackHoleSize = isDigging || phase === "reveal" || phase === "exit"
    ? blackHoleSizes[Math.min(digLevel, 3)]
    : 0;
  const blackHoleShow = phase === "dig" || phase === "reveal" || phase === "exit";
  const cardsShow = phase === "reveal" || phase === "exit";
  const tatuVisible = phase !== "init" && phase !== "exit";

  // Dig bob: tatu bounces on each dig stroke
  const digBob = isDigging
    ? Math.sin(digProgress * Math.PI * 2) * Math.min(digLevel + 2, 5)
    : 0;

  // ── Timer ──
  useEffect(() => {
    if (prefersReducedMotion) {
      setElapsed(TOTAL_DURATION + 100);
      const t = setTimeout(() => onCompleteRef.current(), 200);
      return () => clearTimeout(t);
    }

    const start = performance.now();
    let raf: number;

    function tick(now: number) {
      const e = now - start;
      setElapsed(e);

      if (e >= TOTAL_DURATION && !doneRef.current) {
        doneRef.current = true;
        setExiting(true);
        setTimeout(() => onCompleteRef.current(), 600);
        return;
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
    };
  }, [prefersReducedMotion]);

  // Force complete safety timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        setExiting(true);
        setTimeout(() => onCompleteRef.current(), 400);
      }
    }, TOTAL_DURATION + 3000);
    return () => clearTimeout(timer);
  }, []);

  // ── Tatu position from phase ──
  const tatuTop = (() => {
    if (phase === "init") return "12%";
    if (phase === "descend") {
      // Extend timing to move down slower
      const local = elapsed - PHASES.DESCEND;
      const dur = PHASES.CROSS - PHASES.DESCEND;
      const pct = Math.min(local / dur, 1);
      // Ease-out: slow down near target
      const eased = 1 - Math.pow(1 - pct, 2);
      return `${12 + eased * 35}%`;
    }
    return "47%";
  })();

  const tatuLeft = (() => {
    if (phase === "init" || phase === "descend") return "78%";
    if (phase === "cross") {
      const local = elapsed - PHASES.CROSS;
      const dur = PHASES.DIG - PHASES.CROSS;
      const pct = Math.min(local / dur, 1);
      const eased = 1 - Math.pow(1 - pct, 2);
      return `${78 - eased * 28}%`;
    }
    return "50%";
  })();

  // Visible boot lines
  const visibleBootIdx = (() => {
    let idx = -1;
    const e = elapsed + PHASES.INIT;
    for (let i = 0; i < BOOT_LINES.length; i++) {
      if (e >= BOOT_LINES[i].phase) idx = i;
    }
    return idx;
  })();

  // Exit direction for tatu: fly up-right out of frame
  const exitX = exiting ? 120 : 0;
  const exitY = exiting ? -80 : 0;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at center, #0a0a1a 0%, #000 100%)",
      }}
      animate={exiting ? { opacity: 0, scale: 1.02 } : { opacity: 1, scale: 1 }}
      transition={exiting ? { duration: 0.6, ease: "easeInOut" } : { duration: 0 }}
    >
      {/* Starfield */}
      <StarField stars={stars} />

      {/* Nebula */}
      <NebulaBg />

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34, 211, 238, 0.018) 2px, rgba(34, 211, 238, 0.018) 4px)",
          animation: "scanline-sweep 8s linear infinite",
        }}
      />

      {/* Vignette — more dramatic */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.9) 100%)",
        }}
      />

      {/* ── Accretion stream (particles spiraling into black hole) ── */}
      <AccretionStream active={isDigging} digLevel={digLevel} />

      {/* ── Black Hole ── */}
      <AnimatePresence>
        {blackHoleShow && (
          <motion.div
            key="blackhole"
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <BlackHole size={blackHoleSize} show={true} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Reveal Burst ── */}
      {phase === "reveal" && <RevealBurst show={true} />}

      {/* ── Portfolio Cards ── */}
      <PortfolioCards show={cardsShow} />

      {/* ── Tatu ── */}
      <motion.div
        key="tatu"
        className="absolute z-10"
        style={{
          transform: "translate(-50%, -50%)",
          opacity: tatuVisible ? 1 : 0,
          pointerEvents: "none",
          top: `calc(${tatuTop} + ${digBob}px)`,
          left: tatuLeft,
        }}
        animate={exiting ? { x: exitX, y: exitY, opacity: 0 } : { x: 0, y: 0 }}
        transition={
          exiting
            ? { duration: 0.5, ease: "easeIn" }
            : { opacity: { duration: 0.3 } }
        }
      >
        <TatuGlyph
          scale={1.2}
          digging={isDigging}
          digLevel={digLevel}
          digProgress={digProgress}
          sinkAmount={sinkAmount}
        />
      </motion.div>

      {/* ── Boot messages ── */}
      <div
        className="absolute z-10 bottom-[18%] left-1/2 -translate-x-1/2 w-80 font-mono text-xs"
        style={{ color: "rgba(34, 211, 238, 0.6)" }}
      >
        {BOOT_LINES.map((line, i) => (
          <div
            key={i}
            className="overflow-hidden whitespace-nowrap"
            style={{
              height: 18,
              opacity: i <= visibleBootIdx ? 1 : 0,
              transition: "opacity 0.3s ease",
              color: line.accent ? "#22d3ee" : "rgba(34, 211, 238, 0.6)",
              textShadow: line.accent
                ? "0 0 8px rgba(34,211,238,0.5)"
                : "none",
            }}
          >
            {line.text}
            {i === visibleBootIdx && (
              <span
                className="inline-block w-[6px] h-[12px] ml-[2px] align-middle"
                style={{
                  background: "#22d3ee",
                  boxShadow: "0 0 6px #22d3ee",
                  animation: "blink-cursor 0.6s step-end infinite",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── Progress bar ── */}
      <div
        className="absolute z-10 bottom-[12%] left-1/2 -translate-x-1/2 w-72 h-[2px] overflow-hidden rounded-full"
        style={{ background: "rgba(34, 211, 238, 0.1)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-100 ease-linear"
          style={{
            width: `${Math.min((elapsed / TOTAL_DURATION) * 100, 100)}%`,
            background: "linear-gradient(90deg, #6366f1, #22d3ee, #6366f1)",
            backgroundSize: "200% 100%",
            animation: "progress-glow 1.5s linear infinite",
            boxShadow: "0 0 8px rgba(34,211,238,0.4)",
          }}
        />
      </div>

      {/* ── Phase label ── */}
      <div
        className="absolute z-10 bottom-[8%] left-1/2 -translate-x-1/2 font-mono text-[8px] tracking-[3px]"
        style={{ color: "rgba(34, 211, 238, 0.2)" }}
      >
        {phase === "dig"
          ? `EXCAVATION [${digLevel + 1}/4]`
          : phase === "reveal"
            ? "CARDS DEPLOYED"
            : phase === "exit"
              ? "SYSTEM READY"
              : phase.toUpperCase()}
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes star-pulse {
          0% { opacity: 0.1; transform: scale(0.8); }
          100% { opacity: 0.5; transform: scale(1.3); }
        }
        @keyframes scanline-sweep {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes blackhole-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes blackhole-pulse {
          0% { opacity: 0.3; transform: scale(0.8); }
          100% { opacity: 0.7; transform: scale(1.3); }
        }
        @keyframes blackhole-lensing {
          0% { transform: scaleX(1) scaleY(1); opacity: 0.1; }
          50% { transform: scaleX(1.15) scaleY(0.85); opacity: 0.2; }
          100% { transform: scaleX(1) scaleY(1); opacity: 0.1; }
        }
        @keyframes progress-glow {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </motion.div>
  );
}
