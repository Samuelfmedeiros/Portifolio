"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function HUDOverlay() {
  const [coords, setCoords] = useState({ lat: -15.79, lng: -47.88 });
  const [altitude, setAltitude] = useState(408);
  const [speed, setSpeed] = useState(7.66);
  const [time, setTime] = useState("");
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString("pt-BR", { hour12: false }));
      setCoords((c) => ({
        lat: c.lat + (Math.random() - 0.5) * 0.01,
        lng: c.lng + (Math.random() - 0.5) * 0.01,
      }));
      setAltitude((a) => a + (Math.random() - 0.5) * 2);
      setSpeed((s) => Math.max(7.6, Math.min(7.72, s + (Math.random() - 0.5) * 0.02)));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Flicker só quando motion é permitido
  const flickerAnim = shouldReduceMotion
    ? {}
    : { opacity: [0.4, 0.6, 0.35, 0.5, 0.4] };

  return (
    <motion.div
      className="absolute inset-0 z-1 pointer-events-none font-mono text-[10px] text-cyan-400/40"
      animate={flickerAnim}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Top-left: Coordenadas */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}
        className="absolute top-4 left-4 md:top-8 md:left-8 space-y-1"
      >
        <div>ALT {altitude.toFixed(1)}km</div>
        <div>VEL {speed.toFixed(2)}km/s</div>
        <div>{coords.lat.toFixed(4)}° {coords.lng.toFixed(4)}°</div>
      </motion.div>

      {/* Top-right: Relógio */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4 }}
        className="absolute top-4 right-4 md:top-8 md:right-8 text-right space-y-1"
      >
        <div className="text-cyan-400/60">{time}</div>
        <div>ORBIT: LEO-7</div>
        <div>STATUS: NOMINAL</div>
      </motion.div>

      {/* Bottom-left: Sistemas */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-4 left-4 md:bottom-8 md:left-8 space-y-1"
      >
        <div>[SHLD] ████████░░ 80%</div>
        <div>[PWR]  █████████░ 92%</div>
        <div>[NAV]  ████████░░ 85%</div>
      </motion.div>

      {/* Bottom-right: Identificação */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-4 right-4 md:bottom-8 md:right-8 text-right space-y-1"
      >
        <div>SYS v2.0.0</div>
        <div>MISSION CONTROL</div>
        <div>BRASÍLIA-DF</div>
      </motion.div>

      {/* Center crosshair sutil */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="w-8 h-px bg-cyan-400" />
        <div className="h-8 w-px bg-cyan-400 absolute" />
      </div>
    </motion.div>
  );
}
