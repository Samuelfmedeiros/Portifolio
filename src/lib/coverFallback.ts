/**
 * Deterministic cover fallback for project cards.
 *
 * When a repo has no imageUrl the card used to render a bare gradient plus the
 * project name in plain text — which reads as "missing cover" (Samuel,
 * 16/09/2026). This builds a cover from the project name alone: a neon monogram
 * over concentric rings, stable across renders because every value derives from
 * a hash of the name.
 */

/** FNV-1a 32-bit — small, stable, no deps. */
export function hashName(name: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < name.length; i++) {
    h ^= name.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/**
 * Two-letter monogram from the first letters of the first two meaningful
 * segments: "roger-mlops" -> "RM", "seu.pet" -> "SP". Falls back to the first
 * two characters for single-word names.
 */
export function monogram(name: string): string {
  const segments = name
    .split(/[-_.\s]+/)
    .map((s) => s.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter(Boolean);

  if (segments.length >= 2) {
    return (segments[0][0] + segments[1][0]).toUpperCase();
  }
  const single = segments[0] || name.replace(/[^\p{L}\p{N}]/gu, "");
  return single.slice(0, 2).toUpperCase() || "??";
}

export interface FallbackGeometry {
  /** Rotation of the outer dashed ring, in degrees. */
  ringRotation: number;
  /** Radii of the three concentric rings, in viewBox units (100x100). */
  radii: [number, number, number];
  /** Positions of the small accent nodes. */
  nodes: Array<{ x: number; y: number; r: number }>;
  /** Dash pattern for the outer arc. */
  dash: string;
  /** Phase offset so nodes and rings never line up identically. */
  phase: number;
}

/**
 * Derive stable geometry from the project name. The same name always yields the
 * same cover — no randomness, so the visual cannot flicker between renders.
 */
export function fallbackGeometry(name: string): FallbackGeometry {
  const h = hashName(name);
  const ringRotation = h % 360;
  const radii: [number, number, number] = [
    30 + (h % 5),
    22 + ((h >> 3) % 5),
    14 + ((h >> 6) % 4),
  ];

  const nodes: Array<{ x: number; y: number; r: number }> = [];
  for (let i = 0; i < 3; i++) {
    const seed = (h >> (i * 4)) % 1000;
    const angle = ((seed / 1000) * 360 * Math.PI) / 180;
    const dist = radii[0] - 6 - (seed % 8);
    nodes.push({
      x: 50 + Math.cos(angle) * dist,
      y: 50 + Math.sin(angle) * dist,
      r: 1.4 + (seed % 3) * 0.4,
    });
  }

  return {
    ringRotation,
    radii,
    nodes,
    dash: `${6 + (h % 5)} ${4 + ((h >> 2) % 5)}`,
    phase: ((h >> 9) % 100) / 100,
  };
}
