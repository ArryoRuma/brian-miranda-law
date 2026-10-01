<script setup lang="ts">
import type { FaqContent, SitePageContent } from "~/types/content";

const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    path: string;
    hero?: SitePageContent["hero"];
    faqs?: FaqContent[];
    finalCta?: { title: string; body: string };
    showFinalCta?: boolean;
    showFaqSection?: boolean;
    breadcrumbLabel?: string;
  }>(),
  {
    hero: undefined,
    faqs: undefined,
    finalCta: undefined,
    showFinalCta: true,
    showFaqSection: true,
    breadcrumbLabel: undefined,
  }
);

const siteCopy = useSiteCopy();
const faqCopy = computed(() => siteCopy.value.site.shared.editorialFaq);

usePageSeo({
  title: props.title,
  description: props.description,
  path: props.path,
});

if (props.faqs?.length) {
  useSchemaOrg([
    {
      "@type": "FAQPage",
      mainEntity: props.faqs.map(item => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ]);
}
</script>

<template>
  <Breadcrumbs :current-label="breadcrumbLabel" />
  <slot name="hero">
    <InteriorHero v-if="hero" v-bind="hero" />
  </slot>
  <slot />
  <section
    v-if="showFaqSection && faqs?.length"
    class="faq-section interior-faq-section"
  >
    <div class="faq-intro">
      <SectionEyebrow>{{ faqCopy.eyebrow }}</SectionEyebrow>
      <h2>{{ faqCopy.title }}</h2>
      <p>{{ faqCopy.body }}</p>
    </div>
    <FaqAccordion :items="faqs" :id-prefix="`faq-${path}`" />
  </section>
  <CallToAction
    v-if="showFinalCta"
    :title="finalCta?.title"
    :body="finalCta?.body"
  />
</template>
