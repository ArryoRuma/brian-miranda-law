<script setup lang="ts">
import { Check } from "@lucide/vue";
const siteCopy = await useSiteCopy();
const content = computed(() => siteCopy.value.resources.checklist);

usePageSeo({
  title: content.value.seo.title,
  description: content.value.seo.description,
  path: content.value.seo.path!,
});
</script>

<template>
  <div>
    <Breadcrumbs />
    <InteriorHero v-bind="content.hero" />
    <section class="checklist-section">
      <div class="checklist-intro">
        <SectionEyebrow tone="dark">{{ content.intro.eyebrow }}</SectionEyebrow>
        <h2>{{ content.intro.title }}</h2>
        <p>{{ content.intro.body }}</p>
      </div>
      <div class="checklist-groups">
        <section
          v-for="(group, index) in content.groups"
          :key="group.title"
          class="checklist-group"
        >
          <span>{{ String(index + 1).padStart(2, "0") }}</span>
          <h3>{{ group.title }}</h3>
          <ul>
            <li v-for="item in group.items" :key="item">
              <Check :size="17" aria-hidden="true" /> {{ item }}
            </li>
          </ul>
        </section>
      </div>
    </section>
    <CallToAction
      :title="content.finalCta.title"
      :body="content.finalCta.body"
    />
  </div>
</template>
