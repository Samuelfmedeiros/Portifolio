import { Suspense } from "react";
import { ProfileSection } from "@/components/ProfileSection";
import { ProjectHangar } from "@/components/ProjectHangar";
import { HangarSkeleton } from "@/components/HangarSkeleton";
import { FadeInSection } from "@/components/FadeInSection";
import { LazyGameShowcase } from "@/components/LazyGameShowcase";
import { LazyContactForm } from "@/components/LazyContactForm";
import { getRepos } from "@/lib/github";
import { STATIC_PROJECTS, GAME_PROJECTS } from "@/lib/staticProjects";
import { BlogSection } from "@/components/BlogSection";
import { getLatestLifelogPosts } from "@/lib/lifelogRss";

// ISR: revalida a página a cada 30min — garante que posts novos do LifeLog
// apareçam na seção Blog sem precisar de novo deploy (Samuel 09/08/2026).
export const revalidate = 1800;

async function HangarWithData() {
  const repos = await getRepos();
  const filteredRepos = repos.filter(
    (r) => r.name !== "SamuelFmedeiros" && r.name !== "arachne-mcp" && r.name !== "Arachne_Os_Crawl"
  );

  // Merge static + API, deduplicating by name (static data takes precedence for featured fields)
  const repoMap = new Map<string, typeof STATIC_PROJECTS[0]>();
  for (const r of filteredRepos) repoMap.set(r.name, r);
  for (const r of STATIC_PROJECTS) repoMap.set(r.name, r);
  const allProjects = Array.from(repoMap.values());
  // DogWalk primeiro (Samuel: "Dog walk deve ser primeiro projeto")
  allProjects.sort((a, b) => {
    if (a.name === 'DogWalk') return -1;
    if (b.name === 'DogWalk') return 1;
    return 0;
  });

  // Split games from other projects
  const games = allProjects.filter((r) => GAME_PROJECTS.includes(r.name));
  // Sort games by GAME_PROJECTS order (Samuel: memory-matrix → simon-game → code-typing → terminal → asteroid-dodge)
  games.sort((a, b) => GAME_PROJECTS.indexOf(a.name) - GAME_PROJECTS.indexOf(b.name));
  const projects = allProjects.filter((r) => !GAME_PROJECTS.includes(r.name));

  return (
    <>
      <ProjectHangar repos={projects} />
      {games.length > 0 && (
        <section id="games" className="scroll-mt-20">
          {/* 🔴 Bloco perf 12/08/2026 — lazy-hydration via LazyGameShowcase */}
          <LazyGameShowcase repos={games} />
        </section>
      )}
    </>
  );
}

async function BlogWithData() {
  const posts = await getLatestLifelogPosts();
  return <BlogSection posts={posts} />;
}

export default function Home() {
  return (
    <>
      <div className="section-wrapper">
        <ProfileSection />
        <FadeInSection delay={0.1}>
          <section id="projects" className="scroll-mt-20">
            <Suspense fallback={<HangarSkeleton />}>
              <HangarWithData />
            </Suspense>
          </section>
        </FadeInSection>
        <FadeInSection delay={0.2}>
          <section id="blog" className="scroll-mt-20">
            <Suspense fallback={null}>
              <BlogWithData />
            </Suspense>
          </section>
        </FadeInSection>
        <FadeInSection delay={0.3}>
          <section id="contact" className="scroll-mt-20">
            {/* 🔴 Bloco perf 12/08/2026 — lazy-hydration via LazyContactForm */}
            <LazyContactForm />
          </section>
        </FadeInSection>
      </div>
    </>
  );
}
