"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="glass p-2 rounded-full transition-all hover:scale-110"
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-[var(--accent)]" />
      ) : (
        <Moon className="w-5 h-5 text-[var(--accent)]" />
      )}
    </button>
  );
}
