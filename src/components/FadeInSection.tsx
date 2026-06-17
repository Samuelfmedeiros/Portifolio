"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGsapAnimation";

interface FadeInSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  once?: boolean;
}

const directionMap = {
  up: { y: 1, x: 0 },
  down: { y: -1, x: 0 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * FadeInSection — GSAP ScrollTrigger reveal
 * Substitui framer-motion para fade-in ao scroll.
 */
export function FadeInSection({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 30,
  once = true,
}: FadeInSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const dir = directionMap[direction];
    const ctx = gsap.context(() => {
      gsap.from(el, {
        x: dir.x * distance,
        y: dir.y * distance,
        opacity: 0,
        duration: 0.6,
        delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: once ? "play none none none" : "play reverse play reverse",
        },
      });
    });

    return () => ctx.revert();
  }, [delay, direction, distance, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * StaggerContainer — container para múltiplos itens com stagger
 */
export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = el.querySelectorAll("[data-stagger-item]");
    if (!items.length) return;

    const ctx = gsap.context(() => {
      gsap.from(items, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: staggerDelay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });

    return () => ctx.revert();
  }, [staggerDelay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * StaggerItem — item dentro de StaggerContainer
 */
export function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-stagger-item className={className}>
      {children}
    </div>
  );
}
