"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkle: number;
  twinkleSpeed: number;
  depth: "deep" | "mid" | "close";
  hue: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  life: number;
  angle: number;
  color: [number, number, number];
}

export function ParallaxBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let scrollY = 0;
    let lastScrollY = 0;
    let scrollVelocity = 0;
    let mouseX = 0;
    let mouseY = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Generate multi-depth star field
    const stars: Star[] = [];
    const starCounts = { deep: 150, mid: 80, close: 40 };

    for (const [depth, count] of Object.entries(starCounts)) {
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: depth === "deep" ? Math.random() * 1.2 + 0.2
                : depth === "mid" ? Math.random() * 1.8 + 0.4
                : Math.random() * 2.8 + 0.6,
          opacity: depth === "deep" ? Math.random() * 0.5 + 0.2
                   : depth === "mid" ? Math.random() * 0.6 + 0.3
                   : Math.random() * 0.8 + 0.4,
          speed: depth === "deep" ? Math.random() * 0.15 + 0.02
                 : depth === "mid" ? Math.random() * 0.35 + 0.08
                 : Math.random() * 0.6 + 0.15,
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.02 + 0.008,
          depth: depth as Star["depth"],
          hue: 200 + Math.random() * 60, // blue-cyan range
        });
      }
    }

    const shootingStars: ShootingStar[] = [];

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollVelocity = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;
      scrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });

    const isDark = () => document.documentElement.classList.contains("theme-dark");

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const dark = isDark();

      // Decay scroll velocity
      scrollVelocity *= 0.92;
      const warpFactor = Math.min(scrollVelocity / 80, 1);

      if (dark) {
        // Deep space gradient
        const gradient = ctx.createRadialGradient(w * 0.5, h * 0.3, 0, w * 0.5, h * 0.3, Math.max(w, h));
        gradient.addColorStop(0, "#010818");
        gradient.addColorStop(0.4, "#000510");
        gradient.addColorStop(1, "#000000");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      } else {
        // Light theme: subtle stars on transparent canvas
        ctx.clearRect(0, 0, w, h);
      }

      // Mouse parallax offset - stronger on close layers
      const mx = (mouseX - w * 0.5) * 0.02;
      const my = (mouseY - h * 0.5) * 0.015;

      // Enhanced nebula clouds with more colors and softer glow
      const drawNebula = (cx: number, cy: number, radius: number, stops: { offset: number; color: string }[], scrollMult: number, parallaxMult: number) => {
        const nebulaY = (cy + scrollY * scrollMult) % h;
        const n = ctx.createRadialGradient(cx + mx * parallaxMult, nebulaY + my * parallaxMult, 0, cx + mx * parallaxMult, nebulaY + my * parallaxMult, radius);
        for (const stop of stops) {
          n.addColorStop(stop.offset, stop.color);
        }
        ctx.fillStyle = n;
        ctx.fillRect(0, 0, w, h);
      };

      // Nebula 1: cyan-indigo large cloud
      drawNebula(w * 0.15, h * 0.08, Math.max(w, h) * 0.45, [
        { offset: 0, color: "rgba(34, 211, 238, 0.06)" },
        { offset: 0.3, color: "rgba(99, 102, 241, 0.04)" },
        { offset: 0.6, color: "rgba(168, 85, 247, 0.02)" },
        { offset: 1, color: "transparent" },
      ], 0.02, 1);

      // Nebula 2: indigo-cyan medium cloud
      drawNebula(w * 0.82, h * 0.55, w * 0.38, [
        { offset: 0, color: "rgba(99, 102, 241, 0.07)" },
        { offset: 0.4, color: "rgba(34, 211, 238, 0.03)" },
        { offset: 0.7, color: "rgba(236, 72, 153, 0.02)" },
        { offset: 1, color: "transparent" },
      ], 0.05, 0.6);

      // Nebula 3: pink-purple accent
      drawNebula(w * 0.5, h * 0.3, w * 0.3, [
        { offset: 0, color: "rgba(236, 72, 153, 0.04)" },
        { offset: 0.5, color: "rgba(168, 85, 247, 0.02)" },
        { offset: 1, color: "transparent" },
      ], 0.035, 0.4);

      // Nebula 4: deep blue subtle
      drawNebula(w * 0.35, h * 0.75, w * 0.28, [
        { offset: 0, color: "rgba(59, 130, 246, 0.03)" },
        { offset: 0.5, color: "rgba(99, 102, 241, 0.015)" },
        { offset: 1, color: "transparent" },
      ], 0.04, 0.5);

      // Parallax factors per depth
      const parallaxFactors: Record<Star["depth"], { scroll: number; mouse: number }> = {
        deep: { scroll: 0.01, mouse: 0.2 },
        mid: { scroll: 0.03, mouse: 0.5 },
        close: { scroll: 0.06, mouse: 1.0 },
      };

      // Draw stars with depth-based parallax and warp effect
      for (const star of stars) {
        const pf = parallaxFactors[star.depth];
        const y = ((star.y + scrollY * star.speed * pf.scroll + my * pf.mouse) % h + h) % h;
        const x = ((star.x + mx * pf.mouse) % w + w) % w;

        star.twinkle += star.twinkleSpeed;
        const twinkleOpacity = star.opacity * (0.6 + 0.4 * Math.sin(star.twinkle));

        // Warp effect: stretch stars during fast scroll
        if (warpFactor > 0.1) {
          const stretchLength = star.size * (1 + warpFactor * 8);
          const warpAlpha = twinkleOpacity * warpFactor * 0.6;

          ctx.save();
          ctx.translate(x, y);

          // Direction based on scroll
          const scrollDir = scrollY > lastScrollY ? 1 : -1;
          ctx.scale(1, 1 + warpFactor * 4);

          const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, stretchLength);
          const hue = star.hue;
          glow.addColorStop(0, `hsla(${hue}, 80%, 85%, ${warpAlpha})`);
          glow.addColorStop(0.5, `hsla(${hue}, 70%, 70%, ${warpAlpha * 0.3})`);
          glow.addColorStop(1, "transparent");
          ctx.fillStyle = glow;
          ctx.fillRect(-stretchLength, -stretchLength * 2, stretchLength * 2, stretchLength * 4);

          ctx.restore();
        }

        // Glow for larger stars
        if (star.size > 1.2) {
          const glowRadius = star.size * (3 + warpFactor * 2);
          const glow = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
          const starHue = star.hue;
          glow.addColorStop(0, `hsla(${starHue}, 60%, 85%, ${twinkleOpacity * 0.25})`);
          glow.addColorStop(1, "transparent");
          ctx.fillStyle = glow;
          ctx.fillRect(x - glowRadius, y - glowRadius, glowRadius * 2, glowRadius * 2);
        }

        // Star body
        const baseOpacity = dark ? twinkleOpacity : twinkleOpacity * 0.25; // dimmer in light theme
        ctx.fillStyle = dark
          ? `hsla(${star.hue}, 40%, 90%, ${baseOpacity})`
          : `rgba(100, 130, 160, ${baseOpacity})`;
        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Shooting stars - more frequent with colored trails
      if (Math.random() < 0.008) { // ~2.5x more frequent
        const colors: [number, number, number][] = [
          [34, 211, 238],  // cyan
          [168, 85, 247],  // purple
          [236, 72, 153],  // pink
          [96, 165, 250],  // blue
        ];
        shootingStars.push({
          x: Math.random() * w * 0.8,
          y: Math.random() * h * 0.4,
          length: Math.random() * 120 + 60,
          speed: Math.random() * 10 + 8,
          opacity: 1,
          life: 1,
          angle: 0.3 + Math.random() * 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      // Draw shooting stars with colored trails
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.speed;
        ss.y += ss.speed * ss.angle;
        ss.life -= 0.015;
        ss.opacity = ss.life;

        if (ss.life <= 0) {
          shootingStars.splice(i, 1);
          continue;
        }

        const [r, g, b] = ss.color;
        const endX = ss.x - ss.length;
        const endY = ss.y - ss.length * ss.angle;

        // Main trail with color
        const grad = ctx.createLinearGradient(ss.x, ss.y, endX, endY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
        grad.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${ss.opacity * 0.8})`);
        grad.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${ss.opacity * 0.3})`);
        grad.addColorStop(1, "transparent");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Secondary glow trail
        const glowGrad = ctx.createLinearGradient(ss.x, ss.y, endX, endY);
        glowGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${ss.opacity * 0.15})`);
        glowGrad.addColorStop(1, "transparent");
        ctx.strokeStyle = glowGrad;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Head glow
        const headGlow = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, 8);
        headGlow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${ss.opacity * 0.6})`);
        headGlow.addColorStop(1, "transparent");
        ctx.fillStyle = headGlow;
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
}
