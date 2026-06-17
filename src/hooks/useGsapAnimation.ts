"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hook: useGsapAnimation — entrada suave com GSAP
 * Substitui Framer Motion `initial/animate` por GSAP.
 */
export function useGsapFadeIn(
  selector: string,
  options: {
    delay?: number;
    duration?: number;
    y?: number;
    stagger?: number;
    trigger?: string;
    start?: string;
    once?: boolean;
  } = {}
) {
  const {
    delay = 0,
    duration = 0.6,
    y = 20,
    stagger = 0,
    trigger,
    start = "top 85%",
    once = true,
  } = options;

  useEffect(() => {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;

    const ctx = gsap.context(() => {
      if (stagger > 0) {
        gsap.from(els, {
          y,
          opacity: 0,
          duration,
          delay,
          stagger,
          ease: "power2.out",
          scrollTrigger: trigger
            ? { trigger: trigger || els[0].parentElement, start, once }
            : undefined,
        });
      } else {
        els.forEach((el, i) => {
          gsap.from(el, {
            y,
            opacity: 0,
            duration,
            delay: delay + i * (stagger || 0.08),
            ease: "power2.out",
            scrollTrigger: trigger
              ? { trigger: trigger || el.parentElement, start, once }
              : undefined,
          });
        });
      }
    });

    return () => ctx.revert();
  }, [selector]);
}

/**
 * Hook: useScrollParallax — parallax via GSAP ScrollTrigger
 */
export function useScrollParallax(
  selector: string,
  speed: number = 0.5,
  options: { start?: string; end?: string } = {}
) {
  const { start = "top bottom", end = "bottom top" } = options;

  useEffect(() => {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;

    const ctx = gsap.context(() => {
      els.forEach((el) => {
        gsap.to(el, {
          y: () => `${(speed - 1) * 100}%`,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub: 1,
          },
        });
      });
    });

    return () => ctx.revert();
  }, [selector]);
}

/**
 * Inicializa parallax de fundo com ScrollTrigger
 */
export function useBgParallax(
  containerRef: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const layers = el.querySelectorAll("[data-parallax-layer]");
      layers.forEach((layer) => {
        const speed = parseFloat(layer.getAttribute("data-speed") || "0.3");
        gsap.to(layer, {
          y: () => `${(speed - 1) * 200}%`,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      });
    });

    return () => ctx.revert();
  }, [containerRef]);
}

/**
 * useGsapTimeline — animação sequencial com timeline
 */
export function useGsapTimeline(
  play: boolean,
  build: (tl: gsap.core.Timeline) => void
) {
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!play) return;
    const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.out" } });
    tlRef.current = tl;
    build(tl);
    return () => {
      tl.kill();
      tlRef.current = null;
    };
  }, [play]);
}

/**
 * useGsapTo — animação única e simples estilo `animate={{}}`
 */
export function useGsapTo(
  selector: string,
  vars: gsap.TweenVars,
  deps: any[] = []
) {
  useEffect(() => {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;
    const ctx = gsap.context(() => gsap.to(els, vars));
    return () => ctx.revert();
  }, deps);
}

/**
 * useGsapFrom — animação de entrada estilo `initial={{}} animate={{}}`
 */
export function useGsapFrom(
  selector: string,
  fromVars: gsap.TweenVars,
  toVars?: gsap.TweenVars,
  deps: any[] = []
) {
  useEffect(() => {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;
    const ctx = gsap.context(() => {
      if (toVars) {
        gsap.fromTo(els, fromVars, toVars);
      } else {
        gsap.from(els, fromVars);
      }
    });
    return () => ctx.revert();
  }, deps);
}

export { gsap, ScrollTrigger };
