"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { SplashScreen } from "./SplashScreen";

/** Preload images and wait for them to be ready */
function waitForContentImages(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const imgs = Array.from(document.images).filter((img) => !img.complete);
  if (imgs.length === 0) return Promise.resolve();
  return Promise.all(
    imgs.map(
      (img) =>
        new Promise<void>((res) => {
          const onDone = () => res();
          img.addEventListener("load", onDone, { once: true });
          img.addEventListener("error", onDone, { once: true });
          // Safety timeout — don't hold splash forever
          setTimeout(res, 3000);
        })
    )
  ).then(() => undefined);
}

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const completedRef = useRef(false);
  const contentReadyRef = useRef(false);

  useEffect(() => {
    const visited = sessionStorage.getItem("visited");
    if (visited) {
      setIsLoading(false);
    }
  }, []);

  const handleComplete = () => {
    // Guard: prevent rapid double-clicks from causing issues
    if (completedRef.current) return;
    completedRef.current = true;

    // If content images aren't loaded yet, extend splash by a small margin
    if (!contentReadyRef.current) {
      waitForContentImages().then(() => {
        contentReadyRef.current = true;
        sessionStorage.setItem("visited", "true");
        setIsLoading(false);
      });
      return;
    }
    sessionStorage.setItem("visited", "true");
    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <SplashScreen key="splash" onComplete={handleComplete} />}
      </AnimatePresence>

      {/* Render children always, but hide them behind splash via z-index stacking */}
      <div
        style={{
          // Splash is z-[9999], children sit below it until splash unmounts
          position: "relative",
          zIndex: 1,
          opacity: isLoading ? 0 : 1,
          transform: isLoading ? "scale(0.97)" : "scale(1)",
          transition: "opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.15s, transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.15s",
          willChange: "opacity, transform",
        }}
      >
        {children}
      </div>
    </>
  );
}
