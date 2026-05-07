"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function AnalyticsTracker() {
  useEffect(() => {
    if (!supabase) return;
    const path = window.location.pathname;
    supabase.rpc("increment_page_view", { page: path }).then(({ error }) => {
      if (error) console.debug("Analytics:", error.message);
    });
  }, []);

  return null;
}
