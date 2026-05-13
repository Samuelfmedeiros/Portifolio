"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { GlassCard } from "./GlassCard";
import { useTheme } from "./ThemeProvider";
import type { Command } from "@/lib/types";

const BANNER = [
  "Samuel Medeiros — Analista de Dados",
  "Digite 'help' ou pressione Tab para autocompletar.",
  "",
].join("\n");

const PROMPT = "C:\\Users\\Visitor";

const COMMANDS = ["help", "ajuda", "sobre", "projetos", "habilidades", "contato", "limpar", "clear", "hora", "whoami", "theme"];

export function Terminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Command[]>([
    { cmd: "", output: BANNER },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const commandHistoryRef = useRef<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const { toggle: themeToggle } = useTheme();

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [history]);

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let output = "";

    switch (trimmed) {
      case "help":
      case "ajuda":
        output = `COMANDOS DISPONÍVEIS:
  ajuda         — Mostra esta mensagem
  sobre         — Sobre Samuel
  projetos      — Lista de projetos
  habilidades   — Habilidades técnicas
  contato       — Informações de contato
  limpar        — Limpa o terminal
  hora          — Hora atual
  whoami        — Nome do usuário
  theme         — Alterna o tema`;
        break;

      case "sobre":
        output = `Samuel Medeiros
Analista de Dados — Brasília/DF

Especialidades:
  • Power BI, SQL, DAX
  • Python, Pandas, Machine Learning
  • ETL e automação
  • IA Generativa e LLMs

Formação:
  • Pós-graduação em Banco de Dados e BI — IESB
  • Análise e Desenvolvimento de Sistemas — IESB

Experiência:
  • ANA (Agência Nacional de Águas)
  • Global Hitss
  • TRT 10ª Região`;
        break;

      case "projetos":
        output = `PROJETOS:
  🐾 DogWalk        — Plataforma de passeio de cães (Next.js + Supabase)
  🛰️ Mission Control — Este portfólio (Next.js + Framer Motion)
  📊 ANA Dashboards  — Dashboards de dados (Power BI + SQL)`;
        break;

      case "habilidades":
        output = `HABILIDADES:
  [Linguagens]    Python, SQL, TypeScript
  [BI/Analytics] Power BI, Excel, Power Query, DAX
  [ML/IA]         Scikit-learn, Pandas, LLMs
  [Web]           Next.js, React, Tailwind CSS
  [Banco]         PostgreSQL, Supabase, MySQL
  [Ferramentas]   Docker, Git, Linux, Azure`;
        break;

      case "contato":
        output = `CONTATO:
  📧 Email:    samuelandrademedeiros@gmail.com
  💼 LinkedIn: linkedin.com/in/samuelandrademedeiros
  🐙 GitHub:   github.com/Samuelfmedeiros
  📱 WhatsApp: wa.me/556191191722`;
        break;

      case "limpar":
      case "clear":
        setHistory([]);
        return;

      case "hora":
        output = `Horário: ${new Date().toLocaleString("pt-BR")}`;
        break;

      case "whoami":
        output = "Samuel Medeiros";
        break;

      case "theme":
        themeToggle();
        output = "Tema alternado com sucesso.";
        break;

      default:
        output = `Comando não encontrado: '${trimmed}'
Digite 'ajuda' para ver os comandos disponíveis.`;
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
    <section id="terminal" className="py-12 md:py-20 px-4 md:px-6">
      <h2 className="text-3xl font-mono text-[var(--accent)] mb-12 text-center">
        ▸ TERMINAL
      </h2>

      <GlassCard className="max-w-3xl mx-auto font-mono text-sm">
        <div
          ref={scrollRef}
          className="h-48 sm:h-64 md:h-80 overflow-y-auto mb-4 p-4 rounded-lg bg-black/30 text-[#e2e8f0] scroll-smooth"
        >
          {history.map((entry, i) => (
            <div key={i} className="mb-2">
              {entry.cmd && (
                <div className="text-[var(--accent)]">
                  <span className="text-[var(--accent)]">{PROMPT}&gt;</span>{" "}
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
          <span className="text-[var(--accent)] shrink-0">{PROMPT}&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-[var(--text-primary)] font-mono text-sm"
            placeholder="digite um comando..."
            autoFocus
          />
        </div>
      </GlassCard>
    </section>
  );
}
