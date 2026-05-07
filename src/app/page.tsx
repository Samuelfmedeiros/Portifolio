import { HeroSection } from "@/components/HeroSection";
import { CoreEngine } from "@/components/CoreEngine";
import { ProjectHangar } from "@/components/ProjectHangar";
import { Terminal } from "@/components/Terminal";
import { UtilityDeck } from "@/components/UtilityDeck";
import { ContactForm } from "@/components/ContactForm";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CoreEngine />
      <ProjectHangar />
      <Terminal />
      <UtilityDeck />
      <ContactForm />
    </>
  );
}
