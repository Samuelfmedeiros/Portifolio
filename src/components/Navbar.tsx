"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FolderKanban, Terminal, Gamepad2, Radio } from "lucide-react";
import { Github, Linkedin, Mail } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const NAV_ITEMS = [
  { href: "#about", label: "Sobre", icon: null, id: "nav-about" },
  { href: "#projects", label: "Projetos", icon: FolderKanban, id: "nav-projects" },
  { href: "#terminal", label: "Terminal", icon: Terminal, id: "nav-terminal" },
  { href: "#contact", label: "Contato", icon: Radio, id: "nav-contact" },
];

export function Navbar() {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center group-hover:shadow-[0_0_12px_var(--accent)] transition-shadow">
              <span className="text-[var(--bg-primary)] font-bold text-sm">SM</span>
            </div>
            <span className="font-mono text-sm tracking-wider text-[var(--accent)] hidden sm:inline">
              Samuel Medeiros
            </span>
          </Link>

          {/* Desktop links */}
          <div className="flex items-center gap-4 md:gap-6" role="navigation" aria-label="Navegação principal">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="text-sm font-mono text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
              >
                {item.label}
              </a>
            ))}
            <ThemeToggle />
            <div className="hidden md:flex items-center gap-3 ml-4 pl-4 border-l border-[var(--border)]">
              <a href="https://github.com/Samuelfmedeiros" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com/in/samuelfmedeiros" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="mailto:samuelandrademedeiros@gmail.com" aria-label="Email" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Mobile: theme toggle only */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </>
  );
}