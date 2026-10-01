<script setup lang="ts">
const siteCopy = useSiteCopy();
const content = computed(() => siteCopy.value.resources.faq);
const faqs = computed(() => content.value.groups.flatMap(group => group.items));
</script>

<template>
  <PageShell
    :title="content.seo.title"
    :description="content.seo.description"
    :path="content.seo.path"
    :hero="content.hero"
    :faqs="faqs"
    :show-faq-section="false"
  >
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
  </PageShell>
</template>
