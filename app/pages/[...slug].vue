<script setup lang="ts">
import type { SitePageContent } from "~/types/content";
import { normalizeContentBaseRoutePath } from "~~/lib/content/localization";

const legalPageKeys = [
  "privacy",
  "cookies",
  "disclaimer",
  "accessibility",
] as const;
type LegalPageKey = (typeof legalPageKeys)[number];
type PageKind =
  | { type: "editorial" | "about"; content: SitePageContent }
  | { type: "contact" }
  | { type: "faq" }
  | { type: "checklist" }
  | { type: "video" }
  | { type: "legal"; page: LegalPageKey };

type ResolvedPage = PageKind & {
  socialCopy: { title: string; description: string };
};

const route = useRoute();
const siteCopy = useSiteCopy();

function resolvePage(basePath: string): ResolvedPage | undefined {
  const { site, contactPage, resources, legal, pages } = siteCopy.value;
  if (basePath === "/contact") {
    const { title, body } = contactPage.intro;
    return { type: "contact", socialCopy: { title, description: body } };
  }
  if (basePath === "/resources/estate-planning-faqs")
    return { type: "faq", socialCopy: resources.faq.seo };
  if (basePath === "/resources/estate-planning-checklist")
    return { type: "checklist", socialCopy: resources.checklist.seo };
  if (basePath === "/resources/video-blog")
    return { type: "video", socialCopy: resources.video.seo };

  const legalPage = legalPageKeys.find(key => basePath === `/${key}`);
  if (legalPage) {
    const content = legal[legalPage];
    return {
      type: "legal",
      page: legalPage,
      socialCopy: {
        title: content?.title ?? site.defaultTitle,
        description: content?.description ?? site.defaultTitle,
      },
    };
  }

  const editorialPage = Object.values(pages).find(
    page => normalizeContentBaseRoutePath(page.path) === basePath
  );
  if (editorialPage)
    return {
      type: editorialPage.layout ? "about" : "editorial",
      content: editorialPage,
      socialCopy: {
        title: editorialPage.title,
        description: editorialPage.metaDescription,
      },
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

const socialCopy = page.value?.socialCopy;
const defaultTitle = siteCopy.value.site.defaultTitle;
defineOgImage("NuxtSeo.takumi", {
  title: socialCopy?.title ?? defaultTitle,
  description: socialCopy?.description ?? defaultTitle,
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
