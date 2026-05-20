"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function PerspectiveGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [0.25, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);

  return (
    <motion.div
      ref={containerRef}
      style={{ y, opacity, scale }}
      className="absolute inset-0 z-0 overflow-hidden"
    >
      {/* Grid horizontal com perspectiva — estilo Tron/space runway */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, transparent 0%, rgba(34, 211, 238, 0.3) 2%, transparent 3%),
            linear-gradient(to right, rgba(34, 211, 238, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "100% 3rem, 4rem 100%",
          transform: "perspective(500px) rotateX(60deg)",
          transformOrigin: "center top",
          opacity: 0.12,
        }}
      />
      {/* Horizon glow — fade suave no topo */}
      <div
        className="absolute top-0 left-0 right-0 h-32"
        style={{
          background: `linear-gradient(to bottom, var(--bg-primary, #000), transparent)`,
        }}
      />
    </motion.div>
  );
}
