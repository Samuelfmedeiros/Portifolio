"use client";

import { useEffect, useState, memo } from "react";
import { useLanguage } from "@/lib/i18n";

export const MissionClock = memo(function MissionClock() {
  const [time, setTime] = useState(new Date());
  const { t, locale } = useLanguage();
  const dateLocale = locale === "en" ? "en-US" : "pt-BR";

  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  const missionStart = new Date("2026-05-06T21:51:43Z");
  const elapsed = Math.floor((time.getTime() - missionStart.getTime()) / 1000);
  const days = Math.floor(elapsed / 86400);
  const hours = Math.floor((elapsed % 86400) / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  return (
    <div className="text-center py-4">
      <h3 className="font-mono text-sm text-[var(--accent)] mb-4">⏱ {t("mission.clock.title")}</h3>

      <div className="text-4xl font-mono tabular-nums text-[var(--text-primary)] mb-4">
        {time.toLocaleTimeString(dateLocale)}
      </div>

      <div className="text-xs font-mono text-[var(--text-secondary)]">
        {time.toLocaleDateString(dateLocale, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
      </div>

      <div className="mt-6 pt-4 border-t border-[var(--border)]">
        <p className="text-xs font-mono text-[var(--text-secondary)] mb-2">{t("mission.clock.mission")}</p>
        <div className="flex gap-4 justify-center font-mono tabular-nums text-sm">
          <div>
            <span className="text-[var(--accent)]">{String(days).padStart(2, "0")}</span>
            <span className="text-[var(--text-secondary)] text-xs ml-1">d</span>
          </div>
          <div>
            <span className="text-[var(--accent)]">{String(hours).padStart(2, "0")}</span>
            <span className="text-[var(--text-secondary)] text-xs ml-1">h</span>
          </div>
          <div>
            <span className="text-[var(--accent)]">{String(minutes).padStart(2, "0")}</span>
            <span className="text-[var(--text-secondary)] text-xs ml-1">m</span>
          </div>
          <div>
            <span className="text-[var(--accent)]">{String(seconds).padStart(2, "0")}</span>
            <span className="text-[var(--text-secondary)] text-xs ml-1">s</span>
          </div>
        </div>
      </div>
    </div>
  );
});
