"use client";

import { useState, useEffect, useRef, memo, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";

// ─── Boot messages ───
const BOOT_LINES = [
  { text: "TATU PROCURE SYSTEM v1.0", delay: 200 },
  { text: "MAPPING PORTFOLIO DATA...", delay: 600 },
  { text: "LINKING MISSION CONTROL...", delay: 1100 },
  { text: "CALIBRATING HYPERDRIVE...", delay: 1600 },
  { text: "READY.", delay: 2100 },
];

const TOTAL_DURATION = 3200; // ms — splash total

// ─── Stars ───
type Star = { x: number; y: number; size: number; delay: number };
const STAR_COUNT = 120;

const genStars = () =>
  Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 0.5 + Math.random() * 2,
    delay: Math.random() * 3,
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
            background: "#22d3ee",
            opacity: 0.15 + Math.random() * 0.3,
            boxShadow: `0 0 ${s.size * 2}px #22d3ee`,
            animation: `star-pulse ${1.5 + Math.random() * 2}s ease-in-out ${s.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
});

// ─── Props ───
interface Props {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [visibleLine, setVisibleLine] = useState(-1);
  const [exiting, setExiting] = useState(false);
  const doneRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const stars = useRef(genStars()).current;

  // ── Progress bar ──
  useEffect(() => {
    if (prefersReducedMotion) {
      setProgress(100);
      setVisibleLine(BOOT_LINES.length - 1);
      const t = setTimeout(() => onCompleteRef.current(), 100);
      return () => clearTimeout(t);
    }

    const start = performance.now();
    let raf: number;

    function tick(now: number) {
      const elapsed = now - start;
      const pct = Math.min((elapsed / TOTAL_DURATION) * 100, 100);
      setProgress(pct);

      // Find which boot line should be visible (avoid findLastIndex for compat)
      let lineIdx = -1;
      for (let i = BOOT_LINES.length - 1; i >= 0; i--) {
        if (elapsed >= BOOT_LINES[i].delay) { lineIdx = i; break; }
      }
      if (lineIdx >= 0) setVisibleLine(lineIdx);

      if (pct >= 100 && !doneRef.current) {
        doneRef.current = true;
        setExiting(true);
        setTimeout(() => onCompleteRef.current(), 800);
      } else {
        raf = requestAnimationFrame(tick);
      }
    }

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      doneRef.current = true;
    };
  }, [prefersReducedMotion]);

  // Force complete if stuck (ISR safety)
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

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: "radial-gradient(ellipse at center, #0a0a1a 0%, #000 100%)",
      }}
      animate={exiting ? { opacity: 0, scale: 1.02 } : { opacity: 1, scale: 1 }}
      transition={exiting ? { duration: 0.6, ease: "easeInOut" } : { duration: 0 }}
    >
      {/* Starfield */}
      <StarField stars={stars} />

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34, 211, 238, 0.015) 2px, rgba(34, 211, 238, 0.015) 4px)",
          animation: "scanline-sweep 8s linear infinite",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      {/* ── MC Monogram ── */}
      <motion.div
        className="relative z-10 mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Orbit rings */}
          <circle cx="40" cy="40" r="36" stroke="#22d3ee" strokeWidth="0.5" opacity={0.3} fill="none" />
          <circle cx="40" cy="40" r="28" stroke="#6366f1" strokeWidth="0.5" opacity={0.2} fill="none" />
          {/* MC letters */}
          <text x="40" y="48" textAnchor="middle" fill="#22d3ee" fontSize="28" fontWeight="700" fontFamily="monospace" opacity={0.9}>MC</text>
          {/* Corner brackets */}
          <path d="M12 12 L12 18 L18 18" stroke="#22d3ee" strokeWidth="1.5" fill="none" opacity={0.5} />
          <path d="M68 12 L68 18 L62 18" stroke="#22d3ee" strokeWidth="1.5" fill="none" opacity={0.5} />
          <path d="M12 68 L12 62 L18 62" stroke="#22d3ee" strokeWidth="1.5" fill="none" opacity={0.5} />
          <path d="M68 68 L68 62 L62 62" stroke="#22d3ee" strokeWidth="1.5" fill="none" opacity={0.5} />
        </svg>
      </motion.div>

      {/* ── Boot lines ── */}
      <div className="relative z-10 w-72 font-mono text-xs">
        {BOOT_LINES.map((line, i) => (
          <motion.div
            key={i}
            className="overflow-hidden whitespace-nowrap"
            initial={{ width: 0, opacity: 0 }}
            animate={
              i <= visibleLine
                ? { width: "100%", opacity: 1 }
                : { width: 0, opacity: 0 }
            }
            transition={{
              width: { duration: 0.4, ease: "easeOut" },
              opacity: { duration: 0.2 },
            }}
            style={{
              color: i === BOOT_LINES.length - 1 ? "#22d3ee" : "rgba(34, 211, 238, 0.6)",
              textShadow: i === BOOT_LINES.length - 1 ? "0 0 8px rgba(34,211,238,0.5)" : "none",
              height: 18,
            }}
          >
            {line.text}
            {i <= visibleLine && i === visibleLine && (
              <span className="inline-block w-[6px] h-[12px] ml-[2px] align-middle" style={{
                background: "#22d3ee",
                boxShadow: "0 0 6px #22d3ee",
                animation: "blink-cursor 0.6s step-end infinite",
              }} />
            )}
          </motion.div>
        ))}
      </div>

      {/* ── Progress bar ── */}
      <div className="relative z-10 mt-6 w-72 h-[2px] overflow-hidden rounded-full" style={{ background: "rgba(34, 211, 238, 0.1)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #6366f1, #22d3ee)",
            boxShadow: "0 0 8px rgba(34,211,238,0.4)",
          }}
        />
      </div>

      {/* Version */}
      <div className="relative z-10 mt-2 font-mono text-[8px] tracking-[3px]" style={{ color: "rgba(34, 211, 238, 0.2)" }}>
        TATU PROCURE v1.0
      </div>

      {/* ── Boot keyframe styles ── */}
      <style>{`
        @keyframes star-pulse {
          0% { opacity: 0.1; transform: scale(0.8); }
          100% { opacity: 0.4; transform: scale(1.2); }
        }
        @keyframes scanline-sweep {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </motion.div>
  );
}
