"use client";

import { useState, useEffect, useRef, memo, useMemo } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { TatuGlyph } from "./TatuGlyph";

// ─── Phase timing (ms from start) ───
const PHASES = {
  INIT:    0,
  DESCEND: 600,   // tatu appears top-right, starts descending
  CROSS:   2400,  // tatu reaches mid-right, starts crossing to center
  DIG:     4200,  // tatu at center, digs black hole (30→60→100→160px)
  PORTAL:  6800,  // black hole grows → portal opens (160→400px → screen)
  EXIT:    9000,  // portal consumes everything, content revealed
} as const;

const TOTAL_DURATION = 10000;
const DIG_CYCLE_MS = 500;

// ─── Boot lines per phase ───
interface BootLine {
  text: string;
  phase: number;
  accent?: boolean;
}

const BOOT_LINES: BootLine[] = [
  { text: "SEARCHING...",        phase: PHASES.INIT },
  { text: "SCANNING PORTFOLIO SPACE",      phase: PHASES.DESCEND },
  { text: "TARGET ACQUIRED",               phase: PHASES.CROSS, accent: true },
  { text: "EXCAVATION DRILL ARMED",        phase: PHASES.DIG },
  { text: "BLACK HOLE GENERATOR ACTIVE",   phase: PHASES.DIG + 800, accent: true },
  { text: "PORTAL STABILIZED",             phase: PHASES.PORTAL, accent: true },
  { text: "MISSION CONTROL DEPLOYED.",     phase: PHASES.EXIT - 600 },
];

// ─── Stars ───
type Star = { x: number; y: number; size: number; delay: number; opacity: number; animDuration: number; shadowColor: string };
const STAR_COUNT = 200;

const genStars = () =>
  Array.from({ length: STAR_COUNT }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 0.3 + Math.random() * 2.2,
    delay: Math.random() * 4,
    opacity: 0.1 + Math.random() * 0.35,
    animDuration: 1.5 + Math.random() * 2.5,
    shadowColor: i % 5 === 0 ? "#6366f1" : "#22d3ee",
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
            background: s.shadowColor,
            opacity: s.opacity,
            boxShadow: `0 0 ${s.size * 2}px ${s.shadowColor}`,
            animation: `star-pulse ${s.animDuration}s ease-in-out ${s.delay}s infinite alternate`,
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
          background: "radial-gradient(ellipse, #6366f1 0%, #22d3ee 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute w-[40%] h-[40%] rounded-full opacity-[0.025]"
        style={{
          right: "5%",
          bottom: "5%",
          background: "radial-gradient(ellipse, #22d3ee 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
    </div>
  );
});

// ─── Black Hole components ───
function BlackHoleRing({
  radius, opacity, rotationSpeed, color = "#22d3ee", dashed = false,
}: {
  radius: number; opacity: number; rotationSpeed: number; color?: string; dashed?: boolean;
}) {
  return (
    <circle
      cx={0} cy={0} r={radius}
      stroke={color} strokeWidth={1.2}
      strokeDasharray={dashed ? "4 6" : undefined}
      fill="none" opacity={opacity}
      style={{
        animation: `blackhole-spin ${rotationSpeed}s linear infinite`,
        transformOrigin: "center",
      }}
    />
  );
}

function BlackHoleInner({ size, opacity: bhOpacity }: { size: number; opacity: number }) {
  const s = size;

  return (
    <svg
      viewBox={`${-s / 2} ${-s / 2} ${s} ${s}`}
      className="w-full h-full"
      style={{ filter: "url(#bh-glow)", opacity: bhOpacity }}
    >
      <defs>
        <radialGradient id="bh-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#6366f1" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
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
      <circle cx={0} cy={0} r={s * 0.48} fill="url(#bh-core)" />

      {/* Gravitational lensing ring */}
      <ellipse
        cx={0} cy={0}
        rx={s * 0.42} ry={s * 0.12}
        fill="none" stroke="#22d3ee" strokeWidth={0.5}
        opacity={0.15}
        style={{ animation: "blackhole-lensing 3s ease-in-out infinite alternate", transformOrigin: "center" }}
      />

      {/* Event horizon */}
      <circle cx={0} cy={0} r={s * 0.22} fill="#000" opacity={0.95} />
      <circle cx={0} cy={0} r={s * 0.22} stroke="#6366f1" strokeWidth={1.5} fill="none" opacity={0.7} />

      {/* Accretion rings */}
      <BlackHoleRing radius={s * 0.38} opacity={0.4} rotationSpeed={3} color="#6366f1" />
      <BlackHoleRing radius={s * 0.32} opacity={0.55} rotationSpeed={4.5} />
      <BlackHoleRing radius={s * 0.26} opacity={0.4} rotationSpeed={6} color="#6366f1" dashed />
      <BlackHoleRing radius={s * 0.42} opacity={0.15} rotationSpeed={8} dashed />

      {/* Inner glow */}
      <circle
        cx={0} cy={0}
        r={s * 0.08}
        fill="#22d3ee"
        opacity={0.6}
        style={{ animation: "blackhole-pulse 0.8s ease-in-out infinite alternate" }}
      />

      {/* Accretion particles */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2;
        const r = s * (0.24 + i * 0.04);
        return (
          <circle key={i} cx={Math.cos(angle) * r} cy={Math.sin(angle) * r} r={1.5}
            fill={i % 2 === 0 ? "#22d3ee" : "#6366f1"} opacity={0.6}>
            <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0"
              dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
          </circle>
        );
      })}
    </svg>
  );
}

const BlackHole = memo(function BlackHole({ size, show, opacity: bhOpacity = 1 }: { size: number; show: boolean; opacity?: number }) {
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
      <BlackHoleInner size={size} opacity={bhOpacity} />
    </div>
  );
});

// ─── Accretion stream particles ───
const AccretionStream = memo(function AccretionStream({
  active, digLevel,
}: {
  active: boolean; digLevel: number;
}) {
  const particles = useMemo(() => {
    const count = 12 + digLevel * 6;
    // eslint-disable-next-line react-hooks/purity
    const rand = () => Math.random();
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / 12) * Math.PI * 2 + rand() * 0.5,
      dist: 30 + rand() * 50,
      w: 1.5 + rand() * 2,
      h: 1.5 + rand() * 2,
      shadow: 2 + rand() * 4,
      dur: 1.5 + rand() * 2,
      del: rand() * 2,
    }));
  }, [digLevel]);

  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-[4]" aria-hidden>
      {particles.map((p, i) => {
        const bg = i % 3 === 0 ? "#6366f1" : "#22d3ee";
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.w,
              height: p.h,
              background: bg,
              boxShadow: `0 0 ${p.shadow}px ${bg}`,
            }}
            initial={{
              x: `calc(50% + ${Math.cos(p.angle) * p.dist}px)`,
              y: `calc(50% + ${Math.sin(p.angle) * p.dist}px)`,
              opacity: 0,
            }}
            animate={{
              x: "50%",
              y: "50%",
              opacity: [0, 0.7, 0],
              scale: [0.5, 1, 0.3],
            }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              delay: p.del,
              ease: "easeIn",
            }}
          />
        );
      })}
    </div>
  );
});

// ─── Portal burst particles ───
interface PortalBurstProps {
  show: boolean;
}

const PortalBurst = memo(function PortalBurst({ show }: PortalBurstProps) {
  const particles = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    const rand = () => Math.random();
    return Array.from({ length: 60 }, (_, i) => {
      const angle = (i / 60) * Math.PI * 2;
      const bg = i % 5 < 2 ? "#fff" : i % 3 === 0 ? "#6366f1" : "#22d3ee";
      return {
        angle,
        dist: 100 + rand() * 200,
        w: 1 + rand() * 4,
        h: 1 + rand() * 4,
        bg,
        shadow: `0 0 ${3 + rand() * 8}px ${bg}`,
        dur: 0.8 + rand() * 0.6,
        del: rand() * 0.3,
      };
    });
  }, []);

  if (!show) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-[6]" aria-hidden>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.w,
            height: p.h,
            background: p.bg,
            boxShadow: p.shadow,
          }}
          initial={{ x: "50%", y: "50%", opacity: 1, scale: 1 }}
          animate={{
            x: `calc(50% + ${Math.cos(p.angle) * p.dist}px)`,
            y: `calc(50% + ${Math.sin(p.angle) * p.dist}px)`,
            opacity: [1, 0.5, 0],
            scale: [1, 0.6, 0],
          }}
          transition={{
            duration: p.dur,
            delay: p.del,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
});

// ─── Props ───
interface Props {
  onComplete: () => void;
  onPortalOpen?: () => void;
}

export function SplashScreen({ onComplete, onPortalOpen }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const [elapsed, setElapsed] = useState(0);
  const [exiting, setExiting] = useState(false);
  const doneRef = useRef(false);
  const portalFiredRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const stars = useMemo(() => genStars(), []);

  // Sync onCompleteRef when it changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // ── Phase from elapsed ──
  const phase =
    elapsed < PHASES.DESCEND ? "init" :
    elapsed < PHASES.CROSS ? "descend" :
    elapsed < PHASES.DIG ? "cross" :
    elapsed < PHASES.PORTAL ? "dig" :
    elapsed < PHASES.EXIT ? "portal" :
    "exit";

  const isDigging = phase === "dig";
  const digElapsed = elapsed - PHASES.DIG;
  const digCycle = isDigging ? Math.floor(digElapsed / DIG_CYCLE_MS) : 0;
  const digLevel = Math.min(digCycle, 3);
  const digProgress = isDigging ? (digElapsed % DIG_CYCLE_MS) / DIG_CYCLE_MS : 0;
  const sinkAmount = digLevel / 3;

  // Black hole sizing
  const isBhPhase = phase === "dig" || phase === "portal" || phase === "exit";
  const digSizes = [30, 60, 100, 160];
  const baseBhSize = isBhPhase ? digSizes[Math.min(digLevel, 3)] : 0;

  // In portal phase, black hole grows from dig size → massive portal
  const portalSize = (() => {
    if (phase !== "portal") return baseBhSize;
    const local = elapsed - PHASES.PORTAL;
    const dur = PHASES.EXIT - PHASES.PORTAL;
    const pct = Math.min(local / dur, 1);
    const eased = 1 - Math.pow(1 - pct, 3); // ease-out cubic
    // Grow from baseBhSize to screen-filling ~2000px
    return baseBhSize + eased * 1800;
  })();

  // In exit phase, black hole becomes transparent (portal opens fully)
  const bhOpacity = (() => {
    if (phase === "exit") {
      const local = elapsed - PHASES.EXIT;
      const dur = TOTAL_DURATION - PHASES.EXIT;
      const pct = Math.min(local / dur, 1);
      return Math.max(0, 1 - pct * 1.5);
    }
    return 1;
  })();

  // Splash background mask: in exit phase, opens from center like a portal
  const splashMask = (() => {
    if (phase !== "exit") return "none";
    const local = elapsed - PHASES.EXIT;
    const dur = TOTAL_DURATION - PHASES.EXIT;
    const pct = Math.min(local / dur, 1);
    const radius = pct * 100; // 0% → 100% transparent
    return `radial-gradient(circle at 50% 50%, transparent ${radius}%, black ${radius}%)`;
  })();

  const blackHoleShow = isBhPhase;
  const tatuVisible = phase !== "init" && phase !== "exit" && phase !== "portal";

  // Dig bob
  const digBob = isDigging
    ? Math.sin(digProgress * Math.PI * 2) * Math.min(digLevel + 2, 5)
    : 0;

  // Tatu exit: portal phase, tatu flies into the black hole
  const tatuPortalExit = phase === "portal"
    ? { scale: Math.max(0, 1 - ((elapsed - PHASES.PORTAL) / (PHASES.EXIT - PHASES.PORTAL))), opacity: Math.max(0, 1 - ((elapsed - PHASES.PORTAL) / (PHASES.EXIT - PHASES.PORTAL)) * 2) }
    : { scale: 1, opacity: 1 };

  // ── Timer ──
  useEffect(() => {
    if (prefersReducedMotion) {
      const t = setTimeout(() => {
        setElapsed(TOTAL_DURATION + 100);
        onCompleteRef.current();
      }, 200);
      return () => clearTimeout(t);
    }

    const start = performance.now();
    let raf: number;

    function tick(now: number) {
      const e = now - start;
      setElapsed(e);

      // Fire portal callback when entering portal phase
      if (
        e >= PHASES.PORTAL &&
        e < PHASES.EXIT &&
        !portalFiredRef.current &&
        onPortalOpen
      ) {
        portalFiredRef.current = true;
        onPortalOpen();
      }

      if (e >= TOTAL_DURATION && !doneRef.current) {
        doneRef.current = true;
        setExiting(true);
        setTimeout(() => onCompleteRef.current(), 400);
        return;
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [prefersReducedMotion, onPortalOpen]);

  // Safety timeout: se o onComplete não for chamado, força saída em 8s
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        setExiting(true);
        setTimeout(() => onCompleteRef.current(), 200);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  // ── Transition: when exiting, fade out z-index
  const splashZ = exiting ? 40 : 50;
  const tatuTop = (() => {
    if (phase === "init") return "12%";
    if (phase === "descend") {
      const local = elapsed - PHASES.DESCEND;
      const dur = PHASES.CROSS - PHASES.DESCEND;
      const pct = Math.min(local / dur, 1);
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
    const e = elapsed;
    for (let i = 0; i < BOOT_LINES.length; i++) {
      if (e >= BOOT_LINES[i].phase) idx = i;
    }
    return idx;
  })();

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center select-none overflow-hidden"
      style={{
        zIndex: splashZ,
        background: exiting ? "transparent" : "radial-gradient(ellipse at center, #0a0a1a 0%, #000 100%)",
        mask: splashMask,
        WebkitMask: splashMask,
        transition: "background 0.3s ease",
      }}
    >
      {/* Starfield */}
      <StarField stars={stars} />

      {/* Nebula */}
      <NebulaBg />

      {/* Scanline overlay */}
      {!exiting && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34, 211, 238, 0.018) 2px, rgba(34, 211, 238, 0.018) 4px)",
            animation: "scanline-sweep 8s linear infinite",
          }}
        />
      )}

      {/* Vignette */}
      {!exiting && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.9) 100%)",
          }}
        />
      )}

      {/* Accretion stream */}
      <AccretionStream active={isDigging} digLevel={digLevel} />

      {/* Portal burst */}
      {phase === "portal" && <PortalBurst show={true} />}

      {/* Black Hole */}
      <AnimatePresence>
        {blackHoleShow && (
          <motion.div
            key="blackhole"
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <BlackHole size={portalSize} show={true} opacity={bhOpacity} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tatu */}
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
        animate={{
          scale: tatuPortalExit.scale,
          opacity: phase === "portal"
            ? Math.max(0, 1 - ((elapsed - PHASES.PORTAL) / (PHASES.EXIT - PHASES.PORTAL)) * 2)
            : tatuVisible ? 1 : 0,
        }}
        transition={{ opacity: { duration: 0.3 } }}
      >
        <TatuGlyph
          scale={1.2}
          digging={isDigging}
          digLevel={digLevel}
          digProgress={digProgress}
          sinkAmount={sinkAmount}
        />
      </motion.div>

      {/* Boot messages */}
      <div
        className="absolute z-10 bottom-[18%] left-1/2 -translate-x-1/2 w-80 font-mono text-xs"
        style={{ color: "rgba(34, 211, 238, 0.6)", opacity: phase === "exit" ? 0 : 1, transition: "opacity 0.5s" }}
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
              textShadow: line.accent ? "0 0 8px rgba(34,211,238,0.5)" : "none",
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

      {/* Progress bar */}
      <div
        className="absolute z-10 bottom-[12%] left-1/2 -translate-x-1/2 w-72 h-[2px] overflow-hidden rounded-full"
        style={{
          background: "rgba(34, 211, 238, 0.1)",
          opacity: phase === "exit" ? 0 : 1,
          transition: "opacity 0.5s",
        }}
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

      {/* Phase label */}
      <div
        className="absolute z-10 bottom-[8%] left-1/2 -translate-x-1/2 font-mono text-[8px] tracking-[3px]"
        style={{
          color: "rgba(34, 211, 238, 0.2)",
          opacity: phase === "exit" ? 0 : 1,
          transition: "opacity 0.5s",
        }}
      >
        {phase === "dig"
          ? `EXCAVATION [${digLevel + 1}/4]`
          : phase === "portal"
            ? "PORTAL OPENING"
            : phase === "exit"
              ? "SYSTEM READY"
              : phase.toUpperCase()}
      </div>

      {/* Keyframes */}
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
    </div>
  );
}
