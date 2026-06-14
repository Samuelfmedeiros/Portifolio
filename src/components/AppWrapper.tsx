"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { SplashScreen } from "./SplashScreen";

function shouldShowSplashOnClient(): boolean {
  const envVal = process.env.NEXT_PUBLIC_ENABLE_SPLASH;
  if (envVal === "false") return false;
  if (envVal === "true") return true;
  if (typeof window !== "undefined" && window.location.hostname.endsWith(".vercel.app")) return false;
  return true;
}

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const readyRef = useRef(false);

  // Após hydration, decide: splash ou conteúdo direto
  useEffect(() => {
    const visited = sessionStorage.getItem("visited");
    if (!shouldShowSplashOnClient() || visited) {
      setShowSplash(false);
      setShowContent(true);
    }
    // Senão: splash fica visível, conteúdo espera handleComplete
  }, []);

  // Safety timeout — evita splash infinito
  useEffect(() => {
    if (!showSplash || showContent) return;
    const t = setTimeout(() => {
      if (!readyRef.current) {
        readyRef.current = true;
        sessionStorage.setItem("visited", "true");
        setShowSplash(false);
        setShowContent(true);
      }
    }, 5000);
    return () => clearTimeout(t);
  }, [showSplash, showContent]);

  const handleComplete = useCallback(() => {
    if (readyRef.current) return;
    readyRef.current = true;
    sessionStorage.setItem("visited", "true");
    setShowSplash(false);
    setShowContent(true);
  }, []);

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleComplete} />}
      {showContent && children}
    </>
  );
}
