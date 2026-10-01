import { defineCollection, defineContentConfig } from "@nuxt/content";
import { blogCollectionSchema } from "./lib/content/blog";
import { translationDocumentSchema } from "./lib/content/collections";
import {
  legalPageSchema,
  pageSchema,
  rawSiteContentSchema,
} from "./lib/content/schema";

const shape = rawSiteContentSchema.shape;

export default defineContentConfig({
  collections: {
    site: defineCollection({
      type: "data",
      source: "site/shared.yml",
      schema: shape.site,
    }),
    home: defineCollection({
      type: "data",
      source: "site/home.yml",
      schema: shape.home,
    }),
    pages: defineCollection({
      type: "data",
      source: "site/pages/*.yml",
      schema: pageSchema,
    }),
    resourceFaq: defineCollection({
      type: "data",
      source: "site/resources/faq.yml",
      schema: shape.resources.shape.faq,
    }),
    resourceChecklist: defineCollection({
      type: "data",
      source: "site/resources/checklist.yml",
      schema: shape.resources.shape.checklist,
    }),
    resourceVideo: defineCollection({
      type: "data",
      source: "site/resources/video.yml",
      schema: shape.resources.shape.video,
    }),
    blogSettings: defineCollection({
      type: "data",
      source: "site/blog.yml",
      schema: shape.blog,
    }),
    contactPage: defineCollection({
      type: "data",
      source: "site/contact-page.yml",
      schema: shape.contactPage,
    }),
    legal: defineCollection({
      type: "data",
      source: "site/legal/*.yml",
      schema: legalPageSchema,
    }),
    questionnaire: defineCollection({
      type: "data",
      source: "site/questionnaire.yml",
      schema: shape.questionnaire,
    }),
    nextSteps: defineCollection({
      type: "data",
      source: "site/next-steps.yml",
      schema: shape.nextSteps,
    }),
    error404: defineCollection({
      type: "data",
      source: "site/error-404.yml",
      schema: shape.error404,
    }),
    translationReview: defineCollection({
      type: "data",
      source: "site/localization/review.yml",
      schema: shape.localization.shape.review,
    }),
    translationsEs: defineCollection({
      type: "data",
      source: "site/localization/es/**/*.yml",
      schema: translationDocumentSchema,
    }),
    translationsPt: defineCollection({
      type: "data",
      source: "site/localization/pt/**/*.yml",
      schema: translationDocumentSchema,
    }),
    articles: defineCollection({
      type: "page",
      source: "blog/*.md",
      schema: blogCollectionSchema,
    }),
  },
});
