<script setup lang="ts">
import { ChevronRight } from "@lucide/vue";

const route = useRoute();
const labels: Record<string, string> = {
  "/estate-planning": "Estate Planning",
  "/estate-planning/wills": "Wills",
  "/estate-planning/trusts": "Trusts",
  "/estate-planning/powers-of-attorney": "Powers of Attorney",
  "/estate-planning/health-care-directives": "Health Care Directives",
  "/about": "About Brian",
  "/resources": "Resources",
  "/resources/estate-planning-faqs": "Estate Planning FAQs",
  "/resources/estate-planning-checklist": "Estate Planning Checklist",
  "/resources/video-blog": "Video Library",
  "/other-services": "Other Legal Services",
  "/contact": "Contact",
  "/privacy": "Privacy",
  "/cookies": "Cookies",
  "/disclaimer": "Website Disclaimer",
  "/accessibility": "Accessibility",
};

const crumbs = computed(() => {
  const path = route.path;
  if (path === "/") return [];

  const result = [{ label: "Home", href: "/" }];
  let currentPath = "";
  for (const segment of path.split("/").filter(Boolean)) {
    currentPath += `/${segment}`;
    const label = labels[currentPath];
    if (label) {
      result.push({ label, href: currentPath });
    }
  }
  return result;
});
</script>

<template>
  <nav v-if="crumbs.length" class="breadcrumbs" aria-label="Breadcrumb">
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
