import { jsPDF } from "jspdf";
import type { BrandTheme } from "./brandColors";

// Gera o PDF do currículo personalizado (Resume Tailor AI) — ATS-friendly.
// v4 (03/09): redesign premium p/ caber em 1 página.
//  - Moldura externa dupla (primary + secondary) + cantoneiras
//  - Header sólido na cor da marca com nome branco/escuro por contraste
//  - Contato em coluna à direita (economiza linhas)
//  - Chips de highlights (competências mapeadas da vaga) dentro do header
//  - Cards com borda esquerda grossa + período em badge
//  - Badges com borda primary (não só tint)
// O TEXTO das palavras é SEMPRE escuro (ou branco no header) — a cor
// aparece em molduras/bordas/chips, nunca como cor de texto corrido.
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
  /** Competências-chave mapeadas da descrição da vaga (chips no header). */
  highlights?: string[];
}

// Tokens de layout
const PAGE_W = 210; // A4 mm
const PAGE_H = 297;
const FRAME = 4; // moldura externa
const MARGIN = 11; // conteúdo (após a moldura)
const CONTENT_X = FRAME + MARGIN;
const CONTENT_W = PAGE_W - (FRAME + MARGIN) * 2;
const HEADER_H = 27; // altura do header sólido
const BASE = 1.25;

// Cores neutras (sempre para texto fora do header)
const INK: [number, number, number] = [20, 20, 20];
const INK_SOFT: [number, number, number] = [70, 70, 70];
const INK_MUTED: [number, number, number] = [110, 110, 110];
const RULE: [number, number, number] = [225, 225, 225];
const WHITE: [number, number, number] = [255, 255, 255];

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

/** Luminância relativa (0-1) para decidir texto branco vs escuro no header. */
function luminance(c: [number, number, number]): number {
  return (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255;
}

interface Theme {
  accent: [number, number, number];
  accentTint: [number, number, number];
  accentSoft: [number, number, number];
  /** Cor do texto sobre o header sólido (branco p/ marca escura, INK p/ clara). */
  headerText: [number, number, number];
  headerSub: [number, number, number];
  hasBrand: boolean;
}

function resolveTheme(theme: BrandTheme | null | undefined): Theme {
  if (!theme) {
    return {
      accent: [30, 30, 30],
      accentTint: [248, 248, 248],
      accentSoft: [120, 120, 120],
      headerText: WHITE,
      headerSub: [245, 245, 245],
      hasBrand: false,
    };
  }
  const accent = toRGB(theme.primary);
  const secondary = toRGB(theme.secondary);
  const dark = luminance(accent) < 0.5;
  const headerText: [number, number, number] = dark ? WHITE : INK;
  const headerSub: [number, number, number] = dark ? [238, 238, 238] : [60, 60, 60];
  return {
    accent,
    accentTint: mix(accent, WHITE, 0.88),
    accentSoft: secondary[0] + secondary[1] + secondary[2] === 0 ? accent : secondary,
    headerText,
    headerSub,
    hasBrand: true,
  };
}

/** Remove prefixos http(s)://www. para exibição compacta no header. */
function prettyLink(url?: string): string {
  if (!url) return "";
  return url.replace(/^https?:\/\/(www\.)?/i, "");
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
    objective: en ? "Objective" : "Objetivo",
    summary: en ? "Professional Summary" : "Resumo Profissional",
    experience: en ? "Professional Experience" : "Experiências Profissionais",
    education: en ? "Education" : "Formação Acadêmica",
    skills: en ? "Technical Skills" : "Competências Técnicas",
  };

  // ── Núcleo de medição/desenho ───────────────────────────────────────
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

  const LINE_H = (size: number) => size * 0.42;

  // ── Chrome: moldura + header sólido ─────────────────────────────────
  const drawFrame = () => {
      if (!th.hasBrand) return; // neutro: sem moldura (layout limpo)
      // Moldura simples (primary) — sem filete duplo
      doc.setDrawColor(...th.accent);
      doc.setLineWidth(1.0);
      doc.roundedRect(FRAME, FRAME, PAGE_W - FRAME * 2, PAGE_H - FRAME * 2, 2.5, 2.5, "S");
      // Cantoneiras (secondary) — L nos 4 cantos
      doc.setDrawColor(...th.accentSoft);
      doc.setLineWidth(1.3);
      const c = FRAME + 1.4;
      const arm = 12;
      doc.line(c, c + arm, c, c);
      doc.line(c, c, c + arm, c);
      doc.line(PAGE_W - c, c, PAGE_W - c - arm, c);
      doc.line(PAGE_W - c, c, PAGE_W - c, c + arm);
      doc.line(c, PAGE_H - c, c, PAGE_H - c - arm);
      doc.line(c, PAGE_H - c, c + arm, PAGE_H - c);
      doc.line(PAGE_W - c, PAGE_H - c, PAGE_W - c, PAGE_H - c - arm);
      doc.line(PAGE_W - c, PAGE_H - c, PAGE_W - c - arm, PAGE_H - c);
    };

  const shortLink = (url?: string): string => prettyLink(url).replace(/^linkedin\.com\/in\//, "linkedin.com/in/");

  const drawHeader = () => {
    const top = FRAME + 2;
    // Header sólido na cor da marca (borda superior da moldura respeitada)
    doc.setFillColor(...th.accent);
    doc.rect(FRAME + 1, top, PAGE_W - (FRAME + 1) * 2, HEADER_H, "F");
    // Filete secondary sob o header
    doc.setDrawColor(...th.accentSoft);
    doc.setLineWidth(0.7);
    doc.line(FRAME + 1, top + HEADER_H, PAGE_W - FRAME - 1, top + HEADER_H);

    const rightX = PAGE_W - FRAME - MARGIN;
    const leftW = 112; // largura da área esquerda (nome/role/chips)

    // Nome (máx 2 linhas)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15.5);
    doc.setTextColor(...th.headerText);
    const nameLines = doc.splitTextToSize(r.name || "", leftW) as string[];
    let ny = top + 7;
    for (const ln of nameLines.slice(0, 2)) {
      doc.text(ln, CONTENT_X, ny);
      ny += 5.8;
    }

    // Role
    if (r.role) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...th.headerSub);
      doc.text(r.role, CONTENT_X, ny);
    }

    // Contato à direita (coluna compacta)
    if (r.contact) {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...th.headerSub);
      let cy = top + 6.2;
      const line1 = [r.contact.location, r.contact.phone].filter(Boolean).join("  ·  ");
      const line2 = r.contact.email || "";
      const line3 = shortLink(r.contact.linkedin);
      const line4 = [r.contact.site, r.contact.github].map(prettyLink).filter(Boolean).join("  ·  ");
      const contactLines: { text: string; size: number }[] = [
        { text: line1, size: 7.6 },
        { text: line2, size: 7.4 },
        { text: line3, size: 7.2 },
        { text: line4, size: 7.2 },
      ];
      for (const cl of contactLines) {
        if (!cl.text) continue;
        doc.setFontSize(cl.size);
        // Trunca se exceder a largura da coluna
        const maxW = rightX - CONTENT_X - leftW + 10;
        const t = doc.splitTextToSize(cl.text, maxW) as string[];
        doc.text(t[0], rightX, cy, { align: "right" });
        cy += 3.0;
      }
    }

    // Chips de highlights (na base do header, lado esquerdo)
    const hs = (r.highlights || []).slice(0, 4);
    if (hs.length) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.4);
      let cx = CONTENT_X;
      const cy2 = top + HEADER_H - 3.4;
      const chipH = 5.6;
      const padX = 3.0;
      const gap = 2.0;
      for (const h of hs) {
        const w = doc.getTextWidth(h) + padX * 2;
        if (cx + w > rightX) break;
        doc.setFillColor(...th.headerText);
        doc.setDrawColor(...th.headerText);
        doc.setLineWidth(0.3);
        doc.roundedRect(cx, cy2 - 4.2, w, chipH, 2.8, 2.8, "FD");
        doc.setTextColor(...th.accent);
        doc.text(h, cx + padX, cy2 - 1.3);
        cx += w + gap;
      }
    }
  };

  drawFrame();
  drawHeader();

  let y = FRAME + 2 + HEADER_H + 6;

  const ensure = (needed: number) => {
    if (y + needed > PAGE_H - FRAME - MARGIN) {
      doc.addPage();
      y = FRAME + 2 + HEADER_H + 6;
      drawFrame();
      drawHeader();
    }
  };

  const drawText = (lines: string[], opts: { size: number; style: "normal" | "bold"; color?: [number, number, number] }, indent = 0) => {
    for (const line of lines) {
      ensure(LINE_H(opts.size) + 0.7);
      doc.setFont("helvetica", opts.style);
      doc.setFontSize(opts.size);
      if (opts.color) doc.setTextColor(...opts.color);
      doc.text(line, CONTENT_X + indent, y);
      y += LINE_H(opts.size);
    }
  };

  // Título de seção: quadradinho accent + label ESCURO + regra dupla
  const sectionTitle = (label: string) => {
    ensure(11);
    y += BASE * 2.6;
    doc.setFillColor(...th.accent);
    doc.rect(CONTENT_X, y - 1.9, 1.5, 3.0, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...INK);
    doc.text(label.toUpperCase(), CONTENT_X + 4.0, y + 0.2);
    y += 2.3;
    // Regra dupla: primary grossa + secondary fina
    doc.setDrawColor(...th.accent);
    doc.setLineWidth(0.55);
    doc.line(CONTENT_X, y, PAGE_W - FRAME - MARGIN, y);
    doc.setDrawColor(...mix(th.accentSoft, WHITE, 0.4));
    doc.setLineWidth(0.25);
    doc.line(CONTENT_X, y + 0.9, PAGE_W - FRAME - MARGIN, y + 0.9);
    y += BASE * 1.6;
  };

  const bulletGlyph = "\u2022"; // • (WinAnsi-safe, NUNCA ▪)

  const bulletLinesFor = (text: string): string[] => wrap(text, { size: 8.6, style: "normal" }, 4.8);
  const drawBulletLines = (lines: string[]) => {
    for (let i = 0; i < lines.length; i++) {
      ensure(3.6);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.6);
      if (i === 0) {
        doc.setTextColor(...th.accentSoft);
        doc.text(bulletGlyph, CONTENT_X + 1.5, y);
        doc.setTextColor(...INK);
        doc.text(lines[i], CONTENT_X + 4.8, y);
      } else {
        doc.setTextColor(...INK);
        doc.text(lines[i], CONTENT_X + 4.8, y);
      }
      y += 3.6;
    }
  };

  // ── Card de experiência com altura EXATA (2 passadas) ────────────────
  const experienceCard = (exp: { title?: string; company?: string; period?: string; bullets?: string[] }) => {
    const title = [exp.title, exp.company].filter(Boolean).join(" — ");
    const period = exp.period || "";
    const padTop = 1.4;
        const padBottom = 1.6;
    const titleLH = 4.2;
    const titleIndent = 5.0;
    const periodIndent = 2.6;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.3);
    const periodW = period ? doc.getTextWidth(period) + periodIndent + 3.4 : 0;
    const titleLines = doc.splitTextToSize(title, CONTENT_W - titleIndent - periodW) as string[];
    const bulletLines: string[][] = (exp.bullets || []).map((b) => bulletLinesFor(b));
    const contentH =
      padTop +
      titleLines.length * titleLH +
      bulletLines.reduce((acc, bl) => acc + bl.length * 3.6, 0) +
      padBottom;

    if (y + contentH > PAGE_H - FRAME - MARGIN && titleLines.length > 0) {
      doc.addPage();
      y = FRAME + 2 + HEADER_H + 6;
      drawFrame();
      drawHeader();
    }

    const cardTop = y - padTop + 0.3;
    // Fundo tint + borda esquerda primary grossa + cantos arredondados
    doc.setFillColor(...th.accentTint);
    doc.roundedRect(CONTENT_X, cardTop, CONTENT_W, contentH - 0.4, 1.6, 1.6, "F");
    doc.setFillColor(...th.accent);
    doc.roundedRect(CONTENT_X, cardTop, 2.4, contentH - 0.4, 1.2, 1.2, "F");
    doc.rect(CONTENT_X + 0.6, cardTop + 0.8, 1.2, contentH - 0.4 - 1.6, "F");

    // Título + período (texto escuro; período em badge)
    y += padTop;
    titleLines.forEach((ln) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.3);
      doc.setTextColor(...INK);
      doc.text(ln, CONTENT_X + titleIndent, y);
      y += titleLH;
    });
    if (period) {
      const pw = doc.getTextWidth(period);
      const bx = PAGE_W - FRAME - MARGIN - pw - periodIndent;
      const by = y - titleLH + 0.6;
      doc.setDrawColor(...mix(th.accentSoft, WHITE, 0.35));
      doc.setLineWidth(0.3);
      doc.setFillColor(...WHITE);
      doc.roundedRect(bx - 1.5, by - 2.5, pw + 3, 4.2, 2.1, 2.1, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.6);
      doc.setTextColor(...INK_SOFT);
      doc.text(period, bx, by);
    }
    for (const bl of bulletLines) drawBulletLines(bl);
    y += padBottom;
  };

  // ── Badges (skills / formação) — wrap exato em linhas, com borda ─────
  const drawBadges = (items: string[], opts: { size: number }) => {
    const gap = 1.8;
    const padX = 2.4;
    const padY = 1.3;
    const badgeH = opts.size * 0.5 + padY * 2;
    const lineGap = 1.2;

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
      let lineX = CONTENT_X;
      for (const item of line) {
        const w = doc.getTextWidth(item) + padX * 2;
        doc.setDrawColor(...mix(th.accentSoft, WHITE, 0.25));
        doc.setLineWidth(0.55);
        doc.setFillColor(...th.accentTint);
        doc.roundedRect(lineX, y, w, badgeH, 2.4, 2.4, "FD");
        doc.setTextColor(...INK);
        doc.text(item, lineX + padX, y + padY + opts.size * 0.36);
        lineX += w + gap;
      }
      y += badgeH + lineGap;
    }
    y += BASE * 1.0;
  };

  // ── Conteúdo ─────────────────────────────────────────────────────────
  if (r.objective) {
    sectionTitle(L.objective);
    drawText(wrap(r.objective, { size: 8.8, style: "normal" }), { size: 8.8, style: "normal" });
  }
  if (r.summary) {
    sectionTitle(L.summary);
    drawText(wrap(r.summary, { size: 8.8, style: "normal" }), { size: 8.8, style: "normal" });
  }
  if (r.experiences?.length) {
    sectionTitle(L.experience);
    for (const exp of r.experiences) experienceCard(exp);
  }
  if (r.education?.length) {
    sectionTitle(L.education);
    drawBadges(r.education, { size: 7.8 });
  }
  if (r.skills?.length) {
    sectionTitle(L.skills);
    drawBadges(r.skills.slice(0, 16), { size: 7.6 });
  }

  return doc.output("blob");
}
