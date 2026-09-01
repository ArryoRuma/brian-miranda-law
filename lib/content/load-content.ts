import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, join, relative } from "node:path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import { parse } from "yaml";
import { z } from "zod";
import { siteContentSchema, type SiteContent } from "./schema";
import {
  createLocalizedContent,
  locales,
  type Locale,
  type TranslationOverlay,
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

const translationEntrySchema = z
  .object({
    source: z.string().min(1),
    value: z.string().trim().min(1),
  })
  .strict();
const translationOverlayFileSchema = z.record(
  z.string().min(1),
  translationEntrySchema
);

type ContentRecord = Record<string, unknown>;

function isContentRecord(value: unknown): value is ContentRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readYamlRecord(
  rootDirectory: string,
  filePath: string
): ContentRecord {
  const displayPath = relative(rootDirectory, filePath);
  if (!existsSync(filePath)) {
    throw new Error(`Required content file is missing: ${displayPath}`);
  }

  let parsed: unknown;
  try {
    parsed = parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid YAML in ${displayPath}: ${message}`, {
      cause: error,
    });
  }

  if (!isContentRecord(parsed)) {
    throw new Error(`Content file must contain a YAML object: ${displayPath}`);
  }
  return parsed;
}

function readWrappedContent(
  rootDirectory: string,
  contentDirectory: string,
  fileName: string,
  expectedKey: string
) {
  const filePath = join(contentDirectory, fileName);
  const record = readYamlRecord(rootDirectory, filePath);
  const keys = Object.keys(record);
  if (keys.length !== 1 || keys[0] !== expectedKey) {
    throw new Error(
      `${relative(rootDirectory, filePath)} must contain exactly the top-level key "${expectedKey}"`
    );
  }
  return record[expectedKey];
}

function readRecordDirectory(
  rootDirectory: string,
  contentDirectory: string,
  directoryName: string
) {
  const directoryPath = join(contentDirectory, directoryName);
  if (!existsSync(directoryPath)) {
    throw new Error(
      `Required content directory is missing: ${relative(rootDirectory, directoryPath)}`
    );
  }

  const fileNames = readdirSync(directoryPath)
    .filter(fileName => fileName.endsWith(".yml"))
    .sort((left, right) => left.localeCompare(right));
  if (!fileNames.length) {
    throw new Error(
      `Content directory has no YAML fragments: ${relative(rootDirectory, directoryPath)}`
    );
  }

  const records: ContentRecord = {};
  const recordSources = new Map<string, string>();
  for (const fileName of fileNames) {
    const filePath = join(directoryPath, fileName);
    const record = readYamlRecord(rootDirectory, filePath);
    const keys = Object.keys(record);
    if (keys.length !== 1) {
      throw new Error(
        `${relative(rootDirectory, filePath)} must contain exactly one content record`
      );
    }

    const [key] = keys;
    if (!key) {
      throw new Error(
        `${relative(rootDirectory, filePath)} must contain exactly one content record`
      );
    }
    if (recordSources.has(key)) {
      throw new Error(
        `Duplicate content record "${key}" in ${recordSources.get(key)} and ${relative(rootDirectory, filePath)}`
      );
    }
    records[key] = record[key];
    recordSources.set(key, relative(rootDirectory, filePath));
  }
  return records;
}

function listYamlFiles(directoryPath: string, prefix = ""): string[] {
  return readdirSync(directoryPath, { withFileTypes: true }).flatMap(entry => {
    const relativePath = join(prefix, entry.name);
    const absolutePath = join(directoryPath, entry.name);
    if (entry.isDirectory()) return listYamlFiles(absolutePath, relativePath);
    return entry.isFile() && entry.name.endsWith(".yml") ? [relativePath] : [];
  });
}

function getOverlayBasePaths(rootDirectory: string, contentDirectory: string) {
  const basePaths = new Map<string, string[]>([
    ["shared.yml", ["site"]],
    ["home.yml", ["home"]],
    ["blog.yml", ["blog"]],
    ["contact-page.yml", ["contactPage"]],
    ["questionnaire.yml", ["questionnaire"]],
    ["next-steps.yml", ["nextSteps"]],
    ["error-404.yml", ["error404"]],
  ]);

  for (const directoryName of ["pages", "resources", "legal"] as const) {
    const directoryPath = join(contentDirectory, directoryName);
    for (const fileName of readdirSync(directoryPath)
      .filter(name => name.endsWith(".yml"))
      .sort()) {
      const filePath = join(directoryPath, fileName);
      const record = readYamlRecord(rootDirectory, filePath);
      const keys = Object.keys(record);
      if (keys.length !== 1 || !keys[0]) {
        throw new Error(
          `${relative(rootDirectory, filePath)} must contain exactly one content record`
        );
      }
      basePaths.set(join(directoryName, fileName), [directoryName, keys[0]]);
    }
  }
  return basePaths;
}

export function loadTranslationOverlay(
  rootDirectory: string,
  locale: Exclude<Locale, "en">
): TranslationOverlay {
  const contentDirectory = join(rootDirectory, "content", "site");
  const overlayDirectory = join(contentDirectory, "localization", locale);
  if (!existsSync(overlayDirectory)) {
    throw new Error(
      `Required translation directory is missing: ${relative(rootDirectory, overlayDirectory)}`
    );
  }

  const basePaths = getOverlayBasePaths(rootDirectory, contentDirectory);
  const overlay: TranslationOverlay = {};
  const sources = new Map<string, string>();
  const relativeFiles = listYamlFiles(overlayDirectory).sort((left, right) =>
    left.localeCompare(right)
  );
  if (!relativeFiles.length) {
    throw new Error(
      `Translation directory has no YAML overlays: ${relative(rootDirectory, overlayDirectory)}`
    );
  }

  for (const relativeFile of relativeFiles) {
    const basePath = basePaths.get(relativeFile);
    const filePath = join(overlayDirectory, relativeFile);
    const displayPath = relative(rootDirectory, filePath);
    if (!basePath) {
      throw new Error(`Unknown ${locale} translation overlay: ${displayPath}`);
    }
    const parsed = translationOverlayFileSchema.safeParse(
      readYamlRecord(rootDirectory, filePath)
    );
    if (!parsed.success) {
      throw new Error(
        `Invalid ${locale} translation overlay ${displayPath}: ${parsed.error.message}`
      );
    }

    for (const [relativeFieldPath, entry] of Object.entries(parsed.data)) {
      const fieldSegments = relativeFieldPath.split(".");
      if (fieldSegments.some(segment => !segment)) {
        throw new Error(
          `Invalid ${locale} translation path "${relativeFieldPath}" in ${displayPath}`
        );
      }
      const fieldPath = [...basePath, ...fieldSegments].join(".");
      if (sources.has(fieldPath)) {
        throw new Error(
          `Duplicate ${locale} translation path "${fieldPath}" in ${sources.get(fieldPath)} and ${displayPath}`
        );
      }
      overlay[fieldPath] = { ...entry, file: displayPath };
      sources.set(fieldPath, displayPath);
    }
  }

  return overlay;
}

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

export function loadSiteContent(rootDirectory: string): SiteContent {
  const contentDirectory = join(rootDirectory, "content", "site");
  const content = {
    site: readWrappedContent(
      rootDirectory,
      contentDirectory,
      "shared.yml",
      "site"
    ),
    home: readWrappedContent(
      rootDirectory,
      contentDirectory,
      "home.yml",
      "home"
    ),
    pages: readRecordDirectory(rootDirectory, contentDirectory, "pages"),
    resources: readRecordDirectory(
      rootDirectory,
      contentDirectory,
      "resources"
    ),
    blog: readWrappedContent(
      rootDirectory,
      contentDirectory,
      "blog.yml",
      "blog"
    ),
    contactPage: readWrappedContent(
      rootDirectory,
      contentDirectory,
      "contact-page.yml",
      "contactPage"
    ),
    legal: readRecordDirectory(rootDirectory, contentDirectory, "legal"),
    questionnaire: readWrappedContent(
      rootDirectory,
      contentDirectory,
      "questionnaire.yml",
      "questionnaire"
    ),
    nextSteps: readWrappedContent(
      rootDirectory,
      contentDirectory,
      "next-steps.yml",
      "nextSteps"
    ),
    error404: readWrappedContent(
      rootDirectory,
      contentDirectory,
      "error-404.yml",
      "error404"
    ),
    localization: {
      review: readYamlRecord(
        rootDirectory,
        join(contentDirectory, "localization", "review.yml")
      ),
    },
  };

  return siteContentSchema.parse(content);
}

export function loadRepositoryContent(rootDirectory: string): {
  siteCopy: SiteContent;
  siteCopyByLocale: Record<Locale, SiteContent>;
  blogPosts: PublishedBlogPost[];
} {
  const siteCopy = loadSiteContent(rootDirectory);
  const blogPosts = loadBlogPosts(join(rootDirectory, "content", "blog"));
  const siteCopyByLocale = Object.fromEntries(
    locales.map(locale => [
      locale,
      createLocalizedContent(
        siteCopy,
        locale,
        locale === "en" ? {} : loadTranslationOverlay(rootDirectory, locale)
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
