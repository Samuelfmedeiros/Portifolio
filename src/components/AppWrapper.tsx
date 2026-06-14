"use client";

import { useState, useCallback, useEffect } from "react";
import { SplashScreen } from "./SplashScreen";

/**
 * Decides whether to show the splash:
 * 1. Env var override (NEXT_PUBLIC_ENABLE_SPLASH) — for manual control
 * 2. Auto-detect: skip splash on Vercel production domains
 * 3. Default: true (splash shows on localhost, staging, etc.)
 *
 * Runs at module level: safe for SSR (returns true when window is undefined).
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

  // Safety timeout: força exibição do conteúdo após 5s
  useEffect(() => {
    const t = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setShowSplash(false);
      }
    }, 5000);
    return () => clearTimeout(t);
  }, [isLoading]);

  // Run once on mount
  useEffect(() => {
    const show = shouldShowSplash();
    setShowSplash(show);
    if (!show) {
      setIsLoading(false);
    } else if (sessionStorage.getItem("visited")) {
      setIsLoading(false);
    }
  }, []);

  const handleComplete = useCallback(() => {
    sessionStorage.setItem("visited", "true");
    setIsLoading(false);
  }, []);

  return (
    <>
      {showSplash && isLoading && (
        <SplashScreen onComplete={handleComplete} />
      )}

      {/* Content fade-in */}
      <div
        style={{
          opacity: isLoading ? 0 : undefined,
          transition: "opacity 0.5s ease-in",
        }}
      >
        {children}
      </div>
    </>
  );
}
