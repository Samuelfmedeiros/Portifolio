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
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "#000",
        animation: "splashFade 0.6s ease-out forwards",
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
