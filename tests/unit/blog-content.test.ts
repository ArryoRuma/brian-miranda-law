import { describe, expect, it } from "vitest";
import { blogFrontMatterSchema } from "../../lib/content/blog";
import { assembleRepositoryContent } from "../../lib/content/collections";
import { loadRepositoryDocuments } from "../helpers/repository-content";

const article = (overrides: Record<string, unknown> = {}) => ({
  id: "blog/reviewed-planning-article.md",
  stem: "blog/reviewed-planning-article",
  extension: "md",
  title: "A reviewed planning article",
  description: "A unique description for a reviewed planning article.",
  slug: "reviewed-planning-article",
  author: "Brian M. Miranda, Esq.",
  heroImage: "/images/brian-law-hero_7235d741.jpg.webp",
  heroImageAlt: "An estate-planning desk",
  tags: ["Estate planning"],
  status: "published",
  reviewed: true,
  publishedAt: "2026-08-21",
  body: { type: "root", children: [] },
  ...overrides,
});

describe("Nuxt Content article publication gate", () => {
  it("accepts a reviewed published article", () => {
    expect(blogFrontMatterSchema.parse(article()).status).toBe("published");
  });

  it("rejects an unreviewed published article", () => {
    expect(
      blogFrontMatterSchema.safeParse(article({ reviewed: false })).success
    ).toBe(false);
  });

  it("rejects invalid publication dates and update ordering", () => {
    expect(
      blogFrontMatterSchema.safeParse(article({ publishedAt: "2026-02-30" }))
        .success
    ).toBe(false);
    expect(
      blogFrontMatterSchema.safeParse(article({ updatedAt: "2026-08-20" }))
        .success
    ).toBe(false);
  });

  it("keeps drafts out of the published collection", () => {
    const documents = loadRepositoryDocuments();
    documents.articles = [
      article({ status: "draft", reviewed: false, publishedAt: undefined }),
    ];
    expect(assembleRepositoryContent(documents).blogPosts).toEqual([]);
  });

  it("rejects duplicate slugs and filename mismatches", () => {
    const duplicates = loadRepositoryDocuments();
    duplicates.articles = [article(), article({ id: "blog/copy.md" })];
    duplicates.articles[1]!.stem = "blog/reviewed-planning-article";
    expect(() => assembleRepositoryContent(duplicates)).toThrow(
      "Every blog post slug must be unique"
    );

    const mismatch = loadRepositoryDocuments();
    mismatch.articles = [article({ stem: "blog/different-file-name" })];
    expect(() => assembleRepositoryContent(mismatch)).toThrow(
      /must use the filename/
    );
  });
});
