"use client";

/**
 * Mantido como ponto de extensao, mas sem efeito: o engajamento foi movido
 * para ConditionalAnalytics para nao depender do banner de consentimento.
 * O OpenPanel e cookieless e ja carrega independentemente — medido 26/11/2026:
 * com o tracker detras do gate `consent === "accepted"`, zero eventos de
 * scroll_depth/section_time/ui_click chegavam ao ClickHouse em producao.
 */
export function AnalyticsTracker() {
  return null;
}
