"use client";

import { useMemo } from "react";

export type DeviceTier = "low" | "mid" | "high";

export function useDeviceTier(): DeviceTier {
  return useMemo(() => {
    if (typeof window === "undefined") return "high";
    const cpus = navigator.hardwareConcurrency || 4;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (isMobile || cpus <= 4) return "low";
    if (cpus <= 6) return "mid";
    return "high";
  }, []);
}
