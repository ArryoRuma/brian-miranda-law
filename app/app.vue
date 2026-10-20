<script setup lang="ts">
import { buildAttorneyNode } from "~~/lib/seo/schema";

const siteCopy = useSiteCopy();
const site = computed(() => siteCopy.value.site);

useSchemaOrg([buildAttorneyNode(siteCopy.value)]);

const startAnalytics = () => {
  const initialization = document.createElement("script");
  initialization.textContent =
    "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-1Q7V5SLP5M');";
  document.head.append(initialization);

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-1Q7V5SLP5M";
  document.head.append(script);
};

onMounted(() => {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(startAnalytics, { timeout: 5000 });
  } else {
    window.setTimeout(startAnalytics, 1000);
  }
});

useHead(() => ({
  titleTemplate: title =>
    title ? `${title} | ${site.value.titleSuffix}` : site.value.defaultTitle,
}));

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
