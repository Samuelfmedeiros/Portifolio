"use client";

import Link from "next/link";
import { Terminal, FolderKanban, Gamepad2, Radio } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center">
            <span className="text-black font-bold text-sm">MC</span>
          </div>
          <span className="font-mono text-sm tracking-wider hud-text text-[var(--accent)]">
            MISSION CONTROL
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <a href="#projects" className="nav-link text-sm font-mono text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors flex items-center gap-1">
            <FolderKanban className="w-3 h-3" /> Hangar
          </a>
          <a href="#terminal" className="nav-link text-sm font-mono text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors flex items-center gap-1">
            <Terminal className="w-3 h-3" /> Terminal
          </a>
          <a href="#utility" className="nav-link text-sm font-mono text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors flex items-center gap-1">
            <Gamepad2 className="w-3 h-3" /> Deck
          </a>
          <a href="#contact" className="nav-link text-sm font-mono text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors flex items-center gap-1">
            <Radio className="w-3 h-3" /> Transmissão
          </a>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
