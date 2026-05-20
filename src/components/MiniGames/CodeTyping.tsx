"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const CODE_SNIPPETS = [
  'const [data, setData] = useState([])',
  'export async function GET(req) {',
  'SELECT * FROM users WHERE active = true',
  'SELECT name, COUNT(*) FROM projects GROUP BY name',
  'if (error) return NextResponse.json({ error })',
  'await fetch("/api/data").then(r => r.json())',
  'CREATE TABLE missions (id SERIAL PRIMARY KEY)',
  'function fibonacci(n) { return n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2) }',
  'df.groupby("category").sum().sort_values("total")',
  'npm run build && npm run deploy',
  'docker-compose up -d --build',
  'git push origin main --force-with-lease',
  'import { createClient } from "@supabase/supabase-js"',
  'const api = new Hono().get("/health", (c) => c.json({ ok: true }))',
  'UPDATE missions SET status = "complete" WHERE id = 42',
];

interface TypingState {
  currentSnippet: string;
  userInput: string;
  startTime: number | null;
  wpm: number;
  accuracy: number;
  completed: number;
  started: boolean;
  finished: boolean;
  timer: number;
}

export function CodeTyping() {
  const [state, setState] = useState<TypingState>({
    currentSnippet: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
    userInput: "",
    startTime: null,
    wpm: 0,
    accuracy: 100,
    completed: 0,
    started: false,
    finished: false,
    timer: 0,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer
  useEffect(() => {
    if (!state.started || state.finished) return;
    timerRef.current = setInterval(() => {
      setState((prev) => ({ ...prev, timer: prev.timer + 1 }));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.started, state.finished]);

  // Calculate WPM
  useEffect(() => {
    if (state.startTime && !state.finished) {
      const elapsed = (Date.now() - state.startTime) / 60000;
      const words = state.userInput.length / 5;
      const wpm = elapsed > 0 ? Math.round(words / elapsed) : 0;
      setState((prev) => ({ ...prev, wpm }));
    }
  }, [state.userInput, state.startTime, state.finished]);

  // Calculate accuracy
  useEffect(() => {
    if (state.userInput.length === 0) {
      setState((prev) => ({ ...prev, accuracy: 100 }));
      return;
    }
    let correct = 0;
    for (let i = 0; i < state.userInput.length; i++) {
      if (state.userInput[i] === state.currentSnippet[i]) correct++;
    }
    const accuracy = Math.round((correct / state.userInput.length) * 100);
    setState((prev) => ({ ...prev, accuracy }));
  }, [state.userInput, state.currentSnippet]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (!state.started) {
        setState((prev) => ({
          ...prev,
          started: true,
          startTime: Date.now(),
          userInput: value,
        }));
      } else {
        setState((prev) => ({ ...prev, userInput: value }));
      }

      // Check if completed
      if (value === state.currentSnippet) {
        const newCompleted = state.completed + 1;
        const nextSnippet = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
        setState((prev) => ({
          ...prev,
          userInput: "",
          currentSnippet: nextSnippet,
          completed: newCompleted,
          finished: newCompleted >= 5,
        }));
      }
    },
    [state.started, state.currentSnippet, state.completed]
  );

  const resetGame = useCallback(() => {
    setState({
      currentSnippet: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
      userInput: "",
      startTime: null,
      wpm: 0,
      accuracy: 100,
      completed: 0,
      started: false,
      finished: false,
      timer: 0,
    });
    inputRef.current?.focus();
  }, []);

  // Render characters with color coding
  const renderSnippet = () => {
    return state.currentSnippet.split("").map((char, i) => {
      let color = "text-[var(--text-secondary)]";
      if (i < state.userInput.length) {
        color = state.userInput[i] === char ? "text-[var(--accent)]" : "text-[var(--error)] bg-[var(--error)]/20";
      } else if (i === state.userInput.length) {
        color = "text-[var(--accent)] border-b border-[var(--accent)] animate-pulse";
      }
      return (
        <span key={i} className={color}>
          {char}
        </span>
      );
    });
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="py-2">
      <h3 className="font-mono text-sm text-[var(--accent)] mb-4 text-center">
        ⌨️ CODE TYPING CHALLENGE
      </h3>

      {state.finished ? (
        <div className="text-center space-y-3 py-4">
          <p className="font-mono text-lg text-[var(--accent)]">🏆 MISSÃO CUMPRIDA!</p>
          <div className="grid grid-cols-3 gap-4 font-mono text-xs">
            <div>
              <p className="text-[var(--text-secondary)]">WPM</p>
              <p className="text-[var(--accent)] text-lg">{state.wpm}</p>
            </div>
            <div>
              <p className="text-[var(--text-secondary)]">Precisão</p>
              <p className="text-[var(--accent)] text-lg">{state.accuracy}%</p>
            </div>
            <div>
              <p className="text-[var(--text-secondary)]">Tempo</p>
              <p className="text-[var(--accent)] text-lg">{formatTime(state.timer)}</p>
            </div>
          </div>
          <button
            onClick={resetGame}
            className="px-6 py-2 rounded-lg font-mono text-sm text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/30 hover:bg-[var(--accent)]/20 transition-colors"
          >
            🔄 JOGAR NOVAMENTE
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-3 px-2 font-mono text-xs">
            <span className="text-[var(--text-secondary)]">
              WPM: <span className="text-[var(--accent)]">{state.wpm}</span>
            </span>
            <span className="text-[var(--text-secondary)]">
              Precisão: <span className="text-[var(--accent)]">{state.accuracy}%</span>
            </span>
            <span className="text-[var(--text-secondary)]">
              {state.completed}/5
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-[var(--border)] rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-[var(--accent)] transition-all duration-200 rounded-full"
              style={{ width: `${(state.completed / 5) * 100}%` }}
            />
          </div>

          <div className="bg-[var(--bg-primary)]/40 rounded-lg p-4 mb-4 font-mono text-sm leading-relaxed border border-[var(--border)]">
            {renderSnippet()}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={state.userInput}
            onChange={handleChange}
            className="w-full bg-[var(--bg-primary)]/30 border border-[var(--border)] rounded-lg px-4 py-2 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]/50 transition-colors"
            placeholder={state.started ? "" : "Comece a digitar..."}
            autoComplete="off"
            spellCheck={false}
          />

          {!state.started && (
            <p className="font-mono text-[10px] text-[var(--text-secondary)] mt-2 text-center">
              Digite o código acima o mais rápido possível!
            </p>
          )}
        </>
      )}
    </div>
  );
}
