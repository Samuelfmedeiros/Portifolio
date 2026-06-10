"use client";

import { useMemo } from "react";

type AnimationPhase = "initial" | "falling" | "walking" | "digging" | "revealed";

interface TatuSVGProps {
  phase: AnimationPhase;
  size?: number;
}

/**
 * TatuSVG — Treasure Planet–style armadillo in pure SVG.
 * No external assets, no Rive. Animated via CSS classes driven by phase.
 */
export function TatuSVG({ phase, size = 120 }: TatuSVGProps) {
  const scale = size / 120;

  const legAnim = useMemo(() => {
    if (phase === "walking") return "tatu-leg-walk 0.35s ease-in-out infinite alternate";
    if (phase === "digging") return "tatu-leg-dig 0.5s ease-in-out infinite alternate";
    return "none";
  }, [phase]);

  const bodyAnim = useMemo(() => {
    if (phase === "walking") return "tatu-bob 0.4s ease-in-out infinite alternate";
    return "none";
  }, [phase]);

  const tailAnim = useMemo(() => {
    if (phase === "falling") return "tatu-tail-fall 1s ease-in-out infinite alternate";
    return "none";
  }, [phase]);

  const shellPulse = useMemo(() => {
    if (phase === "digging") return "tatu-shell-dig 0.6s ease-in-out infinite alternate";
    return "none";
  }, [phase]);

  const eyeGlow = useMemo(() => {
    if (phase === "revealed") return "tatu-eye-reveal 0.3s ease-out forwards";
    return "none";
  }, [phase]);

  return (
    <>
      <style>{`
        @keyframes tatu-leg-walk {
          0%   { transform: rotate(-12deg) translateY(0); }
          100% { transform: rotate(12deg) translateY(-2px); }
        }
        @keyframes tatu-leg-dig {
          0%   { transform: rotate(-25deg) translateY(0); }
          100% { transform: rotate(15deg) translateY(-4px); }
        }
        @keyframes tatu-bob {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-3px); }
        }
        @keyframes tatu-tail-fall {
          0%   { transform: rotate(25deg); }
          100% { transform: rotate(-10deg); }
        }
        @keyframes tatu-shell-dig {
          0%   { transform: scaleY(1) translateY(0); }
          100% { transform: scaleY(0.92) translateY(4px); }
        }
        @keyframes tatu-eye-reveal {
          0%   { filter: brightness(1); }
          50%  { filter: brightness(3) drop-shadow(0 0 6px #22d3ee); }
          100% { filter: brightness(1.5) drop-shadow(0 0 3px #22d3ee); }
        }
        @keyframes tatu-revealed-pulse {
          0%, 100% { opacity: 0.8; filter: drop-shadow(0 0 8px #22d3ee); }
          50%      { opacity: 1;   filter: drop-shadow(0 0 16px #22d3ee) drop-shadow(0 0 30px #6366f1); }
        }
      `}</style>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", overflow: "visible" }}
      >
        <g
          style={{
            transformOrigin: "60px 65px",
            animation: phase === "revealed" ? "tatu-revealed-pulse 1.5s ease-in-out infinite" : "none",
          }}
        >
          {/* ── Tail ── */}
          <path
            d="M18 62 C8 58, 2 48, 6 38 C8 33, 12 32, 14 36"
            stroke="var(--accent, #22d3ee)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity={0.8}
            style={{
              transformOrigin: "18px 62px",
              animation: tailAnim,
            }}
          />

          {/* ── Back legs ── */}
          <g style={{ transformOrigin: "38px 78px", animation: legAnim }}>
            <path d="M38 72 L34 84 L30 84" stroke="var(--accent, #22d3ee)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.7} />
          </g>
          <g style={{ transformOrigin: "78px 78px", animation: legAnim, animationDelay: "0.12s" }}>
            <path d="M78 72 L82 84 L86 84" stroke="var(--accent, #22d3ee)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.7} />
          </g>

          {/* ── Shell (4 bands) ── */}
          <g style={{ transformOrigin: "60px 55px", animation: shellPulse }}>
            {/* Band 1 — top / head area */}
            <ellipse cx="60" cy="42" rx="30" ry="16" fill="none" stroke="var(--accent, #22d3ee)" strokeWidth="3" opacity={0.9} />
            {/* Band 2 */}
            <ellipse cx="60" cy="50" rx="34" ry="17" fill="none" stroke="#6366f1" strokeWidth="2.5" opacity={0.8} />
            {/* Band 3 */}
            <ellipse cx="60" cy="58" rx="36" ry="18" fill="none" stroke="var(--accent, #22d3ee)" strokeWidth="2.5" opacity={0.7} />
            {/* Band 4 — bottom */}
            <ellipse cx="60" cy="66" rx="34" ry="16" fill="none" stroke="#6366f1" strokeWidth="2" opacity={0.6} />

            {/* Shell fill gradient — subtle glow inside */}
            <ellipse cx="60" cy="54" rx="30" ry="18" fill="url(#shellGlow)" opacity={0.15} />
          </g>

          {/* ── Front legs / paws ── */}
          <g style={{ transformOrigin: "42px 76px", animation: legAnim }}>
            <path d="M44 70 L40 84 L36 84" stroke="var(--accent, #22d3ee)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.7} />
          </g>
          <g style={{ transformOrigin: "74px 76px", animation: legAnim, animationDelay: "0.12s" }}>
            <path d="M72 70 L76 84 L80 84" stroke="var(--accent, #22d3ee)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.7} />
          </g>

          {/* ── Head ── */}
          <g
            style={{
              transformOrigin: "60px 36px",
              animation: phase === "digging" ? "tatu-leg-dig 0.5s ease-in-out infinite alternate" : "none",
            }}
          >
            {/* Head shape */}
            <path
              d="M52 34 C50 28, 54 22, 60 20 C66 22, 70 28, 68 34 Z"
              fill="none"
              stroke="var(--accent, #22d3ee)"
              strokeWidth="2.5"
              opacity={0.9}
            />

            {/* Left ear */}
            <path d="M54 24 L50 16 L56 20" stroke="var(--accent, #22d3ee)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.7} />
            {/* Right ear */}
            <path d="M66 24 L70 16 L64 20" stroke="var(--accent, #22d3ee)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.7} />

            {/* Eyes */}
            <circle cx="56" cy="28" r="2" fill="var(--accent, #22d3ee)" style={{ animation: eyeGlow }} />
            <circle cx="64" cy="28" r="2" fill="var(--accent, #22d3ee)" style={{ animation: eyeGlow, animationDelay: "0.1s" }} />

            {/* Nose */}
            <circle cx="60" cy="32" r="1.5" fill="#6366f1" opacity={0.8} />
          </g>

          {/* ── Claws (appear during digging) ── */}
          {phase === "digging" && (
            <g opacity={0.8}>
              <path d="M36 82 L32 78" stroke="var(--accent, #22d3ee)" strokeWidth="1.5" strokeLinecap="round" opacity={0.6} />
              <path d="M80 82 L84 78" stroke="var(--accent, #22d3ee)" strokeWidth="1.5" strokeLinecap="round" opacity={0.6} />
            </g>
          )}

          {/* ── Shell opening (revealed phase) ── */}
          {phase === "revealed" && (
            <g>
              {/* Energy burst from inside shell */}
              <circle cx="60" cy="54" r="14" fill="none" stroke="url(#portalGlow)" strokeWidth="2" opacity={0.9}>
                <animate attributeName="r" values="14;22;14" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="60" cy="54" r="6" fill="#22d3ee" opacity={0.4}>
                <animate attributeName="r" values="6;12;6" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0.1;0.4" dur="1.5s" repeatCount="indefinite" />
              </circle>
              {/* Shell plates flying apart */}
              {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <path
                  key={i}
                  d={`M60 54 L${60 + Math.cos(angle * Math.PI / 180) * 20} ${54 + Math.sin(angle * Math.PI / 180) * 20}`}
                  stroke="var(--accent, #22d3ee)"
                  strokeWidth="1.5"
                  opacity={0.5}
                  style={{
                    transformOrigin: "60px 54px",
                    animation: `tatu-leg-walk 0.3s ease-out ${i * 0.05}s forwards`,
                  }}
                />
              ))}
            </g>
          )}
        </g>

        {/* ── Defs ── */}
        <defs>
          <radialGradient id="shellGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent, #22d3ee)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--accent, #22d3ee)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="portalGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
            <stop offset="50%" stopColor="var(--accent, #22d3ee)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </>
  );
}
