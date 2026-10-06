import { z } from "zod";

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

export const blogCollectionSchema = z
  .object({
    title: text,
    description: text,
    slug,
    author: text,
    heroImage: imagePath.optional(),
    heroImageAlt: text.optional(),
    tags: z
      .array(text)
      .refine(values => new Set(values).size === values.length, {
        message: "Tags must be unique",
      })
      .default([]),
    status: z.enum(["draft", "published"]),
    reviewed: z.boolean(),
    publishedAt: calendarDate.optional(),
    updatedAt: calendarDate.optional(),
  })
  .superRefine((post, context) => {
    if (Boolean(post.heroImage) !== Boolean(post.heroImageAlt)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: post.heroImage ? ["heroImageAlt"] : ["heroImage"],
        message: "heroImage and heroImageAlt must be provided together",
      });
    }
  });

export const blogFrontMatterSchema = blogCollectionSchema.superRefine(
  (post, context) => {
    if (post.status === "published" && !post.reviewed) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reviewed"],
        message: "Published articles must be reviewed",
      });
    }
    if (post.status === "published" && !post.publishedAt) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["publishedAt"],
        message: "Published articles require a publication date",
      });
    }
    if (post.status === "draft" && post.reviewed) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reviewed"],
        message: "Draft articles cannot be marked reviewed",
      });
    }
    if (
      post.publishedAt &&
      post.updatedAt &&
      post.updatedAt < post.publishedAt
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["updatedAt"],
        message: "updatedAt cannot be earlier than publishedAt",
      });
    }
  }
);

export type BlogFrontMatter = z.infer<typeof blogFrontMatterSchema>;
export type PublishedBlogPost = BlogFrontMatter & {
  status: "published";
  reviewed: true;
  publishedAt: string;
  id: string;
  stem: string;
  body: unknown;
};
