<script setup lang="ts">
import {
  ArrowUpRight,
  FileText,
  HandCoins,
  HeartPulse,
  Landmark,
} from "@lucide/vue";
import type { HomeService } from "~/types/content";

const props = defineProps<{ service: HomeService }>();
const siteCopy = await useSiteCopy();
const icons = {
  file: FileText,
  landmark: Landmark,
  hand: HandCoins,
  heart: HeartPulse,
};
const icon = computed(() => icons[props.service.icon]);
</script>

<template>
  <article class="service-card">
    <div class="service-top">
      <span class="service-number">{{ service.number }}</span>
      <component :is="icon" :size="25" :stroke-width="1.4" aria-hidden="true" />
    </div>
    <h3>{{ service.title }}</h3>
    <p>{{ service.description }}</p>
    <NuxtLink
      class="card-arrow"
      :aria-label="
        siteCopy.site.shared.serviceLinkAriaLabel.replace(
          '{service}',
          service.title
        )
      "
      :to="service.href"
    >
      <ArrowUpRight :size="18" aria-hidden="true" />
    </NuxtLink>
  </article>
</template>
