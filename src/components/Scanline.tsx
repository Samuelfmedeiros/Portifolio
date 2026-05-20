"use client";

import { motion } from "framer-motion";

export function Scanline() {
  return (
    <motion.div
      className="absolute inset-x-0 z-2 pointer-events-none overflow-hidden"
      animate={{ top: ["-2%", "102%"] }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "linear",
        repeatDelay: 3,
      }}
      style={{ height: "1px" }}
    >
      <div
        className="w-full h-full"
        style={{
          background: `linear-gradient(to bottom, transparent, rgba(34, 211, 238, 0.6), transparent)`,
          opacity: 0.06,
        }}
      />
    </motion.div>
  );
}
