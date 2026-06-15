// ═══════════════════════════════════════════════════════════════
// useAnalytics — hook tipado para eventos do Umami
// Centraliza todos os eventos de analytics do Portifolio Samuel
// Chama window.umami.track() com segurança (só client-side)
// ═══════════════════════════════════════════════════════════════

"use client";

import { useCallback } from "react";

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, unknown>) => void;
    };
  }
}

/** Viewport/seção que o usuário visualizou */
export type SectionName =
  | "profile"
  | "skills"
  | "about"
  | "projects"
  | "games"
  | "contact"
  | "footer";

/** Eventos do Portifolio Samuel */
export type AnalyticsEvent =
  | { type: "section_view"; section: SectionName }
  | { type: "project_click"; project: string }
  | { type: "project_filter"; filter: string }
  | { type: "contact_submit" }
  | { type: "contact_error"; error: string }
  | { type: "skill_view"; skill: string }
  | { type: "external_link"; url: string; label: string }
  | { type: "theme_toggle"; theme: "dark" | "light" }
  | { type: "game_play"; game: string }
  | { type: "keyboard_shortcut"; key: string }
  | { type: "nav_click"; section: SectionName }
  | { type: "back_to_top" }
  | { type: "cursor_magnet"; target: string };

const EVENT_NAMES: Record<AnalyticsEvent["type"], string> = {
  section_view: "section_view",
  project_click: "project_click",
  project_filter: "project_filter",
  contact_submit: "contact_submit",
  contact_error: "contact_error",
  skill_view: "skill_view",
  external_link: "external_link",
  theme_toggle: "theme_toggle",
  game_play: "game_play",
  keyboard_shortcut: "keyboard_shortcut",
  nav_click: "nav_click",
  back_to_top: "back_to_top",
  cursor_magnet: "cursor_magnet",
};

function sendEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  if (!window.umami?.track) {
    // Umami tracker not loaded yet — silently ignore
    return;
  }
  const name = EVENT_NAMES[event.type];
  const { type: _, ...data } = event;
  window.umami.track(name, data);
}

export function useAnalytics() {
  const track = useCallback((event: AnalyticsEvent) => {
    sendEvent(event);
  }, []);

  return { track };
}
