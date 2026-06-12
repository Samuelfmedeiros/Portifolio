"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

interface GradientCornerProps {
  opacity: MotionValue<number>;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  delay?: number;
}

function GradientCorner({ opacity, position, delay = 0 }: GradientCornerProps) {
  const positionClasses: Record<string, string> = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0",
  };

  const gradientDir: Record<string, string> = {
    "top-left": "to-br",
    "top-right": "to-bl",
    "bottom-left": "to-tr",
    "bottom-right": "to-tl",
  };

  return (
    <motion.div
      style={{ opacity }}
      className={`absolute w-12 h-12 md:w-20 md:h-20 ${positionClasses[position]} z-1`}
    >
      {/* Outer gradient border - softer */}
      <motion.div
        className={`absolute inset-0 ${positionClasses[position]} rounded-tl-lg bg-gradient-to-${gradientDir[position]} from-[var(--accent)] to-transparent`}
        style={{
          opacity: 0.12,
          maskImage:
            position === "top-left"
              ? "linear-gradient(to bottom right, black 0%, transparent 70%)"
              : position === "top-right"
              ? "linear-gradient(to bottom left, black 0%, transparent 70%)"
              : position === "bottom-left"
              ? "linear-gradient(to top right, black 0%, transparent 70%)"
              : "linear-gradient(to top left, black 0%, transparent 70%)",
          WebkitMaskImage:
            position === "top-left"
              ? "linear-gradient(to bottom right, black 0%, transparent 70%)"
              : position === "top-right"
              ? "linear-gradient(to bottom left, black 0%, transparent 70%)"
              : position === "bottom-left"
              ? "linear-gradient(to top right, black 0%, transparent 70%)"
              : "linear-gradient(to top left, black 0%, transparent 70%)",
        }}
        animate={{ opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
      />

      {/* Inner accent - thin line */}
      <div
        className={`absolute w-6 h-6 md:w-8 md:h-8 ${position === "top-left" ? "top-1 left-1" : position === "top-right" ? "top-1 right-1" : position === "bottom-left" ? "bottom-1 left-1" : "bottom-1 right-1"}`}
        style={{
          borderTop: position.startsWith("top") ? "1px solid rgba(34, 211, 238, 0.08)" : "none",
          borderBottom: position.startsWith("bottom") ? "1px solid rgba(34, 211, 238, 0.08)" : "none",
          borderLeft: position.endsWith("left") ? "1px solid rgba(34, 211, 238, 0.08)" : "none",
          borderRight: position.endsWith("right") ? "1px solid rgba(34, 211, 238, 0.08)" : "none",
        }}
      />
    </motion.div>
  );
}

export function CockpitBorders() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  return (
    <motion.div className="absolute inset-0 z-1 pointer-events-none" style={{ opacity }}>
      {/* Four gradient corners */}
      <GradientCorner opacity={opacity} position="top-left" delay={0} />
      <GradientCorner opacity={opacity} position="top-right" delay={1} />
      <GradientCorner opacity={opacity} position="bottom-left" delay={2} />
      <GradientCorner opacity={opacity} position="bottom-right" delay={3} />

      {/* Side gradient accents - softer */}
      <motion.div
        className="absolute top-[15%] left-0 w-px h-20 bg-gradient-to-b from-transparent via-[var(--accent)] to-transparent"
        style={{ opacity: 0.08 }}
        animate={{ opacity: [0.04, 0.12, 0.04], height: ["5rem", "8rem", "5rem"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[15%] right-0 w-px h-20 bg-gradient-to-b from-transparent via-[var(--accent)] to-transparent"
        style={{ opacity: 0.08 }}
        animate={{ opacity: [0.04, 0.12, 0.04], height: ["5rem", "8rem", "5rem"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      {/* Top/bottom center gradient accents */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
        style={{ opacity: 0.1 }}
        animate={{ width: ["6rem", "12rem", "6rem"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
        style={{ opacity: 0.1 }}
        animate={{ width: ["6rem", "12rem", "6rem"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Edge glow lines - very subtle */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
        style={{ opacity: 0.06 }}
        animate={{ opacity: [0.03, 0.1, 0.03] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
        style={{ opacity: 0.06 }}
        animate={{ opacity: [0.03, 0.1, 0.03] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
      />

      {/* Viewport markers - softer */}
      {[20, 40, 60, 80].map((pct, i) => (
        <div key={`t-${i}`} className="absolute top-0" style={{ left: `${pct}%` }}>
          <div className="w-px h-2 bg-gradient-to-b from-[var(--accent)] to-transparent" style={{ opacity: 0.06 }} />
        </div>
      ))}
      {[20, 40, 60, 80].map((pct, i) => (
        <div key={`b-${i}`} className="absolute bottom-0" style={{ left: `${pct}%` }}>
          <div className="w-px h-2 bg-gradient-to-t from-[var(--accent)] to-transparent" style={{ opacity: 0.06 }} />
        </div>
      ))}
    </motion.div>
  );
}
