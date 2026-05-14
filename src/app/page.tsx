import { Suspense } from "react";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/HeroSection";
import { CoreEngine } from "@/components/CoreEngine";
import { SkillsGrid } from "@/components/SkillsGrid";
import { ProjectHangar } from "@/components/ProjectHangar";
import { HangarSkeleton } from "@/components/HangarSkeleton";
import { GlassSkeleton } from "@/components/Skeleton";
import { getRepos } from "@/lib/github";
import { STATIC_PROJECTS } from "@/lib/staticProjects";
import { AboutTimeline } from "@/components/AboutTimeline";
import { ContactForm } from "@/components/ContactForm";
import { ScrollProgress } from "@/components/ScrollProgress";

const Terminal = dynamic(
  () => import("@/components/Terminal").then((m) => ({ default: m.Terminal })),
  { loading: () => <GlassSkeleton className="max-w-3xl mx-auto mt-20" /> }
);

async function HangarWithData() {
  const repos = await getRepos();
  const allProjects = [...STATIC_PROJECTS, ...repos];
  return <ProjectHangar repos={allProjects} />;
}

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <div className="section-wrapper">
        <section id="hero" className="section-wrapper">
          <HeroSection />
        </section>
        <section id="engine" >
          <CoreEngine />
        </section>
        <section id="about" >
          <AboutTimeline />
        </section>
        <section id="skills" >
          <SkillsGrid />
        </section>
        <section id="projects" >
          <Suspense fallback={<HangarSkeleton />}>
            <HangarWithData />
          </Suspense>
        </section>
        <section id="terminal" >
          <Terminal />
        </section>
        <section id="contact" >
          <ContactForm />
        </section>
      </div>
    </>
  );
}