"use client";

import { motion } from "framer-motion";

export function CockpitBorders() {
  const corner = "absolute w-8 h-8 md:w-12 md:h-12 border-cyan-500/20 z-1";
  return (
    <div className="absolute inset-0 z-1 pointer-events-none">
      {/* Top-left */}
      <motion.div
        className={`${corner} top-0 left-0 border-r-0 border-b-0 rounded-tl-lg`}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Top-right */}
      <motion.div
        className={`${corner} top-0 right-0 border-l-0 border-b-0 rounded-tr-lg`}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      {/* Bottom-left */}
      <motion.div
        className={`${corner} bottom-0 left-0 border-r-0 border-t-0 rounded-bl-lg`}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      {/* Bottom-right */}
      <motion.div
        className={`${corner} bottom-0 right-0 border-l-0 border-t-0 rounded-br-lg`}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Side accents */}
      <div className="absolute top-1/4 left-0 w-1 h-16 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent" />
      <div className="absolute top-1/4 right-0 w-1 h-16 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent" />

      {/* Top/bottom center accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent" />
    </div>
  );
}
