"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { GlassCard } from "./GlassCard";
import type { Command } from "@/lib/types";

const BANNER = [
  "███╗   ███╗██╗███████╗███████╗██╗ ██████╗ ███╗   ██╗",
  "████╗ ████║██║██╔════╝██╔════╝██║██╔═══██╗████╗  ██║",
  "██╔████╔██║██║███████╗███████╗██║██║   ██║██╔██╗ ██║",
  "██║╚██╔╝██║██║╚════██║╚════██║██║██║   ██║██║╚██╗██║",
  "██║ ╚═╝ ██║██║███████║███████║██║╚██████╔╝██║ ╚████║",
  "╚═╝     ╚═╝╚═╝╚══════╝╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝",
  "",
  "  CONTROL TERMINAL v2.0 ◆ Samuel Andrade ◆ Type 'help'",
  "",
].join("\n");

const COMMANDS = ["help", "whoami", "ls projects", "skills", "contact", "clear", "date", "neofetch", "matrix"];

export function Terminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Command[]>([
    { cmd: "", output: BANNER },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const commandHistoryRef = useRef<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [history]);

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let output = "";

    switch (trimmed) {
      case "help":
        output = `AVAILABLE COMMANDS:
  help          — Show this message
  whoami        — About Samuel Andrade
  ls projects   — List featured projects
  skills        — Technical skills
  contact       — Contact information
  clear         — Clear terminal
  date          — Current mission time
  neofetch      — System information
  matrix        — Enter the Matrix`;
        break;

      case "whoami":
        output = `OPERATOR: Samuel Andrade
ROLE: Analista de Dados & Produto
SPECIALIZATION: BI, SQL, Machine Learning, LLMs
LOCATION: Brasil 🇧🇷
MISSION: Transformar dados em decisão`;
        break;

      case "ls projects":
        output = `PROJETOS:`
  🐾 DogWalk        — Plataforma de passeio de cães (Next.js + Supabase)
  🛰️ Mission Control — Este portfólio (Next.js + Framer Motion)
  📊 ANA Dashboards  — Dashboards de dados (Power BI + SQL)
  🤖 LLM Lab         — Experimentos com LLMs locais (RTX 3060)`;
        break;

      case "skills":
        output = `TECH STACK:
  [LANGUAGES]    Python, SQL, TypeScript
  [BI/ANALYTICS] Power BI, Excel, Pandas
  [ML/AI]        Scikit-learn, LLMs locais, Ollama
  [WEB]          Next.js, React, Tailwind CSS
  [DB]           PostgreSQL, Supabase, MySQL
  [HARDWARE]     RTX 3060 12GB, Docker, Linux`;
        break;

      case "contact":
        output = `CONTATO:
  📧 Email:  samuelandrademedeiros@gmail.com
  🐙 GitHub: github.com/Samuelfmedeiros
  💼 LinkedIn: linkedin.com/in/samuelandrademedeiros`;
        break;

      case "clear":
        setHistory([]);
        return;

      case "date":
        output = `MISSION TIME: ${new Date().toLocaleString("pt-BR")}`;
        break;

      case "neofetch": {
        const uptime = Math.floor(process.uptime());
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        output = `         ▄▄▄▄▄▄▄▄      OS: MISSION CONTROL v2.0
      ▄████████████▄   HOST: Vercel Edge Network
    ▄████████████████▄  KERNEL: Next.js 16.2.5
   ██████████████████   UPTIME: ${hours}h ${minutes}m
  ████████████████████  SHELL: zsh (emulated)
  ████████████████████  CPU: AMD Ryzen 5 5600 + RTX 3060
  ███████▀    ▀███████  MEMORY: 32GB DDR4
  ██████▀      ▀██████  STORAGE: 1TB NVMe SSD
   █████▄    ▄█████    LLM: Ollama (Mistral, Llama 3)
    ▀████████████▀     IDE:  Cursor / VS Code`;
        break;
      }

      case "matrix": {
        const chars = "ｦｧｨｩｪｫｬｭｮｯｱｲｳｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789";
        output = Array.from({ length: 15 }, () =>
          Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
        ).join("\n");
        break;
      }

      default:
        output = `COMMAND NOT FOUND: '${trimmed}'\nType 'help' for available commands.`;
    }

    setHistory((prev) => [...prev, { cmd, output }]);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && input.trim()) {
      commandHistoryRef.current.push(input);
      setHistoryIndex(-1);
      executeCommand(input);
      setInput("");
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistoryRef.current.length === 0) return;
      const newIndex = historyIndex === -1
        ? commandHistoryRef.current.length - 1
        : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(commandHistoryRef.current[newIndex]);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (commandHistoryRef.current.length === 0) return;
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistoryRef.current.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(newIndex);
        setInput(commandHistoryRef.current[newIndex]);
      }
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const currentInput = input.trim().toLowerCase();
      const match = COMMANDS.find((c) => c.startsWith(currentInput));
      if (match) setInput(match);
    }
  };

  return (
    <section id="terminal" className="py-20 px-6">
      <h2 className="text-3xl font-mono text-[var(--accent)] mb-12 text-center">
        ▸ TERMINAL
      </h2>

      <GlassCard className="max-w-3xl mx-auto font-mono text-sm">
        <div
          ref={scrollRef}
          className="h-80 overflow-y-auto mb-4 p-4 rounded-lg bg-black/30 text-[#e2e8f0]"
        >
          {history.map((entry, i) => (
            <div key={i} className="mb-2">
              {entry.cmd && (
                <div className="text-[var(--accent)]">
                  <span className="text-[var(--text-secondary)]">visitor@mission-control:~$</span>{" "}
                  {entry.cmd}
                </div>
              )}
              <pre className="text-xs text-[var(--text-secondary)] whitespace-pre-wrap mt-1">
                {entry.output}
              </pre>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[var(--accent)]">
          <span className="text-[var(--text-secondary)] shrink-0">visitor@mission-control:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-[var(--text-primary)] font-mono text-sm"
            placeholder="type a command..."
            autoFocus
          />
        </div>
      </GlassCard>
    </section>
  );
}
