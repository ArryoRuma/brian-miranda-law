import { ApproachSection } from "./sections/ApproachSection";
import { ContactSection } from "./sections/ContactSection";
import { FaqSection } from "./sections/FaqSection";
import { HeroSection } from "./sections/HeroSection";
import {
  HomeAudienceSections,
  HomeTrustStrip,
} from "./sections/HomeAudienceSections";
import { ProcessSection } from "./sections/ProcessSection";
import { QuoteSection } from "./sections/QuoteSection";
import { ServicesSection } from "./sections/ServicesSection";

export function HomeSections() {
  return (
    <main id="top">
      <HeroSection />
      <HomeTrustStrip />
      <ApproachSection />
      <ServicesSection />
      <QuoteSection />
      <ProcessSection />
      <HomeAudienceSections />
      <FaqSection />
      <ContactSection />
    </main>
  );
}
