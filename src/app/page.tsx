import { Suspense } from "react";
import dynamic from "next/dynamic";
import { ProfileSection } from "@/components/ProfileSection";
import { ProjectHangar } from "@/components/ProjectHangar";
import { GameShowcase } from "@/components/GameShowcase";
import { HangarSkeleton } from "@/components/HangarSkeleton";
import { GlassSkeleton } from "@/components/Skeleton";
import { getRepos } from "@/lib/github";
import { STATIC_PROJECTS, GAME_PROJECTS } from "@/lib/staticProjects";
import { ContactForm } from "@/components/ContactForm";

const Terminal = dynamic(
  () => import("@/components/Terminal").then((m) => ({ default: m.Terminal })),
  { loading: () => <GlassSkeleton className="max-w-3xl mx-auto mt-12" /> }
);

async function HangarWithData() {
  const repos = await getRepos();
  const filteredRepos = repos.filter((r) => r.name !== "SamuelFmedeiros");
  
  // Merge static + API, deduplicating by name (static data takes precedence for featured fields)
  const repoMap = new Map<string, typeof STATIC_PROJECTS[0]>();
  for (const r of filteredRepos) repoMap.set(r.name, r);
  for (const r of STATIC_PROJECTS) repoMap.set(r.name, r);
  const allProjects = Array.from(repoMap.values());

  // Split games from other projects
  const games = allProjects.filter((r) => GAME_PROJECTS.includes(r.name));
  const projects = allProjects.filter((r) => !GAME_PROJECTS.includes(r.name));

  return (
    <>
      <ProjectHangar repos={projects} title="▸ PROJETOS" />
      {games.length > 0 && (
        <section id="games" className="scroll-mt-20">
          <GameShowcase repos={games} />
        </section>
      )}
    </>
  );
}

export default function Home() {
  return (
    <>
      <div className="section-wrapper">
        <ProfileSection />
        <section id="projects" className="scroll-mt-20">
          <Suspense fallback={<HangarSkeleton />}>
            <HangarWithData />
          </Suspense>
        </section>
        <section id="terminal" className="scroll-mt-20">
          <Terminal />
        </section>
        <section id="contact" className="scroll-mt-20">
          <ContactForm />
        </section>
      </div>
    </>
  );
}
