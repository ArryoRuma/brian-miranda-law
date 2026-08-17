<script setup lang="ts">
useHead({
  titleTemplate: title =>
    title ? `${title} | Miranda Law` : "Miranda Law | Estate Planning",
});

useSeoMeta({
  ogSiteName: "Miranda Law",
  ogType: "website",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
