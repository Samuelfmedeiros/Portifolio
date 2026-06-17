"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGsapAnimation";

/**
 * ParallaxBackground — Fundo espacial com canvas + GSAP ScrollTrigger
 *
 * Canvas renderiza estrelas, nebulosas e planetas.
 * GSAP controla o parallax via ScrollTrigger.scrub().
 */
export function ParallaxBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Setup ──────────────────────────────────────────────
    const isMobile = window.innerWidth < 768;

    let animId: number;
    let scrollProgress = 0; // 0..1 controlado pelo GSAP

    // Estrelas: reduzidas para performance
    const stars = Array.from({ length: isMobile ? 30 : 80 }, () => ({
      x: Math.random() * 2000,
      y: Math.random() * 2000,
      size: Math.random() * 1.8 + 0.3,
      speed: 0.2 + Math.random() * 0.6,
      opacity: 0.2 + Math.random() * 0.5,
      hue: 190 + Math.random() * 80,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.005 + Math.random() * 0.015,
    }));

    // Nebulosas: posições fixas
    const nebulae = isMobile ? [] : [
      { x: 0.12, y: 0.1, r: 0.5, color: "rgba(34,211,238,0.04)", speed: 0.3 },
      { x: 0.78, y: 0.6, r: 0.4, color: "rgba(168,85,247,0.04)", speed: 0.5 },
      { x: 0.55, y: 0.25, r: 0.25, color: "rgba(245,158,11,0.015)", speed: 0.4 },
    ];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // ── Render loop ────────────────────────────────────────
    function draw() {
      const w = canvas!.width;
      const h = canvas!.height;
      const dark = document.documentElement.classList.contains("theme-dark");

      // Fundo
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.25, 0, w * 0.5, h * 0.25, Math.max(w, h) * 0.8);
      if (dark) {
        grad.addColorStop(0, "#020c1a");
        grad.addColorStop(0.5, "#010612");
        grad.addColorStop(1, "#000000");
      } else {
        grad.addColorStop(0, "#f0f4ff");
        grad.addColorStop(0.5, "#e0e8f5");
        grad.addColorStop(1, "#d0d8e5");
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Nebulosas
      for (const neb of nebulae) {
        const nx = w * neb.x;
        const ny = h * neb.y + scrollProgress * 300 * neb.speed;
        const ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, Math.max(w, h) * neb.r);
        ng.addColorStop(0, neb.color);
        ng.addColorStop(1, "transparent");
        ctx.fillStyle = ng;
        ctx.fillRect(0, 0, w, h);
      }

      // Estrelas
      for (const star of stars) {
        star.twinkle += star.twinkleSpeed;
        const tOpacity = star.opacity * (0.5 + 0.5 * Math.sin(star.twinkle));
        const sy = ((star.y + scrollProgress * 400 * star.speed) % (h + 200)) - 100;
        const sx = star.x % w;

        if (dark) {
          ctx.fillStyle = `hsla(${star.hue}, 50%, 80%, ${tOpacity})`;
        } else {
          ctx.fillStyle = `rgba(100, 130, 180, ${tOpacity * 0.4})`;
        }
        ctx.beginPath();
        ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    // ── GSAP ScrollTrigger ─────────────────────────────────
    const ctxGsap = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          scrollProgress = self.progress;
        },
      });
    });

    return () => {
      cancelAnimationFrame(animId);
      ctxGsap.revert();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ willChange: "transform", transform: "translateZ(0)" }}
        aria-hidden="true"
      />
    </div>
  );
}
