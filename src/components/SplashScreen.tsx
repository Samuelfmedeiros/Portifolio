"use client";

import { useEffect, useRef } from "react";

const TOTAL_DURATION = 1200;

interface Props {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: Props) {
  const doneRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        onComplete();
      }
    }, TOTAL_DURATION);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "#000",
        animation: `splashFade ${TOTAL_DURATION}ms ease-out forwards`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.12,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(34,211,238,0.3) 39px, rgba(34,211,238,0.3) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(34,211,238,0.3) 39px, rgba(34,211,238,0.3) 40px)",
        }}
      />
    </div>
  );
}
