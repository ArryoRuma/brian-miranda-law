import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import { parse } from "yaml";
import { z } from "zod";
import { siteContentSchema, type SiteContent } from "./schema";
import {
  createLocalizedContent,
  locales,
  type Locale,
} from "./localization";

const text = z.string().trim().min(1);
const slug = text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
  message: "Use lowercase words separated by hyphens",
});
const imagePath = text.regex(
  /^\/[a-zA-Z0-9/_.-]+\.(?:avif|gif|jpe?g|png|svg|webp)$/
);
const calendarDate = z.preprocess(
  value => (value instanceof Date ? value.toISOString().slice(0, 10) : value),
  text.refine(value => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00.000Z`);
    return (
      !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
    );
  }, "Expected a real calendar date in YYYY-MM-DD format")
);

const commonFrontMatter = z.object({
  title: text,
  description: text,
  slug,
  author: text,
  heroImage: imagePath,
  heroImageAlt: text,
  tags: z
    .array(text)
    .min(1)
    .refine(values => new Set(values).size === values.length, {
      message: "Tags must be unique",
    }),
  updatedAt: calendarDate.optional(),
});

const draftFrontMatter = commonFrontMatter.extend({
  status: z.literal("draft"),
  reviewed: z.literal(false),
  publishedAt: calendarDate.optional(),
});

const publishedFrontMatter = commonFrontMatter.extend({
  status: z.literal("published"),
  reviewed: z.literal(true),
  publishedAt: calendarDate,
});

export const blogFrontMatterSchema = z
  .discriminatedUnion("status", [draftFrontMatter, publishedFrontMatter])
  .superRefine((post, context) => {
    if (
      post.status === "published" &&
      post.updatedAt &&
      post.updatedAt < post.publishedAt
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["updatedAt"],
        message: "updatedAt cannot be earlier than publishedAt",
      });
    }
  });

export type BlogFrontMatter = z.infer<typeof blogFrontMatterSchema>;
export type PublishedBlogFrontMatter = z.infer<typeof publishedFrontMatter>;
export type PublishedBlogPost = PublishedBlogFrontMatter & {
  bodyHtml: string;
};

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
});

function parseBlogPostContent(source: string) {
  const parsed = matter(source, { engines: { yaml: parse } });
  const metadata = blogFrontMatterSchema.parse(parsed.data);

  const body = parsed.content.trim();
  if (!body)
    throw new Error(`Blog post "${metadata.slug}" has no body content`);

  return {
    ...metadata,
    bodyHtml: markdown.render(body),
  };
}

function validateBlogFileName(slugValue: string, fileName: string) {
  const expectedFileName = `${slugValue}.md`;
  if (basename(fileName) !== expectedFileName) {
    throw new Error(
      `Blog slug "${slugValue}" must use the filename "${expectedFileName}"`
    );
  }
}

export function parseBlogPostSource(source: string, fileName: string) {
  const post = parseBlogPostContent(source);
  validateBlogFileName(post.slug, fileName);
  return post;
}

export function loadBlogPosts(blogDirectory: string): PublishedBlogPost[] {
  if (!existsSync(blogDirectory)) return [];

  const postsWithFiles = readdirSync(blogDirectory)
    .filter(fileName => fileName.endsWith(".md") && !fileName.startsWith("_"))
    .map(fileName => ({
      fileName,
      post: parseBlogPostContent(
        readFileSync(join(blogDirectory, fileName), "utf8")
      ),
    }));

  const slugs = postsWithFiles.map(({ post }) => post.slug);
  if (new Set(slugs).size !== slugs.length) {
    throw new Error("Every blog post slug must be unique");
  }

  postsWithFiles.forEach(({ fileName, post }) =>
    validateBlogFileName(post.slug, fileName)
  );

  const posts = postsWithFiles.map(({ post }) => post);

  return posts
    .filter(
      (post): post is PublishedBlogPost =>
        post.status === "published" && post.reviewed
    )
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
}

export function loadRepositoryContent(rootDirectory: string): {
  siteCopy: SiteContent;
  siteCopyByLocale: Record<Locale, SiteContent>;
  blogPosts: PublishedBlogPost[];
} {
  const sitePath = join(rootDirectory, "content", "site.yml");
  const siteCopy = siteContentSchema.parse(
    parse(readFileSync(sitePath, "utf8"))
  );
  const blogPosts = loadBlogPosts(join(rootDirectory, "content", "blog"));
  const siteCopyByLocale = Object.fromEntries(
    locales.map(locale => [
      locale,
      createLocalizedContent(
        siteCopy,
        locale,
        locale === "en" ? {} : siteCopy.localization.translations[locale]
      ),
    ])
  ) as Record<Locale, SiteContent>;

  const assetPaths = [
    siteCopy.site.logo,
    siteCopy.home.hero.image,
    siteCopy.home.process.image,
    ...Object.values(siteCopy.pages).flatMap(page =>
      page.hero.image ? [page.hero.image] : []
    ),
    ...blogPosts.map(post => post.heroImage),
  ];

  for (const assetPath of new Set(assetPaths)) {
    if (!existsSync(join(rootDirectory, "public", assetPath.slice(1)))) {
      throw new Error(`Referenced public asset does not exist: ${assetPath}`);
    }
  }

  return { siteCopy, siteCopyByLocale, blogPosts };
}
