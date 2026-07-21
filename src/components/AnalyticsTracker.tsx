"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    umami?: {
      track: (data: { url?: string; type?: string; label?: string; [key: string]: unknown }) => void;
    };
  }
}

export function AnalyticsTracker() {
  useEffect(() => {
    const path = window.location.pathname;
    if (path && window.umami) {
      window.umami.track?.({ url: path });
    }
  }, []);

  return null;
}
