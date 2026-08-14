import { ApproachSection } from "./sections/ApproachSection";
import { ContactSection } from "./sections/ContactSection";
import { FaqSection } from "./sections/FaqSection";
import { HeroSection } from "./sections/HeroSection";
import { ProcessSection } from "./sections/ProcessSection";
import { QuoteSection } from "./sections/QuoteSection";
import { ServicesSection } from "./sections/ServicesSection";

export function HomeSections() {
  return (
    <main id="top">
      <HeroSection />
      <ApproachSection />
      <ServicesSection />
      <QuoteSection />
      <ProcessSection />
      <FaqSection />
      <ContactSection />
    </main>
  );
}
