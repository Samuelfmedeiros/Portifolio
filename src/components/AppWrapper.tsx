"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { SplashScreen } from "./SplashScreen";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    const visited = sessionStorage.getItem("visited");
    if (visited) {
      setIsLoading(false);
    }
  }, []);

  const handleComplete = () => {
    sessionStorage.setItem("visited", "true");
    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && <SplashScreen onComplete={handleComplete} />}
      </AnimatePresence>
      {children}
    </>
  );
}