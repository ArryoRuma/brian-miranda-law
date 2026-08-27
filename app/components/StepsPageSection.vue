<script setup lang="ts">
import type { PageSectionContent } from "~/types/content";

type StepsSection = Extract<PageSectionContent, { type: "steps" }>;

defineProps<{ section: StepsSection }>();
</script>

<template>
  <PageSectionFrame
    :id="section.id"
    :eyebrow="section.eyebrow"
    :title="section.title"
    :tone="section.tone"
    :type="section.type"
  >
    <ol class="editorial-steps editorial-process-list">
      <li
        v-for="(step, index) in section.steps"
        :key="step.title + '-' + index"
      >
        <span>{{ String(index + 1).padStart(2, "0") }}</span>
        <div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.body }}</p>
        </div>
      </li>
    </ol>
    <p v-if="section.note" class="content-note">{{ section.note }}</p>
  </PageSectionFrame>
</template>
