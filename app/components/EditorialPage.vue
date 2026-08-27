<script setup lang="ts">
import type { SitePageContent } from "~/types/content";

const props = defineProps<{ content: SitePageContent }>();
const siteCopy = useSiteCopy();
const faqCopy = computed(() => siteCopy.value.site.shared.editorialFaq);

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
  <PageSectionRenderer
    v-for="(section, index) in content.sections"
    :key="section.id ?? `${content.path}-${index}`"
    :section="section"
  />
  <section v-if="content.faqs" class="faq-section interior-faq-section">
    <div class="faq-intro">
      <SectionEyebrow>{{ faqCopy.eyebrow }}</SectionEyebrow>
      <h2>{{ faqCopy.title }}</h2>
      <p>{{ faqCopy.body }}</p>
    </div>
    <FaqAccordion :items="content.faqs" :id-prefix="`faq-${content.path}`" />
  </section>
  <CallToAction
    :title="content.finalCta?.title"
    :body="content.finalCta?.body"
  />
</template>
