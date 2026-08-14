"use client";

// GameIcon — ícones SVG próprios dos mini-games (sem emojis)
const ICONS: Record<string, string> = {
  memory:
    '<rect x="4" y="4" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.85"/><rect x="13" y="4" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.5"/>',
  rocket:
    '<path d="M12 2l3 8 6 2-6.4 2.6L12 22l-2.6-7.4L3 12l6-2 3-8z" fill="currentColor"/>',
  keyboard:
    '<rect x="3" y="6" width="18" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M6 10h.01M9.5 10h.01M13 10h.01M16.5 10h.01M6 13.5h.01M9.5 13.5h.01M13 13.5h.01M16.5 13.5h.01M7.5 16.5h9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  grid:
    '<path d="M4 4h16v16H4z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4 10h16M4 16h16M10 4v16M16 4v16" stroke="currentColor" stroke-width="1.2" opacity="0.7"/>',
  gamepad:
    '<path d="M7 8h10a5 5 0 0 1 5 5v3a2 2 0 0 1-3.5 1.4L16 15H8l-2.5 2.4A2 2 0 0 1 2 16v-3a5 5 0 0 1 5-5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="8.5" cy="10.5" r="0.8" fill="currentColor"/><circle cx="15.5" cy="10.5" r="0.8" fill="currentColor"/>',
};

export default function GameIcon({ icon, size = 14 }: { icon: string; size?: number }) {
  const content = ICONS[icon] || ICONS.gamepad;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "inline-block", verticalAlign: "-0.15em", flexShrink: 0 }}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
