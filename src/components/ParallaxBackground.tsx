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
    let mouseX = 0;
    let mouseY = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Generate richer star field
    const stars: Star[] = Array.from({ length: 250 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 0.3,
      opacity: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.5 + 0.05,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
    }));

    // Shooting stars
    const shootingStars: { x: number; y: number; length: number; speed: number; opacity: number; life: number }[] = [];

    const handleScroll = () => {
      scrollY = window.scrollY;
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

      if (!dark) {
        // Light theme: transparent canvas, let CSS background show through
        ctx.clearRect(0, 0, w, h);
        animationId = requestAnimationFrame(draw);
        return;
      }

      // Deep space gradient
      const gradient = ctx.createRadialGradient(w * 0.5, h * 0.3, 0, w * 0.5, h * 0.3, Math.max(w, h));
      gradient.addColorStop(0, "#010818");
      gradient.addColorStop(0.4, "#000510");
      gradient.addColorStop(1, "#000000");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Mouse parallax offset
      const mx = (mouseX - w * 0.5) * 0.015;
      const my = (mouseY - h * 0.5) * 0.01;

      // Draw nebula clouds
      const nebula1Y = (h * 0.08 + scrollY * 0.03) % h;
      const n1 = ctx.createRadialGradient(w * 0.15 + mx, nebula1Y + my, 0, w * 0.15 + mx, nebula1Y + my, Math.max(w, h) * 0.4);
      n1.addColorStop(0, "rgba(34, 211, 238, 0.07)");
      n1.addColorStop(0.5, "rgba(99, 102, 241, 0.04)");
      n1.addColorStop(1, "transparent");
      ctx.fillStyle = n1;
      ctx.fillRect(0, 0, w, h);

      const nebula2Y = (h * 0.55 + scrollY * 0.06) % h;
      const n2 = ctx.createRadialGradient(w * 0.85 + mx * 0.5, nebula2Y + my * 0.5, 0, w * 0.85 + mx * 0.5, nebula2Y + my * 0.5, w * 0.35);
      n2.addColorStop(0, "rgba(99, 102, 241, 0.09)");
      n2.addColorStop(0.5, "rgba(34, 211, 238, 0.03)");
      n2.addColorStop(1, "transparent");
      ctx.fillStyle = n2;
      ctx.fillRect(0, 0, w, h);

      const nebula3Y = (h * 0.3 + scrollY * 0.04) % h;
      const n3 = ctx.createRadialGradient(w * 0.5 + mx * 0.3, nebula3Y + my * 0.3, 0, w * 0.5 + mx * 0.3, nebula3Y + my * 0.3, w * 0.25);
      n3.addColorStop(0, "rgba(236, 72, 153, 0.04)");
      n3.addColorStop(1, "transparent");
      ctx.fillStyle = n3;
      ctx.fillRect(0, 0, w, h);

      // Draw twinkling stars with parallax
      for (const star of stars) {
        const parallaxFactor = star.speed * 0.5;
        const y = ((star.y + scrollY * star.speed * 0.03 + my * parallaxFactor) % h + h) % h;
        const x = ((star.x + mx * parallaxFactor) % w + w) % w;

        star.twinkle += star.twinkleSpeed;
        const twinkleOpacity = star.opacity * (0.6 + 0.4 * Math.sin(star.twinkle));

        // Glow for larger stars
        if (star.size > 1.5) {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, star.size * 4);
          glow.addColorStop(0, `rgba(200, 230, 255, ${twinkleOpacity * 0.3})`);
          glow.addColorStop(1, "transparent");
          ctx.fillStyle = glow;
          ctx.fillRect(x - star.size * 4, y - star.size * 4, star.size * 8, star.size * 8);
        }

        ctx.fillStyle = `rgba(220, 240, 255, ${twinkleOpacity})`;
        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Random shooting star
      if (Math.random() < 0.003) {
        shootingStars.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.5,
          length: Math.random() * 80 + 40,
          speed: Math.random() * 8 + 6,
          opacity: 1,
          life: 1,
        });
      }

      // Draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.speed;
        ss.y += ss.speed * 0.4;
        ss.life -= 0.02;
        ss.opacity = ss.life;

        if (ss.life <= 0) {
          shootingStars.splice(i, 1);
          continue;
        }

        const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.length, ss.y - ss.length * 0.4);
        grad.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
        grad.addColorStop(1, "transparent");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.length, ss.y - ss.length * 0.4);
        ctx.stroke();
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