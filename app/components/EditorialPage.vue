<script setup lang="ts">
import type { SitePageContent } from "~/types/content";
import { buildEditorialPageSchema } from "~~/lib/seo/schema";

const props = defineProps<{ content: SitePageContent }>();
const siteCopy = useSiteCopy();

const schema = buildEditorialPageSchema(siteCopy.value, props.content);
if (schema.length) useSchemaOrg(schema);
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
