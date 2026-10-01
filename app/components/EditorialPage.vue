<script setup lang="ts">
import type { SitePageContent } from "~/types/content";

defineProps<{ content: SitePageContent }>();
</script>

<template>
  <PageShell
    :title="content.title"
    :description="content.metaDescription"
    :path="content.path"
    :hero="content.hero"
    :faqs="content.faqs"
    :final-cta="content.finalCta"
  >
    <PageSectionRenderer
      v-for="(section, index) in content.sections"
      :key="section.id ?? `${content.path}-${index}`"
      :section="section"
    />
  </PageShell>
</template>
