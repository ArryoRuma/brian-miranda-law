<script setup lang="ts">
import {
  ArrowUpRight,
  CalendarCheck,
  ClipboardCheck,
  MessageCircle,
} from "@lucide/vue";
import { getPhoneHref, getWhatsAppHref } from "~/data/routes";

type Locale = "en" | "es" | "pt";
const props = defineProps<{ locale: Locale }>();
const siteCopy = useSiteCopy(toRef(props, "locale"));
const content = computed(() => siteCopy.value.nextSteps.locales[props.locale]);
const contact = computed(() => siteCopy.value.site.contact);
const icons = {
  documents: ClipboardCheck,
  schedule: CalendarCheck,
  communicate: MessageCircle,
};

usePageSeo({
  title: content.value.title,
  description: content.value.lead,
  path: `/start/${props.locale}/what-happens-next`,
  locale: props.locale,
  noIndex: true,
});
</script>

<template>
  <section class="next-steps-page">
    <div class="next-steps-heading">
      <SectionEyebrow>{{ content.eyebrow }}</SectionEyebrow>
      <h1>{{ content.heading }}</h1>
      <p>{{ content.lead }}</p>
    </div>
    <ol>
      <li v-for="(step, index) in content.steps" :key="step.id">
        <component :is="icons[step.id]" :size="25" aria-hidden="true" />
        <span>{{ String(index + 1).padStart(2, "0") }}</span>
        <h2>{{ step.title }}</h2>
        <p>{{ step.body }}</p>
      </li>
    </ol>
    <div class="next-steps-actions">
      <NuxtLink class="button button-brass" :to="`/start/${locale}`">
        {{ content.cta }} <ArrowUpRight :size="17" aria-hidden="true" />
      </NuxtLink>
      <a :href="getPhoneHref(contact.phoneHref)">{{ contact.phoneDisplay }}</a>
      <a
        :href="getWhatsAppHref(contact.phoneHref)"
        target="_blank"
        rel="noreferrer"
      >
        {{ siteCopy.nextSteps.whatsAppLabel }}
      </a>
    </div>
  </section>
</template>
