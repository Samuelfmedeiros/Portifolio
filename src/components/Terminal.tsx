"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { GlassCard } from "./GlassCard";

interface Command {
  cmd: string;
  output: string;
}

export function Terminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Command[]>([
    { cmd: "", output: "🛰️ MISSION CONTROL TERMINAL v1.0\nType 'help' for available commands.\n" },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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
  date          — Current mission time`;
        break;

      case "whoami":
        output = `OPERATOR: Samuel Andrade
ROLE: Analista de Dados & Produto
SPECIALIZATION: BI, SQL, Machine Learning, LLMs
LOCATION: Brasil 🇧🇷
MISSION: Transformar dados em decisão`;
        break;

      case "ls projects":
        output = `PROJECTS IN HANGAR:
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
        output = `TRANSMISSION CHANNELS:
  📧 Email:  samuelandrademedeiros@gmail.com
  🐙 GitHub: github.com/Samuelfmedeiros
  💼 LinkedIn: linkedin.com/in/samuelandrade`;
        break;

      case "clear":
        setHistory([]);
        return;

      case "date":
        output = `MISSION TIME: ${new Date().toLocaleString("pt-BR")}`;
        break;

      default:
        output = `COMMAND NOT FOUND: '${trimmed}'\nType 'help' for available commands.`;
    }

    setHistory((prev) => [...prev, { cmd, output }]);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && input.trim()) {
      executeCommand(input);
      setInput("");
    }
  };

  return (
    <section id="terminal" className="py-20 px-6">
      <h2 className="text-3xl font-mono text-[var(--accent)] mb-12 text-center">
        ▸ TERMINAL CENTRAL
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
