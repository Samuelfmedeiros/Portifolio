"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * LazySection — adia a montagem do filho até a seção ficar perto da viewport.
 * Padrão oficial de lazy-hydration abaixo do fold: o dynamic import só dispara
 * quando o usuário rola até o componente (reduz TBT/bootup do load inicial).
 *
 * Samuel 12/08/2026 — bloco perf: GameShowcase/BlogSection/ContactForm não são
 * LCP e não precisam hidratar junto com o hero. fallback mantém altura → CLS 0.
 */
export function LazySection({
  children,
  fallback,
  rootMargin = "400px",
  className,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // SSR/primeiro render: se já estiver na viewport, monta imediato
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 400) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className}>
      {visible ? children : fallback}
    </div>
  );
}
