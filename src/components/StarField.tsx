"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

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
  const { scrollYProgress } = useScroll();

  const shouldReduceMotion = useReducedMotion();
  const stars = useMemo(() => generateStars(60), []);

  const layers = useMemo(() => {
    const grouped: Record<number, Star[]> = { 1: [], 2: [], 3: [] };
    stars.forEach((s) => grouped[s.depth].push(s));
    return grouped;
  }, [stars]);

  const speed1 = shouldReduceMotion ? '0%' : depthSpeed[1][1];
  const speed2 = shouldReduceMotion ? '0%' : depthSpeed[2][1];
  const speed3 = shouldReduceMotion ? '0%' : depthSpeed[3][1];

  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', speed1]);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', speed2]);
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%', speed3]);

  const depthY = { 1: y1, 2: y2, 3: y3 } as const;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {([1, 2, 3] as const).map((depth) => {
        const y = depthY[depth];
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
                  duration: 2 + ((star.id * 7 + 13) % 10) / 10 * 3,
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
