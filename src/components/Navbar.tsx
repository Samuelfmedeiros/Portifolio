"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, FolderKanban, Gamepad2, Radio, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const NAV_ITEMS = [
  { href: "#projects", label: "Hangar", icon: FolderKanban, id: "nav-projects" },
  { href: "#terminal", label: "Terminal", icon: Terminal, id: "nav-terminal" },
  { href: "#utility", label: "Deck", icon: Gamepad2, id: "nav-utility" },
  { href: "#contact", label: "TX", icon: Radio, id: "nav-contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center group-hover:shadow-[0_0_12px_var(--accent)] transition-shadow">
              <span className="text-black font-bold text-sm">MC</span>
            </div>
            <span className="font-mono text-sm tracking-wider hud-text text-[var(--accent)] hidden sm:inline">
              MISSION CONTROL
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="nav-link text-sm font-mono text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors flex items-center gap-1.5"
              >
                <item.icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </a>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="glass p-2 rounded-lg transition-all"
              aria-label="Toggle menu"
            >
              {open ? (
                <X className="w-5 h-5 text-[var(--accent)]" />
              ) : (
                <Menu className="w-5 h-5 text-[var(--accent)]" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer + backdrop */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-50 h-full w-72 glass border-l border-[var(--border)] md:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center">
                    <span className="text-black font-bold text-[10px]">MC</span>
                  </div>
                  <span className="font-mono text-xs text-[var(--accent)] hud-text">
                    NAV.SYS
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="glass p-1.5 rounded-lg"
                >
                  <X className="w-4 h-4 text-[var(--accent)]" />
                </button>
              </div>

              {/* Scanline decoration */}
              <div className="h-px bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" />

              {/* Nav items */}
              <div className="p-4 flex flex-col gap-1">
                {NAV_ITEMS.map((item, i) => (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    <span className="ml-auto text-[10px] text-[var(--text-secondary)]/50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </motion.a>
                ))}
              </div>

              {/* Drawer footer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border)]">
                <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--text-secondary)]/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span>SYS:ONLINE</span>
                  <span className="ml-auto">v1.0</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
