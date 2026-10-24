import type { Repo } from "./types";

const GITHUB_API = "https://api.github.com/users/Samuelfmedeiros/repos";
const CACHE_TTL = 3600; // 1 hour ISR
const FETCH_TIMEOUT_MS = 5000; // aborta fetch lento — não segura o TTFB do ISR
// 100 = teto da API numa página: garante que repo marcado como `featured`
// nunca fique de fora por paginação (curadoria vive em projectCuration.ts).
const PER_PAGE = 100;

export async function getRepos(): Promise<Repo[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(
      `${GITHUB_API}?per_page=${PER_PAGE}`,
      {
        next: { revalidate: CACHE_TTL },
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        // Don't let fetch errors crash the build
        cache: "force-cache",
        signal: controller.signal,
      }
    );
    clearTimeout(timer);

    if (!res.ok) {
      console.warn(`GitHub API error: ${res.status} ${res.statusText} — falling back to static projects`);
      return [];
    }

    const repos: Repo[] = await res.json();
    // Sem filtro de nome aqui: quem decide o que vira card é isCuratedRepo.
    return repos;
  } catch (err) {
    console.warn(`GitHub API fetch failed: ${err} — falling back to static projects`);
    return [];
  }
}
