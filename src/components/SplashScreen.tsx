"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_DURATION = 2000; // 2s — clean, minimal

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
        setTimeout(() => onCompleteRef.current(), 400);
      }
    }, TOTAL_DURATION);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none"
          style={{
            background: "radial-gradient(ellipse at center, #0a0a1a 0%, #000 100%)",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {/* Central content */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="text-5xl mb-4">🚀</div>
            <h1
              className="font-mono text-lg tracking-[0.3em]"
              style={{ color: "#22d3ee", textShadow: "0 0 20px rgba(34,211,238,0.4)" }}
            >
              MISSION CONTROL
            </h1>
            <div className="mt-6 flex items-center justify-center gap-2">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: "#22d3ee", boxShadow: "0 0 6px #22d3ee" }}
              />
              <span className="font-mono text-[10px] tracking-[0.2em]" style={{ color: "rgba(34,211,238,0.5)" }}>
                INITIALIZING SYSTEM...
              </span>
            </div>
          </motion.div>

          {/* Progress bar */}
          <div
            className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-48 h-[2px] rounded-full overflow-hidden"
            style={{ background: "rgba(34,211,238,0.1)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #6366f1, #22d3ee)",
              }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
