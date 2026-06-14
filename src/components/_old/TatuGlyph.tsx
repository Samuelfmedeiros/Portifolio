"use client";

import { memo } from "react";

interface TatuGlyphProps {
  scale?: number;
  digging?: boolean;
  digLevel?: number;
  /** Progress within current dig cycle (0–1), used for fine-grained leg/body animation */
  digProgress?: number;
  /** How much the tatu has sunk into the ground from digging (0–1) */
  sinkAmount?: number;
}

function TatuGlyphInner({
  scale = 1,
  digging = false,
  digLevel = 0,
  digProgress = 0,
  sinkAmount = 0,
}: TatuGlyphProps) {
  const s = scale;

  // ── Dynamic values ──

  // Sink deeper with each level (feet going into ground)
  const sinkPx = sinkAmount * digLevel * 4;

  // Body bob: tatu squishes down on strike (sin positive), springs up on recovery (sin negative)
  const sinPos = Math.sin(digProgress * Math.PI);
  const bodyBobY = digging ? -Math.abs(sinPos) * 3 : 0;
  const bodySquash = digging ? 1 - Math.abs(sinPos) * 0.1 : 1;

  // Head tilt: down on strike, up on recovery
  const headTiltDeg = digging ? sinPos * (-10) : 0;

  // Legs: back legs push on downstroke, front legs scratch
  const backLegKick = digging ? Math.sin(digProgress * Math.PI * 2) * 4 : 0;
  const frontLegKick = digging ? Math.sin(digProgress * Math.PI * 2 + Math.PI) * 3 : 0;

  // Tail
  const tailWagDeg = digging ? Math.sin(digProgress * Math.PI * 3) * 12 : 0;

  // ── Canned SVG paths ──
  const BODY_ARC = "M14 30 C14 18, 22 12, 34 12 C46 12, 56 18, 56 30";
  const BELLY_ARC = "M14 30 C14 38, 22 44, 34 44 C46 44, 56 38, 56 30";
  const HEAD_PATH = "M52 22 C56 20, 62 22, 64 26 C66 30, 64 34, 60 35 C56 36, 52 34, 52 30";
  const SNOUT_PATH = "M62 26 C66 26, 68 28, 68 30 C68 32, 66 33, 62 33";
  const EAR_PATH = "M54 20 C55 15, 58 14, 60 18";

  return (
    <svg
      width={70 * s}
      height={Math.max(60, 70) * s}
      viewBox="0 0 70 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      {/* ── Tail (wags when digging) ── */}
      <g transform={`rotate(${tailWagDeg}, 10, 34)`}>
        <path
          d="M8 32 C2 28, 0 22, 3 18 C5 16, 8 16, 12 20"
          stroke="#22d3ee"
          strokeWidth={1.8 * s}
          strokeLinecap="round"
          fill="none"
          opacity={0.7}
        />
      </g>

      {/* ── Back legs (push on dig) ── */}
      <g transform={`translate(0, ${sinkPx + bodyBobY})`}>
        {/* Left back leg */}
        <g transform={`translate(${-backLegKick * 0.3}, ${backLegKick})`}>
          <line
            x1={24} y1={44} x2={18} y2={52}
            stroke="#22d3ee" strokeWidth={1.5 * s} strokeLinecap="round" opacity={0.6}
          />
        </g>
        {/* Right back leg */}
        <g transform={`translate(${backLegKick * 0.3}, ${backLegKick * 0.5})`}>
          <line
            x1={30} y1={44} x2={28} y2={53}
            stroke="#22d3ee" strokeWidth={1.5 * s} strokeLinecap="round" opacity={0.6}
          />
        </g>
      </g>

      {/* ── Body shell (squash + stretch) ── */}
      <g transform={`translate(34, ${28 + sinkPx + bodyBobY}) scale(1, ${bodySquash})`}>
        <g transform="translate(-34, -28)">
          {/* Shell back */}
          <path d={BODY_ARC} stroke="#22d3ee" strokeWidth={1.5 * s} fill="#0a0a1a" opacity={0.9} />
          {/* Belly */}
          <path d={BELLY_ARC} stroke="#22d3ee" strokeWidth={1 * s} fill="none" opacity={0.3} />

          {/* Segment lines */}
          <path d="M26 16 C24 22, 24 32, 26 40" stroke="#22d3ee" strokeWidth={1 * s} opacity={0.4} />
          <path d="M38 14 C36 22, 36 34, 38 42" stroke="#22d3ee" strokeWidth={1 * s} opacity={0.4} />
          <path d="M48 16 C47 22, 47 32, 48 38" stroke="#22d3ee" strokeWidth={1 * s} opacity={0.3} />

          {/* Shell highlight */}
          <path d="M18 24 C24 18, 32 16, 42 16" stroke="#22d3ee" strokeWidth={0.5 * s} opacity={0.2} fill="none" />

          {/* ── Front legs (scratch) ── */}
          <g transform={`translate(${frontLegKick}, ${frontLegKick * 0.6})`}>
            <line x1={40} y1={44} x2={42} y2={53}
              stroke="#22d3ee" strokeWidth={1.5 * s} strokeLinecap="round" opacity={0.6} />
          </g>
          <g transform={`translate(${-frontLegKick * 0.5}, ${frontLegKick * 0.3})`}>
            <line x1={48} y1={42} x2={51} y2={50}
              stroke="#22d3ee" strokeWidth={1.5 * s} strokeLinecap="round" opacity={0.6} />
          </g>

          {/* Claws */}
          <line x1={42} y1={53} x2={40} y2={56}
            stroke="#22d3ee" strokeWidth={0.8 * s} strokeLinecap="round" opacity={0.4}
            transform={`translate(${frontLegKick}, ${frontLegKick * 0.6})`}
          />
          <line x1={51} y1={50} x2={53} y2={53}
            stroke="#22d3ee" strokeWidth={0.8 * s} strokeLinecap="round" opacity={0.4}
            transform={`translate(${-frontLegKick * 0.5}, ${frontLegKick * 0.3})`}
          />
        </g>
      </g>

      {/* ── Head (tilts on strike) ── */}
      <g transform={`rotate(${headTiltDeg}, 60, 28) translate(0, ${sinkPx + bodyBobY})`}>
        <path d={HEAD_PATH} stroke="#22d3ee" strokeWidth={1.5 * s} fill="#0a0a1a" opacity={0.9} />
        <path d={SNOUT_PATH} stroke="#22d3ee" strokeWidth={1 * s} fill="#0a0a1a" opacity={0.8} />
        <circle cx={67} cy={30} r={1.5 * s} fill="#22d3ee" opacity={0.7} />
        <path d={EAR_PATH} stroke="#22d3ee" strokeWidth={1.2 * s} strokeLinecap="round" fill="none" opacity={0.6} />
        <circle cx={58} cy={26} r={2 * s} fill="#22d3ee" opacity={0.9} />
        <circle cx={58} cy={26} r={1 * s} fill="#fff" opacity={0.8} />
      </g>

      {/* ── Dig particles ── */}
      {digging && (
        <g opacity={0.8}>
          {/* Dirt spray from under the tatu's claws */}
          {[0, 1, 2, 3].map((i) => {
            const spread = (i - 1.5) * 0.4; // -0.6 to 0.6 directional spread
            const baseX = 34 + spread * 20;
            const baseY = 50 + digLevel * 2;
            const dur = `${0.2 + i * 0.08}s`;
            return (
              <circle
                key={i}
                cx={baseX}
                cy={baseY}
                r={(0.8 + i * 0.15) * s}  /* pseudo-random from index */
                fill={i % 2 === 0 ? "#22d3ee" : "#6366f1"}
              >
                <animate
                  attributeName="cx"
                  from={baseX.toString()}
                  to={(baseX + spread * 25).toString()}
                  dur={dur} repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  from={baseY.toString()}
                  to={(baseY - 6 - i * 2).toString()}
                  dur={dur} repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.9" to="0" dur={dur} repeatCount="indefinite"
                />
                <animate
                  attributeName="r"
                  from={(1.2 * s).toString()}
                  to="0"
                  dur={dur} repeatCount="indefinite"
                />
              </circle>
            );
          })}
        </g>
      )}
    </svg>
  );
}

export const TatuGlyph = memo(TatuGlyphInner);
