"use client";

import { useEffect, useState } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

export function ParallaxBackground() {
  const [stars, setStars] = useState<Star[]>([]);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Generate stars
    const generated: Star[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.5 + 0.1,
    }));
    setStars(generated);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Deep space gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#000510] via-[#000a1a] to-[#000000]" />

      {/* Stars with parallax */}
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${(star.y + scrollY * star.speed * 0.02) % 100}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            transform: `translateY(${scrollY * star.speed * -0.01}px)`,
          }}
        />
      ))}

      {/* Nebula blobs */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-10"
        style={{
          background: "radial-gradient(circle, #22d3ee, transparent)",
          top: `${10 + scrollY * 0.03}%`,
          left: "10%",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-8"
        style={{
          background: "radial-gradient(circle, #6366f1, transparent)",
          top: `${50 + scrollY * 0.05}%`,
          right: "5%",
        }}
      />
    </div>
  );
}
