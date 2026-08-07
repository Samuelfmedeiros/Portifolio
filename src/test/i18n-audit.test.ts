// @ts-nocheck — teste de auditoria que lê arquivos (node fs); o tsconfig do app
// não inclui types:["node"], então o typecheck estrito não se aplica aqui.
/**
 * i18n Audit Test — garante que NENHUM texto PT visível esteja hardcoded
 * fora de t()/dicionário nos componentes principais.
 *
 * Falha no CI se encontrar → impede regressão de tradução.
 *
 * Samuel pediu (07/08/2026): após a varredura profunda que achou vários
 * hardcoded (botoes, aria-labels, modais), criar teste que impede voltar.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const COMPONENTS = [
  "src/components/HeroSection.tsx",
  "src/components/Navbar.tsx",
  "src/components/Footer.tsx",
  "src/components/ProfileSection.tsx",
  "src/components/UnifiedProfile.tsx",
  "src/components/ProjectHangar.tsx",
  "src/components/GameShowcase.tsx",
  "src/components/ContactForm.tsx",
  "src/components/PalettePicker.tsx",
  "src/components/SupportButton.tsx",
  "src/components/ConsultingButton.tsx",
  "src/components/UtilityDeck.tsx",
  "src/components/CookieBanner.tsx",
  "src/components/DownloadModal.tsx",
];

/** Palavras PT que NÃO podem aparecer hardcoded fora de t() */
const PT_PATTERN =
  /\b(Início|Inicio|Jornada|Projetos|Habilidades|Contato|Sobre|Voltar|Fechar|Baixar|Enviar|Nome|Email|Mensagem|Carregando|Todos|Filtros|Buscar|Pesquisar|Experiência|Educação|Formação|Certificação|Currículo|Curriculo|Idioma|Tema|Ver projetos|Ver Projetos|Saiba mais|Leia mais|Clique|Digite|Concluído|Sucesso|Erro|Cancelar|Confirmar|Salvar|Copiar|Roxo|Ciano|Verde|Âmbar|Rosa|Azul|Escuro|Claro|Compartilhar|Seguidores|Contribuições|Linguagens|Repos|Redes|Siga|Visite|Acesse|Apoiar|Apoie|Chave Pix|Pagamento|Contribuição|Escaneie|Enviando|Descrição|Habilidades técnicas|Informações de contato|Limpa o terminal|Data e hora|Nome do usuário|Alterna o tema|Tech stack|Info do GitHub|System info|Lista arquivos|Mostra diretório|Repete o texto|Mostra o banner|Citação inspiradora|Informações de rede|Ping em um servidor|Informações sobre alguém|Vaca falante|Coloca Samuel no holofote|EASTER EGGS|Repara PATH|Modo Noturno|Efeito Matrix|Não faça isso)\b/;

/** Termos técnicos/marcas/nomes próprios que são permitidos hardcoded */
const ALLOWED = new Set([
  "Next.js", "React", "Python", "SQL", "GitHub", "Docker", "TypeScript",
  "Power BI", "Tailwind", "Cloudflare", "Framer", "Lucide", "FastAPI",
  "PostgreSQL", "Supabase", "Linux", "Azure", "Excel", "DAX", "Ollama",
  "Whisper", "Mamba", "RAG", "SSM", "CI", "CD", "PDF", "ANA", "IESB",
  "TRT", "Samuel Medeiros", "Brasília", "DF", "Brasil", "Pix", "QR Code",
  "Buy Me a Coffee", "Email", "Coffee", "Sponsor", "LinkedIn", "WhatsApp",
  "Resume", "CV",
]);

function extractText(line: string): string[] {
  const found: string[] = [];
  // JSX text: >texto<
  const jsxRe = />([^<>{}]{2,60})</g;
  // attrs: aria-label/placeholder/title/alt
  const attrRe = /(?:aria-label|placeholder|title|alt)="([^"]{2,80})"/g;
  for (const re of [jsxRe, attrRe]) {
    let m;
    while ((m = re.exec(line)) !== null) {
      found.push(m[1].trim());
    }
  }
  return found;
}

function isAllowed(text: string): boolean {
  const trimmed = text.replace(/[—–·•]/g, " ").trim();
  if (ALLOWED.has(trimmed)) return true;
  // Se o texto inteiro é nome próprio/marca, ignora
  return false;
}

describe("i18n audit — zero PT hardcoded fora de t()", () => {
  it("não encontra texto PT visível fora de t() nos componentes", () => {
    const violations: string[] = [];

    for (const comp of COMPONENTS) {
      if (!existsSync(join(process.cwd(), comp))) continue;
      const lines = readFileSync(join(process.cwd(), comp), "utf8").split("\n");

      lines.forEach((line, idx) => {
        // Pula linhas que já usam t()
        if (line.includes("t(")) return;
        // Pula comentários/imports/exports/types
        const trimmed = line.trim();
        if (trimmed.startsWith("//") || trimmed.startsWith("/*") ||
            trimmed.startsWith("* ") || trimmed.startsWith("import ") ||
            trimmed.startsWith("export ") || trimmed.startsWith("type ") ||
            trimmed.startsWith("interface ")) return;

        const texts = extractText(line);
        for (const text of texts) {
          if (text.length < 2 || !/[A-Za-zÁ-Úá-ú]/.test(text)) continue;
          if (isAllowed(text)) continue;
          if (PT_PATTERN.test(text)) {
            violations.push(`${comp}:${idx + 1} — "${text}"`);
          }
        }
      });
    }

    expect(violations).toEqual([]);
  });
});
