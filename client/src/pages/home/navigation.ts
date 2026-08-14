import type { PageSectionId } from "./content";

export function scrollToSection(sectionId: PageSectionId) {
  document
    .getElementById(sectionId)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}
