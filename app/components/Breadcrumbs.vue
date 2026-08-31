<script setup lang="ts">
import { ChevronRight } from "@lucide/vue";
import { stripLocalePrefix } from "~~/lib/content/localization";

const props = defineProps<{ currentLabel?: string }>();
const route = useRoute();
const { homePath, localizePath } = useSiteLocale();
const siteCopy = useSiteCopy();
const copy = computed(() => siteCopy.value.site.breadcrumbs);

const crumbs = computed(() => {
  const path = stripLocalePrefix(route.path);
  if (path === "/") return [];

  const result = [{ label: copy.value.home, href: homePath.value }];
  let currentPath = "";
  const segments = path.split("/").filter(Boolean);
  for (const [index, segment] of segments.entries()) {
    currentPath += `/${segment}`;
    const label =
      copy.value.labels[currentPath] ??
      (index === segments.length - 1 ? props.currentLabel : undefined);
    if (label) {
      result.push({ label, href: localizePath(currentPath) });
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
