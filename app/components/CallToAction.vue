<script setup lang="ts">
const props = defineProps<{
  title?: string;
  body?: string;
  eyebrow?: string;
}>();
const siteCopy = await useSiteCopy();
const defaults = computed(() => siteCopy.value.site.shared.finalCta);
</script>

<template>
  <section class="final-cta">
    <div>
      <SectionEyebrow>{{ props.eyebrow ?? defaults.eyebrow }}</SectionEyebrow>
      <h2>{{ props.title ?? defaults.title }}</h2>
      <p>{{ props.body ?? defaults.body }}</p>
    </div>
    <div class="contact-methods">
      <ContactActions />
      <NuxtLink class="text-link" to="/contact">
        {{ siteCopy.site.shared.viewContactOptions }}
      </NuxtLink>
    </div>
  </section>
</template>
