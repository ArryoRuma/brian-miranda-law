import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  loadBlogPosts,
  parseBlogPostSource,
} from "../../lib/content/load-content";

const frontMatter = ({
  status = "published",
  reviewed = true,
  publishedAt = "2026-08-21",
  updatedAt,
}: {
  status?: "draft" | "published";
  reviewed?: boolean;
  publishedAt?: string;
  updatedAt?: string;
} = {}) => `---
title: A reviewed planning article
description: A unique description for a reviewed planning article.
slug: reviewed-planning-article
author: Brian M. Miranda, Esq.
heroImage: /images/brian-law-hero_7235d741.jpg.webp
heroImageAlt: An estate-planning desk
tags:
  - Estate planning
status: ${status}
reviewed: ${reviewed}
publishedAt: ${publishedAt}
${updatedAt ? `updatedAt: ${updatedAt}\n` : ""}
---

## A useful heading

Reviewed article body.
`;

describe("blog publication gate", () => {
  it("renders an approved Markdown post with raw HTML disabled", () => {
    const source = `${frontMatter()}\n<script>alert('no')</script>`;
    const post = parseBlogPostSource(source, "reviewed-planning-article.md");
    expect(post.status).toBe("published");
    expect(post.bodyHtml).toContain("<h2>A useful heading</h2>");
    expect(post.bodyHtml).not.toContain("<script>");
  });

  it("rejects an unreviewed published post", () => {
    expect(() =>
      parseBlogPostSource(
        frontMatter({ reviewed: false }),
        "reviewed-planning-article.md"
      )
    ).toThrow();
  });

  it("rejects invalid publication dates", () => {
    expect(() =>
      parseBlogPostSource(
        frontMatter({ publishedAt: "2026-02-30" }),
        "reviewed-planning-article.md"
      )
    ).toThrow();
  });

  it("rejects an update date before publication", () => {
    expect(() =>
      parseBlogPostSource(
        frontMatter({ updatedAt: "2026-08-20" }),
        "reviewed-planning-article.md"
      )
    ).toThrow();
  });

  it("keeps drafts out of the published collection", () => {
    const directory = mkdtempSync(join(tmpdir(), "miranda-blog-"));
    const source = frontMatter({ status: "draft", reviewed: false });
    writeFileSync(join(directory, "reviewed-planning-article.md"), source);
    expect(loadBlogPosts(directory)).toEqual([]);
  });

  it("rejects duplicate slugs before publishing", () => {
    const directory = mkdtempSync(join(tmpdir(), "miranda-blog-"));
    writeFileSync(join(directory, "first.md"), frontMatter());
    writeFileSync(join(directory, "second.md"), frontMatter());
    expect(() => loadBlogPosts(directory)).toThrow(
      "Every blog post slug must be unique"
    );
  });

  it("rejects filename and slug mismatches", () => {
    expect(() =>
      parseBlogPostSource(frontMatter(), "different-file-name.md")
    ).toThrow(/must use the filename/);
  });
});
