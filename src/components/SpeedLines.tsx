"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useReducedMotion } from "framer-motion";

interface SpeedLine {
  id: number;
  x: number;
  width: number;
  delay: number;
  duration: number;
}

/**
 * SpeedLines — efeito warp durante scroll rápido
 * Linhas verticais que alongam proporcionalmente à velocidade do scroll
 */
export function SpeedLines() {
  const [intensity, setIntensity] = useState(0);
  const lastScrollRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const shouldReduceMotion = useReducedMotion();

  const lines: SpeedLine[] = useMemo(() => {
    const mul = 16807;
    const mod = 2147483647;
    return Array.from({ length: 20 }, (_, i) => {
      const seed = (42 * Math.pow(mul, i + 1)) % mod;
      const r = (seed - 1) / (mod - 1);
      return {
        id: i,
        x: r * 100,
        width: ((seed * mul) % mod / (mod - 1)) * 1.5 + 0.5,
        delay: ((seed * Math.pow(mul, 2)) % mod / (mod - 1)) * 2,
        duration: ((seed * Math.pow(mul, 3)) % mod / (mod - 1)) * 1 + 0.5,
      };
    });
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const trackSpeed = () => {
      const now = Date.now();
      const currentScroll = window.scrollY;
      const dt = now - lastTimeRef.current;
      const dy = Math.abs(currentScroll - lastScrollRef.current);
      const speed = dt > 0 ? dy / dt : 0;

      // Suavizar com easing: clamp 0-1
      const raw = Math.min(speed / 3, 1);
      setIntensity((prev) => prev + (raw - prev) * 0.3);

      lastScrollRef.current = currentScroll;
      lastTimeRef.current = now;
      rafRef.current = requestAnimationFrame(trackSpeed);
    };

    rafRef.current = requestAnimationFrame(trackSpeed);

    // Decay quando para de scroll
    const decay = setInterval(() => {
      setIntensity((prev) => Math.max(0, prev - 0.05));
    }, 50);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(decay);
    };
  }, [shouldReduceMotion]);

  if (shouldReduceMotion || intensity < 0.02) return null;

  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      style={{ opacity: intensity }}
    >
      {lines.map((line) => (
        <div
          key={line.id}
          className="absolute top-0 bg-gradient-to-b from-transparent via-cyan-400/60 to-transparent"
          style={{
            left: `${line.x}%`,
            width: line.width,
            height: `${40 + intensity * 60}%`,
            opacity: 0.15 * intensity,
            animation: `speedLineFall ${line.duration}s linear ${line.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
