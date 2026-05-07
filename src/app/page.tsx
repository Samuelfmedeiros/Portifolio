import { HeroSection } from "@/components/HeroSection";
import { CoreEngine } from "@/components/CoreEngine";
import { SkillsGrid } from "@/components/SkillsGrid";
import { ProjectHangar } from "@/components/ProjectHangar";
import { Terminal } from "@/components/Terminal";
import { UtilityDeck } from "@/components/UtilityDeck";
import { ContactForm } from "@/components/ContactForm";
import { getRepos } from "@/lib/github";

export default async function Home() {
  const repos = await getRepos();

  return (
    <>
      <HeroSection />
      <CoreEngine />
      <SkillsGrid />
      <ProjectHangar repos={repos} />
      <Terminal />
      <UtilityDeck />
      <ContactForm />
    </>
  );
}
