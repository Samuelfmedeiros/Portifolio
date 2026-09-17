"use client";

import { fallbackGeometry, monogram } from "@/lib/coverFallback";

interface Props {
  /** Project name — drives the monogram and the deterministic geometry. */
  name: string;
  /** Accent colour (hex) inherited from the card, so the cover matches it. */
  accent?: string;
}

/**
 * Cover used when a project has no imageUrl yet.
 *
 * Renders a real cover (monogram + deterministic neon rings) instead of the
 * bare gradient-plus-name that read as "missing cover". Inline SVG: no asset,
 * no network, no build step.
 */
export function ProjectCoverFallback({ name, accent = "#22d3ee" }: Props) {
  const geo = fallbackGeometry(name);
  const [r1, r2, r3] = geo.radii;

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full"
      role="img"
      aria-label={`${name} cover`}
      data-testid="cover-fallback"
      data-cover-name={name}
    >
      <defs>
        <radialGradient id={`cf-glow-${name}`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
          <stop offset="70%" stopColor={accent} stopOpacity="0.06" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="100" height="100" fill={`url(#cf-glow-${name})`} />

      {/* Concentric rings — the outer one dashed and rotated by the name hash */}
      <g transform={`rotate(${geo.ringRotation} 50 50)`}>
        <circle
          cx="50"
          cy="50"
          r={r1}
          fill="none"
          stroke={accent}
          strokeOpacity="0.5"
          strokeWidth="0.6"
          strokeDasharray={geo.dash}
        />
      </g>
      <circle cx="50" cy="50" r={r2} fill="none" stroke={accent} strokeOpacity="0.3" strokeWidth="0.5" />
      <circle cx="50" cy="50" r={r3} fill="none" stroke={accent} strokeOpacity="0.18" strokeWidth="0.4" />

      {/* Accent nodes */}
      {geo.nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.r} fill={accent} fillOpacity={0.55 + geo.phase * 0.3} />
      ))}

      {/* Monogram */}
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
        fill={accent}
        fillOpacity="0.95"
        style={{
          fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
          fontSize: "26px",
          fontWeight: 700,
          letterSpacing: "0.08em",
        }}
      >
        {monogram(name)}
      </text>
    </svg>
  );
}
