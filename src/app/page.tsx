import { Suspense } from "react";
import dynamic from "next/dynamic";
import { ProfileSection } from "@/components/ProfileSection";
import { ProjectHangar } from "@/components/ProjectHangar";
import { HangarSkeleton } from "@/components/HangarSkeleton";
import { GlassSkeleton } from "@/components/Skeleton";
import { getRepos } from "@/lib/github";
import { STATIC_PROJECTS, GAME_PROJECTS } from "@/lib/staticProjects";
import { ContactForm } from "@/components/ContactForm";
import { GitHubStatsSection } from "@/components/GitHubStatsSection";

const Terminal = dynamic(
  () => import("@/components/Terminal").then((m) => ({ default: m.Terminal })),
  { loading: () => <GlassSkeleton className="max-w-3xl mx-auto mt-12" /> }
);

async function HangarWithData() {
  const repos = await getRepos();
  const filteredRepos = repos.filter((r) => r.name !== "SamuelFmedeiros");
  const allProjects = [...STATIC_PROJECTS, ...filteredRepos];

  // Split games from other projects
  const games = allProjects.filter((r) => GAME_PROJECTS.includes(r.name));
  const projects = allProjects.filter((r) => !GAME_PROJECTS.includes(r.name));

  return (
    <>
      <ProjectHangar repos={projects} title="▸ PROJETOS" />
      {games.length > 0 && (
        <section id="games" className="scroll-mt-20">
          <ProjectHangar repos={games} title="🎮 JOGOS" />
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
        <section id="stats" className="scroll-mt-20">
          <GitHubStatsSection />
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
