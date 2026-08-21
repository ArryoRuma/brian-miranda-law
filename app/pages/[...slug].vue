<script setup lang="ts">
import type { SitePageContent } from "~/types/content";

type Locale = "en" | "es" | "pt";
type LegalPageKey = "privacy" | "cookies" | "disclaimer" | "accessibility";
type PageKind =
  | { type: "editorial"; content: SitePageContent }
  | { type: "contact" }
  | { type: "faq" }
  | { type: "checklist" }
  | { type: "video" }
  | { type: "legal"; page: LegalPageKey }
  | { type: "preview"; locale: Locale }
  | { type: "next"; locale: Locale };

const route = useRoute();
const siteCopy = await useSiteCopy();

const editorialPages = Object.fromEntries(
  Object.values(siteCopy.value.pages).map(page => [page.path, page])
) as Record<string, SitePageContent>;

function resolvePage(path: string): PageKind | undefined {
  if (editorialPages[path])
    return { type: "editorial", content: editorialPages[path] };
  if (path === "/contact") return { type: "contact" };
  if (path === "/resources/estate-planning-faqs") return { type: "faq" };
  if (path === "/resources/estate-planning-checklist")
    return { type: "checklist" };
  if (path === "/resources/video-blog") return { type: "video" };

  const legal = path.slice(1) as LegalPageKey;
  if (["privacy", "cookies", "disclaimer", "accessibility"].includes(legal)) {
    return { type: "legal", page: legal };
  }

  const previewMatch = path.match(/^\/start\/(en|es|pt)$/);
  if (previewMatch)
    return { type: "preview", locale: previewMatch[1] as Locale };

  const nextMatch = path.match(/^\/start\/(en|es|pt)\/what-happens-next$/);
  if (nextMatch) return { type: "next", locale: nextMatch[1] as Locale };
}

const page = resolvePage(route.path);
if (!page) {
  throw createError({
    statusCode: 404,
    statusMessage: siteCopy.value.error404.heading,
  });
}
</script>

<template>
  <div>
    <EditorialPage v-if="page.type === 'editorial'" :content="page.content" />
    <ContactPageContent v-else-if="page.type === 'contact'" />
    <FaqResourcePage v-else-if="page.type === 'faq'" />
    <ChecklistPageContent v-else-if="page.type === 'checklist'" />
    <VideoLibraryPage v-else-if="page.type === 'video'" />
    <LegalPageContent v-else-if="page.type === 'legal'" :page="page.page" />
    <QuestionnairePreview
      v-else-if="page.type === 'preview'"
      :locale="page.locale"
    />
    <NextStepsPreview v-else :locale="page.locale" />
  </div>
</template>
