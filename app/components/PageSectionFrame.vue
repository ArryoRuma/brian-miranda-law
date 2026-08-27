<script setup lang="ts">
import type { PageSectionContent } from "~/types/content";

type SectionTone = NonNullable<PageSectionContent["tone"]>;

const props = withDefaults(
  defineProps<{
    id?: string;
    eyebrow?: string;
    title: string;
    tone?: SectionTone;
    type: PageSectionContent["type"];
  }>(),
  {
    id: undefined,
    eyebrow: undefined,
    tone: "paper",
  }
);

const eyebrowTone = computed(() =>
  props.tone === "dark" || props.tone === "blue" ? "light" : "dark"
);
</script>

<template>
  <section
    :id="id"
    class="content-section"
    :class="['content-section-' + tone, 'content-section-' + type]"
    :data-section-type="type"
  >
    <div class="content-section-heading">
      <SectionEyebrow v-if="eyebrow" :tone="eyebrowTone">
        {{ eyebrow }}
      </SectionEyebrow>
      <h2>{{ title }}</h2>
    </div>

    <div class="content-section-body" :class="'content-section-body-' + type">
      <slot />
    </div>
  </section>
</template>
