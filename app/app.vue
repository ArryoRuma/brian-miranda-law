<script setup lang="ts">
const siteCopy = useSiteCopy();
const site = computed(() => siteCopy.value.site);

useHead({
  titleTemplate: title =>
    title ? `${title} | ${site.value.titleSuffix}` : site.value.defaultTitle,
  script: [
    {
      async: true,
      src: "https://www.googletagmanager.com/gtag/js?id=G-1Q7V5SLP5M",
    },
    {
      innerHTML: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-1Q7V5SLP5M');`,
    },
  ],
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
