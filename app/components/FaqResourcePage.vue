<script setup lang="ts">
import { FAQ_GROUPS } from "~/data/resources";

const description =
  "Plain-language answers to common estate-planning questions about wills, trusts, incapacity documents, and working with Miranda Law.";

usePageSeo({
  title: "Estate Planning FAQs",
  description,
  path: "/resources/estate-planning-faqs",
});

useSchemaOrg([
  {
    "@type": "FAQPage",
    mainEntity: FAQ_GROUPS.flatMap(group =>
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
    <InteriorHero
      eyebrow="Estate planning FAQs"
      title="Clear answers create"
      accent="better questions."
      lead="Use these general answers to organize what you want to discuss. Your own plan should be based on your family, property, responsibilities, and goals."
      secondary-href="/resources/estate-planning-checklist"
      secondary-label="Open the planning checklist"
    />
    <section
      v-for="group in FAQ_GROUPS"
      :key="group.title"
      class="faq-section interior-faq-section"
    >
      <div class="faq-intro">
        <SectionEyebrow>{{ group.title }}</SectionEyebrow>
        <h2>{{ group.title }}</h2>
        <p>General information to help you prepare for a conversation.</p>
      </div>
      <FaqAccordion
        :items="group.items"
        :id-prefix="`faq-${group.title.toLowerCase().replaceAll(' ', '-')}`"
      />
    </section>
    <CallToAction />
  </div>
</template>
