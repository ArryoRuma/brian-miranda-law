<script setup lang="ts">
import { ArrowUpRight } from "@lucide/vue";

withDefaults(
  defineProps<{
    eyebrow: string;
    title: string;
    accent?: string;
    lead: string;
    image?: string;
    imageAlt?: string;
    secondaryHref?: string;
    secondaryLabel?: string;
  }>(),
  {
    accent: undefined,
    image: "/images/brian-law-hero_7235d741.jpg.webp",
    imageAlt: "Estate-planning documents arranged on a warm desk",
    secondaryHref: undefined,
    secondaryLabel: undefined,
  }
);
</script>

<template>
  <section class="interior-hero">
    <div class="interior-hero-copy">
      <SectionEyebrow>{{ eyebrow }}</SectionEyebrow>
      <h1>
        {{ title }}
        <template v-if="accent"
          ><br /><i>{{ accent }}</i></template
        >
      </h1>
      <p class="interior-hero-lede">{{ lead }}</p>
      <div class="hero-actions">
        <ContactActions />
        <NuxtLink
          v-if="secondaryHref && secondaryLabel"
          class="text-link"
          :to="secondaryHref"
        >
          {{ secondaryLabel }} <ArrowUpRight :size="15" aria-hidden="true" />
        </NuxtLink>
      </div>
    </div>
    <div class="interior-hero-image">
      <NuxtImg
        :src="image"
        :alt="imageAlt"
        width="1920"
        height="1280"
        sizes="xs:100vw md:50vw"
        format="webp"
        loading="eager"
        fetchpriority="high"
      />
    </div>
  </section>
</template>
