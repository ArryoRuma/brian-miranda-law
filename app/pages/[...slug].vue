<script setup lang="ts">
import type { SitePageContent } from "~/types/content";
import { normalizeContentBaseRoutePath } from "~~/lib/content/localization";

type LegalPageKey = "privacy" | "cookies" | "disclaimer" | "accessibility";
type PageKind =
  | { type: "editorial" | "about"; content: SitePageContent }
  | { type: "contact" }
  | { type: "faq" }
  | { type: "checklist" }
  | { type: "video" }
  | { type: "legal"; page: LegalPageKey };

const route = useRoute();
const siteCopy = useSiteCopy();

function resolvePage(basePath: string): PageKind | undefined {
  if (basePath === "/contact") return { type: "contact" };
  if (basePath === "/resources/estate-planning-faqs") return { type: "faq" };
  if (basePath === "/resources/estate-planning-checklist")
    return { type: "checklist" };
  if (basePath === "/resources/video-blog") return { type: "video" };

  const legal = basePath.slice(1) as LegalPageKey;
  if (["privacy", "cookies", "disclaimer", "accessibility"].includes(legal)) {
    return { type: "legal", page: legal };
  }

  const editorialPage = Object.values(siteCopy.value.pages).find(
    page => normalizeContentBaseRoutePath(page.path) === basePath
  );
  if (editorialPage)
    return {
      type: editorialPage.layout ? "about" : "editorial",
      content: editorialPage,
    };
}

const page = computed(() =>
  resolvePage(normalizeContentBaseRoutePath(route.path))
);
if (import.meta.server && !page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: siteCopy.value.error404.heading,
  });
}

if (import.meta.client) {
  onNuxtReady(() => {
    if (!page.value) {
      showError({
        statusCode: 404,
        statusMessage: siteCopy.value.error404.heading,
      });
    }
  });
}

const ogImageTitle = computed(() => {
  if (page.value?.type === "editorial" || page.value?.type === "about")
    return page.value.content.title;
  if (page.value?.type === "contact")
    return siteCopy.value.contactPage.intro.title;
  if (page.value?.type === "faq") return siteCopy.value.resources.faq.seo.title;
  if (page.value?.type === "checklist")
    return siteCopy.value.resources.checklist.seo.title;
  if (page.value?.type === "video")
    return siteCopy.value.resources.video.seo.title;
  if (page.value?.type === "legal")
    return (
      siteCopy.value.legal[page.value.page]?.title ??
      siteCopy.value.site.defaultTitle
    );
  return siteCopy.value.site.defaultTitle;
});

const ogImageDescription = computed(() => {
  if (page.value?.type === "editorial" || page.value?.type === "about")
    return page.value.content.metaDescription;
  if (page.value?.type === "contact")
    return siteCopy.value.contactPage.intro.body;
  if (page.value?.type === "faq")
    return siteCopy.value.resources.faq.seo.description;
  if (page.value?.type === "checklist")
    return siteCopy.value.resources.checklist.seo.description;
  if (page.value?.type === "video")
    return siteCopy.value.resources.video.seo.description;
  if (page.value?.type === "legal")
    return (
      siteCopy.value.legal[page.value.page]?.description ??
      siteCopy.value.site.defaultTitle
    );
  return siteCopy.value.site.defaultTitle;
});

defineOgImage("NuxtSeo.takumi", {
  title: ogImageTitle.value,
  description: ogImageDescription.value,
});
</script>

<template>
  <div v-if="page">
    <AboutPageContent v-if="page.type === 'about'" :content="page.content" />
    <EditorialPage
      v-else-if="page.type === 'editorial'"
      :content="page.content"
    />
    <ContactPageContent v-else-if="page.type === 'contact'" />
    <FaqResourcePage v-else-if="page.type === 'faq'" />
    <ChecklistPageContent v-else-if="page.type === 'checklist'" />
    <VideoLibraryPage v-else-if="page.type === 'video'" />
    <LegalPageContent v-else-if="page.type === 'legal'" :page="page.page" />
  </div>
</template>
