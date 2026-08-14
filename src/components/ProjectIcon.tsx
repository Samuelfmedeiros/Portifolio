"use client";

// ProjectIcon — ícones SVG próprios por projeto (sem emojis)
// Mesmos desenhos do LifeLog (src/components/ProjectIcon.astro)

const ICONS: Record<string, string> = {
  arachne:
    '<path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.35"/><circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/>',
  dogwalk:
    '<ellipse cx="7" cy="7" rx="2" ry="2.6" fill="currentColor"/><ellipse cx="12" cy="5.6" rx="2" ry="2.6" fill="currentColor"/><ellipse cx="17" cy="7" rx="2" ry="2.6" fill="currentColor"/><path d="M12 10.2c-2.2 0-4 1.6-4.4 3.6-.2 1.1.6 2.2 1.8 2.2h5.2c1.2 0 2-1.1 1.8-2.2-.4-2-2.2-3.6-4.4-3.6z" fill="currentColor"/>',
  portfolio:
    '<path d="M12 2.5c-3.8.8-6 3.5-6.5 7.5l2.5 2.5 1.5-1 .5 4.5-2 2 1.5 1.5 3.5-3 3.5-4.5 1 1.5 2.5-2.5c-.5-4-2.7-6.7-7.5-7.5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="8" r="1.6" fill="currentColor"/>',
  capivara:
    '<path d="M4.5 13C4.5 8 8 4.5 12 4.5S19.5 8 19.5 13c0 3.5-2.5 6-7.5 6s-7.5-2.5-7.5-6z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9.5 11.5c.6.6 1.6.6 2.2 0M12.3 11.5c.6.6 1.6.6 2.2 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M10 16c1.2.8 2.8.8 4 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  tatuengine:
    '<path d="M3 12c2.5-4 5-4 7.5 0s5 4 7.5 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M3 17c2.5-4 5-4 7.5 0s5 4 7.5 0" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>',
  seguranca:
    '<path d="M12 3l7 2.5v5.2c0 4.4-3 7.6-7 9.3-4-1.7-7-4.9-7-9.3V5.5L12 3z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9.2 11.8l2 2 3.6-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  lifelog:
    '<path d="M12 5.5C10 4 7 4 4.5 4.8V19c2.5-.8 5.5-.8 7.5.7 2-1.5 5-1.5 7.5-.7V4.8C17 4 14 4 12 5.5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 5.5V19.7" stroke="currentColor" stroke-width="1.5"/>',
  estudos:
    '<path d="M12 4L2.5 8.5 12 13l9.5-4.5L12 4z" fill="currentColor" opacity="0.85"/><path d="M6.5 10.5v4c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M21.5 8.5V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  descobertas:
    '<path d="M12 3c-3 0-5 2.2-5 5 0 1.8.8 3 1.8 4.2.7.9 1.2 1.6 1.2 2.8h4c0-1.2.5-1.9 1.2-2.8C16.2 11 17 9.8 17 8c0-2.8-2-5-5-5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 16.5h4M10.5 19h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
};

const FALLBACK =
  '<path d="M12 4.5C7 4.5 3.5 7.8 3.5 12s3.5 7.5 8.5 7.5 8.5-3.3 8.5-7.5S17 4.5 12 4.5z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v5M12 15.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>';

export default function ProjectIcon({ project, size = 16 }: { project: string; size?: number }) {
  const content = ICONS[project] || FALLBACK;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "block", flexShrink: 0 }}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
