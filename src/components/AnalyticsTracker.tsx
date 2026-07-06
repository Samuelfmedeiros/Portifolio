"use client";

import { useEffect } from "react";

export function AnalyticsTracker() {
  useEffect(() => {
    // Page view tracking via Umami (configured in layout)
    // Legacy Supabase RPC removed — using Umami analytics instead
    const path = window.location.pathname;
    if (path && typeof window !== "undefined" && (window as any).umami) {
      (window as any).umami.track?.({ url: path });
    }
  }, []);

  return null;
}
