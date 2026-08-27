<script setup lang="ts">
const siteCopy = useSiteCopy();
const content = computed(() => siteCopy.value.resources.faq);

usePageSeo({
  title: content.value.seo.title,
  description: content.value.seo.description,
  path: content.value.seo.path!,
});

useSchemaOrg([
  {
    "@type": "FAQPage",
    mainEntity: content.value.groups.flatMap(group =>
      group.items.map(item => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      }))
    ),
  },
]);
</script>

<template>
  <div>
    <Breadcrumbs />
    <InteriorHero v-bind="content.hero" />
    <section
      v-for="group in content.groups"
      :key="group.title"
      class="faq-section interior-faq-section"
    >
      <div class="faq-intro">
        <SectionEyebrow>{{ group.title }}</SectionEyebrow>
        <h2>{{ group.title }}</h2>
        <p>{{ content.groupIntro }}</p>
      </div>
      <FaqAccordion
        :items="group.items"
        :id-prefix="`faq-${group.title.toLowerCase().replaceAll(' ', '-')}`"
      />
    </section>
    <CallToAction />
  </div>
</template>
