"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_DURATION = 600; // 0.6s — só um flash de grid

interface Props {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: Props) {
  const [show, setShow] = useState(true);
  const doneRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        setShow(false);
        setTimeout(() => onCompleteRef.current(), 100);
      }
    }, TOTAL_DURATION);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: "#000",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
        >
          {/* Grid de cockpit — fade in/out rápido */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(to right, rgba(34,211,238,0.12) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(34,211,238,0.12) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
              maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
            }}
          />

          {/* Centro — glow sutil */}
          <motion.div
            className="absolute w-24 h-24 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)",
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0.5, 0], scale: [0.5, 1.2, 1, 0.8] }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
