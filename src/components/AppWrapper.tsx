"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { SplashScreen } from "./SplashScreen";

const SPLASH_MS = 1200;
const CONTENT_MOUNT_MS = 1000; // Monta conteúdo 200ms antes do splash acabar (crossfade)

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
  }, []);

  // Pré-monta conteúdo antes do splash acabar (crossfade)
  useEffect(() => {
    if (!showSplash || showContent) return;
    const t = setTimeout(() => {
      setShowContent(true);
    }, CONTENT_MOUNT_MS);
    return () => clearTimeout(t);
  }, [showSplash, showContent]);

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
    }, SPLASH_MS + 3000);
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
