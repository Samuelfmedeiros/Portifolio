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
import { ContactForm } from "@/components/ContactForm";

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
      <HeroSection />
      <CoreEngine />
      <AboutTimeline />
      <SkillsGrid />
      <Suspense fallback={<HangarSkeleton />}>
        <HangarWithData />
      </Suspense>
      <Terminal />
      <ContactForm />
    </>
  );
}