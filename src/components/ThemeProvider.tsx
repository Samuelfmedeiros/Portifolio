"use client";

import { createContext, useContext, useState, useLayoutEffect, useCallback, useEffect, ReactNode } from "react";
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
  // Fix #418 (hydration mismatch — mesmo padrão da issue #44):
  // estado inicial SEMPRE "dark"/DEFAULT_PALETTE — determinístico, idêntico no
  // server e no 1º render do client → hidratação consistente.
  // O tema/paleta reais (localStorage + system) são lidos no useLayoutEffect
  // abaixo, que roda ANTES do paint (sem flash, sem mismatch).
  const [theme, setThemeState] = useState<Theme>("dark");
  const [palette, setPaletteState] = useState<string>(DEFAULT_PALETTE);

  // Lê o tema/paleta reais pós-hydration, síncrono antes do paint (sem FOUC).
  // Substitui o estado inicial do getInitialTheme/getInitialPalette que
  // divergia server ("dark") vs client (localStorage/system) → React #418.
  useLayoutEffect(() => {
    const initialTheme = getInitialTheme();
    const initialPalette = getInitialPalette();
    setThemeState(initialTheme);
    setPaletteState(initialPalette);
    setThemeClass(initialTheme);
    applyPaletteToDoc(initialPalette, initialTheme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-apply palette when theme changes
  useLayoutEffect(() => {
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

  const toggle = useCallback(
    (e?: { clientX?: number; clientY?: number }) => {
      const next = theme === "dark" ? "light" : "dark";

      // View Transition API — clip-path circular a partir do clique (GPU compositor).
      // Restaurada 25/08/2026 com guarda de prefers-reduced-motion (a11y WCAG 2.3.3)
      // + fallback pra troca direta em browsers sem suporte.
      const apply = () => {
        setTheme(next);
        if (typeof window !== "undefined" && window.umami?.track) {
          window.umami.track("theme_toggle", { theme: next });
        }
      };

      const reducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (
        typeof document !== "undefined" &&
        document.startViewTransition &&
        !reducedMotion
      ) {
        const x = e?.clientX ?? window.innerWidth / 2;
        const y = e?.clientY ?? window.innerHeight / 2;
        const t = document.startViewTransition(apply);
        t.ready.then(() => {
          const r = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
          );
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${r}px at ${x}px ${y}px)`,
              ],
            },
            {
              // 400ms — rápida mas fluida. < 400ms fica seco, > 600ms arrasta.
              duration: 400,
              easing: "cubic-bezier(0.65, 0, 0.35, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        });
      } else {
        apply();
      }
    },
    [theme, setTheme]
  );

  // Test hook: E2Es podem disparar a troca sem depender de hidratação.
  useEffect(() => {
    (window as unknown as { __pfThemeToggle?: typeof toggle }).__pfThemeToggle =
      toggle;
    return () => {
      delete (window as unknown as { __pfThemeToggle?: typeof toggle })
        .__pfThemeToggle;
    };
  }, [toggle]);

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
