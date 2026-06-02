"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CONFIG, canShowAds } from "@/lib/monetization";
import { useMonetizationConsent } from "./MonetizationProvider";

/**
 * Google AdSense component.
 * - Only renders if ADSENSE_CONFIG.enabled (client ID set)
 * - Only shows ads if user gave consent (non-personalized or personalized)
 * - Loads AdSense script once per page
 * - Falls back to non-personalized ads if no personalized consent
 * - Graceful no-op if no consent or no config
 */
export function AdSense({
  slot,
  format = "auto",
  className = "",
  style,
}: {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical" | "fluid";
  className?: string;
  style?: React.CSSProperties;
}) {
  const insRef = useRef<HTMLModElement>(null);
  const { consent } = useMonetizationConsent();
  const adsAllowed = canShowAds(consent);

  // Load AdSense script once per page
  useEffect(() => {
    if (!ADSENSE_CONFIG.enabled || !adsAllowed) return;

    const existingScript = document.querySelector(
      'script[src*="pagead2.googlesyndication.com"]'
    );
    if (existingScript) return;

    const script = document.createElement("script");
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.clientId}`;
    script.async = true;
    script.crossOrigin = "anonymous";
    // Non-personalized ads if no personalized consent
    if (consent && !consent.ads) {
      script.setAttribute("data-ad-frequency-type", "non-personalized");
    }
    document.head.appendChild(script);

    return () => {
      // Cleanup: remove script on unmount (rare edge case)
      try {
        document.head.removeChild(script);
      } catch {
        // already removed
      }
    };
  }, [adsAllowed, consent]);

  // Push ad to AdSense queue after ins element is rendered
  useEffect(() => {
    if (!adsAllowed || !slot || !ADSENSE_CONFIG.enabled) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const adsbygoogle = (window as any).adsbygoogle || [];
      // Avoid double-push
      const alreadyPushed = insRef.current?.getAttribute("data-adsbygoogle-status");
      if (!alreadyPushed) {
        adsbygoogle.push({});
      }
    } catch {
      // AdSense not loaded yet — silently skip
    }
  }, [adsAllowed, slot]);

  // Don't render if no consent or no config
  if (!ADSENSE_CONFIG.enabled || !adsAllowed || !slot) return null;

  return (
    <div
      className={`ad-container ${className}`}
      style={style}
      aria-label="Anúncio"
      role="complementary"
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", minHeight: "60px", ...style }}
        data-ad-client={ADSENSE_CONFIG.clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      {/* Fallback if ad doesn't load — invisible, no layout shift */}
      <noscript>
        <p className="text-[9px] font-mono text-[var(--text-secondary)]/30 text-center">
          Anúncio
        </p>
      </noscript>
    </div>
  );
}
