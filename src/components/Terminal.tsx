"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { Terminal as TerminalIcon } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { useTheme } from "./ThemeProvider";
import { MissionGames } from "./MiniGames/MissionGames";
import type { Command } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";
import { useAnalytics } from "@/hooks/useAnalytics";

const BANNER = [
  " ╔══════════════════════════════════════╗",
  " ║     🛰️  PORTIFOLIO  v2.0           ║",
  " ║     Samuel Medeiros — Dev Full Stack║",
  " ╚══════════════════════════════════════╝",
  "",
  "Digite 'help' ou pressione Tab para autocompletar.",
  "",
].join("\n");

const PROMPT = "C:\\Users\\Visitor";

const COMMANDS = ["help", "ajuda", "sobre", "projetos", "habilidades", "contato", "limpar", "clear", "cls", "hora", "date", "whoami", "theme", "fix", "run", "matrix", "sudo", "stack", "github", "neofetch", "uptime", "ls", "echo", "banner", "quote", "exit", "ipconfig", "ping", "cowsay", "whois", "pwd", "holofote", "skills"];

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
  const { t } = useLanguage();
  const { track } = useAnalytics();

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
  skills        — Nível de proficiência em cada skill
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
  ls            — Lista arquivos do diretório
  pwd           — Mostra diretório atual
  echo <text>   — Repete o texto
  banner        — Mostra o banner
  quote         — Citação inspiradora aleatória
  ipconfig      — Informações de rede
  ping <host>   — Ping em um servidor
  whois <nome>  — Informações sobre alguém
  cowsay        — Vaca falante 🐄
  holofote      — Coloca Samuel no holofote

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
  • Pós-graduação em Ciência de Dados e Machine Learning Engineering — IESB
  • Análise e Desenvolvimento de Sistemas — IESB

Experiência:
  • ANA (Agência Nacional de Águas)
  • Global Hitss
  • TRT 10ª Região`;
        break;

      case "projetos":
        output = `PROJETOS:
  🐾 DogWalk        — Plataforma de passeio de cães (Next.js + Supabase)
  🛰️ Portifolio Samuel — Este portfólio (Next.js + Framer Motion)
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
  Repos públicos: portifolio, dog-walk e mais
  Linguagens: TypeScript, Python, SQL, JavaScript
  Contribuições: Frequentes`;
        break;

      case "neofetch":
        output = `
        ╭───────────────╮         samuel@portfolio
        │   🛰️  Portifolio v2  │         ──────────────────
        │  Portifólio   │         OS: Web (Next.js 16)
        ╰───────────────╯         Host: ${typeof navigator !== 'undefined' ? navigator.platform : 'unknown'}
                                  Shell: Terminal React
                                  Theme: ${typeof document !== 'undefined' ? document.documentElement.classList.contains('theme-dark') ? 'Night Vision' : 'Daylight Ops' : 'unknown'}
                                  CPU: ${typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || '??' : '?'} cores
                                  Memory: ${typeof navigator !== 'undefined' && (navigator as Navigator & { deviceMemory?: number }).deviceMemory ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory + 'GB' : '??'}
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

      case "ls":
        output = ` Volume in drive C é WINDOWS
 Volume Serial Number: PS-2026

 Directory of C:\\Users\\Visitor\\

2026-05-27  10:30    <DIR>          .
2026-05-27  10:30    <DIR>          ..
2026-05-27  10:30    <DIR>          Documents
2026-05-27  10:30    <DIR>          Projects
2026-05-27  10:30    <DIR>          Downloads
2026-05-27  10:30    <DIR>          Desktop
2026-05-27  10:30    <DIR>          Music
               0 File(s)              0 bytes
               7 Dir(s)   ∞ bytes free`;
        break;

      case "pwd":
        output = PROMPT;
        break;

      case "cls":
      case "clear":
      case "limpar":
        setHistory([]);
        return;

      case "skills":
        output = `PROFICIÊNCIA EM HABILIDADES:

  Power BI           ████████████████████████░  95%  Expert
  SQL & PostgreSQL   ████████████████████████░  95%  Expert
  Python             ████████████████████░░░░░  78%  Advanced
  Machine Learning   ████████████████████░░░░░  78%  Advanced
  Next.js & React    ████████████████████░░░░░  78%  Advanced
  LLMs Locais        ██████████████████░░░░░░░  60%  Proficient
  Docker             ██████████████████░░░░░░░  60%  Proficient
  Git & GitHub       ████████████████████░░░░░  78%  Advanced`;
        break;

      case "banner":
        output = BANNER;
        break;

      case "quote": {
        const quotes = [
          "\"A melhor maneira de prever o futuro é criá-lo.\" — Peter Drucker",
          "\"Dados são o novo petróleo.\" — Clive Humby",
          "\"Sem dados, você é apenas mais uma pessoa com uma opinião.\" — W. Edwards Deming",
          "\"A simplicidade é a sofisticação máxima.\" — Leonardo da Vinci",
          "\"O único jeito de fazer um ótimo trabalho é amar o que você faz.\" — Steve Jobs",
          "\"Não é o mais forte que sobrevive, mas o que melhor se adapta.\" — Charles Darwin",
          "\"A tecnologia move o mundo.\" — Steve Jobs",
          "\"Transformar problemas em oportunidades é a essência da inovação.\" — Samuel Medeiros",
          "\"O sucesso é a soma de pequenos esforços repetidos dia após dia.\" — Robert Collier",
          "\"Se você pode medir, você pode gerenciar.\" — Peter Drucker",
        ];
        output = `📜 ${quotes[Math.floor(Math.random() * quotes.length)]}`;
        break;
      }

      case "ipconfig":
        output = `Windows IP Configuration

Ethernet adapter Ethernet0:
   Connection-specific DNS Suffix  . : local
   IPv4 Address. . . . . . . . . . . : 192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1

Wireless LAN adapter Wi-Fi:
   Connection-specific DNS Suffix  . : local
   IPv4 Address. . . . . . . . . . . : 10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}
   Subnet Mask . . . . . . . . . . . : 255.0.0.0
   Default Gateway . . . . . . . . . : 10.0.0.1

   🛰️ Portifolio Samuel Signal: ❚❚❚❚❚❚❚❚❚❚ 100%`;
        break;

      case "exit":
        output = `> Encerrando sessão...
> Salvando configurações...
> 
> Obrigado por visitar! Volte sempre 🚀
> 
> (Dica: Feche esta aba se quiser sair de verdade.)`;
        break;

      case "holofote":
        output = `
╔══════════════════════════════════════════════════════╗
║                                                      ║
║     ☆  ☆  ☆  ☆  ☆  ☆  ☆  ☆  ☆  ☆  ☆  ☆  ☆       ║
║                                                      ║
║          🎯  S A M U E L  M E D E I R O S  🎯        ║
║                                                      ║
║     ☆  ☆  ☆  ☆  ☆  ☆  ☆  ☆  ☆  ☆  ☆  ☆  ☆       ║
║                                                      ║
║     Desenvolvedor Full Stack & Analista de Dados     ║
║     Transformando dados em decisoes estrategicas     ║
║                                                      ║
╚══════════════════════════════════════════════════════╝`;
        break;

      default:
        // Check for echo
        if (trimmed.startsWith("echo ")) {
          output = trimmed.slice(5);
          break;
        }

        // Check for ping
        if (trimmed.startsWith("ping ")) {
          const host = trimmed.slice(5) || "localhost";
          const ms = Math.floor(Math.random() * 40 + 10);
          output = `Pinging ${host} [192.168.1.${Math.floor(Math.random() * 254)}] with 32 bytes of data:
Reply from 192.168.1.1: bytes=32 time=${ms}ms TTL=64
Reply from 192.168.1.1: bytes=32 time=${ms + 5}ms TTL=64
Reply from 192.168.1.1: bytes=32 time=${ms - 3}ms TTL=64
Reply from 192.168.1.1: bytes=32 time=${ms + 2}ms TTL=64

Ping statistics for 192.168.1.${Math.floor(Math.random() * 254)}:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = ${ms - 3}ms, Maximum = ${ms + 5}ms, Average = ${Math.floor(ms + 1)}ms`;
          break;
        }

        // Check for whois
        if (trimmed.startsWith("whois ")) {
          const name = trimmed.slice(6);
          output = `WHOIS lookup for "${name}"...

  Nome: ${name}
  Cargo: Analista de Dados / Desenvolvedor Full Stack
  Localização: Brasília, DF — Brasil
  Expertise: Power BI, SQL, Python, Machine Learning
  Contato: samuelandrademedeiros@gmail.com
  GitHub: github.com/Samuelfmedeiros
  LinkedIn: linkedin.com/in/samuelandrademedeiros

  [Resultados obtidos do registro WHOIS interno]`;
          break;
        }

        // Check for cowsay
        if (trimmed.startsWith("cowsay ")) {
          const msg = trimmed.slice(7) || "Moo!";
          const width = Math.max(msg.length, 4);
          const border = "─".repeat(width);
          output = ` ┌${border}┐
 │ ${msg.padEnd(width - 1)} │
 └${border}┘
  \\   ^__^
   \\  (oo)\\_______
      (__)\\       )\\/\\
          ||----w |
          ||     ||`;
          break;
        }

        if (trimmed.startsWith("cowsay")) {
          output = ` ┌────┐
 │ Moo! │
 └────┘
  \\   ^__^
   \\  (oo)\\_______
      (__)\\       )\\/\\
          ||----w |
          ||     ||`;
          break;
        }

        output = `Comando não encontrado: '${trimmed}'
Digite 'ajuda' para ver os comandos disponíveis.`;
    }
    setHistory((prev) => [...prev.slice(-99), { cmd, output }]);
    track({ type: "terminal_command", url: "terminal", label: `Comando: ${trimmed || "(vazio)"}` });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && input.trim()) {
      commandHistoryRef.current = [...commandHistoryRef.current.slice(-49), input];
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
      if (!currentInput) return;
      const matches = COMMANDS.filter((c) => c.startsWith(currentInput));
      if (matches.length === 0) return;
      if (matches.length === 1) {
        setInput(matches[0]);
      } else {
        const prefix = matches.reduce((common, cmd) => {
          let i = 0;
          while (i < common.length && i < cmd.length && common[i] === cmd[i]) i++;
          return common.slice(0, i);
        });
        if (prefix.length > currentInput.length) {
          setInput(prefix);
        } else {
          setHistory((prev) => [...prev, { cmd: `${currentInput}\t`, output: matches.join("  ") }]);
        }
      }
    }
  };

  return (
    <section id="terminal" className="py-8 md:py-12 px-4 md:px-6">
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
            aria-label={t("terminal.input", "Digite um comando")}
            role="textbox"
            autoFocus
          />
        </div>
      </GlassCard>

      {/* Portifolio Games */}
      <div className="max-w-3xl mx-auto mt-8">
        <MissionGames />
      </div>
    </section>
  );
}
