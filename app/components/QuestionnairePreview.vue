<script setup lang="ts">
import { Check, LockKeyhole } from "@lucide/vue";

type Locale = "en" | "es" | "pt";
const props = defineProps<{ locale: Locale }>();
const siteCopy = useSiteCopy();
const content = computed(
  () => siteCopy.value.questionnaire.locales[props.locale]
);
const common = computed(() => siteCopy.value.questionnaire.common);

usePageSeo({
  title: content.value.title,
  description: content.value.meta,
  path: `/start/${props.locale}`,
  locale: props.locale,
  noIndex: true,
});
</script>

<template>
  <div>
    <section class="questionnaire-hero">
      <div>
        <SectionEyebrow>{{ content.eyebrow }}</SectionEyebrow>
        <h1>{{ content.heading }}</h1>
        <p>{{ content.lead }}</p>
        <ul>
          <li v-for="item in content.trust" :key="item">
            <Check :size="16" aria-hidden="true" /> {{ item }}
          </li>
        </ul>
      </div>
      <div class="questionnaire-intro-card">
        <LockKeyhole :size="24" aria-hidden="true" />
        <h2>{{ content.statusTitle }}</h2>
        <p>{{ content.statusBody }}</p>
      </div>
    </section>

    <section class="questionnaire-preview" aria-labelledby="preview-heading">
      <div class="questionnaire-preview-heading">
        <SectionEyebrow tone="dark">{{ common.previewEyebrow }}</SectionEyebrow>
        <h2 id="preview-heading">{{ content.statusTitle }}</h2>
      </div>
      <ol class="questionnaire-preview-list">
        <li v-for="(group, index) in content.groups" :key="group.title">
          <details :open="index === 0">
            <summary>
              <span>{{ String(index + 1).padStart(2, "0") }}</span>
              <strong>{{ group.title }}</strong>
            </summary>
            <ul>
              <li>{{ group.body }}</li>
            </ul>
          </details>
        </li>
      </ol>
    </section>

    <section class="questionnaire-preview-cta">
      <div>
        <h2>{{ content.cta }}</h2>
        <p>{{ common.confidentiality }}</p>
      </div>
      <ContactActions />
    </section>
  </div>
</template>
