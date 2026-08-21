<script setup lang="ts">
import { Play } from "@lucide/vue";
const siteCopy = await useSiteCopy();
const content = computed(() => siteCopy.value.resources.video);

usePageSeo({
  title: content.value.seo.title,
  description: content.value.seo.description,
  path: content.value.seo.path!,
});
</script>

<template>
  <div>
    <Breadcrumbs />
    <InteriorHero v-bind="content.hero" />
    <section class="video-library-section">
      <div class="video-library-heading coming-soon-panel">
        <SectionEyebrow tone="dark">{{ content.intro.eyebrow }}</SectionEyebrow>
        <h2>{{ content.intro.title }}</h2>
        <p>{{ content.intro.body }}</p>
      </div>
      <div class="video-topic-grid">
        <article v-for="topic in content.topics" :key="topic.title">
          <div class="video-placeholder" aria-hidden="true">
            <Play :size="28" />
            <span>{{ content.placeholder }}</span>
          </div>
          <h3>{{ topic.title }}</h3>
          <p>{{ topic.summary }}</p>
        </article>
      </div>
    </section>
    <CallToAction />
  </div>
</template>
