// Guardrails do Resume Tailor — módulo puro (sem Next) p/ ser testável.
// 1) Blocklist de prompt injection no input do usuário.
// 2) Validação do JSON de saída contra os dados imutáveis do CV.
// 3) Parse robusto do JSON do LLM.
import type { ResumeData } from "./resumeData";

// ─── Guardrails de input: blocklist de prompt injection ─────────────
export const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?(previous|prior|above|the)/i,
  /esqueça\s+(tudo\s+)?(o\s+)?(que|as instruções|as regras)/i,
  /ignore\s+(as|the)\s+(instru|rules)/i,
  /disregard\s+(the\s+)?(above|instructions|prompt)/i,
  /system\s*(:|prompt)/i,
  /reveal\s+(your|the)\s*(system|prompt)/i,
  /mostre\s+(seu|o)\s*(prompt|sistema|system)/i,
  /ignore\s+(your\s+)?(system|developer)\s*prompt/i,
  /(act|behave)\s+as\s+(if\s+)?you\s+are/i,
  /(agora|você)\s+(é|e|eh)\s+(um|o)\s+(agente|chatgpt|assistente|diferente)/i,
  /(you\s+are\s+now|now\s+you\s+are)\s+/i,
  /jailbreak/i,
  /dan\s*mode/i,
  /(inje(c|ç)(ã|a)o|injection)\s+de\s+prompt/i,
  /dev\s*mode/i,
  /sem\s*(regras|limites|filtros)/i,
  /no\s*(rules|limits|filters)/i,
  /(call|chamar)\s+(an?|o)\s*(api|url|endpoint|http)/i,
  /openai\.(com|org)/i,
  /(\/\*|__|import\s+|\brequire\s*\(|\bfetch\s*\()/i,
];

export function looksLikeInjection(input: string): boolean {
  return INJECTION_PATTERNS.some((re) => re.test(input));
}

// ─── Validação do JSON de saída ──────────────────────────────────────
export interface ValidateResult {
  ok: boolean;
  reasons: string[];
  resume: ResumeData | null;
}

const IMMUTABLE_CONTACT_KEYS = ["email", "linkedin", "site", "github"] as const;

function normalizeStr(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

export function validateResumeOutput(json: unknown, base: ResumeData): ValidateResult {
  const reasons: string[] = [];
  if (!json || typeof json !== "object") {
    return { ok: false, reasons: ["JSON de saída não é um objeto."], resume: null };
  }
  const r = json as Record<string, unknown>;

  const needStr = (v: unknown): v is string => typeof v === "string" && v.length > 0;
  const needStrArray = (v: unknown): v is string[] =>
    Array.isArray(v) && v.every((x) => typeof x === "string" && x.length > 0);

  if (!needStr(r.name)) reasons.push("name ausente ou inválido.");
  if (!needStr(r.role)) reasons.push("role ausente ou inválido.");
  if (!Array.isArray(r.experiences)) reasons.push("experiences precisa ser array.");

  // 1) Nome imutável
  if (needStr(r.name) && normalizeStr(r.name) !== normalizeStr(base.name)) {
    reasons.push("O nome foi alterado. Deve ser exatamente: " + base.name);
  }

  // 2) Contato imutável
  const contact = (r.contact ?? {}) as Record<string, unknown>;
  for (const key of IMMUTABLE_CONTACT_KEYS) {
    const v = contact[key];
    const bv = (base.contact as Record<string, string>)[key];
    if (v !== undefined && bv && normalizeStr(String(v)) !== normalizeStr(bv)) {
      reasons.push(`Contato (${key}) foi alterado. Deve ser: ${bv}`);
    }
  }

  // 3) Empresas e períodos imutáveis
  const baseCompanies = base.experiences.map((e) => normalizeStr(e.company));
  const baseTitles = base.experiences.map((e) => normalizeStr(e.title));
  const basePeriods = base.experiences.map((e) => normalizeStr(e.period));

  if (Array.isArray(r.experiences)) {
    r.experiences.forEach((exp, i) => {
      const e = exp as Record<string, unknown>;
      const company = e.company ? normalizeStr(String(e.company)) : "";
      const title = e.title ? normalizeStr(String(e.title)) : "";
      const period = e.period ? normalizeStr(String(e.period)) : "";

      const companyMatch = baseCompanies.some((bc) => company.includes(bc) || bc.includes(company));
      if (company && !companyMatch) {
        reasons.push(`Empresa inventada na experiência ${i + 1}: "${e.company}". Só pode usar: ${base.experiences.map((x) => x.company).join(", ")}`);
      }
      const titleMatch = baseTitles.some((bt) => title.includes(bt) || bt.includes(title));
      if (title && !titleMatch && !companyMatch) {
        reasons.push(`Cargo inventado na experiência ${i + 1}: "${e.title}". Use um cargo real do CV.`);
      }
      const periodMatch = basePeriods.some((bp) => period === bp || period.includes(bp) || bp.includes(period));
      if (period && !periodMatch) {
        reasons.push(`Período inventado na experiência ${i + 1}: "${e.period}". Use: ${base.experiences.map((x) => x.period).join(", ")}`);
      }
    });
  }

  // 4) Formação imutável
  if (r.education !== undefined && !needStrArray(r.education)) {
    reasons.push("education precisa ser array de strings.");
  } else if (Array.isArray(r.education)) {
    const baseEdu = base.education.map(normalizeStr);
    for (const item of r.education) {
      const ni = normalizeStr(item);
      if (!baseEdu.some((b) => ni.includes(b) || b.includes(ni))) {
        reasons.push(`Formação inventada: "${item}". Use apenas as formações reais.`);
      }
    }
  }

  // 5) Skills: array de strings, sem inventar dados sensíveis/URLs
  if (r.skills !== undefined && !needStrArray(r.skills)) {
    reasons.push("skills precisa ser array de strings.");
  }
  if (Array.isArray(r.skills)) {
    for (const s of r.skills) {
      if (/(https?:\/\/|\.com|\.br|\.org)/i.test(s)) {
        reasons.push(`Skill contém URL suspeita: "${s.slice(0, 60)}"`);
      }
    }
  }

  if (reasons.length > 0) {
    return { ok: false, reasons, resume: null };
  }

  // Monta o resume sanitizado (só campos conhecidos, tipos garantidos)
  const resume: ResumeData = {
    name: typeof r.name === "string" ? r.name : base.name,
    role: typeof r.role === "string" ? r.role : base.role,
    contact: {
      location: typeof contact.location === "string" ? contact.location : base.contact.location,
      phone: typeof contact.phone === "string" ? contact.phone : base.contact.phone,
      email: base.contact.email,
      linkedin: base.contact.linkedin,
      site: base.contact.site,
      github: base.contact.github,
    },
    objective: typeof r.objective === "string" ? r.objective : base.objective,
    summary: typeof r.summary === "string" ? r.summary : base.summary,
    experiences: Array.isArray(r.experiences)
      ? r.experiences.map((e) => {
          const x = e as Record<string, unknown>;
          return {
            title: typeof x.title === "string" ? x.title : "",
            company: typeof x.company === "string" ? x.company : "",
            period: typeof x.period === "string" ? x.period : "",
            bullets: Array.isArray(x.bullets) ? x.bullets.filter((b): b is string => typeof b === "string") : [],
          };
        })
      : base.experiences,
    education: needStrArray(r.education) ? r.education : base.education,
    skills: needStrArray(r.skills) ? r.skills : base.skills,
  };

  return { ok: true, reasons: [], resume };
}

// ─── Parse robusto do JSON do LLM ────────────────────────────────────
export function parseLLMJson(content: string): unknown {
  const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const fenceFree = cleaned.replace(/^```+|\n```+$/g, "");
  const start = fenceFree.indexOf("{");
  const end = fenceFree.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) throw new Error("no JSON object found");
  return JSON.parse(fenceFree.slice(start, end + 1));
}
