"use client";

import { useEffect } from "react";

/**
 * ScrollRestoration — previne scroll jump durante navegação SPA.
 * Substitui o inline script no <head> que causava hydration error #418.
 */
export function ScrollRestoration() {
  useEffect(() => {
    try {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    } catch {
      // seguro falhar silenciosamente
    }
  }, []);

  return null;
}
