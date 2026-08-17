<script setup lang="ts">
import type { SitePageContent } from "~/data/page-content";

const props = defineProps<{ content: SitePageContent }>();

usePageSeo({
  title: props.content.title,
  description: props.content.metaDescription,
  path: props.content.path,
});

if (props.content.faqs?.length) {
  useSchemaOrg([
    {
      "@type": "FAQPage",
      mainEntity: props.content.faqs.map(item => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ]);
}
</script>

<template>
  <Breadcrumbs />
  <InteriorHero v-bind="content.hero" />
  <ContentSection
    v-for="(section, index) in content.sections"
    :key="section.id ?? `${content.path}-${index}`"
    :section="section"
  />
  <section v-if="content.faqs" class="faq-section interior-faq-section">
    <div class="faq-intro">
      <SectionEyebrow>Frequently asked questions</SectionEyebrow>
      <h2>Questions are part of good planning.</h2>
      <p>
        These answers provide general information. Your circumstances may call
        for a different approach.
      </p>
    </div>
    <FaqAccordion :items="content.faqs" :id-prefix="`faq-${content.path}`" />
  </section>
  <CallToAction
    :title="content.finalCta?.title"
    :body="content.finalCta?.body"
  />
</template>
