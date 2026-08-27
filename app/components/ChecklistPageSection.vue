<script setup lang="ts">
import { Check } from "@lucide/vue";
import type { PageSectionContent } from "~/types/content";

type ChecklistSection = Extract<PageSectionContent, { type: "checklist" }>;

defineProps<{ section: ChecklistSection }>();
</script>

<template>
  <PageSectionFrame
    :id="section.id"
    :eyebrow="section.eyebrow"
    :title="section.title"
    :tone="section.tone"
    :type="section.type"
  >
    <ul class="check-list editorial-check-list">
      <li v-for="item in section.bullets" :key="item">
        <span class="check-list-icon">
          <Check :size="18" :stroke-width="2" aria-hidden="true" />
        </span>
        <span>{{ item }}</span>
      </li>
    </ul>
    <p v-if="section.note" class="content-note">{{ section.note }}</p>
  </PageSectionFrame>
</template>
