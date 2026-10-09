<script setup lang="ts">
const route = useRoute();
const siteCopy = useSiteCopy();
const slug = String(route.params.slug ?? "");
const county = siteCopy.value.locations.counties.find(item =>
  item.municipalities.some(municipality => municipality.slug === slug)
);
const municipality = county?.municipalities.find(item => item.slug === slug);

if (!county || !municipality) {
  throw createError({
    statusCode: 404,
    statusMessage: siteCopy.value.error404.heading,
  });
}
</script>

<template>
  <HomePageContent :location="{ county, municipality }" />
</template>
