<script setup lang="ts">
import { ArrowUpRight } from "@lucide/vue";
import { formatLocationCopy } from "~~/lib/content/locations";
import { getLocationPath, locationHubPath } from "~~/lib/content/schema";

const siteCopy = useSiteCopy();
const { localizePath } = useSiteLocale();
const locations = computed(() => siteCopy.value.locations);
const copy = computed(() => locations.value.hub);
const hero = computed(() => ({
  eyebrow: copy.value.eyebrow,
  title: copy.value.heading,
  lead: copy.value.intro,
}));
</script>

<template>
  <PageShell
    :title="copy.title"
    :description="copy.description"
    :path="locationHubPath"
    :hero="hero"
  >
    <div class="locations-directory">
      <section
        v-for="county in locations.counties"
        :key="county.name"
        class="locations-county-group"
      >
        <h2>
          {{ formatLocationCopy(copy.countyHeading, { county: county.name }) }}
        </h2>
        <ul class="location-link-grid">
          <li
            v-for="municipality in county.municipalities"
            :key="municipality.slug"
          >
            <NuxtLink :to="localizePath(getLocationPath(municipality.slug))">
              {{ municipality.name }}
              <ArrowUpRight :size="16" aria-hidden="true" />
            </NuxtLink>
          </li>
        </ul>
      </section>
    </div>
  </PageShell>
</template>
