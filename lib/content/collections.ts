import { z } from "zod";
import { blogFrontMatterSchema, type PublishedBlogPost } from "./blog";
import {
  createLocalizedContent,
  locales,
  type Locale,
  type TranslationOverlay,
} from "./localization";
import { siteContentSchema, type SiteContent } from "./schema";

type ContentDocument<T> = T & {
  id: string;
  stem: string;
  extension?: string;
  meta?: Record<string, unknown>;
};

export const translationEntrySchema = z
  .object({
    source: z.string().min(1),
    value: z.string().trim().min(1),
  })
  .strict();

export const translationDocumentSchema = z.object({
  entries: z
    .array(
      translationEntrySchema.extend({
        path: z.string().trim().min(1),
      })
    )
    .min(1),
});

export type TranslationDocument = z.infer<typeof translationDocumentSchema> & {
  id: string;
  stem: string;
};

export type RepositoryCollectionDocuments = {
  site: Array<ContentDocument<SiteContent["site"]>>;
  home: Array<ContentDocument<SiteContent["home"]>>;
  pages: Array<ContentDocument<SiteContent["pages"][string]>>;
  resourceFaq: Array<ContentDocument<SiteContent["resources"]["faq"]>>;
  resourceChecklist: Array<
    ContentDocument<SiteContent["resources"]["checklist"]>
  >;
  resourceVideo: Array<ContentDocument<SiteContent["resources"]["video"]>>;
  blogSettings: Array<ContentDocument<SiteContent["blog"]>>;
  contactPage: Array<ContentDocument<SiteContent["contactPage"]>>;
  legal: Array<ContentDocument<SiteContent["legal"][string]>>;
  questionnaire: Array<ContentDocument<SiteContent["questionnaire"]>>;
  nextSteps: Array<ContentDocument<SiteContent["nextSteps"]>>;
  error404: Array<ContentDocument<SiteContent["error404"]>>;
  translationReview: Array<
    ContentDocument<SiteContent["localization"]["review"]>
  >;
  translationsEs: TranslationDocument[];
  translationsPt: TranslationDocument[];
  articles: Array<Record<string, unknown>>;
};

export type RepositoryContent = {
  siteCopy: SiteContent;
  siteCopyByLocale: Record<Locale, SiteContent>;
  blogPosts: PublishedBlogPost[];
};

function only<T>(documents: T[], label: string): T {
  if (documents.length !== 1) {
    throw new Error(`${label} collection must contain exactly one document`);
  }
  return documents[0]!;
}

function withoutNulls<T>(value: T): T {
  if (Array.isArray(value)) return value.map(withoutNulls) as T;
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, child]) => child !== null)
      .map(([key, child]) => [key, withoutNulls(child)])
  ) as T;
}

function recordKey(stem: string) {
  const key = stem.split("/").at(-1);
  if (!key) throw new Error(`Unable to derive a content key from ${stem}`);
  return key;
}

function recordCollection<T extends { stem: string }>(
  documents: T[],
  label: string
) {
  const entries = documents.map(document => [
    recordKey(document.stem),
    document,
  ]);
  const keys = entries.map(([key]) => key);
  if (new Set(keys).size !== keys.length) {
    throw new Error(`${label} collection contains duplicate document keys`);
  }
  return Object.fromEntries(
    entries.map(([key, document]) => [key, withoutNulls(document)])
  );
}

function translationOverlay(
  documents: TranslationDocument[],
  locale: Exclude<Locale, "en">
): TranslationOverlay {
  const prefix = `site/localization/${locale}/`;
  const overlay: TranslationOverlay = {};

  for (const document of documents) {
    if (!document.stem.startsWith(prefix)) {
      throw new Error(
        `Unexpected ${locale} translation document ${document.stem}`
      );
    }
    const relativeStem = document.stem.slice(prefix.length);
    const segments = relativeStem.split("/");
    const category = segments.length > 1 ? segments[0] : undefined;
    const fileKey = segments.at(-1)!;
    const basePath =
      category === "pages" || category === "resources" || category === "legal"
        ? [category, fileKey]
        : [
            {
              shared: "site",
              home: "home",
              blog: "blog",
              "contact-page": "contactPage",
              questionnaire: "questionnaire",
              "next-steps": "nextSteps",
              "error-404": "error404",
            }[fileKey],
          ];
    if (!basePath[0]) {
      throw new Error(
        `Unknown ${locale} translation document ${document.stem}`
      );
    }

    for (const entry of document.entries) {
      const relativePath = entry.path;
      const path = [...basePath, ...relativePath.split(".")].join(".");
      if (overlay[path]) {
        throw new Error(`Duplicate ${locale} translation path ${path}`);
      }
      overlay[path] = {
        source: entry.source,
        value: entry.value,
        file: document.stem,
      };
    }
  }

  return overlay;
}

export function assembleRepositoryContent(
  documents: RepositoryCollectionDocuments
): RepositoryContent {
  const siteCopy = siteContentSchema.parse({
    site: withoutNulls(only(documents.site, "Site")),
    home: withoutNulls(only(documents.home, "Homepage")),
    pages: recordCollection(documents.pages, "Pages"),
    resources: {
      faq: withoutNulls(only(documents.resourceFaq, "FAQ resource")),
      checklist: withoutNulls(
        only(documents.resourceChecklist, "Checklist resource")
      ),
      video: withoutNulls(only(documents.resourceVideo, "Video resource")),
    },
    blog: withoutNulls(only(documents.blogSettings, "Blog settings")),
    contactPage: withoutNulls(only(documents.contactPage, "Contact page")),
    legal: recordCollection(documents.legal, "Legal"),
    questionnaire: withoutNulls(only(documents.questionnaire, "Questionnaire")),
    nextSteps: withoutNulls(only(documents.nextSteps, "Next steps")),
    error404: withoutNulls(only(documents.error404, "Error page")),
    localization: {
      review: withoutNulls(
        only(documents.translationReview, "Translation review")
      ),
    },
  });

  const siteCopyByLocale = Object.fromEntries(
    locales.map(locale => [
      locale,
      createLocalizedContent(
        siteCopy,
        locale,
        locale === "en"
          ? {}
          : translationOverlay(
              locale === "es"
                ? documents.translationsEs
                : documents.translationsPt,
              locale
            )
      ),
    ])
  ) as Record<Locale, SiteContent>;

  const parsedArticles = documents.articles.map(sourceDocument => {
    const document = withoutNulls(sourceDocument);
    const metadata = blogFrontMatterSchema.parse(document);
    const expectedStem = `blog/${metadata.slug}`;
    if (document.stem !== expectedStem) {
      throw new Error(
        `Blog slug "${metadata.slug}" must use the filename "${metadata.slug}.md"`
      );
    }
    return { ...document, ...metadata };
  });
  const slugs = parsedArticles.map(article => article.slug);
  if (new Set(slugs).size !== slugs.length) {
    throw new Error("Every blog post slug must be unique");
  }
  const blogPosts = parsedArticles
    .filter(
      (
        article
      ): article is typeof article & {
        status: "published";
        reviewed: true;
        publishedAt: string;
      } =>
        article.status === "published" &&
        article.reviewed === true &&
        typeof article.publishedAt === "string"
    )
    .sort((left, right) =>
      right.publishedAt.localeCompare(left.publishedAt)
    ) as PublishedBlogPost[];

  return { siteCopy, siteCopyByLocale, blogPosts };
}
