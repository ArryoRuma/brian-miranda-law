<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{ error: NuxtError }>();

usePageSeo({
  title: "Page Not Found",
  description: "The requested Miranda Law page could not be found.",
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
          <SectionEyebrow>404</SectionEyebrow>
          <h1>That page could not be found.</h1>
          <p>The page may have moved, or the address may be incomplete.</p>
          <NuxtLink class="button button-brass" to="/">Return home</NuxtLink>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>
