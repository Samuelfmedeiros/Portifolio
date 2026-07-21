"use client";

import { useState, useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { PalettePicker } from "./PalettePicker";
import { useLanguage } from "@/lib/i18n";

const NAV_ITEMS = [
  { href: "#profile", key: "nav.home", icon: "🚀" },
  { href: "#jornada", key: "nav.journey", icon: "📜" },
  { href: "#projects", key: "nav.projects", icon: "📂" },
  { href: "#games", key: "nav.games", icon: "🎮" },
  { href: "#contact", key: "nav.contact", icon: "📬" },
];

import { useAnalytics } from "@/hooks/useAnalytics";
import type { SectionName } from "@/hooks/useAnalytics";

export const Navbar = memo(function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const scrollRef = useRef<HTMLUListElement>(null);
  const { track } = useAnalytics();
  const { t } = useLanguage();

  const rafRef = useRef<number | null>(null);

  // Scroll detection — requestAnimationFrame throttle
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);
        rafRef.current = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // IntersectionObserver — robust cleanup with Set
  useEffect(() => {
    const ids = NAV_ITEMS.map((i) => i.href.replace("#", ""));
    let alive = true;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!alive) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { threshold: 0.3 }
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => {
      alive = false;
      observer.disconnect();
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (href === "#hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
      track({ type: "nav_click" as const, section: href.replace("#", "") as SectionName });
    }
  };

  const activeId = activeSection;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--border)] shadow-lg shadow-[var(--shadow)]"
          : "bg-[var(--bg-primary)]/60 backdrop-blur-sm border-b border-[var(--border)]/30"
      }`}
      role="navigation"
      aria-label={t("nav.aria.main")}
    >
      <div className="max-w-7xl mx-auto px-3 md:px-6">
        <div className="flex items-center justify-between h-14 md:h-16">

          {/* Logo */}
          <motion.a
            href="#hero"
            onClick={(e) => handleNavClick(e, "#hero")}
            className="font-mono text-xs sm:text-sm md:text-base tracking-wider text-[var(--accent)] hover:text-[var(--text-primary)] transition-colors shrink-0"
            whileHover={{ scale: 1.02 }}
          >
            <span className="hidden sm:inline">Samuel Medeiros</span>
            <span className="sm:hidden">SM</span>
          </motion.a>

          {/* Desktop Nav — horizontal with glass effect */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeId === item.href.replace("#", "");
              return (
                <li key={item.href}>
                  <motion.a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all block ${
                      isActive
                        ? "text-[var(--accent)] bg-[var(--accent)]/10"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]/20"
                    }`}
                    whileHover={{ y: -1 }}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {t(item.key)}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[var(--accent)] rounded-full"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.a>
                </li>
              );
            })}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <a
              href="https://github.com/Samuelfmedeiros"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="GitHub"
              onClick={() => track({ type: "external_link", url: "github-nav", label: "GitHub Nav" })}
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <PalettePicker />
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Nav — horizontal scrollable, NO hamburger */}
        <ul
          ref={scrollRef}
          className="lg:hidden flex items-center gap-0.5 overflow-x-auto hide-scrollbar pb-2 -mx-2 px-2 snap-x snap-mandatory"
          aria-label={t("nav.aria.mobile")}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.href.replace("#", "");
            return (
              <li key={item.href} className="shrink-0 snap-start">
                <motion.a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/30"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent"
                  }`}
                  whileTap={{ scale: 0.95 }}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className="text-xs">{item.icon}</span>
                  <span className="sm:inline">{t(item.key)}</span>
                  {isActive && (
                    <motion.div
                      className="w-1 h-1 rounded-full bg-[var(--accent)]"
                      layoutId="mobile-active-dot"
                    />
                  )}
                </motion.a>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.nav>
  );
});
