<script setup lang="ts">
import { LEGAL_PAGES, type LegalPageKey } from "~/data/legal";

const props = defineProps<{ page: LegalPageKey }>();
const content = computed(() => LEGAL_PAGES[props.page]);

usePageSeo({
  title: content.value.title,
  description: content.value.description,
  path: `/${props.page}`,
});
</script>

<template>
  <div>
    <Breadcrumbs />
    <article class="legal-page">
      <header>
        <SectionEyebrow>Website information</SectionEyebrow>
        <h1>{{ content.title }}</h1>
        <p>{{ content.intro }}</p>
        <span>Last updated: {{ content.updated }}</span>
      </header>
      <div class="legal-page-content">
        <section v-for="section in content.sections" :key="section.title">
          <h2>{{ section.title }}</h2>
          <p v-for="paragraph in section.paragraphs" :key="paragraph">
            {{ paragraph }}
          </p>
          <ul v-if="'bullets' in section && section.bullets">
            <li v-for="item in section.bullets" :key="item">{{ item }}</li>
          </ul>
        </section>
      </div>
    </article>
  </div>
</template>
