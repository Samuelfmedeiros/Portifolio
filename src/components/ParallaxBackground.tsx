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
  trailHue: number;
}

interface Planet {
  x: number;
  y: number;
  radius: number;
  rotation: number;
  rotationSpeed: number;
  hue: number;
  bandOffset: number;
}

export function ParallaxBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Disable heavy canvas on mobile (< 768px)
    const isMobile = window.innerWidth < 768;
    const activeStarCounts = isMobile
      ? { deep: 30, mid: 15, close: 8 }
      : { deep: 120, mid: 60, close: 30 };

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

    // PLANET config — positioned in the distance
    const planet: Planet = {
      x: 0.75, // % of width
      y: 0.35, // % of height
      radius: 0, // set on resize
      rotation: 0,
      rotationSpeed: 0.0003,
      hue: 210,
      bandOffset: 0,
    };

    // Generate multi-depth star field
    const stars: Star[] = [];
    const starCounts = activeStarCounts;

    for (const [depth, count] of Object.entries(starCounts)) {
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: depth === "deep" ? Math.random() * 1.0 + 0.1
                : depth === "mid" ? Math.random() * 1.5 + 0.3
                : Math.random() * 2.5 + 0.5,
          opacity: depth === "deep" ? Math.random() * 0.4 + 0.15
                   : depth === "mid" ? Math.random() * 0.5 + 0.25
                   : Math.random() * 0.7 + 0.35,
          speed: depth === "deep" ? Math.random() * 0.1 + 0.01
                 : depth === "mid" ? Math.random() * 0.25 + 0.05
                 : Math.random() * 0.5 + 0.1,
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          depth: depth as Star["depth"],
          hue: 190 + Math.random() * 80,
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

      // Update planet size relative to viewport
      planet.radius = Math.min(w, h) * 0.12;
      planet.rotation += planet.rotationSpeed;
      planet.bandOffset = Math.sin(planet.rotation * 2) * 0.3;

      // --- BACKGROUND ---
      if (dark) {
        // Deep space gradient — richer colors
        const gradient = ctx.createRadialGradient(w * 0.5, h * 0.25, 0, w * 0.5, h * 0.25, Math.max(w, h) * 0.8);
        gradient.addColorStop(0, "#020c1a");
        gradient.addColorStop(0.3, "#010612");
        gradient.addColorStop(0.6, "#00040a");
        gradient.addColorStop(1, "#000000");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      } else {
        // Light mode — subtle atmospheric gradient (misty blue-white)
        const gradient = ctx.createRadialGradient(w * 0.5, h * 0.2, 0, w * 0.5, h * 0.2, Math.max(w, h) * 0.9);
        gradient.addColorStop(0, "#f0f4ff");
        gradient.addColorStop(0.3, "#e8eef8");
        gradient.addColorStop(0.6, "#dce4f0");
        gradient.addColorStop(1, "#d0d8e5");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // Subtle soft cloud wisps for light mode
        const cloudGrad1 = ctx.createRadialGradient(
          w * 0.8, h * 0.9, 0,
          w * 0.8, h * 0.9, Math.max(w, h) * 0.4
        );
        cloudGrad1.addColorStop(0, "rgba(255, 255, 255, 0.25)");
        cloudGrad1.addColorStop(0.5, "rgba(220, 230, 245, 0.10)");
        cloudGrad1.addColorStop(1, "transparent");
        ctx.fillStyle = cloudGrad1;
        ctx.fillRect(0, 0, w, h);

        const cloudGrad2 = ctx.createRadialGradient(
          w * 0.15, h * 0.1, 0,
          w * 0.15, h * 0.1, Math.max(w, h) * 0.3
        );
        cloudGrad2.addColorStop(0, "rgba(255, 255, 255, 0.30)");
        cloudGrad2.addColorStop(0.5, "rgba(235, 240, 250, 0.08)");
        cloudGrad2.addColorStop(1, "transparent");
        ctx.fillStyle = cloudGrad2;
        ctx.fillRect(0, 0, w, h);
      }

      // Mouse parallax offset
      const mx = (mouseX - w * 0.5) * 0.02;
      const my = (mouseY - h * 0.5) * 0.015;

      // === NEBULAE ===
      const drawNebula = (
        cx: number, cy: number, radius: number,
        stops: { offset: number; color: string }[],
        scrollMult: number, parallaxMult: number
      ) => {
        if (!dark) {
          // Light mode — softer nebula with pastel tones
          const nebulaY = (cy + scrollY * scrollMult) % h;
          const n = ctx.createRadialGradient(
            cx + mx * parallaxMult * 0.5, nebulaY + my * parallaxMult * 0.5, 0,
            cx + mx * parallaxMult * 0.5, nebulaY + my * parallaxMult * 0.5, radius * 0.6
          );
          n.addColorStop(0, "rgba(200, 215, 240, 0.06)");
          n.addColorStop(0.4, "rgba(180, 200, 230, 0.04)");
          n.addColorStop(1, "transparent");
          ctx.fillStyle = n;
          ctx.fillRect(0, 0, w, h);
          return;
        }
        const nebulaY = (cy + scrollY * scrollMult) % h;
        const n = ctx.createRadialGradient(
          cx + mx * parallaxMult, nebulaY + my * parallaxMult, 0,
          cx + mx * parallaxMult, nebulaY + my * parallaxMult, radius
        );
        for (const stop of stops) n.addColorStop(stop.offset, stop.color);
        ctx.fillStyle = n;
        ctx.fillRect(0, 0, w, h);
      };

      // Nebula 1: ethereal cyan-teal
      drawNebula(w * 0.12, h * 0.05, Math.max(w, h) * 0.5, [
        { offset: 0, color: "rgba(34, 211, 238, 0.04)" },
        { offset: 0.25, color: "rgba(20, 184, 166, 0.03)" },
        { offset: 0.55, color: "rgba(168, 85, 247, 0.015)" },
        { offset: 1, color: "transparent" },
      ], 0.015, 1.2);

      // Nebula 2: purple-coral drift
      drawNebula(w * 0.78, h * 0.6, w * 0.4, [
        { offset: 0, color: "rgba(168, 85, 247, 0.05)" },
        { offset: 0.35, color: "rgba(236, 72, 153, 0.03)" },
        { offset: 0.65, color: "rgba(59, 130, 246, 0.015)" },
        { offset: 1, color: "transparent" },
      ], 0.04, 0.7);

      // Nebula 3: subtle amber-gold accent
      drawNebula(w * 0.55, h * 0.2, w * 0.25, [
        { offset: 0, color: "rgba(245, 158, 11, 0.015)" },
        { offset: 0.4, color: "rgba(251, 191, 36, 0.008)" },
        { offset: 1, color: "transparent" },
      ], 0.03, 0.5);

      // === PLANET ===
      if (dark && !isMobile) {
        const px = w * planet.x + mx * 0.3;
        const py = h * planet.y + scrollY * 0.008 + my * 0.2;
        const pr = planet.radius;

        // Outer atmosphere glow
        const atmosGlow = ctx.createRadialGradient(px, py, pr * 0.7, px, py, pr * 2.5);
        const atmosHue = planet.hue + Math.sin(planet.rotation * 0.5) * 5;
        atmosGlow.addColorStop(0, `hsla(${atmosHue}, 70%, 60%, 0.06)`);
        atmosGlow.addColorStop(0.5, `hsla(${atmosHue + 20}, 60%, 50%, 0.03)`);
        atmosGlow.addColorStop(1, "transparent");
        ctx.fillStyle = atmosGlow;
        ctx.beginPath();
        ctx.arc(px, py, pr * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Planet body
        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.clip();

        // Base gradient — spherical
        const bodyGrad = ctx.createRadialGradient(
          px - pr * 0.3, py - pr * 0.3, 0,
          px, py, pr
        );
        const baseHue = planet.hue + Math.sin(planet.rotation) * 3;
        bodyGrad.addColorStop(0, `hsla(${baseHue}, 40%, 35%, 0.5)`);
        bodyGrad.addColorStop(0.5, `hsla(${baseHue - 10}, 30%, 22%, 0.7)`);
        bodyGrad.addColorStop(1, `hsla(${baseHue - 20}, 25%, 12%, 0.8)`);
        ctx.fillStyle = bodyGrad;
        ctx.fillRect(px - pr, py - pr, pr * 2, pr * 2);

        // Surface bands
        for (let i = 0; i < 6; i++) {
          const bandY = py - pr + (pr * 2 * (0.15 + i * 0.14)) + Math.sin(planet.rotation * 3 + i) * pr * 0.04;
          const bandH = pr * 0.06 + Math.sin(i * 2 + planet.rotation) * pr * 0.02;
          const bandHue = baseHue + Math.sin(i + planet.bandOffset) * 15;
          ctx.fillStyle = `hsla(${bandHue}, 35%, ${20 + (i % 2) * 8}%, 0.25)`;
          ctx.fillRect(px - pr, bandY, pr * 2, bandH);
        }

        // Atmosphere rim light (top)
        const rimGrad = ctx.createRadialGradient(px, py - pr * 0.3, pr * 0.1, px, py - pr * 0.3, pr * 1.1);
        rimGrad.addColorStop(0, "transparent");
        rimGrad.addColorStop(0.6, "transparent");
        rimGrad.addColorStop(0.85, `hsla(${baseHue + 30}, 80%, 70%, 0.04)`);
        rimGrad.addColorStop(1, `hsla(${baseHue + 30}, 80%, 70%, 0)`);
        ctx.fillStyle = rimGrad;
        ctx.fillRect(px - pr, py - pr, pr * 2, pr * 2);

        ctx.restore();

        // Planet inner shadow (crescent dark side)
        const shadowGrad = ctx.createRadialGradient(
          px + pr * 0.5, py, 0,
          px, py, pr
        );
        shadowGrad.addColorStop(0, "transparent");
        shadowGrad.addColorStop(0.7, "transparent");
        shadowGrad.addColorStop(1, "rgba(0, 0, 0, 0.25)");
        ctx.fillStyle = shadowGrad;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();
      }

      // === STARS ===
      const parallaxFactors: Record<Star["depth"], { scroll: number; mouse: number }> = {
        deep: { scroll: 0.01, mouse: 0.2 },
        mid: { scroll: 0.03, mouse: 0.5 },
        close: { scroll: 0.06, mouse: 1.0 },
      };

      for (const star of stars) {
        const pf = parallaxFactors[star.depth];
        const y = ((star.y + scrollY * star.speed * pf.scroll + my * pf.mouse) % h + h) % h;
        const x = ((star.x + mx * pf.mouse) % w + w) % w;

        star.twinkle += star.twinkleSpeed;
        const twinkleOpacity = star.opacity * (0.5 + 0.5 * Math.sin(star.twinkle));

        // Star body
        const baseOpacity = dark ? twinkleOpacity : twinkleOpacity * 0.5;
        ctx.fillStyle = dark
          ? `hsla(${star.hue}, 50%, ${80 + (star.size > 1.5 ? 10 : 0)}%, ${baseOpacity})`
          : `rgba(100, 130, 180, ${baseOpacity})`;
        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // === SHOOTING STARS ===
      if (dark && !isMobile && Math.random() < 0.006) {
        const trailHue = 200 + Math.random() * 100;
        shootingStars.push({
          x: Math.random() * w * 0.7,
          y: Math.random() * h * 0.35,
          length: Math.random() * 100 + 50,
          speed: Math.random() * 12 + 6,
          opacity: 1,
          life: 1,
          angle: 0.25 + Math.random() * 0.2,
          trailHue,
        });
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.speed;
        ss.y += ss.speed * ss.angle;
        ss.life -= 0.018;
        ss.opacity = Math.max(0, ss.life);

        if (ss.life <= 0) {
          shootingStars.splice(i, 1);
          continue;
        }

        const endX = ss.x - ss.length;
        const endY = ss.y - ss.length * ss.angle;

        // Glow trail
        const glowGrad = ctx.createLinearGradient(ss.x, ss.y, endX, endY);
        glowGrad.addColorStop(0, `hsla(${ss.trailHue}, 80%, 90%, ${ss.opacity * 0.6})`);
        glowGrad.addColorStop(0.3, `hsla(${ss.trailHue}, 60%, 70%, ${ss.opacity * 0.3})`);
        glowGrad.addColorStop(0.7, `hsla(${ss.trailHue}, 40%, 50%, ${ss.opacity * 0.1})`);
        glowGrad.addColorStop(1, "transparent");
        ctx.strokeStyle = glowGrad;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Outer glow
        ctx.strokeStyle = `hsla(${ss.trailHue}, 60%, 60%, ${ss.opacity * 0.08})`;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Head
        const headGlow = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, 6);
        headGlow.addColorStop(0, `hsla(${ss.trailHue}, 80%, 95%, ${ss.opacity * 0.5})`);
        headGlow.addColorStop(1, "transparent");
        ctx.fillStyle = headGlow;
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 6, 0, Math.PI * 2);
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
      style={{ willChange: "transform", transform: "translateZ(0)" }}
      aria-hidden="true"
    />
  );
}
