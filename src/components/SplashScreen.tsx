"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_MESSAGES = [
  "Inicializando sistemas...",
  "Carregando módulos de dados...",
  "Conectando à base de conhecimento...",
  "Sincronizando credenciais...",
  "Mission Control pronto para decolagem.",
];

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += 2;
      if (currentProgress > 100) currentProgress = 100;

      setProgress(currentProgress);

      if (currentProgress >= 40 && currentProgress < 60) setMessageIndex(1);
      else if (currentProgress >= 60 && currentProgress < 80) setMessageIndex(2);
      else if (currentProgress >= 80 && currentProgress < 95) setMessageIndex(3);
      else if (currentProgress >= 95) setMessageIndex(4);

      if (currentProgress >= 100) {
        clearInterval(interval);
        clearInterval(cursorInterval);
        setTimeout(() => onCompleteRef.current(), 500);
      }
    }, 50);

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 300);

    return () => {
      clearInterval(interval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] bg-slate-950 flex items-center justify-center"
    >
      <div className="w-full max-w-md px-8">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-mono font-bold text-white mb-2">
            Samuel <span className="text-cyan-400">Medeiros</span>
          </h1>
          <p className="text-slate-500 text-sm font-mono">Mission Control v2.0</p>
        </motion.div>

        {/* Boot sequence */}
        <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400 text-xs font-mono">SYSTEM BOOT</span>
          </div>

          <div className="h-32 font-mono text-xs text-slate-400 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-2"
              >
                <span className="text-cyan-400">&gt;</span> {BOOT_MESSAGES[messageIndex]}
                {showCursor && <span className="animate-pulse">_</span>}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-2">
              <span>Carregando...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="flex justify-center gap-2 mt-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.2 }}
              className="w-1 h-1 rounded-full bg-slate-600"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
