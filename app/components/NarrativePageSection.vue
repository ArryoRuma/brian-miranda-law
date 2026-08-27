<script setup lang="ts">
import type { PageSectionContent } from "~/types/content";

type NarrativeSection = Extract<PageSectionContent, { type: "narrative" }>;

defineProps<{ section: NarrativeSection }>();
</script>

<template>
  <PageSectionFrame
    :id="section.id"
    :eyebrow="section.eyebrow"
    :title="section.title"
    :tone="section.tone"
    :type="section.type"
  >
    <div class="narrative-copy">
      <p v-for="paragraph in section.body" :key="paragraph">
        {{ paragraph }}
      </p>
    </div>
    <p v-if="section.note" class="content-note">{{ section.note }}</p>
  </PageSectionFrame>
</template>
