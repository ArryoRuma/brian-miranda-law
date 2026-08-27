<script setup lang="ts">
const siteCopy = useSiteCopy();
const site = computed(() => siteCopy.value.site);

useHead({
  titleTemplate: title =>
    title ? `${title} | ${site.value.titleSuffix}` : site.value.defaultTitle,
});

useSeoMeta({
  ogSiteName: site.value.name,
  ogType: "website",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
