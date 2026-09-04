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
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // Variantes de travessão/hífen do LLM (–, —, −, ‒, ―) viram hífen simples:
    // LLM escreve "2025 - Atual" e o CV tem "2025 — Atual" → match.
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    // Variante de URL (www., protocolo, barra final) some → match:
    // "linkedin.com/in/x" casa com "https://www.linkedin.com/in/x".
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "")
    .trim();
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

  // 6) Highlights: strings curtas que DEVEM casar com skills reais do CV.
  //    São chips de competência no header — inventar uma competência aqui
  //    é tão grave quanto inventar skill, então o highlight precisa ter
  //    correspondência (substring, ci) com skills ou bullets reais.
  if (r.highlights !== undefined && !needStrArray(r.highlights)) {
    reasons.push("highlights precisa ser array de strings.");
  } else if (Array.isArray(r.highlights)) {
    if (r.highlights.length > 5) {
      reasons.push("highlights deve ter no máximo 5 itens.");
    }
    const knownTerms = [
      ...base.skills.map(normalizeStr),
      ...base.experiences.flatMap((e) => e.bullets).map(normalizeStr),
    ].filter(Boolean);
    for (const h of r.highlights) {
      const nh = normalizeStr(h);
      if (nh.length === 0) continue;
      // Termo curto demais (1 token) não é uma competência confiável.
      if (nh.split(/\s+/).length > 4) {
        reasons.push(`Highlight muito longo: "${h.slice(0, 60)}"`);
        continue;
      }
      const matched = knownTerms.some((t) => t.includes(nh) || nh.includes(t));
      if (!matched) {
        reasons.push(`Highlight inventado: "${h.slice(0, 60)}" — deve casar com uma skill real do CV.`);
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
    highlights: needStrArray(r.highlights) ? r.highlights : undefined,
    jobMatch: cleanJobMatch(r.jobMatch),
  };

  return { ok: true, reasons: [], resume };
}


// ─── jobMatch (V5): bullets "Match com a vaga" ───────────────────────
// Campo cosmético — nunca gera violação/422: itens inválidos são
// descartados silenciosamente (melhor entregar sem o bullet do que
// falhar a geração inteira por causa de um enfeite).
const JOB_MATCH_MAX = 4;
const JOB_MATCH_MAX_LEN = 240;

function cleanJobMatch(items: unknown): string[] | undefined {
  if (!Array.isArray(items)) return undefined;
  const cleaned = items
    .filter((x): x is string => typeof x === "string")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.length <= JOB_MATCH_MAX_LEN)
    .filter((s) => !/(https?:\/\/|\.com|\.br|\.org)/i.test(s))
    .slice(0, JOB_MATCH_MAX);
  return cleaned.length > 0 ? cleaned : undefined;
}

// Sanitização suave: remove highlights que não casam com o CV real.
// Chips são cosméticos — melhor entregar sem o chip inventado do que
// falhar a geração inteira. Outras violações (empresa/formação) seguem 422.
export function sanitizeResumeSoft(json: unknown, base: ResumeData): unknown {
  if (!json || typeof json !== "object") return json;
  const r = json as Record<string, unknown>;
  if (Array.isArray(r.highlights)) {
    const knownTerms = [
      ...base.skills.map(normalizeStr),
      ...base.experiences.flatMap((e) => e.bullets).map(normalizeStr),
    ].filter(Boolean);
    r.highlights = (r.highlights as unknown[])
      .filter((h): h is string => typeof h === "string" && h.trim().length > 0)
      .filter((h) => {
        const nh = normalizeStr(h);
        if (nh.split(/\s+/).length > 4) return false;
        return knownTerms.some((t) => t.includes(nh) || nh.includes(t));
      })
      .slice(0, 5);
    if ((r.highlights as string[]).length === 0) delete r.highlights;
  }
  return r;
}

// Sanitização dura: último degrau antes do 422. Reescreve TODOS os
// campos imutáveis com os dados reais do CV (nome, contato, empresa,
// cargo, período, formação) e mantém do LLM apenas o que é tailored
// (objetivo, resumo, bullets, skills, highlights). Assim a violação
// nunca chega ao PDF — a IA não consegue inventar dado imutável.
export function sanitizeResumeHard(json: unknown, base: ResumeData): ResumeData {
  const r = (json && typeof json === "object" ? json : {}) as Record<string, unknown>;
  const contact = (r.contact ?? {}) as Record<string, unknown>;
  const str = (v: unknown): string => (typeof v === "string" ? v : "");

  const baseExp = Array.isArray(r.experiences) ? (r.experiences as unknown[]) : [];
  // Cada experiência do LLM herda empresa/período REAIS por posição;
  // título e bullets ficam do LLM (podem ser reordenados/parafraseados,
  // mas sem inventar vínculo empregatício novo).
  const experiences = baseExp.length > 0
    ? baseExp.slice(0, base.experiences.length).map((e, i) => {
        const x = (e && typeof e === "object" ? e : {}) as Record<string, unknown>;
        const bullets = Array.isArray(x.bullets)
          ? (x.bullets as unknown[]).filter((b): b is string => typeof b === "string" && b.trim().length > 0)
          : [];
        return {
          title: str(x.title) || base.experiences[i].title,
          company: base.experiences[i].company,
          period: base.experiences[i].period,
          bullets: bullets.length > 0 ? bullets : base.experiences[i].bullets,
        };
      })
    : base.experiences;

  return {
    name: base.name,
    role: str(r.role) || base.role,
    contact: {
      location: base.contact.location,
      phone: base.contact.phone,
      email: base.contact.email,
      linkedin: base.contact.linkedin,
      site: base.contact.site,
      github: base.contact.github,
    },
    objective: str(r.objective) || base.objective,
    summary: str(r.summary) || base.summary,
    experiences,
    education: base.education,
    skills: Array.isArray(r.skills)
      ? (r.skills as unknown[]).filter((s): s is string => typeof s === "string" && s.trim().length > 0).slice(0, 12)
      : base.skills,
    highlights: Array.isArray(r.highlights)
      ? (r.highlights as unknown[]).filter((h): h is string => typeof h === "string" && h.trim().length > 0).slice(0, 5)
      : undefined,
    jobMatch: cleanJobMatch(r.jobMatch),
  };
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

// ─── Guardrail de relevância: o input é sobre uma vaga/empresa/área? ──
// Se o usuário escrever algo NÃO relacionado a vaga/currículo (texto
// aleatório, piada, pergunta, receita etc.), NÃO chamamos a IA: a resposta
// deve ser o PDF normal do site (standard resume).
const JOB_KEYWORDS_PT = [
  "vaga", "cargo", "empresa", "emprego", "trabalho", "posição", "área", "área de",
  "analista", "desenvolvedor", "engenheiro", "estágio", "estagiário", "trainee",
  "júnior", "junior", "pleno", "sênior", "senior", "full stack", "front-end", "backend",
  "frontend", "backend", "dev", "programador", "recrutamento", "seleção", "contratação",
  "salário", "benefícios", "remoto", "presencial", "híbrido", "time", "equipe",
  "stack", "requisitos", "responsabilidades", "atividades", "atribuições",
  "candidatar", "aplicar", "linkedin", "vagas", "vaga de", "oportunidade",
  "product manager", "gerente", "coordena", "supervisor", "assistente", "suporte",
  "dados", "data science", "power bi", "sql", "python", "react", "next.js",
];
const JOB_KEYWORDS_EN = [
  "job", "position", "role", "company", "vacancy", "opening", "opportunity",
  "developer", "engineer", "analyst", "intern", "internship", "trainee",
  "junior", "senior", "mid", "full stack", "frontend", "backend", "dev",
  "programmer", "hiring", "recruitment", "salary", "benefits", "remote",
  "onsite", "hybrid", "team", "stack", "requirements", "responsibilities",
  "apply", "linkedin", "product manager", "manager", "supervisor", "assistant",
  "support", "data", "data science", "power bi", "sql", "python", "react", "next.js",
];

// Sinais claros de que o input NÃO é sobre vaga/currículo
const NON_JOB_SIGNALS: RegExp[] = [
  /(conte|escreva|faça|faz|me diga|me fala|explique|traduza|traduz|crie|gera|gerar|desenha|desenhar)\s/i,
  /(tell|write|make|create|generate|explain|translate|describe|draw)\s/i,
  /(piada|poema|história|historia|receita|música|musica|filme|jogo|segredo|amigo|namorada|namorado)\b/i,
  /(joke|poem|story|recipe|song|movie|game|secret|friend|girlfriend|boyfriend)\b/i,
  /(qual|quem|quando|onde|por que|porque|como)\s/i,
  /(what|who|when|where|why|how)\s/i,
  /^[^a-zA-Zà-ú]{0,3}$/i,
];

/**
 * Retorna true se o input parece descrever uma vaga/empresa/área de
 * trabalho (algo sério o suficiente para personalizar o currículo).
 * Texto aleatório/gibberish/piada/pergunta → false.
 */
export function looksLikeJobRequest(input: string): boolean {
  const text = input.toLowerCase().trim();
  if (text.length < 4) return false;

  // Conta keywords ÚNICAS de vaga (Set — "dev"/"data" existem em PT e EN)
  const found = new Set<string>();
  for (const kw of JOB_KEYWORDS_PT) if (text.includes(kw)) found.add(kw);
  for (const kw of JOB_KEYWORDS_EN) if (text.includes(kw)) found.add(kw);

  // Sinal claro de conteúdo não-job (pergunta/piada/comando de texto):
  // vence a menos que haja MUITAS keywords de vaga (≥4).
  const hasNonJobSignal = NON_JOB_SIGNALS.some((re) => re.test(text));
  if (hasNonJobSignal && found.size < 4) return false;

  // 2+ keywords de vaga → é sobre vaga
  return found.size >= 2;
}

// ─── Detecção de idioma do input (pt vs en) ──────────────────────────
const EN_STRONG = [
  "job", "position", "role", "company", "vacancy", "opening", "hiring",
  "recruitment", "developer", "engineer", "analyst", "intern", "internship",
  "salary", "benefits", "remote", "team", "requirements", "responsibilities",
  "apply",
  // Inglês genérico (precisa disso p/ inputs não-job em inglês)
  "the", "and", "with", "for", "you", "we", "our", "your", "about", "that",
  "this", "not", "are", "was", "were", "have", "has", "had", "will", "would",
  "can", "could", "should", "from", "they", "their", "them", "there", "which",
  "what", "when", "where", "who", "how", "why", "all", "one", "more", "some",
  "tell", "write", "make", "story", "people", "time", "just", "like", "know",
  "good", "great", "new", "old", "thing", "world", "work", "life", "day", "way",
];
const PT_STRONG = [
  "vaga", "cargo", "empresa", "emprego", "trabalho", "posição", "área",
  "analista", "desenvolvedor", "engenheiro", "estágio", "estagiário",
  "salário", "benefícios", "remoto", "equipe", "requisitos", "responsabilidades",
  "candidatar", "você", "nós", "nossa", "nosso", "sua", "seu", "para", "com", "que",
];

/** Detecta se o input foi escrito em inglês (retorna "en") ou português. */
export function detectInputLocale(input: string): "pt" | "en" {
  const text = input.toLowerCase().trim();
  if (!text) return "pt";

  let enHits = 0;
  let ptHits = 0;

  // Sinal forte: caracteres acentuados do português
  if (/[à-úà-úãõâêîôûç]/.test(input.toLowerCase())) ptHits += 2;

  for (const kw of EN_STRONG) if (text.includes(kw)) enHits++;
  for (const kw of PT_STRONG) if (text.includes(kw)) ptHits++;

  if (enHits > ptHits) return "en";
  return "pt";
}
