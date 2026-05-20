"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, useMemo } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  depth: 1 | 2 | 3;
}

const generateStars = (count: number): Star[] => {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const depth = (i % 3) + 1 as Star["depth"];
    stars.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: depth === 1 ? 1 : depth === 2 ? 1.5 : 2,
      opacity: depth === 1 ? 0.3 : depth === 2 ? 0.5 : 0.8,
      depth,
    });
  }
  return stars;
};

const depthSpeed: Record<Star["depth"], [string, string]> = {
  1: ["0%", "8%"],
  2: ["0%", "20%"],
  3: ["0%", "40%"],
};

export function StarField() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const shouldReduceMotion = useReducedMotion();
  const stars = useMemo(() => generateStars(60), []);

  const layers = useMemo(() => {
    const grouped: Record<number, Star[]> = { 1: [], 2: [], 3: [] };
    stars.forEach((s) => grouped[s.depth].push(s));
    return grouped;
  }, [stars]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden">
      {([1, 2, 3] as const).map((depth) => {
        const speed = shouldReduceMotion ? ["0%", "0%"] : depthSpeed[depth];
        const y = useTransform(scrollYProgress, [0, 1], speed);
        return (
          <motion.div
            key={depth}
            style={{ y }}
            className="absolute inset-0"
          >
            {layers[depth].map((star) => (
              <motion.div
                key={star.id}
                className="absolute rounded-full bg-[var(--accent)]"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: star.size,
                  height: star.size,
                  opacity: star.opacity,
                }}
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        opacity: [star.opacity, star.opacity * 0.5, star.opacity],
                      }
                }
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        );
      })}
    </div>
  );
}
