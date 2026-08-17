<script setup lang="ts">
withDefaults(
  defineProps<{ title?: string; body?: string; eyebrow?: string }>(),
  {
    title: "A clearer plan can begin with one conversation.",
    body: "Tell us what brings you here. Miranda Law can help you understand the next questions to consider and whether our services fit your needs.",
    eyebrow: "Start with clarity",
  }
);
</script>

<template>
  <section class="final-cta">
    <div>
      <SectionEyebrow>{{ eyebrow }}</SectionEyebrow>
      <h2>{{ title }}</h2>
      <p>{{ body }}</p>
    </div>
    <div class="contact-methods">
      <ContactActions />
      <NuxtLink class="text-link" to="/contact"
        >View every contact option</NuxtLink
      >
    </div>
  </section>
</template>
