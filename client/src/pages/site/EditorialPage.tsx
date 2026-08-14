import {
  ContentSection,
  FaqAccordionSection,
  FinalCta,
  InteriorHero,
} from "@/components/site/PageSections";
import { PageShell } from "@/components/site/PageShell";
import type { SitePageContent } from "./pageContent";

export function EditorialPage({ content }: { content: SitePageContent }) {
  return (
    <PageShell
      title={content.title}
      description={content.metaDescription}
      path={content.path}
    >
      <InteriorHero {...content.hero} />
      {content.sections.map(section => (
        <ContentSection
          key={`${content.path}-${section.title}`}
          section={section}
        />
      ))}
      {content.faqs ? <FaqAccordionSection items={content.faqs} /> : null}
      <FinalCta title={content.finalCta?.title} body={content.finalCta?.body} />
    </PageShell>
  );
}
