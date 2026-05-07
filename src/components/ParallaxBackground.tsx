"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
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

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Generate stars
    const stars: Star[] = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.5 + 0.1,
    }));

    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const draw = () => {
      // Deep space gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#000510");
      gradient.addColorStop(0.5, "#000a1a");
      gradient.addColorStop(1, "#000000");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars with parallax
      for (const star of stars) {
        const y = (star.y + scrollY * star.speed * 0.02) % canvas.height;
        const parallaxY = y + scrollY * star.speed * -0.005;
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, parallaxY, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw nebula blobs
      const nebula1Y = (canvas.height * 0.1 + scrollY * 0.03) % canvas.height;
      const nebula2Y = (canvas.height * 0.5 + scrollY * 0.05) % canvas.height;

      const n1 = ctx.createRadialGradient(
        canvas.width * 0.1, nebula1Y, 0,
        canvas.width * 0.1, nebula1Y, 300,
      );
      n1.addColorStop(0, "rgba(34, 211, 238, 0.08)");
      n1.addColorStop(1, "transparent");
      ctx.fillStyle = n1;
      ctx.fillRect(0, nebula1Y - 300, canvas.width * 0.4, 600);

      const n2 = ctx.createRadialGradient(
        canvas.width * 0.9, nebula2Y, 0,
        canvas.width * 0.9, nebula2Y, 250,
      );
      n2.addColorStop(0, "rgba(99, 102, 241, 0.06)");
      n2.addColorStop(1, "transparent");
      ctx.fillStyle = n2;
      ctx.fillRect(canvas.width * 0.6, nebula2Y - 250, canvas.width * 0.4, 500);

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
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
