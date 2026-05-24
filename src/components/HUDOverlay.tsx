"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";

// Section definitions for scroll tracking
const SECTIONS = [
  { id: "hero", label: "HERO" },
  { id: "engine", label: "ENGINE" },
  { id: "about", label: "ABOUT" },
  { id: "skills", label: "SKILLS" },
  { id: "projects", label: "PROJECTS" },
  { id: "terminal", label: "TERMINAL" },
  { id: "contact", label: "CONTACT" },
] as const;

export function HUDOverlay() {
  const [coords, setCoords] = useState({ lat: -15.79, lng: -47.88 });
  const [altitude, setAltitude] = useState(408);
  const [displayAltitude, setDisplayAltitude] = useState(408);
  const [speed, setSpeed] = useState(7.66);
  const [displaySpeed, setDisplaySpeed] = useState(7.66);
  const [time, setTime] = useState("");
  const [heading, setHeading] = useState(142.7);
  const [displayHeading, setDisplayHeading] = useState(142.7);
  const [fuel, setFuel] = useState(97.3);
  const [comms, setComms] = useState(100);
  const [missionElapsed, setMissionElapsed] = useState(0);
  const [cpuLoad, setCpuLoad] = useState(23);
  const [memUsage, setMemUsage] = useState(64);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState("hero");
  const shouldReduceMotion = useReducedMotion();

  // Mission start time
  const missionStartRef = useRef(Date.now());
  const prevAltitudeRef = useRef(408);
  const prevSpeedRef = useRef(7.66);
  const prevHeadingRef = useRef(142.7);

  // Smooth number transition
  const animateNumber = useCallback(
    (from: number, to: number, setter: (v: number) => void, duration: number = 600) => {
      if (shouldReduceMotion) {
        setter(to);
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setter(from + (to - from) * eased);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    },
    [shouldReduceMotion]
  );

  // Track scroll progress and current section
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);

      // Determine current section
      const sectionElements = SECTIONS.map((s) => ({
        id: s.id,
        el: document.getElementById(s.id),
      }));

      let activeSection = "hero";
      for (const section of sectionElements) {
        if (section.el) {
          const rect = section.el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            activeSection = section.id;
          }
        }
      }
      setCurrentSection(activeSection);

      // Map scroll progress to altitude (408 to 35000 km - LEO to GEO)
      const mappedAltitude = 408 + (progress / 100) * 34592;
      setAltitude(mappedAltitude);
      animateNumber(prevAltitudeRef.current, mappedAltitude, (v) => {
        setDisplayAltitude(v);
        prevAltitudeRef.current = v;
      });

      // Map scroll progress to speed
      const mappedSpeed = 7.66 + (progress / 100) * 3.84;
      setSpeed(mappedSpeed);
      animateNumber(prevSpeedRef.current, mappedSpeed, (v) => {
        setDisplaySpeed(v);
        prevSpeedRef.current = v;
      });

      // Map scroll progress to heading
      const mappedHeading = (142.7 + progress * 2.5) % 360;
      setHeading(mappedHeading);
      animateNumber(prevHeadingRef.current, mappedHeading, (v) => {
        setDisplayHeading(v);
        prevHeadingRef.current = v;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => window.removeEventListener("scroll", handleScroll);
  }, [animateNumber]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString("pt-BR", { hour12: false }));
      setCoords((c) => ({
        lat: c.lat + (Math.random() - 0.5) * 0.01,
        lng: c.lng + (Math.random() - 0.5) * 0.01,
      }));
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
            <motion.div
              key={i}
              className="w-1.5 h-2.5 rounded-sm"
              animate={{
                backgroundColor: i < filled ? color : "var(--border)",
                opacity: i < filled ? 0.8 : 0.2,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
        <span className="w-8 text-right opacity-80">{Math.round(value)}%</span>
      </div>
    );
  };

  // Flicker only when motion is allowed
  const flickerAnim = shouldReduceMotion
    ? {}
    : { opacity: [0.3, 0.45, 0.28, 0.4, 0.3] };

  // Section index for progress bar
  const sectionIndex = SECTIONS.findIndex((s) => s.id === currentSection);

  return (
    <motion.div
      className="absolute inset-0 z-1 pointer-events-none font-mono text-[10px] text-cyan-400/30"
      animate={flickerAnim}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Top-left: Coordenadas + Navegacao */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}
        className="absolute top-4 left-4 md:top-8 md:left-8 space-y-1.5"
      >
        <div className="text-cyan-400/50 text-xs md:text-sm tracking-wider">TELEMETRIA</div>
        <div>ALT {displayAltitude.toFixed(1)} km</div>
        <div>VEL {displaySpeed.toFixed(2)} km/s</div>
        <div>HDG {displayHeading.toFixed(1)}deg</div>
        <div>{coords.lat.toFixed(4)}deg {coords.lng.toFixed(4)}deg</div>
        <div className="text-[9px] text-cyan-400/20">ORBIT: LEO-7</div>

        {/* Altitude/scroll progress bar */}
        <div className="mt-2 w-24 md:w-32">
          <div className="flex justify-between text-[8px] text-cyan-400/20 mb-0.5">
            <span>ALT PROGRESS</span>
            <span>{scrollProgress.toFixed(0)}%</span>
          </div>
          <div className="h-1 rounded-full bg-cyan-400/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400/40 to-indigo-400/40"
              animate={{ width: `${scrollProgress}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Top-right: Relogio + Missao + Current Section */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4 }}
        className="absolute top-4 right-4 md:top-8 md:right-8 text-right space-y-1.5"
      >
        <div className="text-cyan-400/50 text-xs md:text-sm tracking-wider">STATUS</div>
        <div className="text-cyan-400/50 text-sm md:text-base">{time}</div>
        <div className="text-[9px]">{formatMET(missionElapsed)}</div>
        <div className="text-[9px]">FUEL {fuel.toFixed(1)}%</div>
        <div className="text-[9px]">COMMS {comms.toFixed(0)}%</div>

        {/* Current section indicator */}
        <div className="mt-2 space-y-1">
          <div className="text-[9px] text-cyan-400/30 tracking-wider">SECTOR</div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
              className="text-cyan-400/50 text-xs font-semibold tracking-wider"
            >
              {currentSection.toUpperCase()}
            </motion.div>
          </AnimatePresence>
          {/* Section progress dots */}
          <div className="flex gap-1 justify-end mt-1">
            {SECTIONS.map((s, i) => (
              <motion.div
                key={s.id}
                className="w-1.5 h-1.5 rounded-full"
                animate={{
                  backgroundColor: i <= sectionIndex ? "var(--accent)" : "var(--border)",
                  opacity: i <= sectionIndex ? 0.6 : 0.15,
                  scale: i === sectionIndex ? 1.3 : 1,
                }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
        </div>

        <div className="text-[9px] text-emerald-400/40 mt-1">STATUS: NOMINAL</div>
      </motion.div>

      {/* Bottom-left: Sistemas + Performance */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-4 left-4 md:bottom-8 md:left-8 space-y-1"
      >
        <div className="text-cyan-400/50 text-[9px] tracking-wider">SISTEMAS</div>
        <BarIndicator label="SHLD" value={80} color="var(--accent)" />
        <BarIndicator label="PWR" value={92} color="#34d399" />
        <BarIndicator label="NAV" value={85} color="#60a5fa" />
        <div className="mt-2 space-y-0.5">
          <div className="text-[9px]">CPU {cpuLoad.toFixed(0)}% | MEM {memUsage.toFixed(0)}%</div>
          <div className="text-[9px] text-cyan-400/20">SYS v2.0.0 | BRASILIA-DF</div>
        </div>
      </motion.div>

      {/* Bottom-right: Identificacao + Comms */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-4 right-4 md:bottom-8 md:right-8 text-right space-y-1.5"
      >
        <div className="text-cyan-400/50 text-[9px] tracking-wider">COMMS</div>
        <div className="text-[9px] text-cyan-400/20">FREQ: 14.2 GHz</div>
        <div className="text-[9px] text-cyan-400/20">BAND: Ka</div>
        <div className="text-[9px]">LATENCY: {Math.floor(Math.random() * 20 + 15)}ms</div>
        <div className="mt-2 space-y-0.5">
          <div className="text-[9px] text-cyan-400/30">MISSION CONTROL</div>
          <div className="text-[9px] text-cyan-400/30">Samuel Medeiros</div>
        </div>
      </motion.div>

      {/* Center crosshair + radar ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Radar rings */}
          <div className="absolute inset-0 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 rounded-full border border-cyan-400/3" />
          <div className="absolute inset-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 rounded-full border border-cyan-400/5" />
          {/* Crosshair */}
          <div className="w-8 h-px bg-cyan-400/5" />
          <div className="h-8 w-px bg-cyan-400/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Animated scan line (very subtle) */}
      {!shouldReduceMotion && (
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent"
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      )}
    </motion.div>
  );
}
