"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import type { Theme } from "@/lib/types";
import { PALETTES, DEFAULT_PALETTE, STORAGE_PALETTE_KEY } from "@/lib/palettes";

const STORAGE_KEY = "mc-theme";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (saved === "light" || saved === "dark") return saved;
  return getSystemTheme();
}

function getInitialPalette(): string {
  if (typeof window === "undefined") return DEFAULT_PALETTE;
  return localStorage.getItem(STORAGE_PALETTE_KEY) || DEFAULT_PALETTE;
}

function applyPaletteToDoc(paletteId: string, theme: Theme) {
  const palette = PALETTES.find((p) => p.id === paletteId) || PALETTES[0];
  const accent = theme === "dark" ? palette.accentDark : palette.accentLight;
  const alt = theme === "dark" ? palette.altDark : palette.altLight;
  document.documentElement.style.setProperty("--accent", accent);
  document.documentElement.style.setProperty("--accent-alt", alt);
}

function setThemeClass(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("theme-dark", theme === "dark");
  root.classList.toggle("theme-light", theme === "light");
}

interface ThemeContextValue {
  theme: Theme;
  palette: string;
  toggle: () => void;
  setTheme: (t: Theme) => void;
  setPalette: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  palette: DEFAULT_PALETTE,
  toggle: () => {},
  setTheme: () => {},
  setPalette: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [palette, setPaletteState] = useState<string>(getInitialPalette);

  // Apply theme class + palette on mount
  useEffect(() => {
    setThemeClass(theme);
    applyPaletteToDoc(palette, theme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-apply palette when theme changes
  useEffect(() => {
    setThemeClass(theme);
    applyPaletteToDoc(palette, theme);
  }, [theme, palette]);

  // Sync with system preference changes
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const handler = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        const next = e.matches ? "light" : "dark";
        setThemeState(next);
      }
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const setPalette = useCallback((id: string) => {
    setPaletteState(id);
    localStorage.setItem(STORAGE_PALETTE_KEY, id);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, palette, toggle, setTheme, setPalette }}>
      {children}
    </ThemeContext.Provider>
  );
}
