<script setup lang="ts">
import { h } from "vue";
import CardGridPageSection from "./CardGridPageSection.vue";
import ChecklistPageSection from "./ChecklistPageSection.vue";
import NarrativePageSection from "./NarrativePageSection.vue";
import StepsPageSection from "./StepsPageSection.vue";
import type { PageSectionContent } from "~/types/content";

const props = defineProps<{ section: PageSectionContent }>();

function assertNever(section: never): never {
  throw new Error("Unsupported page section: " + JSON.stringify(section));
}

const RenderSection = () => {
  const section = props.section;

  switch (section.type) {
    case "narrative":
      return h(NarrativePageSection, { section });
    case "checklist":
      return h(ChecklistPageSection, { section });
    case "cards":
      return h(CardGridPageSection, { section });
    case "steps":
      return h(StepsPageSection, { section });
    default:
      return assertNever(section);
  }
};
</script>

<template>
  <RenderSection />
</template>
