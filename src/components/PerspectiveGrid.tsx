"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export function PerspectiveGrid() {
  const { scrollYProgress } = useScroll();

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [0.2, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);

  // Color shift based on scroll - from cyan to indigo
  const [gridColor, setGridColor] = useState("rgba(34, 211, 238"); // cyan

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;

      // Interpolate from cyan (34, 211, 238) to indigo (99, 102, 241)
      const r = Math.round(34 + (99 - 34) * progress);
      const g = Math.round(211 + (102 - 211) * progress);
      const b = Math.round(238 + (241 - 238) * progress);
      setGridColor(`rgba(${r}, ${g}, ${b}`);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      style={{ y, opacity, scale }}
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
    >
      {/* Grid with perspective - Tron/space runway style */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, transparent 0%, ${gridColor}, 0.25) 2%, transparent 3%),
            linear-gradient(to right, ${gridColor}, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: "100% 3rem, 4rem 100%",
          transform: "perspective(500px) rotateX(60deg)",
          transformOrigin: "center top",
          opacity: 0.1,
        }}
      />

      {/* Horizon fade - smooth gradient at top */}
      <div
        className="absolute top-0 left-0 right-0 h-48"
        style={{
          background: `linear-gradient(to bottom, var(--bg-primary, #000) 0%, var(--bg-primary, #000) 30%, transparent 100%)`,
        }}
      />

      {/* Horizon glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(to right, transparent 0%, ${gridColor}, 0.15) 20%, ${gridColor}, 0.3) 50%, ${gridColor}, 0.15) 80%, transparent 100%)`,
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24"
        style={{
          background: `linear-gradient(to top, var(--bg-primary, #000) 0%, transparent 100%)`,
        }}
      />
    </motion.div>
  );
}
