"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import { useDeviceTier } from "@/hooks/useDeviceTier";

/**
 * Buraco negro em redemoinho — camada de FUNDO decorativa da base da Jornada.
 *
 * - Canvas 2D transparente: o trail é feito com `destination-out` (apaga o
 *   próprio canvas), nunca pintando o fundo da página.
 * - Cores lidas das CSS vars `--accent` / `--accent-alt`, que o ThemeProvider
 *   escreve inline no `<html>`; um MutationObserver recolore na troca de paleta.
 * - Parallax vem do `scrollYProgress` da seção (prop), sem criar outro listener.
 * - `prefers-reduced-motion` desenha 1 frame estático e não liga o rAF.
 * - Pausa quando a seção sai da viewport (IntersectionObserver).
 */

const TILT = 0.42; // achatamento vertical do disco (perspectiva)
const INNER_R = 0.18; // borda interna / última órbita estável
const TRAIL_FADE = 0.085;
const PARALLAX_PX = 70;

type Rgb = [number, number, number];

type Particle = {
  angle: number;
  radius: number; // fração 0..1 do raio máximo
  speed: number;
  alpha: number;
  width: number;
};

const HEX = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

function toRgb(raw: string, fallback: Rgb): Rgb {
  const value = raw.trim();
  const hex = HEX.exec(value);
  if (hex) {
    return [parseInt(hex[1], 16), parseInt(hex[2], 16), parseInt(hex[3], 16)];
  }
  const nums = value.match(/\d+(\.\d+)?/g);
  if (nums && nums.length >= 3) {
    return [
      Math.round(Number(nums[0])),
      Math.round(Number(nums[1])),
      Math.round(Number(nums[2])),
    ];
  }
  return fallback;
}

function readPalette(): { accent: Rgb; alt: Rgb } {
  if (typeof window === "undefined") {
    return { accent: [34, 211, 238], alt: [99, 102, 241] };
  }
  const style = window.getComputedStyle(document.documentElement);
  return {
    accent: toRgb(style.getPropertyValue("--accent"), [34, 211, 238]),
    alt: toRgb(style.getPropertyValue("--accent-alt"), [99, 102, 241]),
  };
}

function mix(a: Rgb, b: Rgb, t: number): Rgb {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

interface BlackHoleVortexProps {
  /** `scrollYProgress` da seção Jornada (0 = topo, 1 = fim). */
  progress: MotionValue<number>;
}

export function BlackHoleVortex({ progress }: BlackHoleVortexProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tier = useDeviceTier();

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return; // jsdom / canvas indisponível: decoração não bloqueia nada

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const count = tier === "low" ? 96 : tier === "mid" ? 180 : 300;
    const particles: Particle[] = Array.from({ length: count }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: INNER_R + Math.random() * (1 - INNER_R),
      speed: 0,
      alpha: 0.1 + Math.random() * 0.38,
      width: 0.45 + Math.random() * 1.9,
    }));
    for (const p of particles) {
      p.speed = 0.0022 / Math.sqrt(Math.max(p.radius, 0.2));
    }

    let palette = readPalette();
    let width = 0;
    let height = 0;
    let maxR = 0;
    let raf = 0;
    let last = 0;
    let visible = true;

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      maxR = Math.min(width * 0.46, height * 1.05);
    };

    const drawCore = (cx: number, cy: number) => {
      // horizonte de eventos: escurecimento suave no centro do disco
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.5);
      core.addColorStop(0, "rgba(2,4,10,0.66)");
      core.addColorStop(0.45, "rgba(2,4,10,0.34)");
      core.addColorStop(1, "rgba(2,4,10,0)");
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, maxR * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // anel de fótons
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = `rgba(${palette.accent[0]},${palette.accent[1]},${palette.accent[2]},0.20)`;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, maxR * 0.21, maxR * 0.21 * TILT, 0, 0, Math.PI * 2);
      ctx.stroke();
    };

    const render = (dt: number) => {
      const boost = 1 + progress.get() * 1.7;
      const cx = width / 2;
      const cy = height * 0.58;

      // fade do trail (apaga o canvas, não o fundo da página)
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0,0,0,${TRAIL_FADE})`;
      ctx.fillRect(0, 0, width, height);

      drawCore(cx, cy);

      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";

      for (const p of particles) {
        const prevAngle = p.angle;
        const prevRadius = p.radius;

        p.angle += p.speed * dt * boost;
        p.radius -= 0.0016 * dt * boost;

        if (p.radius < INNER_R) {
          p.radius = 1;
          p.angle = Math.random() * Math.PI * 2;
          p.alpha = 0.1 + Math.random() * 0.38;
          p.speed = 0.0022 / Math.sqrt(Math.max(p.radius, 0.2));
        }

        const inner = 1 - p.radius;
        const color = mix(palette.accent, palette.alt, Math.min(1, inner * 1.35));
        const alpha = p.alpha * (0.26 + inner * 1.05);

        const x1 = cx + Math.cos(prevAngle) * prevRadius * maxR;
        const y1 = cy + Math.sin(prevAngle) * prevRadius * maxR * TILT;
        const x2 = cx + Math.cos(p.angle) * p.radius * maxR;
        const y2 = cy + Math.sin(p.angle) * p.radius * maxR * TILT;

        ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${alpha.toFixed(3)})`;
        ctx.lineWidth = p.width;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    };

    const applyParallax = () => {
      const p = progress.get();
      canvas.style.transform = `translate3d(0, ${(-p * PARALLAX_PX).toFixed(2)}px, 0) scale(${(1 + p * 0.06).toFixed(3)})`;
    };

    const loop = (now: number) => {
      const dt = last === 0 ? 1 : Math.min((now - last) / 16.667, 2.4);
      last = now;
      render(dt);
      applyParallax();
      raf = window.requestAnimationFrame(loop);
    };

    const start = () => {
      if (raf || reduced) return;
      last = 0;
      raf = window.requestAnimationFrame(loop);
    };

    const stop = () => {
      if (!raf) return;
      window.cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();

    if (reduced) {
      // frame único: sem movimento contínuo, mas o disco existe
      render(1);
      applyParallax();
    } else {
      start();
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) render(1);
    });
    ro.observe(wrapper);

    // troca de paleta/tema: ThemeProvider escreve as vars inline no <html>
    const mo = new MutationObserver(() => {
      palette = readPalette();
      if (reduced) render(1);
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class", "data-theme"],
    });

    // fora da viewport = sem rAF (custo zero com a Jornada longe)
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { rootMargin: "120px" }
    );
    io.observe(wrapper);

    return () => {
      stop();
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
      void visible;
    };
  }, [tier]);

  return (
    <div
      ref={wrapperRef}
      data-testid="black-hole-vortex"
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[clamp(340px,46vh,560px)] overflow-hidden"
      style={{
        maskImage:
          "radial-gradient(ellipse 70% 65% at 50% 58%, #000 0%, rgba(0,0,0,0.6) 42%, transparent 78%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 70% 65% at 50% 58%, #000 0%, rgba(0,0,0,0.6) 42%, transparent 78%)",
      }}
    >
      <canvas ref={canvasRef} className="h-full w-full opacity-62" />
    </div>
  );
}
