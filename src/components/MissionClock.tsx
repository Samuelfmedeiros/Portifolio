"use client";

import { useEffect, useState, memo } from "react";

export const MissionClock = memo(function MissionClock() {
  // Hydration-safe (#418): server e client renderizam o MESMO placeholder no 1º
  // paint. Antes, useState(new Date()) fazia o server mostrar a hora do BUILD e
  // o client a hora do ACESSO → React error #418 em todo carregamento.
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const tick = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  const missionStart = new Date("2026-05-06T21:51:43Z");
  const elapsed = time
    ? Math.floor((time.getTime() - missionStart.getTime()) / 1000)
    : null;
  const days = elapsed !== null ? Math.floor(elapsed / 86400) : 0;
  const hours = elapsed !== null ? Math.floor((elapsed % 86400) / 3600) : 0;
  const minutes = elapsed !== null ? Math.floor((elapsed % 3600) / 60) : 0;
  const seconds = elapsed !== null ? elapsed % 60 : 0;

  return (
    <div className="text-center py-4">
      <h3 className="font-mono text-sm text-[var(--accent)] mb-4">⏱ RELÓGIO DE MISSÃO</h3>

      <div className="text-4xl font-mono tabular-nums text-[var(--text-primary)] mb-4">
        {time ? time.toLocaleTimeString("pt-BR") : "--:--:--"}
      </div>

      <div className="text-xs font-mono text-[var(--text-secondary)]">
        {time
          ? time.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
          : "\u00A0"}
      </div>

      <div className="mt-6 pt-4 border-t border-[var(--border)]">
        <p className="text-xs font-mono text-[var(--text-secondary)] mb-2">TEMPO DE MISSÃO</p>
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
