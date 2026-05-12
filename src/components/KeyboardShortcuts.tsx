"use client";

import { useEffect, useState } from "react";
import { X, Command } from "lucide-react";

interface Shortcut {
  key: string;
  description: string;
  action: string;
}

const SHORTCUTS: Shortcut[] = [
  { key: "G", description: "GitHub", action: "GitHub" },
  { key: "T", description: "Terminal", action: "Terminal" },
  { key: "P", description: "Projetos", action: "Projects" },
  { key: "C", description: "Contato", action: "Contact" },
  { key: "?", description: "Atalhos", action: "Help" },
  { key: "Esc", description: "Fechar", action: "Close" },
];

export function KeyboardShortcuts() {
  const [showHints, setShowHints] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      )
        return;

      switch (e.key) {
        case "g":
        case "G":
          window.location.href = "#ferramentas";
          break;
        case "t":
        case "T":
          window.location.href = "#terminal";
          break;
        case "p":
        case "P":
          window.location.href = "#projects";
          break;
        case "c":
        case "C":
          window.location.href = "#contact";
          break;
        case "?":
          e.preventDefault();
          setShowHints((prev) => !prev);
          break;
        case "Escape":
          setShowHints(false);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Show keyboard shortcut hints bar for mobile
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Desktop hint - small text at bottom */}
      <div
        className="fixed bottom-4 right-4 z-40 hidden md:flex items-center gap-2 opacity-0 animate-[fadeIn_0.5s_ease_forwards]"
        aria-hidden="true"
      >
        <Command className="w-3 h-3 text-[var(--text-secondary)]" />
        <span className="text-[10px] font-mono text-[var(--text-secondary)]">
          ? = atalhos
        </span>
      </div>

      {/* Mobile shortcuts bar */}
      <div
        className={`fixed bottom-16 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <button
          onClick={() => setShowHints((prev) => !prev)}
          className="glass border border-[var(--border)] rounded-full px-4 py-2 flex items-center gap-2 hover:border-[var(--accent)] transition-colors"
          aria-label="Ver atalhos de teclado"
        >
          <Command className="w-4 h-4 text-[var(--accent)]" />
          <span className="text-xs font-mono text-[var(--text-secondary)]">
            Atalhos
          </span>
        </button>
      </div>

      {/* Shortcuts overlay */}
      {showHints && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowHints(false)}
          role="dialog"
          aria-label="Atalhos de teclado"
          aria-modal="true"
        >
          <div
            className="glass border border-[var(--border)] rounded-xl p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-sm text-[var(--accent)]">
                ▸ ATAZHOS
              </h3>
              <button
                onClick={() => setShowHints(false)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {SHORTCUTS.map((s) => (
                <div
                  key={s.key}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-[var(--border)]/30"
                >
                  <kbd className="w-6 h-6 flex items-center justify-center rounded bg-[var(--accent)] text-[var(--bg-primary)] text-xs font-mono font-bold">
                    {s.key}
                  </kbd>
                  <span className="text-xs font-mono text-[var(--text-secondary)]">
                    {s.description}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[10px] font-mono text-[var(--text-secondary)]/50 text-center mt-4">
              Pressione uma tecla para navegar
            </p>
          </div>
        </div>
      )}
    </>
  );
}