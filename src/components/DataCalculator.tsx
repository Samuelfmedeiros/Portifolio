"use client";

import { useState } from "react";

export function DataCalculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");

  const handleClick = (value: string) => {
    if (value === "C") {
      setDisplay("0");
      setExpression("");
      return;
    }

    if (value === "=") {
      try {
        const result = eval(expression || display);
        setDisplay(String(result));
        setExpression("");
      } catch {
        setDisplay("ERROR");
        setExpression("");
      }
      return;
    }

    if (display === "0" && value !== ".") {
      setDisplay(value);
      setExpression(value);
    } else {
      setDisplay((prev) => prev + value);
      setExpression((prev) => prev + value);
    }
  };

  const buttons = [
    ["C", "(", ")", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "=", ""],
  ];

  return (
    <div className="py-2">
      <h3 className="font-mono text-sm text-[var(--accent)] mb-4 text-center">🧮 DATA CALCULATOR</h3>

      <div className="bg-black/30 rounded-lg p-4 mb-4">
        <div className="text-right font-mono text-2xl text-[var(--accent)] tabular-nums truncate">
          {display}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {buttons.flat().map((btn, i) => (
          <button
            key={i}
            onClick={() => btn && handleClick(btn)}
            disabled={!btn}
            className={`p-3 rounded-lg font-mono text-sm transition-colors ${
              btn === "C"
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                : btn === "="
                ? "bg-[var(--accent)]/20 text-[var(--accent)] hover:bg-[var(--accent)]/30"
                : ["÷", "×", "-", "+"].includes(btn)
                ? "bg-[var(--accent-alt)]/20 text-[var(--accent-alt)] hover:bg-[var(--accent-alt)]/30"
                : "bg-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--border)]/70"
            }`}
          >
            {btn === "÷" ? "/" : btn === "×" ? "*" : btn}
          </button>
        ))}
      </div>
    </div>
  );
}
