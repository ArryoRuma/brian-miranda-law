<script setup lang="ts">
import type { SitePageContent } from "~/types/content";
import { normalizeContentRoutePath } from "~~/lib/content/localization";

type LegalPageKey = "privacy" | "cookies" | "disclaimer" | "accessibility";
type PageKind =
  | { type: "editorial"; content: SitePageContent }
  | { type: "contact" }
  | { type: "faq" }
  | { type: "checklist" }
  | { type: "video" }
  | { type: "legal"; page: LegalPageKey };

const route = useRoute();
const { localizePath } = useSiteLocale();
const siteCopy = useSiteCopy();

const editorialPages = Object.fromEntries(
  Object.values(siteCopy.value.pages).map(page => [
    localizePath(page.path),
    page,
  ])
) as Record<string, SitePageContent>;

function resolvePage(
  basePath: string,
  localizedPath: string
): PageKind | undefined {
  if (basePath === "/contact") return { type: "contact" };
  if (basePath === "/resources/estate-planning-faqs") return { type: "faq" };
  if (basePath === "/resources/estate-planning-checklist")
    return { type: "checklist" };
  if (basePath === "/resources/video-blog") return { type: "video" };

  const legal = basePath.slice(1) as LegalPageKey;
  if (["privacy", "cookies", "disclaimer", "accessibility"].includes(legal)) {
    return { type: "legal", page: legal };
  }

  if (editorialPages[localizedPath])
    return { type: "editorial", content: editorialPages[localizedPath] };
}

const slug = Array.isArray(route.params.slug)
  ? route.params.slug.join("/")
  : String(route.params.slug ?? "");
const page = resolvePage(
  normalizeContentRoutePath(`/${slug}`),
  normalizeContentRoutePath(route.path)
);
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
  </div>
</template>
