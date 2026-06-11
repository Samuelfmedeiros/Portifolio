"use client";

import { useState, useEffect, useCallback } from "react";
import { SplashScreen } from "./SplashScreen";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [portalEmerge, setPortalEmerge] = useState(false);

  useEffect(() => {
    const visited = sessionStorage.getItem("visited");
    if (visited) {
      setIsLoading(false);
      setPortalEmerge(true);
    }
  }, []);

  const handleComplete = useCallback(() => {
    sessionStorage.setItem("visited", "true");
    setIsLoading(false);
  }, []);

  const handlePortalOpen = useCallback(() => {
    setPortalEmerge(true);
  }, []);

  return (
    <>
      {isLoading && (
        <SplashScreen
          onComplete={handleComplete}
          onPortalOpen={handlePortalOpen}
        />
      )}

      {/* Children render at all times — emerge animation starts when portal opens */}
      <div
        className={portalEmerge ? "portal-emerge" : ""}
        style={{
          opacity: portalEmerge ? undefined : 0,
          transform: portalEmerge ? undefined : "scale(0.85)",
          filter: portalEmerge ? undefined : "blur(6px)",
        }}
      >
        {children}
      </div>

      <style>{`
        .portal-emerge {
          animation: portal-fade-in 0.3s ease-out forwards;
        }
        .portal-emerge > *:nth-child(1) {
          animation: emerge-item 1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
        }
        .portal-emerge > *:nth-child(2) {
          animation: emerge-item 1s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both;
        }
        .portal-emerge > *:nth-child(3) {
          animation: emerge-item 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
        }
        .portal-emerge > *:nth-child(4) {
          animation: emerge-item 1s cubic-bezier(0.16, 1, 0.3, 1) 0.55s both;
        }
        .portal-emerge > *:nth-child(5) {
          animation: emerge-item 1s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both;
        }
        .portal-emerge > *:nth-child(n+6) {
          animation: emerge-item 1s cubic-bezier(0.16, 1, 0.3, 1) 0.85s both;
        }

        @keyframes portal-fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes emerge-item {
          0% {
            opacity: 0;
            transform: scale(0.85) translateY(15px);
            filter: blur(6px);
          }
          50% {
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
        }
      `}</style>
    </>
  );
}
