"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { GlassCard } from "./GlassCard";
import { useTheme } from "./ThemeProvider";
import { MissionGames } from "./MiniGames/MissionGames";
import type { Command } from "@/lib/types";

const BANNER = [
  " ╔══════════════════════════════════════╗",
  " ║     🛰️  MISSION CONTROL  v2.0      ║",
  " ║     Samuel Medeiros — Dev Full Stack║",
  " ╚══════════════════════════════════════╝",
  "",
  "Digite 'help' ou pressione Tab para autocompletar.",
  "",
].join("\n");

const PROMPT = "C:\\Users\\Visitor";

const COMMANDS = ["help", "ajuda", "sobre", "projetos", "habilidades", "contato", "limpar", "clear", "hora", "date", "whoami", "theme", "fix", "run", "matrix", "sudo", "stack", "github", "neofetch", "uptime"];

export function Terminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Command[]>([
    { cmd: "", output: BANNER },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const commandHistoryRef = useRef<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const { toggle: themeToggle } = useTheme();

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [history]);

  const sanitizeInput = (input: string): string => {
    // Remove potentially dangerous characters
    return input
      .replace(/[<>]/g, "") // Strip HTML-like tags
      .replace(/javascript:/gi, "") // Strip javascript: protocol
      .replace(/on\w+=/gi, "") // Strip event handlers
      .replace(/[\x00-\x1F\x7F-\x9F]/g, "") // Strip control chars
      .slice(0, 500); // Limit input length
  };

  const executeCommand = (cmd: string) => {
    const trimmed = sanitizeInput(cmd).trim().toLowerCase();
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
  hora          — Data e hora atual
  date          — Data formatada completa
  whoami        — Nome do usuário
  theme         — Alterna o tema
  stack         — Tech stack do projeto
  github        — Info do GitHub
  neofetch      — System info estilo neofetch
  uptime        — Sessão uptime

⚡ EASTER EGGS (para devs):
  fix path_variables        — Repara variáveis do Windows
  run routine:lights_out    — Modo Noturno Máximo
  matrix                     — Efeito Matrix
  sudo rm -rf /             — ⚠️ Não faça isso`;
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

      case "date":
        output = `Data atual: ${new Date().toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}\nHorário: ${new Date().toLocaleTimeString("pt-BR")}`;
        break;

      case "uptime":
        const uptimeSecs = Math.floor((Date.now() - performance.now()) / 1000);
        const mins = Math.floor(uptimeSecs / 60);
        output = `Session uptime: ${mins} min`;
        break;

      case "stack":
        output = `TECH STACK:
  Frontend:  Next.js 16, React 19, TypeScript, Tailwind CSS 4
  Animações: Framer Motion, Lucide Icons
  Backend:   Supabase (PostgreSQL), Cloudflare Workers
  Testes:    Vitest, Playwright
  Deploy:    Cloudflare Pages, Vercel
  CI/CD:     GitHub Actions`;
        break;

      case "github":
        output = `GitHub: github.com/Samuelfmedeiros
  Repos públicos: mission-control, dog-walk e mais
  Linguagens: TypeScript, Python, SQL, JavaScript
  Contribuições: Frequentes`;
        break;

      case "neofetch":
        output = `
        ╭───────────────╮         samuel@portfolio
        │   🛰️  MC v2  │         ──────────────────
        │  Mission Ctrl │         OS: Web (Next.js 16)
        ╰───────────────╯         Host: ${typeof navigator !== 'undefined' ? navigator.platform : 'unknown'}
                                  Shell: Terminal React
                                  Theme: ${typeof document !== 'undefined' ? document.documentElement.classList.contains('theme-dark') ? 'Night Vision' : 'Daylight Ops' : 'unknown'}
                                  CPU: ${typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || '??' : '?'} cores
                                  Memory: ${typeof navigator !== 'undefined' && (navigator as any).deviceMemory ? (navigator as any).deviceMemory + 'GB' : '??'}
                                  Browser: ${typeof navigator !== 'undefined' ? navigator.userAgent.split(' ').pop() || 'unknown' : 'unknown'}`;
        break;

      case "theme":
        themeToggle();
        output = "Tema alternado com sucesso.";
        break;

      case "fix path_variables":
        output = `> Iniciando reparo do PATH...
> Escaneando variáveis de ambiente corrompidas...

[OK] USERPROFILE = C:\\Users\\Samuel
[OK] APPDATA = C:\\Users\\Samuel\\AppData\\Roaming
[OK] PATH restaurado para valores padrão
[WARN] NODE_PATH estava pointing para C:\\Python27
[FIX] Corrigido NODE_PATH -> C:\\Program Files\\nodejs
[OK] JAVA_HOME = C:\\Program Files\\Java\\jdk-17

> Processando... 100%
✅ PATH_variables reparado com sucesso!`;
        break;

      case "run routine:lights_out":
        output = `> Executando rotina LIGHTS_OUT...
> Simulando falha de energia...

█▓▒░ ░▒▓█

> WARNING: Todos os sistemas offline
> BACKUP: Energia de emergência ativada
> Modo Noturno Máximo ATIVADO

✨ Screen brightness: 0%
✨ Animations: disabled
✨ Terminal: HIGH CONTRAST

> Missão cumprida, operador.`;
        // Trigger extreme dark mode via CSS class
        document.documentElement.classList.add('lights-out');
        setTimeout(() => document.documentElement.classList.remove('lights-out'), 5000);
        break;

      case "matrix":
        output = `> Iniciando efeito MATRIX...
> Conectando à fonte de dados...

████████████████████████████
██ 01001000 01100101 01101100 ██
██ 01101100 01101111 00100000 ██
██ 01010100 01100101 01100011 ██
████████████████████████████

> Acesso concedido.
> Bem-vindo ao sistema, Sr. Anderson.`;
        break;

      case "sudo rm -rf /":
        output = `> sudo: acesso root requerido
> 
> ⚠️ ALERTA DE SEGURANÇA ⚠️
> Tentativa de deletar o universo detectada!
> 
> Bloqueando...
> 
> 🙃 Calma, visitante. 
> Isso aqui é só um portfólio.
> Não vou deixar você deletar minha carreira.`;
        break;

      case "fix":
        output = `Uso: fix <componente>
Exemplo: fix path_variables`;
        break;

      case "run":
        output = `Uso: run routine:<nome>
Exemplo: run routine:lights_out`;
        break;

      case "sudo":
        output = `Acesso negado. Este terminal não tem privilégios de root.
(Porque isso é um portfólio, não um servidor de produção.)`;
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
          <h2 className="text-3xl font-mono text-[var(--accent)] mb-12 text-center" id="terminal-heading">
            ▸ TERMINAL
          </h2>

          <GlassCard className="max-w-3xl mx-auto font-mono text-sm" role="region" aria-labelledby="terminal-heading">
        <div
          ref={scrollRef}
          className="h-48 sm:h-64 md:h-80 overflow-y-auto mb-4 p-4 rounded-lg bg-[var(--bg-primary)]/30 text-[var(--text-primary)] scroll-smooth"
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
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`flex-1 bg-transparent outline-none text-[var(--text-primary)] font-mono text-sm ${
              isFocused ? "caret-[var(--accent)]" : ""
            }`}
            placeholder="digite um comando..."
            aria-label="Digite um comando"
            role="textbox"
            autoFocus
          />
        </div>
      </GlassCard>

      {/* Mission Games */}
      <div className="max-w-3xl mx-auto mt-8">
        <MissionGames />
      </div>
    </section>
  );
}
