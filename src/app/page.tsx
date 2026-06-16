import { Suspense } from "react";
import { ProfileSection } from "@/components/ProfileSection";
import { ProjectHangar } from "@/components/ProjectHangar";
import { GameShowcaseNoSSR } from "@/components/GameShowcaseNoSSR";
import { HangarSkeleton } from "@/components/HangarSkeleton";
import { FadeInSection } from "@/components/FadeInSection";
import { getRepos } from "@/lib/github";
import { STATIC_PROJECTS, GAME_PROJECTS } from "@/lib/staticProjects";
import { ContactForm } from "@/components/ContactForm";
import { BuyMeACoffee } from "@/components/monetization/BuyMeACoffee";

async function HangarWithData() {
  const repos = await getRepos();
  const filteredRepos = repos.filter((r) => r.name !== "SamuelFmedeiros");

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
  const projects = allProjects.filter((r) => !GAME_PROJECTS.includes(r.name));

  return (
    <>
      <ProjectHangar repos={projects} title="▸ PROJETOS" />
      {games.length > 0 && (
        <section id="games" className="scroll-mt-20">
          <GameShowcaseNoSSR repos={games} />
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
        <FadeInSection delay={0.1}>
          <section id="projects" className="scroll-mt-20">
            <Suspense fallback={<HangarSkeleton />}>
              <HangarWithData />
            </Suspense>
          </section>
        </FadeInSection>
        <FadeInSection delay={0.3}>
          <section id="contact" className="scroll-mt-20">
            <ContactForm />
          </section>
        </FadeInSection>
        <FadeInSection delay={0.35}>
          <div className="flex justify-center py-8">
            <BuyMeACoffee className="px-4 py-2 text-sm" />
          </div>
        </FadeInSection>
      </div>
    </>
  );
}
