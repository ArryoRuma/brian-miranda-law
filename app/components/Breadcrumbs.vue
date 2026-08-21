<script setup lang="ts">
import { ChevronRight } from "@lucide/vue";

const route = useRoute();
const siteCopy = await useSiteCopy();
const copy = computed(() => siteCopy.value.site.breadcrumbs);

const crumbs = computed(() => {
  const path = route.path;
  if (path === "/") return [];

  const result = [{ label: copy.value.home, href: "/" }];
  let currentPath = "";
  for (const segment of path.split("/").filter(Boolean)) {
    currentPath += `/${segment}`;
    const label = copy.value.labels[currentPath];
    if (label) {
      result.push({ label, href: currentPath });
    }
  }
  return result;
});
</script>

<template>
  <nav v-if="crumbs.length" class="breadcrumbs" :aria-label="copy.ariaLabel">
    <ol>
      <li v-for="(crumb, index) in crumbs" :key="crumb.href">
        <ChevronRight v-if="index > 0" :size="14" aria-hidden="true" />
        <span v-if="index === crumbs.length - 1" aria-current="page">
          {{ crumb.label }}
        </span>
        <NuxtLink v-else :to="crumb.href">{{ crumb.label }}</NuxtLink>
      </li>
    </ol>
  </nav>
</template>
