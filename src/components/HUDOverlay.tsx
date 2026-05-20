"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function HUDOverlay() {
  const [coords, setCoords] = useState({ lat: -15.79, lng: -47.88 });
  const [altitude, setAltitude] = useState(408);
  const [speed, setSpeed] = useState(7.66);
  const [time, setTime] = useState("");
  const [heading, setHeading] = useState(142.7);
  const [fuel, setFuel] = useState(97.3);
  const [comms, setComms] = useState(100);
  const [missionElapsed, setMissionElapsed] = useState(0);
  const [cpuLoad, setCpuLoad] = useState(23);
  const [memUsage, setMemUsage] = useState(64);
  const shouldReduceMotion = useReducedMotion();

  // Mission start time
  const missionStartRef = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString("pt-BR", { hour12: false }));
      setCoords((c) => ({
        lat: c.lat + (Math.random() - 0.5) * 0.01,
        lng: c.lng + (Math.random() - 0.5) * 0.01,
      }));
      setAltitude((a) => a + (Math.random() - 0.5) * 2);
      setSpeed((s) => Math.max(7.6, Math.min(7.72, s + (Math.random() - 0.5) * 0.02)));
      setHeading((h) => (h + (Math.random() - 0.5) * 0.5 + 360) % 360);
      setFuel((f) => Math.max(85, f - Math.random() * 0.05));
      setComms((c) => Math.max(95, Math.min(100, c + (Math.random() - 0.5) * 2)));
      setCpuLoad((c) => Math.max(10, Math.min(95, c + (Math.random() - 0.5) * 10)));
      setMemUsage((m) => Math.max(40, Math.min(90, m + (Math.random() - 0.5) * 5)));
      setMissionElapsed(Math.floor((Date.now() - missionStartRef.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatMissionTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const formatMET = (s: number) => {
    const days = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    return `MET ${days}d ${h.toString().padStart(2, "0")}:00`;
  };

  // Bar indicator component
  const BarIndicator = ({ label, value, color = "var(--accent)" }: { label: string; value: number; color?: string }) => {
    const bars = 10;
    const filled = Math.round((value / 100) * bars);
    return (
      <div className="flex items-center gap-1.5 text-[9px] md:text-[10px]">
        <span className="text-[var(--text-secondary)] opacity-60 w-8">{label}</span>
        <div className="flex gap-px">
          {Array.from({ length: bars }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-2.5 rounded-sm"
              style={{
                backgroundColor: i < filled ? color : "var(--border)",
                opacity: i < filled ? 0.8 : 0.2,
              }}
            />
          ))}
        </div>
        <span className="w-8 text-right opacity-80">{Math.round(value)}%</span>
      </div>
    );
  };

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
      {/* Top-left: Coordenadas + Navegação */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}
        className="absolute top-4 left-4 md:top-8 md:left-8 space-y-1.5"
      >
        <div className="text-cyan-400/60 text-xs md:text-sm tracking-wider">⟐ TELEMETRIA</div>
        <div>ALT {altitude.toFixed(1)} km</div>
        <div>VEL {speed.toFixed(2)} km/s</div>
        <div>HDG {heading.toFixed(1)}°</div>
        <div>{coords.lat.toFixed(4)}° {coords.lng.toFixed(4)}°</div>
        <div className="text-[9px] text-cyan-400/30">ORBIT: LEO-7</div>
      </motion.div>

      {/* Top-right: Relógio + Missão */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4 }}
        className="absolute top-4 right-4 md:top-8 md:right-8 text-right space-y-1.5"
      >
        <div className="text-cyan-400/60 text-xs md:text-sm tracking-wider">◈ STATUS</div>
        <div className="text-cyan-400/60 text-sm md:text-base">{time}</div>
        <div className="text-[9px]">{formatMET(missionElapsed)}</div>
        <div className="text-[9px]">FUEL {fuel.toFixed(1)}%</div>
        <div className="text-[9px]">COMMS {comms.toFixed(0)}%</div>
        <div className="text-[9px] text-emerald-400/50">STATUS: NOMINAL</div>
      </motion.div>

      {/* Bottom-left: Sistemas + Performance */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-4 left-4 md:bottom-8 md:left-8 space-y-1"
      >
        <div className="text-cyan-400/60 text-[9px] tracking-wider">⟡ SISTEMAS</div>
        <BarIndicator label="SHLD" value={80} color="var(--accent)" />
        <BarIndicator label="PWR" value={92} color="#34d399" />
        <BarIndicator label="NAV" value={85} color="#60a5fa" />
        <div className="mt-2 space-y-0.5">
          <div className="text-[9px]">CPU {cpuLoad.toFixed(0)}% | MEM {memUsage.toFixed(0)}%</div>
          <div className="text-[9px] text-cyan-400/30">SYS v2.0.0 | BRASÍLIA-DF</div>
        </div>
      </motion.div>

      {/* Bottom-right: Identificação + Comms */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-4 right-4 md:bottom-8 md:right-8 text-right space-y-1.5"
      >
        <div className="text-cyan-400/60 text-[9px] tracking-wider">⟐ COMMS</div>
        <div className="text-[9px] text-cyan-400/30">FREQ: 14.2 GHz</div>
        <div className="text-[9px] text-cyan-400/30">BAND: Ka</div>
        <div className="text-[9px]">LATENCY: {Math.floor(Math.random() * 20 + 15)}ms</div>
        <div className="mt-2 space-y-0.5">
          <div className="text-[9px] text-cyan-400/40">MISSION CONTROL</div>
          <div className="text-[9px] text-cyan-400/40">Samuel Medeiros</div>
        </div>
      </motion.div>

      {/* Center crosshair + radar ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Radar rings */}
          <div className="absolute inset-0 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 rounded-full border border-cyan-400/5" />
          <div className="absolute inset-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 rounded-full border border-cyan-400/10" />
          {/* Crosshair */}
          <div className="w-8 h-px bg-cyan-400/10" />
          <div className="h-8 w-px bg-cyan-400/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Animated scan line (very subtle) */}
      {!shouldReduceMotion && (
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent"
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      )}
    </motion.div>
  );
}
