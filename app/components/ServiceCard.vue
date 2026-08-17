<script setup lang="ts">
import {
  ArrowUpRight,
  FileText,
  HandCoins,
  HeartPulse,
  Landmark,
} from "@lucide/vue";
import type { Service } from "~/data/home";

const props = defineProps<{ service: Service }>();
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
      :aria-label="`Learn more about ${service.title}`"
      :to="service.href"
    >
      <ArrowUpRight :size="18" aria-hidden="true" />
    </NuxtLink>
  </article>
</template>
