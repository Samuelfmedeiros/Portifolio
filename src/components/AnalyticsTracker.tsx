"use client";

import { useEffect } from "react";

/**
 * Tracks page views via Umami.
 * Note: Umami auto-tracks page views by default; this is an extra explicit call.
 */
export function AnalyticsTracker() {
  useEffect(() => {
    const path = window.location.pathname;
    if (path && window.umami?.track) {
      // Umami standard API: track(eventName, data?)
      window.umami.track("page_view", { url: path });
    }
  }, []);

  return null;
}
