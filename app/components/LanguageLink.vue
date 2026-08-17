<script setup lang="ts">
defineProps<{ code: string; language: string; href: string }>();
</script>

<template>
  <NuxtLink :to="href">
    <span>{{ code }}</span>
    <strong>{{ language }}</strong>
  </NuxtLink>
</template>
