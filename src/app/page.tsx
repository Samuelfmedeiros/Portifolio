import { Suspense } from "react";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/HeroSection";
import { CoreEngine } from "@/components/CoreEngine";
import { SkillsGrid } from "@/components/SkillsGrid";
import { ProjectHangar } from "@/components/ProjectHangar";
import { HangarSkeleton } from "@/components/HangarSkeleton";
import { GlassSkeleton } from "@/components/Skeleton";
import { getRepos } from "@/lib/github";
import { AboutTimeline } from "@/components/AboutTimeline";
import { ChronoLogParallax } from "@/components/ChronoLogParallax";
import { ContactForm } from "@/components/ContactForm";
import { ScrollProgress } from "@/components/ScrollProgress";

const Terminal = dynamic(
  () => import("@/components/Terminal").then((m) => ({ default: m.Terminal })),
  { loading: () => <GlassSkeleton className="max-w-3xl mx-auto mt-20" /> }
);

async function HangarWithData() {
  const repos = await getRepos();
  return <ProjectHangar repos={repos} />;
}

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <div className="scroll-snap-wrapper">
        <section id="hero" className="scroll-snap-section">
          <HeroSection />
        </section>
        <section id="engine" className="scroll-snap-section">
          <CoreEngine />
        </section>
        <section id="journey" className="scroll-snap-section">
          <ChronoLogParallax />
        </section>
        <section id="about" className="scroll-snap-section">
          <AboutTimeline />
        </section>
        <section id="skills" className="scroll-snap-section">
          <SkillsGrid />
        </section>
        <section id="projects" className="scroll-snap-section">
          <Suspense fallback={<HangarSkeleton />}>
            <HangarWithData />
          </Suspense>
        </section>
        <section id="terminal" className="scroll-snap-section">
          <Terminal />
        </section>
        <section id="contact" className="scroll-snap-section">
          <ContactForm />
        </section>
      </div>
    </>
  );
}