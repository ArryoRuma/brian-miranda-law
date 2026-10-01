<script setup lang="ts">
type LegalPageKey = "privacy" | "cookies" | "disclaimer" | "accessibility";
const props = defineProps<{ page: LegalPageKey }>();
const { localizePath } = useSiteLocale();
const siteCopy = useSiteCopy();
const content = computed(() => {
  const value = siteCopy.value.legal[props.page];
  if (!value) throw createError(`${props.page} content is missing`);
  return value;
});
const labels = computed(() => siteCopy.value.site.shared.legal);
</script>

<template>
  <PageShell
    :title="content.title"
    :description="content.description"
    :path="localizePath(`/${props.page}`)"
    :show-final-cta="false"
  >
    <article class="legal-page">
      <header>
        <SectionEyebrow>{{ labels.eyebrow }}</SectionEyebrow>
        <h1>{{ content.title }}</h1>
        <p>{{ content.intro }}</p>
        <span>{{ labels.updatedLabel }} {{ content.updated }}</span>
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
  </PageShell>
</template>
