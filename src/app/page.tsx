import { HeroSection } from "@/components/HeroSection";
import { CoreEngine } from "@/components/CoreEngine";
import { SkillsGrid } from "@/components/SkillsGrid";
import { ProjectHangar } from "@/components/ProjectHangar";
import { Terminal } from "@/components/Terminal";
import { UtilityDeck } from "@/components/UtilityDeck";
import { ContactForm } from "@/components/ContactForm";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CoreEngine />
      <SkillsGrid />
      <ProjectHangar />
      <Terminal />
      <UtilityDeck />
      <ContactForm />
    </>
  );
}
