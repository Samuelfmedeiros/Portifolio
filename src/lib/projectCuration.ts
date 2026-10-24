import type { Repo } from "./types";
import { GITHUB_ALIASES } from "./staticProjects";

/**
 * Curadoria da grade de projetos (Samuel 24/10/2026).
 *
 * A grade NÃO é alimentada por "repos mais recentes": só entra repo do GitHub
 * que tenha o topic `featured` — promoção é ato explícito, igual ao catálogo
 * estático. Forks ficam de fora (não são projeto dele) e repos de skill
 * (`agent-skills`) também: skills já são representadas pelo card "Skills Shop".
 */
export const CURATED_TOPIC = "featured";

/** Repos que nunca viram card, mesmo com o topic. */
export const NEVER_LISTED = [
  "SamuelFmedeiros",
  "arachne-mcp",
  "Arachne_Os_Crawl",
] as const;

export function isCuratedRepo(r: Pick<Repo, "name" | "fork" | "topics">): boolean {
  if (r.fork) return false;
  const topics = r.topics ?? [];
  if (!topics.includes(CURATED_TOPIC)) return false;
  if (topics.includes("agent-skills")) return false;
  if ((NEVER_LISTED as readonly string[]).includes(r.name)) return false;
  if (GITHUB_ALIASES.includes(r.name)) return false;
  return true;
}
