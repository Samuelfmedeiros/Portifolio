"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Wifi, Battery, Activity } from "lucide-react";

export function HeroSection() {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [time, setTime] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPercent(docHeight > 0 ? Math.round((window.scrollY / docHeight) * 100) : 0);
    };

    const tick = () => {
      setTime(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    tick();
    const interval = setInterval(tick, 1000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 px-4 md:px-6">
      {/* HUD Telemetry Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-20 md:top-24 left-3 right-3 md:left-6 md:right-6 glass rounded-lg px-3 md:px-6 py-2 md:py-3 flex items-center justify-between font-mono text-[10px] md:text-xs border-[var(--border)]"
      >
        {/* Left: status */}
        <div className="flex items-center gap-2 md:gap-4">
          <span className="flex items-center gap-1 text-[var(--accent)]">
            <Cpu className="w-2.5 h-2.5 md:w-3 md:h-3" />
            <span className="hidden sm:inline">SYS:ONLINE</span>
          </span>
          <span className="hidden sm:flex items-center gap-1 text-green-400">
            <Activity className="w-2.5 h-2.5 md:w-3 md:h-3" /> NOMINAL
          </span>
        </div>

        {/* Middle: network (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-4">
          <span className="flex items-center gap-1 text-[var(--text-secondary)]">
            <Wifi className="w-3 h-3" /> LINK:STABLE
          </span>
          <span className="flex items-center gap-1 text-[var(--text-secondary)]">
            <Battery className="w-3 h-3" /> 98%
          </span>
          <span className="text-[var(--accent)] tabular-nums">{time} UTC-3</span>
        </div>

        {/* Right: scroll indicator */}
        <div className="flex items-center gap-1.5 md:gap-2">
          <span className="text-[var(--accent)] tabular-nums md:hidden text-[10px]">{time}</span>
          <span className="hidden sm:inline text-[var(--text-secondary)]">SCROLL</span>
          <div className="w-10 md:w-20 h-1 md:h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[var(--accent)]"
              animate={{ width: `${scrollPercent}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <span className="text-[var(--accent)] tabular-nums w-6 md:w-8 text-right text-[10px] md:text-xs">{scrollPercent}%</span>
        </div>
      </motion.div>

      {/* Main Hero Content */}
      <div className="text-center max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-bold tracking-tighter mb-4">
            <span className="text-[var(--text-primary)]">SAMUEL</span>{" "}
            <span className="text-[var(--accent)]">ANDRADE</span>
          </h1>
          <div className="h-px w-24 md:w-32 mx-auto bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent mb-6" />
          <p className="text-base sm:text-xl md:text-2xl font-mono text-[var(--text-secondary)] tracking-wider">
            ANALISTA DE DADOS &amp; PRODUTO
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-10 md:mt-12 flex flex-wrap gap-2 md:gap-4 justify-center"
        >
          {["BI & SQL", "Python", "Machine Learning", "Next.js", "LLMs Locais"].map((skill) => (
            <span
              key={skill}
              className="glass px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-mono text-[var(--accent)] border-[var(--border)]"
            >
              {skill}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-12 md:mt-16"
        >
          <p className="font-mono text-[10px] md:text-xs text-[var(--text-secondary)] tracking-widest">
            ▼ SCROLL PARA INICIAR SCAN ▼
          </p>
        </motion.div>
      </div>
    </section>
  );
}
