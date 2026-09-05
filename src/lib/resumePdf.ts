import { jsPDF } from "jspdf";
import type { BrandTheme } from "./brandColors";

// Gera o PDF do currículo personalizado (Resume Tailor AI) — ATS-friendly.
// v3 (31/08): design baseado em referências profissionais (VitaeKit Vertex/
// Meridian, ResumGO Queriniana, Resumap Aurora). Embelezamento da marca é
// "por fora": faixa superior, borda esquerda de card, badges, marcadores.
// O TEXTO das palavras é SEMPRE escuro — a cor aparece em molduras.
// 🔴 GLIFOS: usar APENAS WinAnsiEncoding (• · – —) — U+25AA (▪) e outros
// símbolos degradam nas fontes padrão do jsPDF.

export interface ResumePDFData {
  name: string;
  role: string;
  contact?: {
    location?: string;
    phone?: string;
    email?: string;
    linkedin?: string;
    site?: string;
    github?: string;
  };
  objective?: string;
  summary?: string;
  experiences?: { title?: string; company?: string; period?: string; bullets?: string[] }[];
  education?: string[];
  skills?: string[];
}

// Tokens de layout
const PAGE_W = 210; // A4 mm
const PAGE_H = 297;
const MARGIN = 15;
const CONTENT_W = PAGE_W - MARGIN * 2;
const BAND_H = 4.5; // faixa colorida do topo
const BASE = 1.35;

// Cores neutras (sempre para texto)
const INK: [number, number, number] = [20, 20, 20];
const INK_SOFT: [number, number, number] = [75, 75, 75];
const INK_MUTED: [number, number, number] = [115, 115, 115];
const RULE: [number, number, number] = [228, 228, 228];

function toRGB(c: unknown): [number, number, number] {
  if (Array.isArray(c) && c.length === 3) {
    const [r, g, b] = c as [number, number, number];
    return [r, g, b];
  }
  return [20, 20, 20];
}

function mix(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

interface Theme {
  accent: [number, number, number];
  accentTint: [number, number, number];
  accentSoft: [number, number, number];
  hasBrand: boolean;
}

function resolveTheme(theme: BrandTheme | null | undefined): Theme {
  if (!theme) {
    return {
      accent: [30, 30, 30],
      accentTint: [248, 248, 248],
      accentSoft: [130, 130, 130],
      hasBrand: false,
    };
  }
  const accent = toRGB(theme.primary);
  const secondary = toRGB(theme.secondary);
  return {
    accent,
    accentTint: mix(accent, [255, 255, 255], 0.945),
    accentSoft: secondary[0] + secondary[1] + secondary[2] === 0 ? accent : secondary,
    hasBrand: true,
  };
}

export function generateResumePdf(
  r: ResumePDFData,
  locale: "pt" | "en",
  theme?: BrandTheme | null,
): Blob {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const th = resolveTheme(theme);
  const en = locale === "en";

  const L = {
    contact: en ? "Contact" : "Contato",
    objective: en ? "Objective" : "Objetivo",
    summary: en ? "Professional Summary" : "Resumo Profissional",
    experience: en ? "Professional Experience" : "Experiências Profissionais",
    education: en ? "Education" : "Formação Acadêmica",
    skills: en ? "Technical Skills" : "Competências Técnicas",
  };

  // ── Núcleo de medição/desenho (2 passadas p/ altura exata) ──────────
  const wrap = (text: string, opts: { size: number; style: "normal" | "bold" }, indent = 0): string[] => {
    doc.setFont("helvetica", opts.style);
    doc.setFontSize(opts.size);
    const maxW = CONTENT_W - indent;
    const lines: string[] = [];
    for (const raw of text.split("\n")) {
      const parts = doc.splitTextToSize(raw || " ", maxW) as string[];
      for (const p of parts) lines.push(p);
    }
    return lines;
  };

  const LINE_H = (size: number) => size * 0.46;

  let y = MARGIN + BAND_H + 5;

  const drawChrome = () => {
    // Faixa colorida do topo (frame, não texto)
    doc.setFillColor(...th.accent);
    doc.rect(0, 0, PAGE_W, BAND_H, "F");
    // Filete fino abaixo da faixa (accentSoft)
    doc.setDrawColor(...mix(th.accentSoft, [255, 255, 255], 0.35));
    doc.setLineWidth(0.4);
    doc.line(0, BAND_H, PAGE_W, BAND_H);
  };
  drawChrome();

  const ensure = (needed: number) => {
    if (y + needed > PAGE_H - MARGIN) {
      doc.addPage();
      y = MARGIN + BAND_H + 5;
      drawChrome();
    }
  };

  const drawText = (lines: string[], opts: { size: number; style: "normal" | "bold"; color?: [number, number, number] }, indent = 0) => {
    for (const line of lines) {
      ensure(LINE_H(opts.size) + 0.8);
      doc.setFont("helvetica", opts.style);
      doc.setFontSize(opts.size);
      if (opts.color) doc.setTextColor(...opts.color);
      doc.text(line, MARGIN + indent, y);
      y += LINE_H(opts.size);
    }
  };

  // Título de seção: quadradinho accent + label ESCURO + regra fina cinza
  const sectionTitle = (label: string) => {
    ensure(13);
    y += BASE * 2.4;
    doc.setFillColor(...th.accent);
    doc.rect(MARGIN, y - 2.0, 1.5, 3.2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...INK);
    doc.text(label.toUpperCase(), MARGIN + 4.2, y + 0.3);
    y += 2.5;
    doc.setDrawColor(...RULE);
    doc.setLineWidth(0.35);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += BASE * 1.6;
  };

  const bulletGlyph = "\u2022"; // • (WinAnsi-safe, NUNCA ▪)

  // Bullet item com altura exata pré-medida
  const bulletLinesFor = (text: string): string[] => wrap(text, { size: 9.4, style: "normal" }, 5.5);
  const drawBulletLines = (lines: string[]) => {
    for (let i = 0; i < lines.length; i++) {
      ensure(4.0);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.4);
      if (i === 0) {
        doc.setTextColor(...th.accentSoft);
        doc.text(bulletGlyph, MARGIN + 1.8, y);
        doc.setTextColor(...INK);
        doc.text(lines[i], MARGIN + 5.5, y);
      } else {
        doc.setTextColor(...INK);
        doc.text(lines[i], MARGIN + 5.5, y);
      }
      y += 4.0;
    }
  };

  // ── Header: nome + role + contato (tudo ESCURO) ─────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...INK);
  const nameLines = doc.splitTextToSize(r.name || "", CONTENT_W) as string[];
  for (const ln of nameLines) {
    doc.text(ln, MARGIN, y);
    y += 8.4;
  }
  if (r.role) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11.5);
    doc.setTextColor(...INK_SOFT);
    doc.text(r.role, MARGIN, y);
    y += 5.6;
  }
  if (r.contact) {
    const sep = "  \u00B7  "; // · separador (WinAnsi-safe)
    const parts = [r.contact.location, r.contact.phone, r.contact.email].filter(Boolean);
    if (parts.length) drawText(wrap(parts.join(sep), { size: 9, style: "normal" }), { size: 9, style: "normal", color: INK_MUTED });
    const links = [r.contact.linkedin, r.contact.site, r.contact.github].filter(Boolean);
    if (links.length) drawText(wrap(links.join(sep), { size: 8.6, style: "normal" }), { size: 8.6, style: "normal", color: INK_MUTED });
  }
  y += BASE * 1.4;

  // ── Card de experiência com altura EXATA (2 passadas) ────────────────
  const experienceCard = (exp: { title?: string; company?: string; period?: string; bullets?: string[] }) => {
    const title = [exp.title, exp.company].filter(Boolean).join(" — ");
    const period = exp.period || "";
    const padTop = 1.6;
    const padBottom = 1.6;
    const titleLH = 4.7;
    const titleIndent = 5.2;
    const periodIndent = 2.6;

    // Passada 1: medir (altura exata ANTES de desenhar)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    const periodW = period ? doc.getTextWidth(period) + periodIndent : 0;
    const titleLines = doc.splitTextToSize(title, CONTENT_W - titleIndent - periodW) as string[];
    const bulletLines: string[][] = (exp.bullets || []).map((b) => bulletLinesFor(b));
    const contentH =
      padTop +
      titleLines.length * titleLH +
      bulletLines.reduce((acc, bl) => acc + bl.length * 4.0, 0) +
      padBottom;

    // Quebra de página se não couber (sem órfão de título)
    if (y + contentH > PAGE_H - MARGIN && titleLines.length > 0) {
      doc.addPage();
      y = MARGIN + BAND_H + 5;
      drawChrome();
    }

    // Desenhar card: fundo tint + borda esquerda accent + canto
    const cardTop = y - padTop + 0.3;
    doc.setFillColor(...th.accentTint);
    doc.roundedRect(MARGIN, cardTop, CONTENT_W, contentH - 0.5, 1.1, 1.1, "F");
    doc.setFillColor(...th.accent);
    doc.rect(MARGIN, cardTop, 1.2, contentH - 0.5, "F");

    // Título + período (texto escuro)
    y += padTop;
    titleLines.forEach((ln) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...INK);
      doc.text(ln, MARGIN + titleIndent, y);
      y += titleLH;
    });
    if (period) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...INK_SOFT);
      doc.text(period, PAGE_W - MARGIN - doc.getTextWidth(period) - periodIndent, y - titleLH);
    }
    // Bullets
    for (const bl of bulletLines) drawBulletLines(bl);
    y += padBottom;
  };

  // ── Badges (skills / formação) — wrap exato em linhas ────────────────
  const drawBadges = (items: string[], opts: { size: number }) => {
    const gap = 2;
    const padX = 2.6;
    const padY = 1.5;
    const badgeH = opts.size * 0.52 + padY * 2;
    const lineGap = 1.3;

    // Pré-layout das linhas
    const rows: string[][] = [];
    let row: string[] = [];
    let rowW = 0;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(opts.size);
    for (const item of items) {
      const w = doc.getTextWidth(item) + padX * 2;
      if (row.length && rowW + w + gap > CONTENT_W) {
        rows.push(row);
        row = [item];
        rowW = w;
      } else {
        row.push(item);
        rowW += (rowW === 0 ? 0 : gap) + w;
      }
    }
    if (row.length) rows.push(row);

    for (const line of rows) {
      ensure(badgeH + lineGap);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(opts.size);
      let lineX = MARGIN;
      for (const item of line) {
        const w = doc.getTextWidth(item) + padX * 2;
        doc.setDrawColor(...mix(th.accentSoft, [255, 255, 255], 0.45));
        doc.setLineWidth(0.3);
        doc.setFillColor(...th.accentTint);
        doc.roundedRect(lineX, y, w, badgeH, 1.7, 1.7, "FD");
        doc.setTextColor(...INK);
        doc.text(item, lineX + padX, y + padY + opts.size * 0.38);
        lineX += w + gap;
      }
      y += badgeH + lineGap;
    }
    y += BASE * 1.1;
  };

  // ── Conteúdo ─────────────────────────────────────────────────────────
  if (r.objective) {
    sectionTitle(L.objective);
    drawText(wrap(r.objective, { size: 9.4, style: "normal" }), { size: 9.4, style: "normal" });
  }
  if (r.summary) {
    sectionTitle(L.summary);
    drawText(wrap(r.summary, { size: 9.4, style: "normal" }), { size: 9.4, style: "normal" });
  }
  if (r.experiences?.length) {
    sectionTitle(L.experience);
    for (const exp of r.experiences) experienceCard(exp);
  }
  if (r.education?.length) {
    sectionTitle(L.education);
    drawBadges(r.education, { size: 8.8 });
  }
  if (r.skills?.length) {
    sectionTitle(L.skills);
    drawBadges(r.skills, { size: 8.6 });
  }

  return doc.output("blob");
}
