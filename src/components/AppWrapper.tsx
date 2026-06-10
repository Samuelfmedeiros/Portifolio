"use client";

import { useState, useEffect } from "react";
import { SplashScreen } from "./SplashScreen";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

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
      {isLoading && <SplashScreen onComplete={handleComplete} />}
      <div style={{ display: isLoading ? "none" : undefined }}>{children}</div>
    </>
  );
}