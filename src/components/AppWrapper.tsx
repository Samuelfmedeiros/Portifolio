"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { SplashScreen } from "./SplashScreen";

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
  const [hydrated, setHydrated] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const readyRef = useRef(false);

  // Marca hidratação completa (padrão React para hydration)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  // Se já visitou antes, pula splash direto (sem setState síncrono em efeito)
  const skipSplash = hydrated && !shouldShowSplash();
  const alreadyVisited = hydrated && sessionStorage.getItem("visited");
  const showSplash = hydrated ? !skipSplash && !alreadyVisited && !splashDone : true;

  // Safety timeout
  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => {
      if (!readyRef.current) {
        readyRef.current = true;
        setSplashDone(true);
      }
    }, 4000);
    return () => clearTimeout(t);
  }, [hydrated]);

  const handleComplete = useCallback(() => {
    if (readyRef.current) return;
    readyRef.current = true;
    sessionStorage.setItem("visited", "true");
    setTimeout(() => setSplashDone(true), 100);
  }, []);

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleComplete} />}
      {children}
    </>
  );
}
