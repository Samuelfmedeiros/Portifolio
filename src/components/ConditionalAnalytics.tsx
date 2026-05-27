"use client";

import { useAnalyticsConsent } from "./CookieBanner";
import { AnalyticsTracker } from "./AnalyticsTracker";

export function ConditionalAnalytics() {
  const { consent } = useAnalyticsConsent();
  if (consent !== "accepted") return null;
  return <AnalyticsTracker />;
}
