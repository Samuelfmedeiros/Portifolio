import type { Repo } from "./types";

const GITHUB_API = "https://api.github.com/users/Samuelfmedeiros/repos";
const CACHE_TTL = 3600; // 1 hour ISR

export async function getRepos(): Promise<Repo[]> {
  const res = await fetch(
    `${GITHUB_API}?per_page=20&sort=updated`,
    {
      next: { revalidate: CACHE_TTL },
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  const repos: Repo[] = await res.json();
  return repos.filter((r) => !r.name.includes("test"));
}
