import { Suspense } from "react";
import { HeroSection } from "@/components/HeroSection";
import { CoreEngine } from "@/components/CoreEngine";
import { SkillsGrid } from "@/components/SkillsGrid";
import { ProjectHangar } from "@/components/ProjectHangar";
import { HangarSkeleton } from "@/components/HangarSkeleton";
import { Terminal } from "@/components/Terminal";
import { UtilityDeck } from "@/components/UtilityDeck";
import { ContactForm } from "@/components/ContactForm";
import { getRepos } from "@/lib/github";

async function HangarWithData() {
  const repos = await getRepos();
  return <ProjectHangar repos={repos} />;
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <CoreEngine />
      <SkillsGrid />
      <Suspense fallback={<HangarSkeleton />}>
        <HangarWithData />
      </Suspense>
      <Terminal />
      <UtilityDeck />
      <ContactForm />
    </>
  );
}
