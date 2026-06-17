"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGsapAnimation";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  depth: number;
}

/**
 * StarField — Campo estelar com GSAP + ScrollTrigger parallax
 *
 * 3 camadas de profundidade com velocidades diferentes.
 * Substitui framer-motion por animações CSS + GSAP.
 */
export function StarField() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const layers = container.querySelectorAll<HTMLElement>("[data-depth]");
    if (!layers.length) return;

    const ctx = gsap.context(() => {
      layers.forEach((layer) => {
        const depth = parseFloat(layer.dataset.depth || "1");
        const speed = depth * 0.15; // 0.15 / 0.3 / 0.45

        gsap.to(layer, {
          y: () => `${speed * 100}%`,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Depth 1 — deep (slow) */}
      <div data-depth="1" className="absolute inset-0 will-change-transform">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={`d1-${i}`}
            className="absolute rounded-full bg-[var(--accent)]"
            style={{
              left: `${((i * 37 + 13) % 100)}%`,
              top: `${((i * 53 + 7) % 100)}%`,
              width: "1px",
              height: "1px",
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      {/* Depth 2 — mid */}
      <div data-depth="2" className="absolute inset-0 will-change-transform">
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={`d2-${i}`}
            className="absolute rounded-full bg-[var(--accent)]"
            style={{
              left: `${((i * 41 + 19) % 100)}%`,
              top: `${((i * 59 + 11) % 100)}%`,
              width: "1.5px",
              height: "1.5px",
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      {/* Depth 3 — close (fast) */}
      <div data-depth="3" className="absolute inset-0 will-change-transform">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={`d3-${i}`}
            className="absolute rounded-full bg-[var(--accent)]"
            style={{
              left: `${((i * 29 + 31) % 100)}%`,
              top: `${((i * 67 + 23) % 100)}%`,
              width: "2px",
              height: "2px",
              opacity: 0.7,
            }}
          />
        ))}
      </div>
    </div>
  );
}
