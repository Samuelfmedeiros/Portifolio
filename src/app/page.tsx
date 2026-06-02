import { Suspense } from "react";
import dynamic from "next/dynamic";
import { ProfileSection } from "@/components/ProfileSection";
import { ProjectHangar } from "@/components/ProjectHangar";
import { HangarSkeleton } from "@/components/HangarSkeleton";
import { GlassSkeleton } from "@/components/Skeleton";
import { getRepos } from "@/lib/github";
import { STATIC_PROJECTS } from "@/lib/staticProjects";
import { ContactForm } from "@/components/ContactForm";
import { GitHubStatsSection } from "@/components/GitHubStatsSection";

const Terminal = dynamic(
  () => import("@/components/Terminal").then((m) => ({ default: m.Terminal })),
  { loading: () => <GlassSkeleton className="max-w-3xl mx-auto mt-20" /> }
);

async function HangarWithData() {
  const repos = await getRepos();
  const filteredRepos = repos.filter((r) => r.name !== "SamuelFmedeiros");
  const allProjects = [...STATIC_PROJECTS, ...filteredRepos];
  return <ProjectHangar repos={allProjects} />;
}

export default function Home() {
  return (
    <>
      <div className="section-wrapper">
        <ProfileSection />
        <section id="projects">
          <Suspense fallback={<HangarSkeleton />}>
            <HangarWithData />
          </Suspense>
        </section>
        <section id="stats">
          <GitHubStatsSection />
        </section>
        <section id="terminal">
          <Terminal />
        </section>
        <section id="contact">
          <ContactForm />
        </section>
      </div>
    </>
  );
}