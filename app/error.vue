<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{ error: NuxtError }>();
const siteCopy = await useSiteCopy();
const content = computed(() => siteCopy.value.error404);

usePageSeo({
  title: content.value.title,
  description: content.value.description,
  path: "/404",
  noIndex: true,
});
</script>

<template>
  <div class="site-shell">
    <SiteHeader />
    <main id="main-content" tabindex="-1">
      <section class="next-steps-page">
        <div class="next-steps-heading">
          <SectionEyebrow>{{ content.eyebrow }}</SectionEyebrow>
          <h1>{{ content.heading }}</h1>
          <p>{{ content.body }}</p>
          <NuxtLink class="button button-brass" to="/">
            {{ content.actionLabel }}
          </NuxtLink>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>
