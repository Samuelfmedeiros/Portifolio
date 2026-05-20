"use client";

import { motion } from "framer-motion";

export function CockpitBorders() {
  const cornerBase = "absolute w-8 h-8 md:w-16 md:h-16 border-cyan-500/20 z-1";
  const innerCorner = "absolute w-4 h-4 md:w-6 md:h-6 border-cyan-400/10 z-1";

  return (
    <div className="absolute inset-0 z-1 pointer-events-none">
      {/* Main corners — larger, animated */}
      {/* Top-left */}
      <motion.div
        className={`${cornerBase} top-0 left-0 border-r-0 border-b-0 rounded-tl-lg`}
        animate={{ opacity: [0.15, 0.45, 0.15], borderColor: ["rgba(6,182,212,0.15)", "rgba(6,182,212,0.35)", "rgba(6,182,212,0.15)"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Top-right */}
      <motion.div
        className={`${cornerBase} top-0 right-0 border-l-0 border-b-0 rounded-tr-lg`}
        animate={{ opacity: [0.15, 0.45, 0.15], borderColor: ["rgba(6,182,212,0.15)", "rgba(6,182,212,0.35)", "rgba(6,182,212,0.15)"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      {/* Bottom-left */}
      <motion.div
        className={`${cornerBase} bottom-0 left-0 border-r-0 border-t-0 rounded-bl-lg`}
        animate={{ opacity: [0.15, 0.45, 0.15], borderColor: ["rgba(6,182,212,0.15)", "rgba(6,182,212,0.35)", "rgba(6,182,212,0.15)"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      {/* Bottom-right */}
      <motion.div
        className={`${cornerBase} bottom-0 right-0 border-l-0 border-t-0 rounded-br-lg`}
        animate={{ opacity: [0.15, 0.45, 0.15], borderColor: ["rgba(6,182,212,0.15)", "rgba(6,182,212,0.35)", "rgba(6,182,212,0.15)"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Inner corners — smaller accent */}
      <div className={`${innerCorner} top-2 left-2 md:top-3 md:left-3 border-r-0 border-b-0 rounded-tl`} />
      <div className={`${innerCorner} top-2 right-2 md:top-3 md:right-3 border-l-0 border-b-0 rounded-tr`} />
      <div className={`${innerCorner} bottom-2 left-2 md:bottom-3 md:left-3 border-r-0 border-t-0 rounded-bl`} />
      <div className={`${innerCorner} bottom-2 right-2 md:bottom-3 md:right-3 border-l-0 border-t-0 rounded-br`} />

      {/* Side accents — animated pulse */}
      <motion.div
        className="absolute top-1/4 left-0 w-1 h-16 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/4 right-0 w-1 h-16 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      {/* Top/bottom center accents */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent"
        animate={{ width: ["6rem", "10rem", "6rem"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent"
        animate={{ width: ["6rem", "10rem", "6rem"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Edge glow lines — subtle animated edges */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"
        animate={{ opacity: [0.1, 0.4, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"
        animate={{ opacity: [0.1, 0.4, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
      />

      {/* Viewport markers — HUD-style small marks along edges */}
      {/* Top markers */}
      <div className="absolute top-0 left-[20%] w-px h-3 bg-cyan-400/10" />
      <div className="absolute top-0 left-[40%] w-px h-3 bg-cyan-400/10" />
      <div className="absolute top-0 left-[60%] w-px h-3 bg-cyan-400/10" />
      <div className="absolute top-0 left-[80%] w-px h-3 bg-cyan-400/10" />
      {/* Bottom markers */}
      <div className="absolute bottom-0 left-[20%] w-px h-3 bg-cyan-400/10" />
      <div className="absolute bottom-0 left-[40%] w-px h-3 bg-cyan-400/10" />
      <div className="absolute bottom-0 left-[60%] w-px h-3 bg-cyan-400/10" />
      <div className="absolute bottom-0 left-[80%] w-px h-3 bg-cyan-400/10" />
    </div>
  );
}
