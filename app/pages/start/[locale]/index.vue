<script setup lang="ts">
import { locales, type Locale } from "~~/lib/content/localization";

definePageMeta({ i18n: false });

const route = useRoute();
const routeLocale = String(route.params.locale);
if (!locales.includes(routeLocale as Locale)) {
  throw createError({ statusCode: 404, statusMessage: "Preview not found" });
}
const locale = routeLocale as Locale;
</script>

<template>
  <QuestionnairePreview :locale="locale" />
</template>
