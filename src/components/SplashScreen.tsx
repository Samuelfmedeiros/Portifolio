"use client";

import { useState, useEffect, useRef } from "react";

const TOTAL_DURATION = 600;

interface Props {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: Props) {
  const [show, setShow] = useState(true);
  const doneRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        setShow(false);
        setTimeout(() => onCompleteRef.current(), 80);
      }
    }, TOTAL_DURATION);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      style={{
        background: "#000",
        animation: "mc-splash-fade 0.6s ease-out forwards",
      }}
    >
      {/* Grid repeating-linear-gradient (GPU acelerado) */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.15,
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(34,211,238,0.25) 39px, rgba(34,211,238,0.25) 40px),
                            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(34,211,238,0.25) 39px, rgba(34,211,238,0.25) 40px)`,
        }}
      />

      <style>{`
        @keyframes mc-splash-fade {
          0%   { opacity: 0; }
          15%  { opacity: 1; }
          70%  { opacity: 0.7; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
