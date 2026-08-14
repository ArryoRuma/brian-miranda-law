import { ContactSection } from "./sections/ContactSection";
import { FaqSection } from "./sections/FaqSection";
import { HeroSection } from "./sections/HeroSection";
import {
  HomeAudienceSections,
  HomeTrustStrip,
} from "./sections/HomeAudienceSections";
import { ProcessSection } from "./sections/ProcessSection";
import { ServicesSection } from "./sections/ServicesSection";

export function HomeSections() {
  return (
    <main id="main-content" tabIndex={-1}>
      <HeroSection />
      <HomeTrustStrip />
      <ServicesSection />
      <ProcessSection />
      <HomeAudienceSections />
      <FaqSection />
      <ContactSection />
    </main>
  );
}
