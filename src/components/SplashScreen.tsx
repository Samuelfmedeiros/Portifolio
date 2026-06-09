"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

// ─── Star in 3D space ───
interface Star3D {
  x: number; y: number; z: number;
  prevX: number; prevY: number;
  size: number;
  brightness: number;
  hue: number; // 0-360
}

const STAR_COUNT = 600;
const WARP_SPEED = 0.15;
const MAX_Z = 400;

function createStars(w: number, h: number): Star3D[] {
  const stars: Star3D[] = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    const z = Math.random() * MAX_Z;
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * Math.max(w, h) * 0.8;
    stars.push({
      x: w / 2 + Math.cos(angle) * radius,
      y: h / 2 + Math.sin(angle) * radius * (h / w),
      z,
      prevX: 0, prevY: 0,
      size: 0.5 + Math.random() * 2,
      brightness: 0.3 + Math.random() * 0.7,
      hue: Math.random() > 0.7 ? 240 + Math.random() * 40 : 190 + Math.random() * 30,
    });
  }
  return stars;
}

// ─── Spaceship drawing ───
function drawShip(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, engine: number, warp: number, time: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const eGlow = engine;
  const wGlow = warp;
  const flicker = 0.85 + Math.sin(time * 40) * 0.15;

  // Engine plume
  const plumeLen = 25 + eGlow * 50 + wGlow * 30;
  const plumeWid = 8 + eGlow * 15 + wGlow * 10;
  
  const plumeGrad = ctx.createRadialGradient(-plumeLen * 0.3, 0, 0, -plumeLen * 0.3, 0, plumeLen);
  plumeGrad.addColorStop(0, `rgba(255,255,255,${0.9 * flicker})`);
  plumeGrad.addColorStop(0.15, `rgba(34,211,238,${0.8 * eGlow * flicker})`);
  plumeGrad.addColorStop(0.4, `rgba(99,102,241,${0.4 * eGlow})`);
  plumeGrad.addColorStop(1, "rgba(99,102,241,0)");
  
  ctx.beginPath();
  ctx.ellipse(-plumeLen * 0.3, 0, plumeLen, plumeWid, 0, 0, Math.PI * 2);
  ctx.fillStyle = plumeGrad;
  ctx.fill();

  // Inner core
  const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, plumeWid * 0.4);
  coreGrad.addColorStop(0, `rgba(255,255,255,${0.7 * flicker})`);
  coreGrad.addColorStop(1, `rgba(34,211,238,0)`);
  ctx.beginPath();
  ctx.ellipse(0, 0, plumeWid * 0.6, plumeWid * 0.3, 0, 0, Math.PI * 2);
  ctx.fillStyle = coreGrad;
  ctx.fill();

  // Ship body
  const bodyGrad = ctx.createLinearGradient(0, -20, 0, 20);
  bodyGrad.addColorStop(0, "#6366f1");
  bodyGrad.addColorStop(0.5, "#4f46e5");
  bodyGrad.addColorStop(1, "#6366f1");

  ctx.beginPath();
  ctx.moveTo(30, 0);
  ctx.lineTo(-15, -18);
  ctx.lineTo(-20, -10);
  ctx.lineTo(-10, -5);
  ctx.lineTo(-10, 5);
  ctx.lineTo(-20, 10);
  ctx.lineTo(-15, 18);
  ctx.closePath();
  ctx.fillStyle = bodyGrad;
  ctx.fill();
  ctx.strokeStyle = "rgba(6,182,212,0.6)";
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Solar sails (top & bottom)
  ctx.save();
  for (const dir of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(15, dir * 5);
    ctx.lineTo(25, dir * 30);
    ctx.lineTo(5, dir * 28);
    ctx.lineTo(-5, dir * 12);
    ctx.closePath();
    const sailGrad = ctx.createLinearGradient(0, dir * 5, 0, dir * 30);
    sailGrad.addColorStop(0, `rgba(99,102,241,${0.3 + eGlow * 0.2})`);
    sailGrad.addColorStop(0.5, `rgba(6,182,212,${0.15 + eGlow * 0.1})`);
    sailGrad.addColorStop(1, `rgba(34,211,238,0.05)`);
    ctx.fillStyle = sailGrad;
    ctx.fill();
    ctx.strokeStyle = `rgba(6,182,212,${0.2 + eGlow * 0.2})`;
    ctx.lineWidth = 0.4;
    ctx.stroke();
  }
  ctx.restore();

  // Cockpit
  ctx.beginPath();
  ctx.ellipse(15, 0, 5, 6, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#020617";
  ctx.fill();
  ctx.strokeStyle = "#22d3ee";
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Cockpit glow
  ctx.beginPath();
  ctx.ellipse(15, 0, 3, 4, 0, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(6,182,212,${0.15 + Math.sin(time * 3) * 0.05})`;
  ctx.fill();

  // Cockpit light
  ctx.beginPath();
  ctx.arc(14, -1.5, 1, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(34,211,238,${0.4 + Math.sin(time * 5) * 0.2})`;
  ctx.fill();

  // Warp rings
  if (wGlow > 0.1) {
    for (let i = 0; i < 3; i++) {
      const rSize = 25 + i * 15 + Math.sin(time * 10 + i) * 5;
      ctx.beginPath();
      ctx.ellipse(10 + i * 5, 0, rSize, rSize * 0.3, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${190 + i * 20}, 70%, 55%, ${0.15 * wGlow / (i + 1)})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }

  ctx.restore();
}

// ─── Hyperspace tunnel ───
function drawTunnel(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number, time: number) {
  const p = Math.min(1, Math.max(0, (progress - 0.5) / 0.4));
  if (p <= 0) return;

  ctx.save();
  ctx.translate(w / 2, h / 2);

  for (let i = 0; i < 25; i++) {
    const t = i / 25;
    const radius = 50 + t * 400;
    const alpha = (1 - t) * p * 0.15;
    const hue = 190 + i * 2 + Math.sin(time + i * 0.5) * 10;
    
    ctx.beginPath();
    ctx.ellipse(0, 0, radius, radius * 0.35, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${hue}, 70%, 55%, ${alpha})`;
    ctx.lineWidth = 0.5 + t * 0.5;
    ctx.stroke();

    // Inner glow rings
    if (i % 3 === 0) {
      ctx.beginPath();
      ctx.ellipse(0, 0, radius - 2, radius * 0.35 - 1, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${hue + 20}, 80%, 65%, ${alpha * 0.3})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  // Center glow
  const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, 100);
  cg.addColorStop(0, `rgba(99,102,241,${p * 0.08})`);
  cg.addColorStop(0.5, `rgba(6,182,212,${p * 0.04})`);
  cg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = cg;
  ctx.fillRect(-200, -200, 400, 400);

  ctx.restore();
}

// ─── Energy particles ───
function drawEnergyParticles(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number, time: number) {
  const p = Math.min(1, Math.max(0, (progress - 0.4) / 0.5));
  if (p <= 0) return;

  for (let i = 0; i < 15; i++) {
    const angle = (i / 15) * Math.PI * 2 + time * 0.5;
    const radius = 100 + Math.sin(time * 2 + i) * 50;
    const x = w / 2 + Math.cos(angle + Math.sin(time + i) * 0.5) * radius;
    const y = h / 2 + Math.sin(angle + Math.sin(time * 0.7 + i) * 0.5) * radius * 0.4;
    const size = 2 + Math.sin(time * 3 + i) * 1;
    const alpha = p * (0.3 + Math.sin(time * 2 + i) * 0.2);
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${190 + i * 3}, 80%, 60%, ${alpha})`;
    ctx.fill();

    // Glow
    ctx.beginPath();
    ctx.arc(x, y, size * 3, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${190 + i * 3}, 80%, 60%, ${alpha * 0.15})`;
    ctx.fill();
  }
}

// ─── Flash transition ───
function drawFlash(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number) {
  const p = Math.min(1, Math.max(0, (progress - 0.78) / 0.15));
  const fade = Math.min(1, Math.max(0, (progress - 0.93) / 0.07));
  if (p <= 0) return;

  const alpha = p * (1 - fade);
  const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7 * p);
  grad.addColorStop(0, `rgba(99,102,241,${alpha * 0.4})`);
  grad.addColorStop(0.3, `rgba(6,182,212,${alpha * 0.2})`);
  grad.addColorStop(0.6, `rgba(99,102,241,${alpha * 0.05})`);
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

// ─── MAIN ───
export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star3D[]>([]);
  const dimsRef = useRef({ w: 1200, h: 800 });
  const progressRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const [phase, setPhase] = useState(0);

  // Bootstrap phases
  useEffect(() => {
    const t: ReturnType<typeof setTimeout>[] = [];
    t.push(setTimeout(() => setPhase(1), 600));   // 0.6s: ship appears
    t.push(setTimeout(() => setPhase(2), 2200));   // 2.2s: accelerate
    t.push(setTimeout(() => setPhase(3), 3800));   // 3.8s: hyperspace
    t.push(setTimeout(() => setPhase(4), 5800));   // 5.8s: flash transit
    t.push(setTimeout(() => onCompleteRef.current(), 7200)); // 7.2s: done
    return () => t.forEach(clearTimeout);
  }, []);

  // Animation loop (Canvas 60fps)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    let animationId: number;
    let startTime = performance.now();

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w;
      canvas!.height = h;
      dimsRef.current = { w, h };
      starsRef.current = createStars(w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(1, elapsed / 7.2);
      progressRef.current = progress;
      const currentPhase = phase;

      // Clear
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, w, h);

      // Deep space gradient
      const spaceGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.6);
      spaceGrad.addColorStop(0, `rgba(30,27,75,${0.3 + progress * 0.1})`);
      spaceGrad.addColorStop(0.4, `rgba(15,23,42,0.5)`);
      spaceGrad.addColorStop(1, "#020617");
      ctx.fillStyle = spaceGrad;
      ctx.fillRect(0, 0, w, h);

      // Nebula clouds
      const nebAlpha = Math.min(1, Math.max(0, (progress - 0.05) / 0.3));
      if (nebAlpha > 0) {
        for (let n = 0; n < 3; n++) {
          const nx = w * (0.2 + n * 0.3) + Math.sin(elapsed * 0.05 + n) * 50;
          const ny = h * (0.3 + n * 0.15) + Math.cos(elapsed * 0.07 + n) * 50;
          const nr = 200 + n * 80;
          const ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr);
          const hue = n === 0 ? 240 : n === 1 ? 190 : 270;
          ng.addColorStop(0, `hsla(${hue}, 50%, 40%, ${0.04 * nebAlpha})`);
          ng.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = ng;
          ctx.fillRect(nx - nr, ny - nr, nr * 2, nr * 2);
        }
      }

      // Warp tunnel
      if (currentPhase >= 3) {
        drawTunnel(ctx, w, h, progress, elapsed);
      }

      // Energy particles
      if (currentPhase >= 2) {
        drawEnergyParticles(ctx, w, h, progress, elapsed);
      }

      // Stars
      const stars = starsRef.current;
      const isWarp = currentPhase >= 3;
      const isMoving = currentPhase >= 1;
      const warpMul = isWarp ? 8 : 1;
      const speedBase = isMoving ? 0.8 + Math.sin(elapsed * 0.5) * 0.1 : 0;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.prevX = s.x;
        s.prevY = s.y;

        // Move star toward center (warp effect)
        const dx = w / 2 - s.x;
        const dy = h / 2 - s.y;
        const dz = s.z * warpMul * WARP_SPEED;
        
        if (s.z > 0) {
          const scale = 1 / s.z * 100;
          s.x += (dx / s.z) * dz * speedBase;
          s.y += (dy / s.z) * dz * speedBase;
          s.z -= dz * 2;
        }

        // Reset star if out of bounds
        if (s.z <= 0 || s.x < -50 || s.x > w + 50 || s.y < -50 || s.y > h + 50) {
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.max(w, h) * 0.5 + Math.random() * Math.max(w, h) * 0.5;
          s.x = w / 2 + Math.cos(angle) * radius;
          s.y = h / 2 + Math.sin(angle) * radius * (h / w);
          s.z = 50 + Math.random() * MAX_Z;
          s.prevX = s.x;
          s.prevY = s.y;
          s.brightness = 0.3 + Math.random() * 0.7;
          s.hue = Math.random() > 0.7 ? 240 + Math.random() * 40 : 190 + Math.random() * 30;
        }

        // Draw star
        const alpha = Math.min(1, s.brightness * (1 / s.z * 50));
        const size = s.size * (1 / s.z * 30);

        if (isWarp && size > 0.5) {
          // Streak effect during warp
          const streakLen = Math.min(50, 5 + (1 / s.z) * 200);
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x + (s.x - s.prevX) * streakLen, s.y + (s.y - s.prevY) * streakLen);
          ctx.strokeStyle = `hsla(${s.hue}, 70%, 60%, ${Math.min(0.8, alpha * 2)})`;
          ctx.lineWidth = Math.max(0.5, size);
          ctx.stroke();
        } else if (size > 0.3) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, Math.max(0.3, size), 0, Math.PI * 2);
          ctx.fillStyle = isMoving 
            ? `hsla(${s.hue}, 60%, 70%, ${alpha})`
            : `rgba(255,255,255,${alpha * 0.5})`;
          ctx.fill();

          // Star glow
          if (size > 1) {
            ctx.beginPath();
            ctx.arc(s.x, s.y, size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${s.hue}, 60%, 50%, ${alpha * 0.1})`;
            ctx.fill();
          }
        }
      }

      // Draw spaceship
      if (currentPhase >= 1 && currentPhase <= 4) {
        const shipProgress = Math.min(1, Math.max(0, (progress - 0.08) / 0.3));
        const engine = Math.min(1, Math.max(0, (progress - 0.1) / 0.3)) * (0.8 + Math.sin(elapsed * 15) * 0.2);
        const warp = Math.min(1, Math.max(0, (progress - 0.45) / 0.3));

        // Ship position - enters from left, settles center, wobbles during warp
        let shipX: number, shipY: number, shipScale: number;
        if (currentPhase === 1) {
          const ease = 1 - Math.pow(1 - shipProgress, 3);
          shipX = w * (-0.1 + ease * 0.6);
          shipY = h * 0.5;
          shipScale = 0.5 + ease * 0.5;
        } else if (currentPhase === 2) {
          shipX = w * 0.5;
          shipY = h * 0.5 + Math.sin(elapsed * 0.5) * 5;
          shipScale = 1 + Math.sin(elapsed) * 0.02;
        } else if (currentPhase >= 3) {
          const wobble = Math.sin(elapsed * 8) * 3;
          shipX = w * 0.5 + wobble;
          shipY = h * 0.5 + Math.sin(elapsed * 6) * 2;
          shipScale = 1 + Math.sin(elapsed * 10) * 0.05;
        } else {
          shipX = w * 0.5;
          shipY = h * 0.5;
          shipScale = 1;
        }

        // Flash fade-out during transit
        const transitFade = Math.min(1, Math.max(0, (progress - 0.78) / 0.08));
        const alpha = 1 - transitFade;

        ctx.save();
        ctx.globalAlpha = Math.max(0, alpha);
        drawShip(ctx, shipX, shipY, shipScale * 0.7, engine, warp, elapsed);
        ctx.restore();
      }

      // Flash
      drawFlash(ctx, w, h, progress);

      // Letterbox
      const letterH = h * 0.1;
      const letterAlpha = currentPhase === 4 ? Math.max(0, 1 - (progress - 0.78) / 0.15) : 1;
      if (letterAlpha > 0) {
        ctx.fillStyle = `rgba(2,6,23,${letterAlpha})`;
        ctx.fillRect(0, 0, w, letterH);
        ctx.fillRect(0, h - letterH, w, letterH);
      }

      // Vignette
      const vigGrad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.2, w / 2, h / 2, Math.max(w, h) * 0.7);
      vigGrad.addColorStop(0, "rgba(0,0,0,0)");
      vigGrad.addColorStop(1, "rgba(2,6,23,0.5)");
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, w, h);

      // Scanline
      ctx.fillStyle = "rgba(6,182,212,0.015)";
      for (let y = 0; y < h; y += 3) {
        ctx.fillRect(0, y, w, 1);
      }

      // Label - "SEJA BEM-VINDO" at the end
      if (progress > 0.82) {
        const labelAlpha = Math.min(1, (progress - 0.82) / 0.08);
        ctx.save();
        ctx.globalAlpha = labelAlpha;
        ctx.fillStyle = "#06b6d4";
        ctx.font = "11px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("SEJA BEM-VINDO", w / 2, h - letterH - 20);
        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [phase]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] bg-[#020617] cursor-none"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </motion.div>
  );
}
