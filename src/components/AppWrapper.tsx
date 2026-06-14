"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { SplashScreen } from "./SplashScreen";

/**
 * Decides whether to show the splash:
 * 1. Env var override (NEXT_PUBLIC_ENABLE_SPLASH) — for manual control
 * 2. Auto-detect: skip splash on Vercel production domains
 * 3. Default: true (splash shows on localhost, staging, etc.)
 */
function shouldShowSplash(): boolean {
  const envVal = process.env.NEXT_PUBLIC_ENABLE_SPLASH;
  if (envVal === "false") return false;
  if (envVal === "true") return true;
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host.endsWith(".vercel.app")) return false;
  }
  return true;
}

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);
  const readyRef = useRef(false);

  // Safety timeout
  useEffect(() => {
    const t = setTimeout(() => {
      if (!readyRef.current) {
        readyRef.current = true;
        setIsLoading(false);
        setShowSplash(false);
        setContentReady(true);
      }
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  // Run once on mount
  useEffect(() => {
    const show = shouldShowSplash();
    setShowSplash(show);
    if (!show) {
      setIsLoading(false);
      setContentReady(true);
    } else if (sessionStorage.getItem("visited")) {
      setIsLoading(false);
      setContentReady(true);
    }
  }, []);

  const handleComplete = useCallback(() => {
    if (readyRef.current) return;
    readyRef.current = true;
    sessionStorage.setItem("visited", "true");
    setIsLoading(false);
    // Brief delay to let exit animation play before revealing content
    setTimeout(() => setContentReady(true), 200);
  }, []);

  return (
    <>
      {showSplash && isLoading && (
        <SplashScreen onComplete={handleComplete} />
      )}

      {/* Content: opacity transition + will-change pra GPU */}
      <div
        style={{
          opacity: contentReady ? 1 : 0,
          transition: "opacity 0.4s ease-out",
          willChange: contentReady ? "auto" : "opacity",
        }}
      >
        {children}
      </div>
    </>
  );
}
