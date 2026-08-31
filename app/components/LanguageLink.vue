<script setup lang="ts">
import { ArrowUpRight } from "@lucide/vue";

defineProps<{
  code: string;
  language: string;
  href: string;
  active?: boolean;
}>();
</script>

<template>
  <NuxtLink :to="href" :aria-current="active ? 'page' : undefined">
    <span>{{ code }}</span>
    <strong>{{ language }}</strong>
    <ArrowUpRight
      class="language-link-arrow"
      :size="20"
      :stroke-width="1.6"
      aria-hidden="true"
    />
  </NuxtLink>
</template>
